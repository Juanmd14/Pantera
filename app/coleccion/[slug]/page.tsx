import Link from "next/link";
import { notFound } from "next/navigation";
import EditorialRow from "../../components/EditorialRow";
import {
  collections,
  getCollection,
  getProductsByCollection,
} from "@/lib/products";
import styles from "../coleccion.module.css";

type Params = { slug: string };

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Pantera" };
  return {
    title: `Colección ${collection.name} — Pantera`,
    description: collection.tagline,
  };
}

export default async function ColeccionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const pieces = getProductsByCollection(slug);

  return (
    <>
      <section className={styles.head}>
        <Link href="/coleccion" className={`lbl ${styles.back}`}>
          ← Colecciones
        </Link>
        <div className={styles.headRow}>
          <h1 className={`display ${styles.title}`}>{collection.name}</h1>
          <div className={`mono ${styles.count}`}>
            {pieces.length} {pieces.length === 1 ? "PIEZA" : "PIEZAS"}
          </div>
        </div>
      </section>

      <div className="hr" />

      {pieces.length === 0 ? (
        <section className={styles.emptyState}>
          <p>Pronto se va a mover algo por acá.</p>
        </section>
      ) : (
        pieces.map((product, idx) => (
          <div key={product.slug}>
            <EditorialRow product={product} right={idx % 2 === 1} />
            {idx < pieces.length - 1 && <div className="hr" />}
          </div>
        ))
      )}
    </>
  );
}
