"use client";

import { useCart } from "@/lib/cart";

type Props = {
  slug: string;
  className?: string;
  label?: string;
};

export default function AddToBag({
  slug,
  className,
  label = "Añadir a la bolsa",
}: Props) {
  const { add } = useCart();
  return (
    <button
      type="button"
      className={`btn solid ${className ?? ""}`.trim()}
      onClick={() => add(slug)}
    >
      {label}
    </button>
  );
}
