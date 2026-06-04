import type { Collection, Product } from "./types";

export const products: Product[] = [
  {
    slug: "abrigo-sombra",
    look: "01",
    name: "Abrigo Sombra",
    shortName: "Abrigo\nSombra",
    description:
      "El abrigo que camina solo de noche. Lana merino estructurada, forro de seda, caída líquida.",
    material: "MERINO / SHADOW",
    price: 30000,
    imageLabel: "LOOK 01 · 4:5",
    collection: "sombra",
    image: "/images/modelos1.jpg",
  },
  {
    slug: "set-campo",
    look: "02",
    name: "Set Campo",
    shortName: "Set\nCampo",
    description:
      "Conjunto liviano de algodón sin teñir. Camisa oversize y short corto; uniforme de los días largos.",
    material: "ALGODÓN CRUDO / TIERRA",
    price: 15000,
    imageLabel: "LOOK 02 · 4:5",
    collection: "campo",
    image: "/images/modelos3.jpg",
  },
  {
    slug: "chaqueta-piel-sombra",
    look: "03",
    name: "Chaqueta Piel Sombra",
    shortName: "Chaqueta\nPiel Sombra",
    description:
      "Cuero napa tratado en mate. Crop alto, cremallera asimétrica; segunda piel para el animal urbano.",
    material: "NAPA MATE / ÓNIX",
    price: 28000,
    imageLabel: "LOOK 03 · 4:5",
    collection: "sombra",
    image: "/images/modelos4.jpg",
  },
  {
    slug: "sudadera-bruma",
    look: "04",
    name: "Sudadera Bruma",
    shortName: "Sudadera\nBruma",
    description:
      "Algodón pesado en blanco roto con paneles internos en obsidiana. Capucha estructurada, gráfico bordado al tono.",
    material: "ALGODÓN PESADO / BLANCO ROTO",
    price: 18000,
    imageLabel: "LOOK 04 · 4:5",
    collection: "campo",
    image: "/images/ropa.jpg",
  },
  {
    slug: "gabardina-nocturna",
    look: "05",
    name: "Gabardina Nocturna",
    shortName: "Gabardina\nNocturna",
    description:
      "Gabardina con cuerpo y silencio. Construcción técnica con caída fluida; hombros que no se ven, se intuyen.",
    material: "GABARDINA / SEDA",
    price: 27000,
    imageLabel: "LOOK 05 · 4:5",
    collection: "sombra",
  },
  {
    slug: "sueter-medianoche",
    look: "06",
    name: "Suéter Medianoche",
    shortName: "Suéter\nMedianoche",
    description:
      "Cashmere denso, cuello cerrado. La prenda para entrar al hábitat sin hacer ruido.",
    material: "CASHMERE / NOIR",
    price: 19000,
    imageLabel: "LOOK 06 · 4:5",
    collection: "sombra",
  },
  {
    slug: "pantalon-caza",
    look: "07",
    name: "Pantalón Caza",
    shortName: "Pantalón\nCaza",
    description:
      "Lana fría con caída precisa. Cintura alta, pierna recta; corta como una sombra recta sobre el suelo.",
    material: "LANA FRÍA / CARBÓN",
    price: 20000,
    imageLabel: "LOOK 07 · 4:5",
    collection: "campo",
  },
  {
    slug: "vestido-eclipse",
    look: "08",
    name: "Vestido Eclipse",
    shortName: "Vestido\nEclipse",
    description:
      "Seda salvaje con drapeado bajo. Espalda al aire, frente cerrado; aparece de noche y no se explica.",
    material: "SEDA SALVAJE / NOIR",
    price: 24000,
    imageLabel: "LOOK 08 · 4:5",
    collection: "sombra",
  },
  {
    slug: "blazer-cazador",
    look: "09",
    name: "Blazer Cazador",
    shortName: "Blazer\nCazador",
    description:
      "Construcción sastre con hombro vivo. Solapa estrecha, cintura marcada; un arma vestida de elegancia.",
    material: "LANA / OBSIDIANA",
    price: 26000,
    imageLabel: "LOOK 09 · 4:5",
    collection: "sombra",
  },
  {
    slug: "camisa-acechante",
    look: "10",
    name: "Camisa Acechante",
    shortName: "Camisa\nAcechante",
    description:
      "Popelín pesado con cuello rígido. Silueta amplia, puños cerrados; camina antes que la pisada.",
    material: "POPELÍN / GRAFITO",
    price: 16000,
    imageLabel: "LOOK 10 · 4:5",
    collection: "campo",
  },
  {
    slug: "falda-medianoche",
    look: "11",
    name: "Falda Medianoche",
    shortName: "Falda\nMedianoche",
    description:
      "Lana cruda al tobillo. Tablones profundos que se abren al andar; ritmo de cazador que cuenta sus pasos.",
    material: "LANA CRUDA / TINTA",
    price: 21000,
    imageLabel: "LOOK 11 · 4:5",
    collection: "sombra",
  },
  {
    slug: "trench-niebla",
    look: "12",
    name: "Trench Niebla",
    shortName: "Trench\nNiebla",
    description:
      "Gabardina técnica con cinturón flojo. Largo a media pierna; se desliza, no se viste.",
    material: "GABARDINA TÉCNICA / HUMO",
    price: 27000,
    imageLabel: "LOOK 12 · 4:5",
    collection: "sombra",
  },
  {
    slug: "botas-paso-mudo",
    look: "13",
    name: "Botas Paso Mudo",
    shortName: "Botas\nPaso Mudo",
    description:
      "Cuero crudo, suela de goma silente. Caña alta, hormado anatómico; el sonido que la ciudad nunca escucha.",
    material: "CUERO CRUDO / GOMA",
    price: 25000,
    imageLabel: "LOOK 13 · 4:5",
    collection: "campo",
  },
];

// Solo las piezas con foto se muestran al cliente. Las que no tienen imagen
// se mantienen en el catálogo para iterar después, pero ningún render
// público las recorre.
export const visibleProducts: Product[] = products.filter((p) => Boolean(p.image));

// ── Colecciones ────────────────────────────────────────────────
// Cada pieza pertenece a una colección (campo | sombra). La portada
// reusa una de las fotos de campaña ya disponibles en /public.
export const collections: Collection[] = [
  {
    slug: "campo",
    name: "Campo",
    tagline: "Crudo, liviano, de los días largos",
    image: "/images/modelos3.jpg",
  },
  {
    slug: "sombra",
    name: "Sombra",
    tagline: "Elegancia oscura en movimiento",
    image: "/images/modelos1.jpg",
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getProductsByCollection(slug: string): Product[] {
  return visibleProducts.filter((p) => p.collection === slug);
}

export function getProduct(slug: string): Product | undefined {
  return visibleProducts.find((p) => p.slug === slug);
}

export function getRelated(slug: string): Product[] {
  return visibleProducts.filter((p) => p.slug !== slug);
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-AR")}`;
}
