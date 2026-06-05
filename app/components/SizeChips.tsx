"use client";

import styles from "./SizeChips.module.css";

type Props = {
  sizes: string[];
  value: string | null;
  onChange: (size: string) => void;
};

export default function SizeChips({ sizes, value, onChange }: Props) {
  return (
    <div className={styles.row} role="radiogroup" aria-label="Talle">
      {sizes.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={value === s}
          className={`chip ${value === s ? "on" : ""}`}
          onClick={() => onChange(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
