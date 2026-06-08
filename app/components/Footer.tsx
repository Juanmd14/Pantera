import BrandMark from "./BrandMark";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <>
      <div className="hr" />
      <footer className={styles.foot}>
        <span className={styles.dot} aria-hidden />
        <BrandMark size="footer" />
        <span className={`mono ${styles.location}`}>
          América · Rivadavia · Buenos Aires
        </span>
        <span className={`mono ${styles.copy}`}>
          © {new Date().getFullYear()} — Estudio Pantera
        </span>
      </footer>
    </>
  );
}
