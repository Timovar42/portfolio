import { calculateCakePrice } from "@/lib/pricing/calculatePrice";
import {
  CREAM_OPTIONS,
  DECOR_OPTIONS,
  FILLING_OPTIONS,
} from "@/lib/data/catalog";

const baseConfig = {
  occasion: "birthday" as const,
  guests: 16,
  shape: "round" as const,
  fillingId: "chocolate",
  creamId: "cream-cheese",
  decorId: "minimal",
};

const result1 = calculateCakePrice({
  configuration: baseConfig,
  fillings: FILLING_OPTIONS,
  creams: CREAM_OPTIONS,
  decors: DECOR_OPTIONS,
});

const result2 = calculateCakePrice({
  configuration: { ...baseConfig, guests: 32 },
  fillings: FILLING_OPTIONS,
  creams: CREAM_OPTIONS,
  decors: DECOR_OPTIONS,
});

console.assert(result1.total > 0, "Price should be positive");
console.assert(result2.total > result1.total, "More guests = higher price");
console.assert(result1.weightKg === 1, "16 guests = 1kg weight");
console.assert(result2.weightKg === 2, "32 guests = 2kg weight");

console.log("Pricing tests passed:", {
  guests16: result1.total,
  guests32: result2.total,
});
