-- Give optional save_contractor_profile() parameters defaults so generated
-- TypeScript types mark them optional. Body is unchanged from 20261102020000.
create or replace function public.save_contractor_profile(
  p_organization_id uuid,
  p_headline text default null,
  p_bio text default null,
  p_years_in_business integer default null,
  p_license_number text default null,
  p_is_insured boolean default false,
  p_base_town text default null,
  p_lng double precision default null,
  p_lat double precision default null,
  p_service_radius_meters integer default null,
  p_primary_trade_id uuid default null,
  p_trade_ids uuid[] default null,
  p_publish boolean default false
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

  delete from public.service_areas
  where organization_id = p_organization_id and name = 'Primary service area';
  if v_point is not null and p_service_radius_meters is not null then
    insert into public.service_areas (organization_id, name, center, radius_meters)
    values (p_organization_id, 'Primary service area', v_point, p_service_radius_meters);
  end if;

  return v_profile_id;
end;
$$;
