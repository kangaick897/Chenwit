insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  8388608,
  array['image/webp', 'image/png', 'image/jpeg']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'site_images_public_read'
  ) then
    execute $policy$
      create policy site_images_public_read
      on storage.objects for select
      using (bucket_id = 'site-images')
    $policy$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'site_images_admin_insert'
  ) then
    execute $policy$
      create policy site_images_admin_insert
      on storage.objects for insert
      to authenticated
      with check (
        bucket_id = 'site-images'
        and exists (
          select 1
          from public.admin_users
          where admin_users.user_id = auth.uid()
            and admin_users.is_active = true
        )
      )
    $policy$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'site_images_admin_update'
  ) then
    execute $policy$
      create policy site_images_admin_update
      on storage.objects for update
      to authenticated
      using (
        bucket_id = 'site-images'
        and exists (
          select 1
          from public.admin_users
          where admin_users.user_id = auth.uid()
            and admin_users.is_active = true
        )
      )
      with check (
        bucket_id = 'site-images'
        and exists (
          select 1
          from public.admin_users
          where admin_users.user_id = auth.uid()
            and admin_users.is_active = true
        )
      )
    $policy$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'site_images_admin_delete'
  ) then
    execute $policy$
      create policy site_images_admin_delete
      on storage.objects for delete
      to authenticated
      using (
        bucket_id = 'site-images'
        and exists (
          select 1
          from public.admin_users
          where admin_users.user_id = auth.uid()
            and admin_users.is_active = true
        )
      )
    $policy$;
  end if;
end $$;
