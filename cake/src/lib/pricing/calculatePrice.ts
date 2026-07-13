import type {
  CakeConfiguration,
  CreamOption,
  DecorOption,
  ExtraOption,
  FillingOption,
  PriceRules,
  SpongeOption,
  TopperOption,
} from "../types";
import {
  CREAM_OPTIONS,
  DECOR_OPTIONS,
  EXTRA_OPTIONS,
  FILLING_OPTIONS,
  INSCRIPTION_PRICE,
  SPONGE_OPTIONS,
  TOPPER_OPTIONS,
} from "../data/catalog";

export const DEFAULT_PRICE_RULES: PriceRules = {
  basePricePerKg: 2500,
  pricePerGuest: 350,
  shapeMultipliers: {
    round: 1,
    square: 1.1,
    tiered: 1.45,
  },
  shapeFixedAdd: {
    round: 0,
    square: 300,
    tiered: 1500,
  },
  occasionMultipliers: {
    birthday: 1,
    wedding: 1.25,
    kids: 1.05,
    corporate: 1.1,
    other: 1,
  },
};

/** Доплата за каждый ярус сверх первого */
export const PRICE_PER_EXTRA_TIER = 1800;

export interface PriceCalculationInput {
  configuration: CakeConfiguration;
  fillings?: FillingOption[];
  creams?: CreamOption[];
  decors?: DecorOption[];
  sponges?: SpongeOption[];
  extras?: ExtraOption[];
  toppers?: TopperOption[];
  rules?: PriceRules;
}

export interface PriceBreakdown {
  basePrice: number;
  shapeAdd: number;
  tierAdd: number;
  spongeAdd: number;
  fillingAdd: number;
  creamAdd: number;
  extrasAdd: number;
  decorAdd: number;
  topperAdd: number;
  occasionMultiplier: number;
  total: number;
  weightKg: number;
}

function resolveWeightKg(configuration: CakeConfiguration): number {
  if (configuration.weightKg && configuration.weightKg > 0) {
    return configuration.weightKg;
  }
  if (configuration.guests && configuration.guests > 0) {
    return Math.max(1, Math.ceil(configuration.guests / 8) * 0.5);
  }
  return 1;
}

export function calculateCakePrice(input: PriceCalculationInput): PriceBreakdown {
  const rules = input.rules ?? DEFAULT_PRICE_RULES;
  const { configuration } = input;

  const fillings = input.fillings ?? FILLING_OPTIONS;
  const creams = input.creams ?? CREAM_OPTIONS;
  const decors = input.decors ?? DECOR_OPTIONS;
  const sponges = input.sponges ?? SPONGE_OPTIONS;
  const extras = input.extras ?? EXTRA_OPTIONS;
  const toppers = input.toppers ?? TOPPER_OPTIONS;

  const weightKg = resolveWeightKg(configuration);
  const sponge = sponges.find((s) => s.id === configuration.spongeId);
  const filling = fillings.find((f) => f.id === configuration.fillingId);
  const cream = creams.find((c) => c.id === configuration.creamId);
  const decor = decors.find((d) => d.id === configuration.decorId);

  const baseBeforeOccasion =
    weightKg * rules.basePricePerKg +
    (configuration.guests ?? 0) * rules.pricePerGuest;

  const shapeMultiplier = rules.shapeMultipliers[configuration.shape];
  const shapeAdd = rules.shapeFixedAdd[configuration.shape];

  const tiers = Math.max(1, configuration.tiers ?? 1);
  const tierAdd = (tiers - 1) * PRICE_PER_EXTRA_TIER;

  const spongeAdd = sponge?.priceAdd ?? 0;
  const fillingAdd = filling?.priceAdd ?? 0;
  const creamAdd = cream?.priceAdd ?? 0;

  const extrasAdd = (configuration.extraIds ?? []).reduce((sum, id) => {
    const extra = extras.find((e) => e.id === id);
    return sum + (extra?.priceAdd ?? 0);
  }, 0);

  const decorAdd = decor?.priceAdd ?? (configuration.customDecorNote ? 500 : 0);

  const topperListAdd = (configuration.topperIds ?? []).reduce((sum, id) => {
    const topper = toppers.find((t) => t.id === id);
    return sum + (topper?.priceAdd ?? 0);
  }, 0);
  const inscriptionAdd = configuration.inscription?.trim()
    ? INSCRIPTION_PRICE
    : 0;
  const topperAdd = topperListAdd + inscriptionAdd;

  const subtotal =
    baseBeforeOccasion * shapeMultiplier +
    shapeAdd +
    tierAdd +
    spongeAdd +
    fillingAdd +
    creamAdd +
    extrasAdd +
    decorAdd +
    topperAdd;

  const occasionMultiplier = rules.occasionMultipliers[configuration.occasion];
  const total = Math.round(subtotal * occasionMultiplier);

  return {
    basePrice: Math.round(baseBeforeOccasion),
    shapeAdd: Math.round(shapeAdd + baseBeforeOccasion * (shapeMultiplier - 1)),
    tierAdd,
    spongeAdd,
    fillingAdd,
    creamAdd,
    extrasAdd,
    decorAdd,
    topperAdd,
    occasionMultiplier,
    total,
    weightKg,
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}
