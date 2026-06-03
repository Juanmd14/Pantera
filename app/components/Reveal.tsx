"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/useInView";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Reveal({ children, className }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
