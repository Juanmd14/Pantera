import EditorialRow from "../components/EditorialRow";
import { visibleProducts } from "@/lib/products";
import styles from "./coleccion.module.css";

export const metadata = {
  title: "Colección Sombra — Pantera",
  description: "Colección Sombra. Elegancia oscura en movimiento.",
};

export default function ColeccionPage() {
  return (
    <>
      <section className={styles.head}>
        <div className="lbl">Colección</div>
        <div className={styles.headRow}>
          <h1 className={`display ${styles.title}`}>Sombra</h1>
          <div className={`mono ${styles.count}`}>{visibleProducts.length} PIEZAS</div>
        </div>
      </section>

      <div className="hr" />

      {visibleProducts.map((product, idx) => (
        <div key={product.slug}>
          <EditorialRow product={product} right={idx % 2 === 1} />
          {idx < visibleProducts.length - 1 && <div className="hr" />}
        </div>
      ))}
    </>
  );
}
