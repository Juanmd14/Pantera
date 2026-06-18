-- Pantera — tighten product_sizes RLS para no exponer inventario oculto.
-- La policy original `using (true)` permitía leer todos los talles vía
-- la anon key, incluso de productos no publicados. Ahora se filtra por
-- el is_published del producto padre.
-- Idempotente: drop + create.

drop policy if exists "product_sizes_public_read" on product_sizes;

create policy "product_sizes_public_read" on product_sizes for select
  using (
    exists (
      select 1 from products
      where products.id = product_sizes.product_id
        and products.is_published = true
    )
  );
