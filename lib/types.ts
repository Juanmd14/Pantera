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
};

export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
};
