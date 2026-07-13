import {
  COLOR_OPTIONS,
  CREAM_OPTIONS,
  DECOR_OPTIONS,
  EXTRA_OPTIONS,
  FILLING_OPTIONS,
  INSCRIPTION_PRICE,
  SITE_CONFIG,
  SPONGE_OPTIONS,
  TOPPER_OPTIONS,
} from "@/lib/data/catalog";
import { DEFAULT_PRICE_RULES, PRICE_PER_EXTRA_TIER } from "@/lib/pricing/calculatePrice";
import { OCCASION_LABELS, SHAPE_LABELS } from "@/lib/types";

export const CONSTRUCTOR_STEPS = [
  { label: "Повод", hint: "Для какого события торт" },
  { label: "Размер", hint: "Гости или вес" },
  { label: "Форма и ярусы", hint: "Геометрия торта" },
  { label: "Коржи", hint: "Основа бисквита" },
  { label: "Начинка", hint: "Прослойка между коржами" },
  { label: "Крем / покрытие", hint: "Внешний слой" },
  { label: "Добавки", hint: "Ягоды, декор-акценты" },
  { label: "Цвет", hint: "Гамма оформления" },
  { label: "Декор", hint: "Стиль или своё фото" },
  { label: "Надпись и топперы", hint: "Финальные штрихи" },
  { label: "Оформление", hint: "Контакты и заявка" },
] as const;

export const CONSTRUCTOR_OCCASIONS = [
  { id: "birthday", emoji: "🎂", label: OCCASION_LABELS.birthday },
  { id: "wedding", emoji: "💍", label: OCCASION_LABELS.wedding },
  { id: "kids", emoji: "🧸", label: OCCASION_LABELS.kids },
  { id: "corporate", emoji: "🏢", label: OCCASION_LABELS.corporate },
  { id: "other", emoji: "✨", label: OCCASION_LABELS.other },
] as const;

export const CONSTRUCTOR_SHAPES = [
  { id: "round", emoji: "⭕", label: SHAPE_LABELS.round },
  { id: "square", emoji: "🟦", label: SHAPE_LABELS.square },
  { id: "tiered", emoji: "🎂", label: SHAPE_LABELS.tiered },
] as const;

export function getConstructorRuntimeData() {
  return {
    steps: CONSTRUCTOR_STEPS,
    occasions: CONSTRUCTOR_OCCASIONS,
    shapes: CONSTRUCTOR_SHAPES,
    sponges: SPONGE_OPTIONS,
    fillings: FILLING_OPTIONS,
    creams: CREAM_OPTIONS,
    extras: EXTRA_OPTIONS,
    colors: COLOR_OPTIONS,
    decors: DECOR_OPTIONS,
    toppers: TOPPER_OPTIONS,
    inscriptionPrice: INSCRIPTION_PRICE,
    customDecorPrice: 500,
    phone: SITE_CONFIG.phone,
    priceRules: DEFAULT_PRICE_RULES,
    pricePerExtraTier: PRICE_PER_EXTRA_TIER,
    initial: {
      occasion: "birthday",
      guests: 10,
      tiers: 1,
      shape: "round",
      spongeId: SPONGE_OPTIONS[0].id,
      fillingId: FILLING_OPTIONS[0].id,
      creamId: CREAM_OPTIONS[0].id,
      colorId: COLOR_OPTIONS[0].id,
      extraIds: [] as string[],
      topperIds: [] as string[],
    },
    labels: { occasion: OCCASION_LABELS, shape: SHAPE_LABELS },
  };
}
