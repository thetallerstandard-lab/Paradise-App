-- Milestone 2: contractor onboarding support.
-- 1. contractor_profiles.base_town: human label for the approximate map point.
-- 2. save_contractor_profile(): one atomic write for profile + trades + primary
--    service area. SECURITY INVOKER, so every statement is still checked by RLS.
-- 3. Last-owner guard: an organization always keeps at least one active owner.

alter table public.contractor_profiles
  add column base_town text check (char_length(base_town) <= 80);

create or replace function public.save_contractor_profile(
  p_organization_id uuid,
  p_headline text,
  p_bio text,
  p_years_in_business integer,
  p_license_number text,
  p_is_insured boolean,
  p_base_town text,
  p_lng double precision,
  p_lat double precision,
  p_service_radius_meters integer,
  p_primary_trade_id uuid,
  p_trade_ids uuid[],
  p_publish boolean
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_profile_id uuid;
  v_point extensions.geography;
begin
  if not private.has_org_role(p_organization_id, array['owner', 'admin']::public.membership_role[]) then
    raise exception 'Only organization owners and admins can edit the business profile';
  end if;

  v_point := case
    when p_lng is null or p_lat is null then null
    else extensions.st_setsrid(extensions.st_makepoint(p_lng, p_lat), 4326)::extensions.geography
  end;

  insert into public.contractor_profiles as cp (
    organization_id, headline, bio, years_in_business, license_number, is_insured,
    base_town, map_point, visibility
  )
  values (
    p_organization_id, nullif(p_headline, ''), nullif(p_bio, ''), p_years_in_business,
    nullif(p_license_number, ''), coalesce(p_is_insured, false), nullif(p_base_town, ''), v_point,
    case when p_publish then 'published' else 'draft' end::public.profile_visibility
  )
  on conflict (organization_id) do update set
    headline = excluded.headline,
    bio = excluded.bio,
    years_in_business = excluded.years_in_business,
    license_number = excluded.license_number,
    is_insured = excluded.is_insured,
    base_town = excluded.base_town,
    map_point = excluded.map_point,
    visibility = excluded.visibility
  returning cp.id into v_profile_id;

  delete from public.contractor_profile_trades where contractor_profile_id = v_profile_id;
  insert into public.contractor_profile_trades (contractor_profile_id, trade_category_id, is_primary)
  select v_profile_id, t.id, t.id = p_primary_trade_id
  from (
    select distinct unnest(array_append(coalesce(p_trade_ids, '{}'), p_primary_trade_id)) as id
  ) t
  where t.id is not null;

  -- One "Primary service area" per organization, managed by this form.
  delete from public.service_areas
  where organization_id = p_organization_id and name = 'Primary service area';
  if v_point is not null and p_service_radius_meters is not null then
    insert into public.service_areas (organization_id, name, center, radius_meters)
    values (p_organization_id, 'Primary service area', v_point, p_service_radius_meters);
  end if;

  return v_profile_id;
end;
$$;

revoke execute on function public.save_contractor_profile(
  uuid, text, text, integer, text, boolean, text, double precision, double precision, integer, uuid, uuid[], boolean
) from public, anon;
grant execute on function public.save_contractor_profile(
  uuid, text, text, integer, text, boolean, text, double precision, double precision, integer, uuid, uuid[], boolean
) to authenticated;

-- Last-owner guard (extends enforce_membership_rules). Runs for every caller,
-- including the service role, except when the organization itself is being
-- deleted (cascade).
create or replace function public.enforce_last_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  remaining integer;
begin
  if old.role <> 'owner' or old.status <> 'active' then
    return coalesce(new, old);
  end if;
  if tg_op = 'UPDATE' and new.role = 'owner' and new.status = 'active' then
    return new;
  end if;
  if not exists (select 1 from public.organizations o where o.id = old.organization_id) then
    return coalesce(new, old);
  end if;

  select count(*) into remaining
  from public.organization_memberships m
  where m.organization_id = old.organization_id
    and m.role = 'owner'
    and m.status = 'active'
    and m.id <> old.id;

  if remaining = 0 then
    raise exception 'An organization must keep at least one active owner';
  end if;
  return coalesce(new, old);
end;
$$;

revoke execute on function public.enforce_last_owner() from public, anon, authenticated;

create trigger organization_memberships_last_owner
  before update or delete on public.organization_memberships
  for each row execute function public.enforce_last_owner();
