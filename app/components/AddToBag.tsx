"use client";

import { useCart } from "@/lib/cart";

type Props = {
  slug: string;
  size?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export default function AddToBag({
  slug,
  size,
  disabled = false,
  className,
  label = "Añadir a la bolsa",
}: Props) {
  const { add } = useCart();
  const isDisabled = disabled || !size;
  return (
    <button
      type="button"
      className={`btn solid ${className ?? ""}`.trim()}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      onClick={() => {
        if (isDisabled) return;
        add(slug, { size });
      }}
    >
      {!size && !disabled ? "Elegí un talle" : label}
    </button>
  );
}
