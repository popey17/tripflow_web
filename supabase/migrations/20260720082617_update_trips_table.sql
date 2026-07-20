alter table public.trips
  add column owner_id uuid references public.profiles(id) on delete cascade,
  add column description text,
  add column destination text,
  add column cover_image text,
  add column start_date date,
  add column end_date date;

-- Remove seed rows that predate ownership
delete from public.trips where owner_id is null;

alter table public.trips
  alter column owner_id set not null;
