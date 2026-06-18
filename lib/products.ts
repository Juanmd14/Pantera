import { cache } from "react";
import { createClient } from "./supabase/server";
import type { Collection, Product, ProductSize } from "./types";

// ── Row shapes (snake_case) ─────────────────────────────────────
type CollectionRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
};

type SizeRow = {
  label: string;
  stock: number;
  sort_order: number;
};

type ProductRow = {
  id: string;
  slug: string;
  look: string;
  name: string;
  short_name: string;
  description: string;
  material: string;
  image_label: string;
  image_url: string | null;
  price: number;
  is_published: boolean;
  sort_order: number;
  collections: { slug: string } | null;
  product_sizes: SizeRow[];
};

function mapCollection(row: CollectionRow): Collection {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    image: row.image_url ?? "",
    isPublished: row.is_published,
    sortOrder: row.sort_order,
  };
}

function mapProduct(row: ProductRow): Product {
  const sizes: ProductSize[] = (row.product_sizes ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => ({ label: s.label, stock: s.stock }));

  const product: Product = {
    slug: row.slug,
    look: row.look,
    name: row.name,
    shortName: row.short_name,
    description: row.description,
    material: row.material,
    price: row.price,
    imageLabel: row.image_label,
    collection: row.collections?.slug ?? "",
    sizes,
    isPublished: row.is_published,
  };
  if (row.image_url) product.image = row.image_url;
  return product;
}

// `cache` deduplica las queries dentro de un mismo render (server).
export const getCollections = cache(async (): Promise<Collection[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("id, slug, name, tagline, image_url, is_published, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as CollectionRow[]).map(mapCollection);
});

export const getCollection = cache(
  async (slug: string): Promise<Collection | undefined> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("collections")
      .select("id, slug, name, tagline, image_url, is_published, sort_order")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? mapCollection(data as CollectionRow) : undefined;
  },
);

const PRODUCT_SELECT = `
  id, slug, look, name, short_name, description, material,
  image_label, image_url, price, is_published, sort_order,
  collections:collection_id ( slug ),
  product_sizes ( label, stock, sort_order )
`;

export const getProductsByCollection = cache(
  async (slug: string): Promise<Product[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("collections.slug", slug)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    // El filtro `.eq("collections.slug", slug)` puede devolver filas con
    // collection null si el join no matchea; las descartamos.
    return (data as unknown as ProductRow[])
      .filter((p) => p.collections?.slug === slug && p.image_url)
      .map(mapProduct);
  },
);

export const getProduct = cache(
  async (slug: string): Promise<Product | undefined> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return undefined;
    const row = data as unknown as ProductRow;
    if (!row.image_url) return undefined;
    return mapProduct(row);
  },
);

export const getRelated = cache(async (slug: string): Promise<Product[]> => {
  const current = await getProduct(slug);
  if (!current) return [];
  const siblings = await getProductsByCollection(current.collection);
  return siblings.filter((p) => p.slug !== slug);
});

// ── Helpers puros ───────────────────────────────────────────────

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-AR")}`;
}

export function isSoldOut(product: Product): boolean {
  return product.sizes.every((s) => s.stock <= 0);
}

export function isSizeAvailable(product: Product, sizeLabel: string): boolean {
  const s = product.sizes.find((s) => s.label === sizeLabel);
  return Boolean(s && s.stock > 0);
}
