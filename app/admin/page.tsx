import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import DeleteCollectionButton from "./_components/DeleteCollectionButton";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

type CollectionWithCount = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
  products: { count: number }[];
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select(
      "id, slug, name, tagline, image_url, is_published, sort_order, products(count)",
    )
    .order("sort_order", { ascending: true });

  const collections = (data ?? []) as CollectionWithCount[];

  return (
    <>
      <header className={styles.pageHead}>
        <div className={styles.kicker}>Catálogo</div>
        <h1 className={styles.title}>Colecciones</h1>
        <p className={styles.subtitle}>
          Cada colección agrupa los productos. Tocá una para editarla o agregar productos.
        </p>
      </header>

      {error ? (
        <div className={styles.flash}>{error.message}</div>
      ) : null}

      <div className={styles.cardsGrid}>
        {collections.map((c) => {
          const count = c.products?.[0]?.count ?? 0;
          return (
            <Link
              key={c.id}
              href={`/admin/colecciones/${c.slug}`}
              className={styles.card}
            >
              <div className={styles.cardActions}>
                <DeleteCollectionButton id={c.id} name={c.name} />
              </div>
              <div className={styles.cardImg}>
                {c.image_url ? (
                  <Image
                    src={c.image_url}
                    alt={c.name}
                    fill
                    sizes="(max-width: 720px) 100vw, 540px"
                  />
                ) : null}
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.cardName}>{c.name}</h2>
                <div className={styles.cardMeta}>
                  <span>{c.slug}</span>
                  <span>·</span>
                  <span>
                    {count} {count === 1 ? "producto" : "productos"}
                  </span>
                  <span>·</span>
                  <span
                    className={`${styles.cardDot} ${
                      c.is_published ? "" : styles.off
                    }`}
                    aria-label={c.is_published ? "publicada" : "no publicada"}
                  />
                  <span>{c.is_published ? "publicada" : "oculta"}</span>
                </div>
              </div>
            </Link>
          );
        })}

        <Link href="/admin/colecciones/nueva" className={styles.cardEmpty}>
          + Nueva colección
        </Link>
      </div>
    </>
  );
}
