-- Paradise initial schema (Milestone 1 design).
-- STATUS: written, NOT yet applied to any database. See docs/architecture/DATABASE_DESIGN.md.
-- Paradise Points are denominations on offers only; there is no ledger here by design.

create extension if not exists postgis with schema extensions;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.membership_role as enum ('owner', 'admin', 'member');
create type public.membership_status as enum ('invited', 'active', 'removed');
create type public.profile_visibility as enum ('draft', 'published');
create type public.resource_request_kind as enum ('equipment_rental', 'labor', 'materials', 'subcontracting');
create type public.resource_request_status as enum ('draft', 'open', 'fulfilled', 'cancelled', 'expired');
create type public.exchange_offer_status as enum ('pending', 'accepted', 'declined', 'withdrawn');

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Users (application profile for each auth.users row)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 120),
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Organizations and memberships
-- ---------------------------------------------------------------------------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 64),
  phone text,
  website text,
  created_by uuid not null references public.profiles (id) on delete restrict,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organizations_set_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.membership_role not null default 'member',
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index organization_memberships_user_id_idx on public.organization_memberships (user_id);

create trigger organization_memberships_set_updated_at before update on public.organization_memberships
  for each row execute function public.set_updated_at();

-- Authorization helpers. SECURITY DEFINER so RLS policies can call them
-- without recursing into organization_memberships' own policies.
create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_memberships m
    where m.organization_id = org_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
  );
$$;

create or replace function public.has_org_role(org_id uuid, roles public.membership_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_memberships m
    where m.organization_id = org_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role = any (roles)
  );
$$;

-- The creator of an organization becomes its owner.
create or replace function public.handle_new_organization()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.organization_memberships (organization_id, user_id, role, status)
  values (new.id, new.created_by, 'owner', 'active');
  return new;
end;
$$;

create trigger on_organization_created after insert on public.organizations
  for each row execute function public.handle_new_organization();

-- Role guard: nobody changes their own role, and only owners grant, change or
-- revoke the owner role. The first membership of a new organization is exempt
-- so handle_new_organization can create the owner. Service-role calls
-- (auth.uid() is null) are trusted.
create or replace function public.enforce_membership_rules()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
begin
  if actor is null then
    return coalesce(new, old);
  end if;

  if tg_op = 'INSERT' then
    if new.role = 'owner'
       and exists (select 1 from public.organization_memberships m where m.organization_id = new.organization_id)
       and not public.has_org_role(new.organization_id, array['owner']::public.membership_role[]) then
      raise exception 'Only owners can add owners';
    end if;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.organization_id <> old.organization_id or new.user_id <> old.user_id then
      raise exception 'Membership organization and user are immutable';
    end if;
    if new.role <> old.role then
      if old.user_id = actor then
        raise exception 'You cannot change your own role';
      end if;
      if (new.role = 'owner' or old.role = 'owner')
         and not public.has_org_role(old.organization_id, array['owner']::public.membership_role[]) then
        raise exception 'Only owners can grant or revoke the owner role';
      end if;
    end if;
    return new;
  end if;

  -- DELETE
  if old.role = 'owner' and not public.has_org_role(old.organization_id, array['owner']::public.membership_role[]) then
    raise exception 'Only owners can remove an owner';
  end if;
  return old;
end;
$$;

create trigger organization_memberships_enforce_rules
  before insert or update or delete on public.organization_memberships
  for each row execute function public.enforce_membership_rules();

-- ---------------------------------------------------------------------------
-- Trade categories (reference data, managed by admins via the secret key)
-- ---------------------------------------------------------------------------
create table public.trade_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  parent_id uuid references public.trade_categories (id) on delete restrict,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Contractor profiles (one public business profile per organization)
-- ---------------------------------------------------------------------------
create table public.contractor_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  headline text check (char_length(headline) <= 160),
  bio text check (char_length(bio) <= 4000),
  years_in_business integer check (years_in_business between 0 and 150),
  license_number text,
  is_insured boolean not null default false,
  -- Deliberately approximate point shown on the public map (e.g. town or ZIP
  -- centroid the contractor chooses). Never a home address.
  map_point extensions.geography(Point, 4326),
  visibility public.profile_visibility not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contractor_profiles_map_point_idx on public.contractor_profiles using gist (map_point);

create trigger contractor_profiles_set_updated_at before update on public.contractor_profiles
  for each row execute function public.set_updated_at();

