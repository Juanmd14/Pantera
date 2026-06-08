"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./status.module.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Pantera] runtime error", error);
  }, [error]);

  return (
    <section className={styles.wrap}>
      <div className={styles.inner}>
        <div className="lbl">Error inesperado</div>
        <h1 className={`display ${styles.title}`}>
          Algo se quebró
          <br />
          en la sombra
        </h1>
        <p className={styles.body}>
          Algo no respondió como esperábamos. Probá de nuevo; si persiste,
          escribinos por WhatsApp y lo coordinamos a mano.
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={reset} className="btn solid">
            Reintentar
          </button>
          <Link href="/" className="btn">
            Volver al inicio
          </Link>
        </div>
        {error.digest && (
          <p className={`mono ${styles.digest}`}>ref · {error.digest}</p>
        )}
      </div>
    </section>
  );
}
