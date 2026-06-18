import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CollectionForm from "../../_components/CollectionForm";
import { formatPrice } from "@/lib/products";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

type Params = { slug: string };

type CollectionRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  look: string;
  image_url: string | null;
  price: number;
  is_published: boolean;
  sort_order: number;
};

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return { title: `${slug} — Pantera Admin` };
}

export default async function EditarColeccionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: col } = await supabase
    .from("collections")
    .select("id, slug, name, tagline, image_url, is_published, sort_order")
    .eq("slug", slug)
    .maybeSingle();

  const collection = col as CollectionRow | null;
  if (!collection) notFound();

  const { data: prodData } = await supabase
    .from("products")
    .select("id, slug, name, look, image_url, price, is_published, sort_order")
    .eq("collection_id", collection.id)
    .order("sort_order", { ascending: true });

  const products = (prodData ?? []) as ProductRow[];

  return (
    <>
      <header className={styles.pageHead}>
        <div className={styles.kicker}>Colección</div>
        <h1 className={styles.title}>{collection.name}</h1>
        <p className={styles.subtitle}>
          /coleccion/{collection.slug} · {products.length}{" "}
          {products.length === 1 ? "pieza" : "piezas"}
        </p>
      </header>

      <CollectionForm
        initial={{
          id: collection.id,
          slug: collection.slug,
          name: collection.name,
          tagline: collection.tagline,
          imageUrl: collection.image_url,
          isPublished: collection.is_published,
          sortOrder: collection.sort_order,
        }}
      />

      <section style={{ marginTop: 48 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <h2 className={styles.title} style={{ fontSize: 32 }}>
            Piezas
          </h2>
          <Link
            href={`/admin/productos/nuevo?coleccion=${collection.slug}`}
            className={styles.btn}
          >
            + Nuevo producto
          </Link>
        </div>

        {products.length === 0 ? (
          <p className={styles.hint}>Todavía no hay piezas en esta colección.</p>
        ) : (
          <div>
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/admin/productos/${p.slug}`}
                className={styles.productRow}
              >
                <div style={{ position: "relative", width: 64, height: 80 }}>
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      sizes="64px"
                      className={styles.productThumb}
                      style={{ objectFit: "cover" }}
                      unoptimized={p.image_url.startsWith("/")}
                    />
                  ) : null}
                </div>
                <div className={styles.productMain}>
                  <span className={styles.productName}>{p.name}</span>
                  <span className={styles.productSub}>
                    Look {p.look} · {p.is_published ? "publicada" : "oculta"}
                  </span>
                </div>
                <span className={styles.productPrice}>{formatPrice(p.price)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
