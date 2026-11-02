-- RLS / trigger smoke test. Runs entirely inside a transaction and ROLLS BACK,
-- so it leaves no data behind. Run in the Supabase SQL editor (or via MCP
-- execute_sql) as the postgres role. Every `outcome` should start with "yes"
-- or match the expected value noted in the step name.
-- Last run: 2026-11-02 against project iaruniafwipktocripud — all 13 steps as expected.
begin;
create temp table results (step text, outcome text) on commit drop;
grant all on results to authenticated, anon;

insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-4000-8000-00000000000a', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-a@test.invalid', '{"display_name":"Alice"}', now(), now()),
  ('00000000-0000-4000-8000-00000000000b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-b@test.invalid', '{"display_name":"Bob"}', now(), now()),
  ('00000000-0000-4000-8000-00000000000c', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-c@test.invalid', '{"display_name":"Cara"}', now(), now());
insert into results select 'profiles auto-created (expect 3)', count(*)::text from public.profiles where id::text like '00000000-0000-4000-8000-00000000000%';

-- Alice creates org A and an open request
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated"}', true);
insert into public.organizations (id, name, slug, created_by) values ('10000000-0000-4000-8000-00000000000a', 'Alpha Roofing', 'alpha-roofing-rlstest', '00000000-0000-4000-8000-00000000000a');
insert into results select 'alice membership role (expect owner)', role::text from public.organization_memberships where organization_id = '10000000-0000-4000-8000-00000000000a';
insert into public.resource_requests (id, organization_id, created_by, kind, title, status) values ('20000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-00000000000a', '00000000-0000-4000-8000-00000000000a', 'equipment_rental', 'Need a mini excavator', 'open');
insert into public.organization_memberships (organization_id, user_id, role) values ('10000000-0000-4000-8000-00000000000a', '00000000-0000-4000-8000-00000000000c', 'member');
do $$ begin
  insert into public.exchange_offers (request_id, organization_id, created_by, points_amount) values ('20000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-00000000000a', '00000000-0000-4000-8000-00000000000a', 10);
  insert into results values ('self-offer blocked', 'NO - inserted');
exception when others then insert into results values ('self-offer blocked', 'yes: ' || sqlerrm); end $$;

-- Bob creates org B and offers
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000b","role":"authenticated"}', true);
insert into public.organizations (id, name, slug, created_by) values ('10000000-0000-4000-8000-00000000000b', 'Beta Excavating', 'beta-excavating-rlstest', '00000000-0000-4000-8000-00000000000b');
insert into results select 'bob sees open request (expect 1)', count(*)::text from public.resource_requests where id = '20000000-0000-4000-8000-00000000000a';
insert into public.exchange_offers (id, request_id, organization_id, created_by, points_amount) values ('30000000-0000-4000-8000-00000000000b', '20000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-00000000000b', '00000000-0000-4000-8000-00000000000b', 250);
insert into results values ('bob offer inserted', 'yes');
do $$ begin
  update public.exchange_offers set status = 'accepted' where id = '30000000-0000-4000-8000-00000000000b';
  insert into results values ('bob self-accept blocked', 'NO - updated');
exception when others then insert into results values ('bob self-accept blocked', 'yes: ' || sqlerrm); end $$;
insert into results select 'bob sees org A roster rows (expect 0)', count(*)::text from public.organization_memberships where organization_id = '10000000-0000-4000-8000-00000000000a';

-- Cara (member of A, not admin)
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000c","role":"authenticated"}', true);
insert into results select 'cara sees offer (expect 1)', count(*)::text from public.exchange_offers where id = '30000000-0000-4000-8000-00000000000b';
do $$ begin
  update public.exchange_offers set status = 'accepted' where id = '30000000-0000-4000-8000-00000000000b';
  insert into results values ('member accept blocked', 'NO - updated');
exception when others then insert into results values ('member accept blocked', 'yes: ' || sqlerrm); end $$;
do $$ declare n int; begin
  update public.organization_memberships set role = 'owner' where user_id = '00000000-0000-4000-8000-00000000000c';
  get diagnostics n = row_count;
  insert into results values ('member self-promote blocked', case when n = 0 then 'yes: 0 rows (RLS)' else 'NO - updated' end);
exception when others then insert into results values ('member self-promote blocked', 'yes: ' || sqlerrm); end $$;

-- Alice (owner) accepts
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated"}', true);
update public.exchange_offers set status = 'accepted' where id = '30000000-0000-4000-8000-00000000000b';
insert into results select 'owner accept (expect accepted, true)', status::text || ', responded_at set=' || (responded_at is not null)::text from public.exchange_offers where id = '30000000-0000-4000-8000-00000000000b';

-- Anonymous
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
insert into results select 'anon sees requests (expect 0)', count(*)::text from public.resource_requests;
insert into results select 'anon sees trade categories (expect 12)', count(*)::text from public.trade_categories;

reset role;
select * from results;
rollback;
