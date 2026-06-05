"use client";

import { useState } from "react";
import SizeChips from "./SizeChips";
import AddToBag from "./AddToBag";
import StickyCta from "./StickyCta";

type Props = {
  slug: string;
  price: number;
  sizes: string[];
  defaultSize?: string;
  sizeLblClassName?: string;
  chipsWrapClassName?: string;
  ctaClassName?: string;
};

export default function BuyPanel({
  slug,
  price,
  sizes,
  defaultSize,
  sizeLblClassName,
  chipsWrapClassName,
  ctaClassName,
}: Props) {
  const [size, setSize] = useState<string | null>(defaultSize ?? null);

  return (
    <>
      <div className={`lbl lbl-dim ${sizeLblClassName ?? ""}`.trim()}>Talle</div>
      <div className={chipsWrapClassName}>
        <SizeChips sizes={sizes} value={size} onChange={setSize} />
      </div>

      <AddToBag slug={slug} size={size ?? undefined} className={ctaClassName} />

      <StickyCta price={price} slug={slug} size={size ?? undefined} />
    </>
  );
}
