"use client";

import { useState } from "react";
import styles from "./SizeChips.module.css";

type Props = {
  sizes: string[];
  defaultSize?: string;
};

export default function SizeChips({ sizes, defaultSize }: Props) {
  const [active, setActive] = useState<string | null>(defaultSize ?? null);

  return (
    <div className={styles.row} role="radiogroup" aria-label="Talle">
      {sizes.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={active === s}
          className={`chip ${active === s ? "on" : ""}`}
          onClick={() => setActive(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
