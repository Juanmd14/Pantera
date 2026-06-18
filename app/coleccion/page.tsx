import Link from "next/link";
import Placeholder from "../components/Placeholder";
import Reveal from "../components/Reveal";
import { getCollections, getProductsByCollection } from "@/lib/products";
import styles from "./coleccion.module.css";

export const metadata = {
  title: "Colecciones — Pantera",
  description: "Las colecciones de Pantera. Elegancia oscura en movimiento.",
};

export const revalidate = 60;

export default async function ColeccionesPage() {
  const collections = await getCollections();
  const piecesByCollection = await Promise.all(
    collections.map((c) => getProductsByCollection(c.slug)),
  );

  return (
    <>
      <section className={styles.head}>
        <div className="lbl">Colecciones</div>
        <div className={styles.headRow}>
          <h1 className={`display ${styles.title}`}>El hábitat</h1>
          <div className={`mono ${styles.count}`}>
            {collections.length} COLECCIONES
          </div>
        </div>
      </section>

      <div className="hr" />

      <section className={styles.grid}>
        {collections.map((collection, i) => {
          const pieces = piecesByCollection[i] ?? [];
          return (
            <Reveal key={collection.slug}>
              <Link
                href={`/coleccion/${collection.slug}`}
                className={styles.card}
                aria-label={`Ver colección ${collection.name}`}
              >
                <Placeholder
                  label={collection.name.toUpperCase()}
                  lit
                  className={styles.cardImg}
                  height={560}
                  src={collection.image}
                  alt={`Colección ${collection.name}`}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
                <div className={styles.cardBody}>
                  <h2 className={`display ${styles.cardName}`}>
                    {collection.name}
                  </h2>
                  <p className={styles.cardTagline}>{collection.tagline}</p>
                  <div className={`mono ${styles.cardCount}`}>
                    {pieces.length} {pieces.length === 1 ? "PIEZA" : "PIEZAS"}
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}
