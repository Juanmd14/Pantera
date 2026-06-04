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
    image: "/images/modelos1.jpg",
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
  {
    slug: "vestido-eclipse",
    look: "05",
    name: "Vestido Eclipse",
    shortName: "Vestido\nEclipse",
    description:
      "Seda salvaje con drapeado bajo. Espalda al aire, frente cerrado; aparece de noche y no se explica.",
    material: "SEDA SALVAJE / NOIR",
    price: 480,
    imageLabel: "LOOK 05 · 4:5",
  },
  {
    slug: "blazer-cazador",
    look: "06",
    name: "Blazer Cazador",
    shortName: "Blazer\nCazador",
    description:
      "Construcción sastre con hombro vivo. Solapa estrecha, cintura marcada; un arma vestida de elegancia.",
    material: "LANA / OBSIDIANA",
    price: 590,
    imageLabel: "LOOK 06 · 4:5",
  },
  {
    slug: "chaqueta-piel-sombra",
    look: "07",
    name: "Chaqueta Piel Sombra",
    shortName: "Chaqueta\nPiel Sombra",
    description:
      "Cuero napa tratado en mate. Crop alto, cremallera asimétrica; segunda piel para el animal urbano.",
    material: "NAPA MATE / ÓNIX",
    price: 820,
    imageLabel: "LOOK 07 · 4:5",
    image: "/images/modelos4.jpg",
  },
  {
    slug: "camisa-acechante",
    look: "08",
    name: "Camisa Acechante",
    shortName: "Camisa\nAcechante",
    description:
      "Popelín pesado con cuello rígido. Silueta amplia, puños cerrados; camina antes que la pisada.",
    material: "POPELÍN / GRAFITO",
    price: 240,
    imageLabel: "LOOK 08 · 4:5",
  },
  {
    slug: "falda-medianoche",
    look: "09",
    name: "Falda Medianoche",
    shortName: "Falda\nMedianoche",
    description:
      "Lana cruda al tobillo. Tablones profundos que se abren al andar; ritmo de cazador que cuenta sus pasos.",
    material: "LANA CRUDA / TINTA",
    price: 360,
    imageLabel: "LOOK 09 · 4:5",
  },
  {
    slug: "trench-niebla",
    look: "10",
    name: "Trench Niebla",
    shortName: "Trench\nNiebla",
    description:
      "Gabardina técnica con cinturón flojo. Largo a media pierna; se desliza, no se viste.",
    material: "GABARDINA TÉCNICA / HUMO",
    price: 720,
    imageLabel: "LOOK 10 · 4:5",
  },
  {
    slug: "botas-paso-mudo",
    look: "11",
    name: "Botas Paso Mudo",
    shortName: "Botas\nPaso Mudo",
    description:
      "Cuero crudo, suela de goma silente. Caña alta, hormado anatómico; el sonido que la ciudad nunca escucha.",
    material: "CUERO CRUDO / GOMA",
    price: 540,
    imageLabel: "LOOK 11 · 4:5",
  },
  {
    slug: "sudadera-marmol",
    look: "12",
    name: "Sudadera Mármol",
    shortName: "Sudadera\nMármol",
    description:
      "Algodón pesado en blanco roto con paneles internos en obsidiana. Capucha estructurada, gráfico bordado al tono.",
    material: "ALGODÓN PESADO / BLANCO ROTO",
    price: 290,
    imageLabel: "LOOK 12 · 4:5",
    image: "/images/ropa.jpg",
  },
  {
    slug: "set-campo",
    look: "13",
    name: "Set Campo",
    shortName: "Set\nCampo",
    description:
      "Conjunto liviano de algodón sin teñir. Camisa oversize y short corto; uniforme de verano para días largos.",
    material: "ALGODÓN CRUDO / TIERRA",
    price: 240,
    imageLabel: "LOOK 13 · 4:5",
    image: "/images/modelos3.jpg",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelated(slug: string): Product[] {
  return products.filter((p) => p.slug !== slug);
}
