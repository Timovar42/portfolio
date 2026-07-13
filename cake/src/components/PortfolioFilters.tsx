"use client";

import type { CakeType, WeightCategory } from "@/lib/types";
import { CAKE_TYPE_LABELS, WEIGHT_LABELS } from "@/lib/types";

export interface PortfolioFilters {
  cakeType: CakeType | "all";
  occasion: CakeType | "all";
  weight: WeightCategory | "all";
}

interface PortfolioFiltersBarProps {
  filters: PortfolioFilters;
  onChange: (filters: PortfolioFilters) => void;
}

const CAKE_TYPES: (CakeType | "all")[] = [
  "all",
  "birthday",
  "wedding",
  "kids",
  "corporate",
  "other",
];

const WEIGHTS: (WeightCategory | "all")[] = ["all", "small", "medium", "large"];

export function PortfolioFiltersBar({ filters, onChange }: PortfolioFiltersBarProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-cream-dark bg-white p-4 sm:p-6">
      <div>
        <p className="mb-2 text-sm font-medium text-chocolate">Тип торта</p>
        <div className="flex flex-wrap gap-2">
          {CAKE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ ...filters, cakeType: type })}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                filters.cakeType === type
                  ? "bg-rose text-white"
                  : "bg-cream-dark text-chocolate hover:bg-cream"
              }`}
            >
              {type === "all" ? "Все" : CAKE_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-chocolate">Повод</p>
        <div className="flex flex-wrap gap-2">
          {CAKE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ ...filters, occasion: type })}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                filters.occasion === type
                  ? "bg-rose text-white"
                  : "bg-cream-dark text-chocolate hover:bg-cream"
              }`}
            >
              {type === "all" ? "Все" : CAKE_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-chocolate">Вес</p>
        <div className="flex flex-wrap gap-2">
          {WEIGHTS.map((weight) => (
            <button
              key={weight}
              type="button"
              onClick={() => onChange({ ...filters, weight })}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                filters.weight === weight
                  ? "bg-rose text-white"
                  : "bg-cream-dark text-chocolate hover:bg-cream"
              }`}
            >
              {weight === "all" ? "Все" : WEIGHT_LABELS[weight]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
