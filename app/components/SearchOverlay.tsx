"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import styles from "./SearchOverlay.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

type SearchableProduct = Pick<
  Product,
  "slug" | "look" | "name" | "shortName" | "description" | "material" | "price" | "image"
>;

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<SearchableProduct[] | null>(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // El placeholder largo se corta en mobile, así que usamos uno simple cuando
  // el viewport es angosto.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 520px)");
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Cargar catálogo la primera vez que se abre.
  useEffect(() => {
    if (!open || catalog) return;
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("slug, look, name, short_name, description, material, price, image_url")
        .eq("is_published", true)
        .not("image_url", "is", null)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      setCatalog(
        (data ?? []).map((p) => ({
          slug: p.slug,
          look: p.look,
          name: p.name,
          shortName: p.short_name,
          description: p.description,
          material: p.material,
          price: p.price,
          image: p.image_url ?? undefined,
        })),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [open, catalog]);

  // Auto-focus + reset al abrir/cerrar
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 140);
      return () => clearTimeout(t);
    }
    // Sync con el estado externo `open`: limpiar query al cerrarse el overlay.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery("");
  }, [open]);

  // Body scroll lock + Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const list = catalog ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => {
      const hay = `${p.name} ${p.material} ${p.description} ${p.shortName}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, catalog]);

  const hasQuery = query.trim().length > 0;
  const empty = hasQuery && results.length === 0;

  return (
    <div
      className={`${styles.overlay} ${open ? styles.open : ""}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Buscar prendas"
    >
      <div className={styles.head}>
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          placeholder={isNarrow ? "Buscar…" : "Buscar prendas, materiales, looks…"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          className={styles.close}
          aria-label="Cerrar búsqueda"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>

      <div className={styles.body}>
        <div
          className={`mono ${styles.countLine}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {empty
            ? "0 resultados"
            : `${results.length} ${results.length === 1 ? "pieza" : "piezas"}`}
        </div>

        {empty ? (
          <p className={styles.emptyMsg}>
            Nada se mueve por acá. Probá otra palabra.
          </p>
        ) : (
          <div className={styles.results}>
            {results.map((p) => (
              <Link
                key={p.slug}
                href={`/producto/${p.slug}`}
                className={styles.result}
                onClick={onClose}
                aria-label={`Ver ${p.name}`}
              >
                <div className={styles.resultImg}>
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 767px) 50vw, 240px"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
                <div className={styles.resultMeta}>
                  <span className="lbl">Look {p.look}</span>
                  <span className={`display ${styles.resultName}`}>{p.name}</span>
                  <span className={`price ${styles.resultPrice}`}>
                    {formatPrice(p.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
