export type House = {
  slug: string;
  code: string;
  name: string;
  image: string;
  style: string;
  location: string;
  startingPrice: string;
  floors: string;
  usableArea: string;
  houseSize: string;
  landSize: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  floorPlans?: {
    title: string;
    image: string;
  }[];
};

export const houses: House[] = [];

export const featuredHouses: House[] = [];
