"use client";

import { useCart, type CartProductRef } from "@/lib/cart";

type Props = {
  product: CartProductRef;
  size?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export default function AddToBag({
  product,
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
        add(product, { size });
      }}
    >
      {!size && !disabled ? "Elegí un talle" : label}
    </button>
  );
}
