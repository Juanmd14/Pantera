import BrandMark from "./BrandMark";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <>
      <div className="hr" />
      <footer className={styles.foot}>
        <BrandMark size="footer" />
        <span className={`mono ${styles.copy}`}>© 2026 — AMÉRICA · RIVADAVIA · BUENOS AIRES</span>
      </footer>
    </>
  );
}