create table public.contractor_profile_trades (
  contractor_profile_id uuid not null references public.contractor_profiles (id) on delete cascade,
  trade_category_id uuid not null references public.trade_categories (id) on delete restrict,
  is_primary boolean not null default false,
  primary key (contractor_profile_id, trade_category_id)
);

create index contractor_profile_trades_trade_idx on public.contractor_profile_trades (trade_category_id);

-- ---------------------------------------------------------------------------
-- Service areas (radius around a point, or a drawn polygon)
-- ---------------------------------------------------------------------------
create table public.service_areas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null check (char_length(name) <= 120),
  center extensions.geography(Point, 4326),
  radius_meters integer check (radius_meters between 1 and 200000),
  boundary extensions.geography(MultiPolygon, 4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_areas_shape_check check (
    (center is not null and radius_meters is not null and boundary is null)
    or (boundary is not null and center is null and radius_meters is null)
  )
);

create index service_areas_organization_id_idx on public.service_areas (organization_id);
create index service_areas_center_idx on public.service_areas using gist (center);
create index service_areas_boundary_idx on public.service_areas using gist (boundary);

create trigger service_areas_set_updated_at before update on public.service_areas
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Resource requests (Paradise Exchange)
-- ---------------------------------------------------------------------------
create table public.resource_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete restrict,
  kind public.resource_request_kind not null,
  trade_category_id uuid references public.trade_categories (id) on delete set null,
  title text not null check (char_length(title) between 4 and 140),
  description text not null default '' check (char_length(description) <= 4000),
  location extensions.geography(Point, 4326),
  needed_from date,
  needed_until date,
  budget_points integer check (budget_points >= 0),
  status public.resource_request_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resource_requests_dates_check check (needed_until is null or needed_from is null or needed_until >= needed_from)
);

create index resource_requests_organization_id_idx on public.resource_requests (organization_id);
create index resource_requests_status_idx on public.resource_requests (status);
create index resource_requests_location_idx on public.resource_requests using gist (location);

create trigger resource_requests_set_updated_at before update on public.resource_requests
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Exchange offers (point-denominated; no points move in this release)
-- ---------------------------------------------------------------------------
create table public.exchange_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.resource_requests (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete restrict,
  points_amount integer not null check (points_amount > 0),
  message text not null default '' check (char_length(message) <= 2000),
  status public.exchange_offer_status not null default 'pending',
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index exchange_offers_request_id_idx on public.exchange_offers (request_id);
create index exchange_offers_organization_id_idx on public.exchange_offers (organization_id);
-- One live offer per organization per request, and at most one accepted offer per request.
create unique index exchange_offers_one_pending_per_org on public.exchange_offers (request_id, organization_id)
  where status = 'pending';
create unique index exchange_offers_one_accepted_per_request on public.exchange_offers (request_id)
  where status = 'accepted';

create trigger exchange_offers_set_updated_at before update on public.exchange_offers
  for each row execute function public.set_updated_at();

-- Enforce who may move an offer between states. RLS decides which rows a user
-- can touch; this decides which transitions are legal.
create or replace function public.enforce_exchange_offer_rules()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requesting_org uuid;
  request_status public.resource_request_status;
begin
  select r.organization_id, r.status into requesting_org, request_status
  from public.resource_requests r where r.id = new.request_id;

  if tg_op = 'INSERT' then
    if new.organization_id = requesting_org then
      raise exception 'An organization cannot make an offer on its own request';
    end if;
    if request_status <> 'open' then
      raise exception 'Offers can only be made on open requests';
    end if;
    if new.status <> 'pending' then
      raise exception 'New offers must be pending';
    end if;
    return new;
  end if;

  -- UPDATE
  if new.request_id <> old.request_id or new.organization_id <> old.organization_id or new.created_by <> old.created_by then
    raise exception 'Offer ownership fields are immutable';
  end if;
  if new.points_amount <> old.points_amount or new.message <> old.message then
    if old.status <> 'pending' then
      raise exception 'Only pending offers can be edited';
    end if;
    if not public.is_org_member(old.organization_id) then
      raise exception 'Only the offering organization can edit an offer';
    end if;
  end if;

  if new.status <> old.status then
    if old.status <> 'pending' then
      raise exception 'Offer is already %', old.status;
    end if;
    if new.status = 'withdrawn' and not public.is_org_member(old.organization_id) then
      raise exception 'Only the offering organization can withdraw an offer';
    end if;
    if new.status in ('accepted', 'declined')
       and not public.has_org_role(requesting_org, array['owner', 'admin']::public.membership_role[]) then
      raise exception 'Only the requesting organization''s owners or admins can respond to an offer';
    end if;
    new.responded_at = now();
  end if;

  return new;
end;
$$;

create trigger exchange_offers_enforce_rules before insert or update on public.exchange_offers
  for each row execute function public.enforce_exchange_offer_rules();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.trade_categories enable row level security;
alter table public.contractor_profiles enable row level security;
alter table public.contractor_profile_trades enable row level security;
alter table public.service_areas enable row level security;
alter table public.resource_requests enable row level security;
alter table public.exchange_offers enable row level security;

-- profiles
create policy "profiles: signed-in users can read" on public.profiles
  for select to authenticated using (true);
create policy "profiles: users update their own" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- organizations
create policy "organizations: public can read active" on public.organizations
  for select to anon, authenticated using (archived_at is null or public.is_org_member(id));
create policy "organizations: signed-in users create as themselves" on public.organizations
  for insert to authenticated with check (created_by = (select auth.uid()));
create policy "organizations: owners and admins update" on public.organizations
  for update to authenticated
  using (public.has_org_role(id, array['owner', 'admin']::public.membership_role[]))
  with check (public.has_org_role(id, array['owner', 'admin']::public.membership_role[]));

-- organization_memberships
create policy "memberships: members see their organization's roster" on public.organization_memberships
  for select to authenticated using (user_id = (select auth.uid()) or public.is_org_member(organization_id));
create policy "memberships: owners and admins manage" on public.organization_memberships
  for all to authenticated
  using (public.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]))
  with check (public.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));

