"use client";

import type { ProductSize } from "@/lib/types";
import styles from "./SizeChips.module.css";

type Props = {
  sizes: ProductSize[];
  value: string | null;
  onChange: (size: string) => void;
};

export default function SizeChips({ sizes, value, onChange }: Props) {
  return (
    <div className={styles.row} role="radiogroup" aria-label="Talle">
      {sizes.map((s) => {
        const soldOut = s.stock <= 0;
        return (
          <button
            key={s.label}
            type="button"
            role="radio"
            aria-checked={value === s.label}
            aria-disabled={soldOut}
            disabled={soldOut}
            title={soldOut ? "Sin stock" : undefined}
            className={`chip ${value === s.label ? "on" : ""} ${soldOut ? "out" : ""}`.trim()}
            onClick={() => !soldOut && onChange(s.label)}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
