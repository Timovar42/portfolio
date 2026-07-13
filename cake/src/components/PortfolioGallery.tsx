"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PORTFOLIO_ITEMS } from "@/lib/data/catalog";
import { getWeightCategory } from "@/lib/types";
import { PortfolioCard } from "./PortfolioCard";
import {
  PortfolioFiltersBar,
  type PortfolioFilters,
} from "./PortfolioFilters";

const DEFAULT_FILTERS: PortfolioFilters = {
  cakeType: "all",
  occasion: "all",
  weight: "all",
};

export function PortfolioGallery() {
  const [filters, setFilters] = useState<PortfolioFilters>(DEFAULT_FILTERS);

  const filteredItems = useMemo(() => {
    return PORTFOLIO_ITEMS.filter((item) => {
      if (filters.cakeType !== "all" && item.cakeType !== filters.cakeType) {
        return false;
      }
      if (filters.occasion !== "all" && item.occasion !== filters.occasion) {
        return false;
      }
      if (
        filters.weight !== "all" &&
        getWeightCategory(item.weightKg) !== filters.weight
      ) {
        return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-chocolate sm:text-4xl">
          Наши работы
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-chocolate-light">
          Каждый торт — индивидуальная работа. Выберите вдохновение или
          соберите свой в конструкторе.
        </p>
        <Link
          href="/constructor"
          className="mt-6 inline-block rounded-full bg-berry px-8 py-3 font-semibold text-white shadow-soft transition hover:bg-berry-dark active:scale-[0.98]"
        >
          Собрать свой торт
        </Link>
      </section>

      <PortfolioFiltersBar filters={filters} onChange={setFilters} />

      {filteredItems.length === 0 ? (
        <p className="py-12 text-center text-chocolate-light">
          По выбранным фильтрам работ не найдено. Попробуйте изменить параметры.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
