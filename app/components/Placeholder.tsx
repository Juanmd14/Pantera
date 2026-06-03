import type { CSSProperties, ReactNode } from "react";

type Props = {
  label?: string;
  lit?: boolean;
  height?: number | string;
  aspect?: string; // ej. "4/5"
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export default function Placeholder({
  label = "",
  lit = false,
  height,
  aspect,
  className,
  style,
  children,
}: Props) {
  const composed: CSSProperties = {
    ...style,
    ...(height !== undefined ? { height: typeof height === "number" ? `${height}px` : height } : {}),
    ...(aspect ? { aspectRatio: aspect } : {}),
  };

  return (
    <div
      className={`ph ${lit ? "lit" : ""} ${className ?? ""}`}
      data-ph={label}
      style={composed}
    >
      {children}
    </div>
  );
}
