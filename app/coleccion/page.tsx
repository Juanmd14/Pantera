import EditorialRow from "../components/EditorialRow";
import { products } from "@/lib/products";
import styles from "./coleccion.module.css";

export const metadata = {
  title: "Colección Sombra · FW26 — Pantera",
  description: "12 piezas. Otoño / Invierno 2026. Sombra.",
};

export default function ColeccionPage() {
  return (
    <>
      <section className={styles.head}>
        <div className="lbl">Colección — Otoño / Invierno 2026</div>
        <div className={styles.headRow}>
          <h1 className={`display ${styles.title}`}>Sombra</h1>
          <div className={`mono ${styles.count}`}>12 PIEZAS</div>
        </div>
      </section>

      <div className="hr" />

      {products.map((product, idx) => (
        <div key={product.slug}>
          <EditorialRow product={product} right={idx % 2 === 1} />
          {idx < products.length - 1 && <div className="hr" />}
        </div>
      ))}
    </>
  );
}
