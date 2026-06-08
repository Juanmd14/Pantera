export type ProductSize = {
  label: string;
  stock: number;
};

export type Product = {
  slug: string;
  look: string;
  name: string;
  shortName: string;
  description: string;
  material: string;
  price: number;
  imageLabel: string;
  collection: string;
  image?: string;
  sizes: ProductSize[];
};

export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
};
