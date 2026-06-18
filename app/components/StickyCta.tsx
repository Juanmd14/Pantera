"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCart, type CartProductRef } from "@/lib/cart";
import styles from "./StickyCta.module.css";

type Props = {
  product: CartProductRef;
  size?: string;
  disabled?: boolean;
  label?: string;
};

export default function StickyCta({
  product,
  size,
  disabled = false,
  label = "Añadir a la bolsa",
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [stuck, setStuck] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0, rootMargin: "0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isDisabled = disabled || !size;

  return (
    <>
      <div ref={sentinelRef} aria-hidden className={styles.sentinel} />
      <div
        className={`${styles.bar} ${stuck ? styles.barShow : ""}`}
        aria-hidden={!stuck}
      >
        <div className={`price ${styles.price}`}>{formatPrice(product.price)}</div>
        <button
          type="button"
          className={`btn solid ${styles.cta}`}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          onClick={() => {
            if (isDisabled) return;
            add(product, { size });
          }}
        >
          {!size && !disabled ? "Elegí un talle" : label}
        </button>
      </div>
    </>
  );
}
