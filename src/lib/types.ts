// src/lib/types.ts
export type Tier = {
  id: string;
  label: string;
  color: string;
  order: number;
};

export type Item = {
  id: string;
  title: string;
  image: string;
  tierId: string | null;
  summary: string;
  pros: string[];
  cons: string[];
};

export type DataFile = {
  tiers: Tier[];
  items: Item[];
  lastUpdated: string;
};
