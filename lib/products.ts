import type { Product } from "./types";

export const products: Product[] = [
  {
    slug: "abrigo-sombra",
    look: "01",
    name: "Abrigo Sombra",
    shortName: "Abrigo\nSombra",
    description:
      "El abrigo que camina solo de noche. Lana merino estructurada, forro de seda, caída líquida.",
    material: "MERINO / SHADOW",
    price: 690,
    imageLabel: "LOOK 01 · 4:5",
  },
  {
    slug: "gabardina-nocturna",
    look: "02",
    name: "Gabardina Nocturna",
    shortName: "Gabardina\nNocturna",
    description:
      "Gabardina con cuerpo y silencio. Construcción técnica con caída fluida; hombros que no se ven, se intuyen.",
    material: "GABARDINA / SEDA",
    price: 740,
    imageLabel: "LOOK 02 · 4:5",
  },
  {
    slug: "sueter-medianoche",
    look: "03",
    name: "Suéter Medianoche",
    shortName: "Suéter\nMedianoche",
    description:
      "Cashmere denso, cuello cerrado. La prenda para entrar al hábitat sin hacer ruido.",
    material: "CASHMERE / NOIR",
    price: 280,
    imageLabel: "LOOK 03 · 4:5",
  },
  {
    slug: "pantalon-caza",
    look: "04",
    name: "Pantalón Caza",
    shortName: "Pantalón\nCaza",
    description:
      "Lana fría con caída precisa. Cintura alta, pierna recta; corta como una sombra recta sobre el suelo.",
    material: "LANA FRÍA / CARBÓN",
    price: 320,
    imageLabel: "LOOK 04 · 4:5",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelated(slug: string): Product[] {
  return products.filter((p) => p.slug !== slug);
}
