-- Fixes from Supabase advisors after applying the initial schema (2026-11-02).
-- 1. Authorization helpers move to a `private` schema that PostgREST does not
--    expose, so they are no longer callable as /rest/v1/rpc endpoints. RLS
--    policies reference functions by OID and keep working.
-- 2. Trigger functions lose EXECUTE for API roles (triggers do not need it).
-- 3. Covering indexes for foreign keys.
-- 4. "for all" write policies split per command so SELECT has one policy each.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

alter function public.is_org_member(uuid) set schema private;
alter function public.has_org_role(uuid, public.membership_role[]) set schema private;

revoke execute on function private.is_org_member(uuid) from public;
revoke execute on function private.has_org_role(uuid, public.membership_role[]) from public;
grant execute on function private.is_org_member(uuid) to anon, authenticated;
grant execute on function private.has_org_role(uuid, public.membership_role[]) to anon, authenticated;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_new_organization() from public, anon, authenticated;
revoke execute on function public.enforce_membership_rules() from public, anon, authenticated;
revoke execute on function public.enforce_exchange_offer_rules() from public, anon, authenticated;

-- Trigger bodies referenced the helpers by their old schema; redefine them.
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
       and not private.has_org_role(new.organization_id, array['owner']::public.membership_role[]) then
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
         and not private.has_org_role(old.organization_id, array['owner']::public.membership_role[]) then
        raise exception 'Only owners can grant or revoke the owner role';
      end if;
    end if;
    return new;
  end if;

  -- DELETE
  if old.role = 'owner' and not private.has_org_role(old.organization_id, array['owner']::public.membership_role[]) then
    raise exception 'Only owners can remove an owner';
  end if;
  return old;
end;
$$;

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
    if not private.is_org_member(old.organization_id) then
      raise exception 'Only the offering organization can edit an offer';
    end if;
  end if;

  if new.status <> old.status then
    if old.status <> 'pending' then
      raise exception 'Offer is already %', old.status;
    end if;
    if new.status = 'withdrawn' and not private.is_org_member(old.organization_id) then
      raise exception 'Only the offering organization can withdraw an offer';
    end if;
    if new.status in ('accepted', 'declined')
       and not private.has_org_role(requesting_org, array['owner', 'admin']::public.membership_role[]) then
      raise exception 'Only the requesting organization''s owners or admins can respond to an offer';
    end if;
    new.responded_at = now();
  end if;

  return new;
end;
$$;

revoke execute on function public.enforce_membership_rules() from public, anon, authenticated;
revoke execute on function public.enforce_exchange_offer_rules() from public, anon, authenticated;

-- Foreign key indexes
create index if not exists organizations_created_by_idx on public.organizations (created_by);
create index if not exists resource_requests_created_by_idx on public.resource_requests (created_by);
create index if not exists resource_requests_trade_category_id_idx on public.resource_requests (trade_category_id);
create index if not exists exchange_offers_created_by_idx on public.exchange_offers (created_by);
create index if not exists trade_categories_parent_id_idx on public.trade_categories (parent_id);

-- Split "for all" policies into insert / update / delete.
drop policy "memberships: owners and admins manage" on public.organization_memberships;
create policy "memberships: owners and admins insert" on public.organization_memberships
  for insert to authenticated
  with check (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));
create policy "memberships: owners and admins update" on public.organization_memberships
  for update to authenticated
  using (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]))
  with check (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));
create policy "memberships: owners and admins delete" on public.organization_memberships
  for delete to authenticated
  using (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));

drop policy "contractor profiles: owners and admins write" on public.contractor_profiles;
create policy "contractor profiles: owners and admins insert" on public.contractor_profiles
  for insert to authenticated
  with check (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));
create policy "contractor profiles: owners and admins update" on public.contractor_profiles
  for update to authenticated
  using (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]))
  with check (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));
create policy "contractor profiles: owners and admins delete" on public.contractor_profiles
  for delete to authenticated
  using (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));

drop policy "profile trades: owners and admins write" on public.contractor_profile_trades;
create policy "profile trades: owners and admins insert" on public.contractor_profile_trades
  for insert to authenticated
  with check (
    exists (
      select 1 from public.contractor_profiles p
      where p.id = contractor_profile_id
        and private.has_org_role(p.organization_id, array['owner', 'admin']::public.membership_role[])
    )
  );
create policy "profile trades: owners and admins update" on public.contractor_profile_trades
  for update to authenticated
  using (
    exists (
      select 1 from public.contractor_profiles p
      where p.id = contractor_profile_id
        and private.has_org_role(p.organization_id, array['owner', 'admin']::public.membership_role[])
    )
  )
  with check (
    exists (
      select 1 from public.contractor_profiles p
      where p.id = contractor_profile_id
        and private.has_org_role(p.organization_id, array['owner', 'admin']::public.membership_role[])
    )
  );
create policy "profile trades: owners and admins delete" on public.contractor_profile_trades
  for delete to authenticated
  using (
    exists (
      select 1 from public.contractor_profiles p
      where p.id = contractor_profile_id
        and private.has_org_role(p.organization_id, array['owner', 'admin']::public.membership_role[])
    )
  );

drop policy "service areas: owners and admins write" on public.service_areas;
create policy "service areas: owners and admins insert" on public.service_areas
  for insert to authenticated
  with check (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));
create policy "service areas: owners and admins update" on public.service_areas
  for update to authenticated
  using (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]))
  with check (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));
create policy "service areas: owners and admins delete" on public.service_areas
  for delete to authenticated
  using (private.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));
