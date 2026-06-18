"use client";

import { usePathname } from "next/navigation";

// Oculta su contenido cuando estamos en rutas del admin. Sirve para que
// el Nav y Footer del sitio público no se solapen con el shell del admin.
export default function HideOnAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
