export type CakeType = "birthday" | "wedding" | "kids" | "corporate" | "other";
export type CakeShape = "round" | "square" | "tiered";
export type Occasion = CakeType;
export type WeightCategory = "small" | "medium" | "large";

export interface PortfolioItem {
  id: number;
  title: string;
  imageUrl: string;
  cakeType: CakeType;
  occasion: Occasion;
  weightKg: number;
  filling: string;
  cream: string;
  approximatePrice: number;
  description: string;
}

export interface ReadyCake {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
}

export interface SpongeOption {
  id: string;
  name: string;
  description?: string;
  priceAdd: number;
}

export interface FillingOption {
  id: string;
  name: string;
  description?: string;
  priceAdd: number;
}

export interface CreamOption {
  id: string;
  name: string;
  description?: string;
  priceAdd: number;
}

export interface ExtraOption {
  id: string;
  name: string;
  emoji?: string;
  priceAdd: number;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface TopperOption {
  id: string;
  name: string;
  emoji?: string;
  priceAdd: number;
}

export interface DecorOption {
  id: string;
  name: string;
  imageUrl: string;
  priceAdd: number;
}

export interface PriceRules {
  basePricePerKg: number;
  pricePerGuest: number;
  shapeMultipliers: Record<CakeShape, number>;
  shapeFixedAdd: Record<CakeShape, number>;
  occasionMultipliers: Record<Occasion, number>;
}

export interface CakeConfiguration {
  occasion: Occasion;
  guests?: number;
  weightKg?: number;
  tiers?: number;
  shape: CakeShape;
  spongeId?: string;
  fillingId: string;
  creamId: string;
  extraIds?: string[];
  colorId?: string;
  decorId?: string;
  customDecorNote?: string;
  inscription?: string;
  topperIds?: string[];
}

export interface OrderRequest {
  id?: number;
  customerName: string;
  contact: string;
  deliveryDate: string;
  comment?: string;
  orderType: "constructor" | "ready";
  configuration?: CakeConfiguration;
  readyCakeId?: number;
  totalPrice: number;
  customDecorImagePath?: string;
  createdAt?: string;
}

export const CAKE_TYPE_LABELS: Record<CakeType, string> = {
  birthday: "День рождения",
  wedding: "Свадьба",
  kids: "Детский",
  corporate: "Корпоратив",
  other: "Другое",
};

export const OCCASION_LABELS = CAKE_TYPE_LABELS;

export const SHAPE_LABELS: Record<CakeShape, string> = {
  round: "Круглый",
  square: "Квадратный",
  tiered: "Многоярусный",
};

export const WEIGHT_LABELS: Record<WeightCategory, string> = {
  small: "До 2 кг",
  medium: "2–4 кг",
  large: "Более 4 кг",
};

export function getWeightCategory(weightKg: number): WeightCategory {
  if (weightKg < 2) return "small";
  if (weightKg <= 4) return "medium";
  return "large";
}
