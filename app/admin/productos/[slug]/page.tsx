import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "../../_components/ProductForm";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

type Params = { slug: string };

type ProductWithSizes = {
  id: string;
  slug: string;
  collection_id: string;
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
  product_sizes: { label: string; stock: number; sort_order: number }[];
};

type CollectionOption = { id: string; name: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  return { title: `${slug} — Pantera Admin` };
}

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: prod } = await supabase
    .from("products")
    .select(
      "id, slug, collection_id, look, name, short_name, description, material, image_label, image_url, price, is_published, sort_order, product_sizes(label, stock, sort_order)",
    )
    .eq("slug", slug)
    .maybeSingle();

  const product = prod as ProductWithSizes | null;
  if (!product) notFound();

  const { data: colData } = await supabase
    .from("collections")
    .select("id, name, slug")
    .order("sort_order", { ascending: true });

  const collections = (colData ?? []) as CollectionOption[];

  const sizes = (product.product_sizes ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => ({ label: s.label, stock: s.stock }));

  return (
    <>
      <header className={styles.pageHead}>
        <div className={styles.kicker}>Producto</div>
        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.subtitle}>
          /producto/{product.slug} ·{" "}
          {product.is_published ? "publicado" : "oculto"}
        </p>
      </header>

      <ProductForm
        initial={{
          id: product.id,
          slug: product.slug,
          collectionId: product.collection_id,
          look: product.look,
          name: product.name,
          shortName: product.short_name,
          description: product.description,
          material: product.material,
          imageLabel: product.image_label,
          imageUrl: product.image_url,
          price: product.price,
          isPublished: product.is_published,
          sortOrder: product.sort_order,
          sizes,
        }}
        collections={collections}
      />
    </>
  );
}
