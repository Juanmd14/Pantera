"use client";

import { useState, useId, type ReactNode } from "react";
import styles from "./Accordion.module.css";

type Props = {
  title: string;
  children: ReactNode;
};

export default function Accordion({ title, children }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panelId = `accordion-panel-${id}`;
  const buttonId = `accordion-button-${id}`;

  return (
    <div className={styles.item}>
      <button
        id={buttonId}
        type="button"
        className={styles.head}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{title}</span>
        <span className={`mono ${styles.sign}`}>{open ? "−" : "+"}</span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
      >
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}
