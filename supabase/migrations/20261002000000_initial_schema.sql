-- Fresh-project baseline. Do not apply to an existing client database without
-- comparing its schema and policies first.
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  id text primary key,
  company_name text,
  tagline text,
  contact jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values ('default');

create table public.houses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code text not null,
  name text not null,
  cover_image_url text,
  style text,
  location text,
  starting_price text,
  floors text,
  usable_area text,
  house_size text,
  description text,
  bedrooms integer not null default 0 check (bedrooms >= 0),
  bathrooms integer not null default 0 check (bathrooms >= 0),
  parking integer not null default 0 check (parking >= 0),
  is_featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.house_floor_plans (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  title text,
  image_url text,
  sort_order integer not null default 0
);

create table public.project_categories (
  slug text primary key,
  label text not null,
  show_in_filter boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

insert into public.project_categories (slug, label, sort_order)
values ('completed', 'ผลงานทั้งหมด', 1);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text,
  cover_image_url text,
  category_slug text references public.project_categories(slug),
  status text,
  year text,
  area text,
  scope text,
  description text,
  highlights text[] not null default '{}',
  show_details boolean not null default true,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text,
  alt_text text,
  sort_order integer not null default 0
);

create index houses_published_order_idx on public.houses (is_published, sort_order, created_at);
create index house_floor_plans_order_idx on public.house_floor_plans (house_id, sort_order);
create index projects_published_order_idx on public.projects (is_published, sort_order, created_at);
create index project_images_order_idx on public.project_images (project_id, sort_order);

create function public.is_site_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid()) and is_active = true
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.houses enable row level security;
alter table public.house_floor_plans enable row level security;
alter table public.project_categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;

create policy admin_users_self_read on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

create policy site_settings_public_read on public.site_settings for select to anon, authenticated
using (true);
create policy site_settings_admin_update on public.site_settings for update to authenticated
using ((select public.is_site_admin())) with check ((select public.is_site_admin()));

create policy houses_public_or_admin_read on public.houses for select to anon, authenticated
using (is_published or (select public.is_site_admin()));
create policy houses_admin_insert on public.houses for insert to authenticated
with check ((select public.is_site_admin()));
create policy houses_admin_update on public.houses for update to authenticated
using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
create policy houses_admin_delete on public.houses for delete to authenticated
using ((select public.is_site_admin()));

create policy floor_plans_public_or_admin_read on public.house_floor_plans for select to anon, authenticated
using (
  (select public.is_site_admin()) or exists (
    select 1 from public.houses where houses.id = house_id and houses.is_published
  )
);
create policy floor_plans_admin_insert on public.house_floor_plans for insert to authenticated
with check ((select public.is_site_admin()));
create policy floor_plans_admin_update on public.house_floor_plans for update to authenticated
using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
create policy floor_plans_admin_delete on public.house_floor_plans for delete to authenticated
using ((select public.is_site_admin()));

create policy categories_public_or_admin_read on public.project_categories for select to anon, authenticated
using (is_active or (select public.is_site_admin()));
create policy categories_admin_insert on public.project_categories for insert to authenticated
with check ((select public.is_site_admin()));
create policy categories_admin_update on public.project_categories for update to authenticated
using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
create policy categories_admin_delete on public.project_categories for delete to authenticated
using ((select public.is_site_admin()));

create policy projects_public_or_admin_read on public.projects for select to anon, authenticated
using (is_published or (select public.is_site_admin()));
create policy projects_admin_insert on public.projects for insert to authenticated
with check ((select public.is_site_admin()));
create policy projects_admin_update on public.projects for update to authenticated
using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
create policy projects_admin_delete on public.projects for delete to authenticated
using ((select public.is_site_admin()));

create policy project_images_public_or_admin_read on public.project_images for select to anon, authenticated
using (
  (select public.is_site_admin()) or exists (
    select 1 from public.projects where projects.id = project_id and projects.is_published
  )
);
create policy project_images_admin_insert on public.project_images for insert to authenticated
with check ((select public.is_site_admin()));
create policy project_images_admin_update on public.project_images for update to authenticated
using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
create policy project_images_admin_delete on public.project_images for delete to authenticated
using ((select public.is_site_admin()));

grant select on public.admin_users to authenticated;
grant select on public.site_settings to anon;
grant select, update on public.site_settings to authenticated;
grant select on public.houses, public.house_floor_plans,
  public.project_categories, public.projects, public.project_images to anon;
grant select, insert, update, delete on public.houses, public.house_floor_plans,
  public.project_categories, public.projects, public.project_images to authenticated;
