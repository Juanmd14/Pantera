import type { Product } from "./types";

// Helpers puros (sin dependencias server-only). Pueden importarse desde
// client components sin arrastrar `next/headers` ni el cliente de Supabase.

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-AR")}`;
}

export function isSoldOut(product: Product): boolean {
  return product.sizes.every((s) => s.stock <= 0);
}

export function isSizeAvailable(product: Product, sizeLabel: string): boolean {
  const s = product.sizes.find((s) => s.label === sizeLabel);
  return Boolean(s && s.stock > 0);
}

// Convierte "Suéter Medianoche" → "sueter-medianoche". Quita acentos,
// no-alfanuméricos y guiones colgantes. Si el resultado es vacío devuelve "".
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // combining diacritical marks
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
