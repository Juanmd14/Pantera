"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import styles from "./StickyCta.module.css";

type Props = {
  price: number;
  slug: string;
  label?: string;
};

export default function StickyCta({
  price,
  slug,
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

  return (
    <>
      <div ref={sentinelRef} aria-hidden className={styles.sentinel} />
      <div
        className={`${styles.bar} ${stuck ? styles.barShow : ""}`}
        aria-hidden={!stuck}
      >
        <div className={`price ${styles.price}`}>{formatPrice(price)}</div>
        <button
          type="button"
          className={`btn solid ${styles.cta}`}
          onClick={() => add(slug)}
        >
          {label}
        </button>
      </div>
    </>
  );
}
