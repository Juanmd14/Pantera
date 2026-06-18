"use client";

import styles from "../admin.module.css";

export type SizeRow = { label: string; stock: number };

type Props = {
  sizes: SizeRow[];
  onChange: (sizes: SizeRow[]) => void;
};

const PRESETS: Record<string, SizeRow[]> = {
  ropa: ["XS", "S", "M", "L", "XL"].map((label) => ({ label, stock: 99 })),
  botas: ["36", "37", "38", "39", "40", "41"].map((label) => ({
    label,
    stock: 99,
  })),
};

export default function SizesEditor({ sizes, onChange }: Props) {
  function updateAt(i: number, patch: Partial<SizeRow>) {
    const next = sizes.slice();
    next[i] = { ...next[i]!, ...patch };
    onChange(next);
  }
  function removeAt(i: number) {
    onChange(sizes.filter((_, j) => j !== i));
  }
  function addRow() {
    onChange([...sizes, { label: "", stock: 0 }]);
  }
  function loadPreset(key: keyof typeof PRESETS) {
    onChange(PRESETS[key].map((s) => ({ ...s })));
  }
  function markAllSoldOut() {
    onChange(sizes.map((s) => ({ ...s, stock: 0 })));
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => loadPreset("ropa")}
        >
          Cargar XS–XL
        </button>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => loadPreset("botas")}
        >
          Cargar 36–41
        </button>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={markAllSoldOut}
        >
          Marcar todo sin stock
        </button>
      </div>

      {sizes.length === 0 ? (
        <p className={styles.hint}>
          Sin talles. Agregá uno o cargá un preset arriba.
        </p>
      ) : (
        <div className={styles.sizesGrid}>
          {sizes.map((s, i) => (
            <div
              key={i}
              className={`${styles.sizeBox} ${
                s.stock <= 0 ? styles.empty : ""
              }`}
            >
              <span className={styles.sizeLbl}>Talle</span>
              <input
                className={styles.sizeName}
                value={s.label}
                onChange={(e) => updateAt(i, { label: e.target.value })}
                placeholder="M"
              />
              <span className={styles.sizeLbl}>Stock</span>
              <div className={styles.sizeStockRow}>
                <input
                  type="number"
                  min={0}
                  className={styles.sizeStock}
                  value={s.stock}
                  onChange={(e) =>
                    updateAt(i, { stock: Number(e.target.value) })
                  }
                />
                <button
                  type="button"
                  aria-label="Eliminar talle"
                  className={styles.sizeRemove}
                  onClick={() => removeAt(i)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <button
          type="button"
          className={styles.btn}
          onClick={addRow}
          style={{ padding: "10px 18px", fontSize: 14 }}
        >
          + Agregar talle
        </button>
      </div>
    </div>
  );
}
