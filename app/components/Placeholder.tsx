import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  label?: string;
  lit?: boolean;
  height?: number | string;
  aspect?: string; // ej. "4/5"
  className?: string;
  style?: CSSProperties;
  src?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  children?: ReactNode;
};

export default function Placeholder({
  label = "",
  lit = false,
  height,
  aspect,
  className,
  style,
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px",
  priority,
  children,
}: Props) {
  const composed: CSSProperties = {
    ...style,
    ...(height !== undefined ? { height: typeof height === "number" ? `${height}px` : height } : {}),
    ...(aspect ? { aspectRatio: aspect } : {}),
  };

  return (
    <div
      className={`ph ${lit ? "lit" : ""} ${src ? "imaged" : ""} ${className ?? ""}`}
      data-ph={src ? "" : label}
      style={composed}
    >
      {src && (
        <Image
          src={src}
          alt={alt ?? label ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "cover" }}
        />
      )}
      {children}
    </div>
  );
}
