import Link from "next/link";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";
import type { Product } from "@/lib/types";
import styles from "./EditorialRow.module.css";

type Props = {
  product: Product;
  right?: boolean;
};

export default function EditorialRow({ product, right = false }: Props) {
  const image = (
    <Link
      href={`/producto/${product.slug}`}
      className={styles.imageLink}
      aria-label={`Ver ${product.name}`}
    >
      <Placeholder
        label={product.imageLabel}
        lit
        className={styles.image}
        height={520}
      />
    </Link>
  );

  const text = (
    <div className={styles.text}>
      <div className="lbl">Look {product.look}</div>
      <h2 className={`display ${styles.title}`}>{product.name}</h2>
      <p className={styles.desc}>{product.description}</p>
      <div className={`mono lbl-dim ${styles.material}`}>{product.material}</div>
      <div className={`price ${styles.price}`}>€ {product.price}</div>
    </div>
  );

  return (
    <Reveal>
      <section className={`${styles.row} ${right ? styles.rowRight : ""}`}>
        {right ? text : image}
        {right ? image : text}
      </section>
    </Reveal>
  );
}