-- trade_categories (read-only for clients)
create policy "trade categories: anyone can read active" on public.trade_categories
  for select to anon, authenticated using (is_active);

-- contractor_profiles
create policy "contractor profiles: public reads published" on public.contractor_profiles
  for select to anon, authenticated using (visibility = 'published' or public.is_org_member(organization_id));
create policy "contractor profiles: owners and admins write" on public.contractor_profiles
  for all to authenticated
  using (public.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]))
  with check (public.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));

-- contractor_profile_trades
create policy "profile trades: readable with their profile" on public.contractor_profile_trades
  for select to anon, authenticated using (
    exists (
      select 1 from public.contractor_profiles p
      where p.id = contractor_profile_id
        and (p.visibility = 'published' or public.is_org_member(p.organization_id))
    )
  );
create policy "profile trades: owners and admins write" on public.contractor_profile_trades
  for all to authenticated
  using (
    exists (
      select 1 from public.contractor_profiles p
      where p.id = contractor_profile_id
        and public.has_org_role(p.organization_id, array['owner', 'admin']::public.membership_role[])
    )
  )
  with check (
    exists (
      select 1 from public.contractor_profiles p
      where p.id = contractor_profile_id
        and public.has_org_role(p.organization_id, array['owner', 'admin']::public.membership_role[])
    )
  );

-- service_areas
create policy "service areas: readable for published profiles" on public.service_areas
  for select to anon, authenticated using (
    public.is_org_member(organization_id)
    or exists (
      select 1 from public.contractor_profiles p
      where p.organization_id = service_areas.organization_id and p.visibility = 'published'
    )
  );
create policy "service areas: owners and admins write" on public.service_areas
  for all to authenticated
  using (public.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]))
  with check (public.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));

-- resource_requests
create policy "requests: signed-in users read open requests" on public.resource_requests
  for select to authenticated using (status = 'open' or public.is_org_member(organization_id));
create policy "requests: members create for their organization" on public.resource_requests
  for insert to authenticated
  with check (public.is_org_member(organization_id) and created_by = (select auth.uid()));
create policy "requests: creator or admins update" on public.resource_requests
  for update to authenticated
  using (
    created_by = (select auth.uid())
    or public.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[])
  )
  with check (public.is_org_member(organization_id));

-- exchange_offers: visible only to the two organizations involved
create policy "offers: parties can read" on public.exchange_offers
  for select to authenticated using (
    public.is_org_member(organization_id)
    or exists (
      select 1 from public.resource_requests r
      where r.id = request_id and public.is_org_member(r.organization_id)
    )
  );
create policy "offers: members offer for their organization" on public.exchange_offers
  for insert to authenticated
  with check (public.is_org_member(organization_id) and created_by = (select auth.uid()));
create policy "offers: parties update (transitions checked by trigger)" on public.exchange_offers
  for update to authenticated
  using (
    public.is_org_member(organization_id)
    or exists (
      select 1 from public.resource_requests r
      where r.id = request_id and public.is_org_member(r.organization_id)
    )
  );
