"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { uploadImage } from "../_actions";
import styles from "../admin.module.css";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
  kind: "collections" | "products";
  label?: string;
};

export default function ImageUpload({ value, onChange, kind, label }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleFile(file: File) {
    setError(null);
    setStatus("Subiendo…");
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadImage(fd, kind);
      if (!res.ok) {
        setError(res.error);
        setStatus(null);
        return;
      }
      onChange(res.url);
      setStatus("Imagen lista");
    });
  }

  return (
    <div className={styles.uploadBox}>
      {label ? <span className={styles.label}>{label}</span> : null}

      <div className={styles.uploadPreview}>
        {value ? (
          <Image
            src={value}
            alt="Vista previa"
            fill
            sizes="340px"
            style={{ objectFit: "cover" }}
            unoptimized={value.startsWith("/")}
          />
        ) : (
          <div className={styles.uploadPlaceholder}>Sin imagen</div>
        )}
      </div>

      <input
        id={`upload-${kind}`}
        type="file"
        accept="image/*"
        className={styles.uploadInput}
        disabled={pending}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <label
        htmlFor={`upload-${kind}`}
        className={styles.uploadLabel}
        aria-disabled={pending}
      >
        {value ? "Cambiar imagen" : "Subir imagen"}
      </label>

      {value ? (
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => {
            onChange(null);
            setStatus(null);
          }}
          disabled={pending}
        >
          Quitar
        </button>
      ) : null}

      {error ? (
        <div className={`${styles.uploadStatus} ${styles.error}`}>{error}</div>
      ) : status ? (
        <div className={styles.uploadStatus}>{status}</div>
      ) : null}
    </div>
  );
}
