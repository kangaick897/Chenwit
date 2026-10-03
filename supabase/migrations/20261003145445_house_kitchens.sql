alter table public.houses
  add column if not exists kitchens integer check (kitchens >= 0);
