import Link from "next/link";
import Eyes from "./components/Eyes";
import styles from "./status.module.css";

export const metadata = {
  title: "404 · Pantera",
  description: "La pantera no encontró esta huella.",
};

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <div className={styles.inner}>
        <Eyes size={56} gap={36} className={styles.eyes} />
        <div className="lbl">404 · Sin rastro</div>
        <h1 className={`display ${styles.title}`}>
          La pantera no
          <br />
          encontró esta huella
        </h1>
        <p className={styles.body}>
          La página se desvaneció en la niebla o nunca existió. Volvé al hábitat
          principal y seguí explorando.
        </p>
        <div className={styles.actions}>
          <Link href="/" className="btn solid">
            Volver al inicio
          </Link>
          <Link href="/coleccion" className="btn">
            Ver la colección
          </Link>
        </div>
      </div>
    </section>
  );
}
