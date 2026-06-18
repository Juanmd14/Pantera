"use client";

import { useState } from "react";
import type { ProductSize } from "@/lib/types";
import type { CartProductRef } from "@/lib/cart";
import SizeChips from "./SizeChips";
import AddToBag from "./AddToBag";
import StickyCta from "./StickyCta";

type Props = {
  product: CartProductRef;
  sizes: ProductSize[];
  sizeLblClassName?: string;
  chipsWrapClassName?: string;
  ctaClassName?: string;
};

export default function BuyPanel({
  product,
  sizes,
  sizeLblClassName,
  chipsWrapClassName,
  ctaClassName,
}: Props) {
  const [size, setSize] = useState<string | null>(null);
  const allSoldOut = sizes.every((s) => s.stock <= 0);

  return (
    <>
      <div className={`lbl lbl-dim ${sizeLblClassName ?? ""}`.trim()}>
        {allSoldOut ? "Agotado" : "Elegí tu talle"}
      </div>
      <div className={chipsWrapClassName}>
        <SizeChips sizes={sizes} value={size} onChange={setSize} />
      </div>

      <AddToBag
        product={product}
        size={size ?? undefined}
        disabled={!size || allSoldOut}
        className={ctaClassName}
      />

      <StickyCta
        product={product}
        size={size ?? undefined}
        disabled={!size || allSoldOut}
      />
    </>
  );
}
