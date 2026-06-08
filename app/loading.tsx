import styles from "./status.module.css";

export default function Loading() {
  return (
    <section className={styles.wrap} aria-busy="true" aria-live="polite">
      <div className={styles.inner}>
        <div className="lbl">Cargando</div>
        <div className={styles.dots} aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <p className={styles.body}>El animal se acomoda…</p>
      </div>
    </section>
  );
}
