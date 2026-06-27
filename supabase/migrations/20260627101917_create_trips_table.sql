create table public.trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamptz not null default now()
);

-- alter table public.trips enable row level security;

-- create policy "Users can view own trips"
-- on public.trips
-- for select
-- to authenticated
-- using (auth.uid() = user_id);