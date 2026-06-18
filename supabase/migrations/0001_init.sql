-- Pantera — schema inicial para catálogo editable
-- Colecciones, productos, talles con stock, y allowlist de admins.

create extension if not exists "pgcrypto";

-- ── COLECCIONES ─────────────────────────────────────────────────
create table collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text not null default '',
  image_url text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── PRODUCTOS ───────────────────────────────────────────────────
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  collection_id uuid not null references collections(id) on delete cascade,
  look text not null default '',
  name text not null,
  short_name text not null,
  description text not null default '',
  material text not null default '',
  image_label text not null default '',
  image_url text,
  price int not null check (price >= 0),
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_collection_id_idx on products(collection_id);

-- ── TALLES / STOCK ──────────────────────────────────────────────
create table product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null,
  stock int not null default 0 check (stock >= 0),
  sort_order int not null default 0,
  unique (product_id, label)
);

create index product_sizes_product_id_idx on product_sizes(product_id);

-- ── ALLOWLIST DE ADMINS ─────────────────────────────────────────
create table admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ── updated_at trigger ──────────────────────────────────────────
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger collections_set_updated_at
  before update on collections
  for each row execute function set_updated_at();

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────
alter table collections enable row level security;
alter table products enable row level security;
alter table product_sizes enable row level security;
alter table admin_users enable row level security;

-- Lectura pública: solo registros publicados
create policy "collections_public_read" on collections for select
  using (is_published = true);

create policy "products_public_read" on products for select
  using (is_published = true);

-- Talles: lectura pública siempre (no exponen nada sensible)
create policy "product_sizes_public_read" on product_sizes for select
  using (true);

-- Escritura: solo admins (cualquier select/insert/update/delete)
create policy "collections_admin_all" on collections for all
  using (exists (select 1 from admin_users where user_id = auth.uid()))
  with check (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "products_admin_all" on products for all
  using (exists (select 1 from admin_users where user_id = auth.uid()))
  with check (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "product_sizes_admin_all" on product_sizes for all
  using (exists (select 1 from admin_users where user_id = auth.uid()))
  with check (exists (select 1 from admin_users where user_id = auth.uid()));

-- Admins: cada uno puede leer su propio row (para chequear pertenencia)
create policy "admin_users_self_read" on admin_users for select
  using (user_id = auth.uid());
