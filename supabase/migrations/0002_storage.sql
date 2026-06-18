-- Pantera — bucket de Storage para imágenes del catálogo + policies.
-- Idempotente: re-ejecutarlo no rompe nada.

-- ── BUCKET PÚBLICO ──────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('catalog', 'catalog', true)
on conflict (id) do update set public = true;

-- ── POLICIES ────────────────────────────────────────────────────
-- Lectura pública (el bucket ya es público; dejamos la policy explícita
-- por si alguien lo cambia a private después).
drop policy if exists "catalog_public_read" on storage.objects;
create policy "catalog_public_read" on storage.objects for select
  using (bucket_id = 'catalog');

-- Escritura / actualización / borrado: solo admins.
drop policy if exists "catalog_admin_insert" on storage.objects;
create policy "catalog_admin_insert" on storage.objects for insert
  with check (
    bucket_id = 'catalog'
    and exists (select 1 from admin_users where user_id = auth.uid())
  );

drop policy if exists "catalog_admin_update" on storage.objects;
create policy "catalog_admin_update" on storage.objects for update
  using (
    bucket_id = 'catalog'
    and exists (select 1 from admin_users where user_id = auth.uid())
  );

drop policy if exists "catalog_admin_delete" on storage.objects;
create policy "catalog_admin_delete" on storage.objects for delete
  using (
    bucket_id = 'catalog'
    and exists (select 1 from admin_users where user_id = auth.uid())
  );
