"use client";

import { useTrackingEyes } from "@/lib/useTrackingEyes";
import styles from "./Eyes.module.css";

type EyeProps = { size: number };

function Eye({ size }: EyeProps) {
  const irisRef = useTrackingEyes();
  return (
    <div className="eye" data-eye style={{ width: `${size}px` }}>
      <div className="iris" ref={irisRef}>
        <div className="pupil" />
      </div>
    </div>
  );
}

type Props = { size?: number; gap?: number; className?: string };

export default function Eyes({ size = 86, gap = 56, className }: Props) {
  return (
    <div
      className={`eyes ${styles.eyes} ${className ?? ""}`}
      style={{ gap: `${gap}px` }}
    >
      <Eye size={size} />
      <Eye size={size} />
    </div>
  );
}
