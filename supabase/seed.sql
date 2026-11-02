-- Starter trade categories for the Lancaster County launch.
-- Runs with `supabase db reset` locally. Not yet applied anywhere.
insert into public.trade_categories (slug, name, sort_order) values
  ('general-contracting', 'General Contracting', 10),
  ('carpentry', 'Carpentry', 20),
  ('electrical', 'Electrical', 30),
  ('plumbing', 'Plumbing', 40),
  ('hvac', 'HVAC', 50),
  ('roofing', 'Roofing', 60),
  ('masonry', 'Masonry & Concrete', 70),
  ('excavation', 'Excavation & Site Work', 80),
  ('painting', 'Painting', 90),
  ('flooring', 'Flooring', 100),
  ('landscaping', 'Landscaping', 110),
  ('drywall', 'Drywall', 120)
on conflict (slug) do nothing;
