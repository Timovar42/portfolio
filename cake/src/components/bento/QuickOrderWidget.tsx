"use client";

import { StaticLink } from "@/components/StaticLink";
import { useMemo, useState } from "react";
import {
  CREAM_OPTIONS,
  DECOR_OPTIONS,
  FILLING_OPTIONS,
} from "@/lib/data/catalog";
import {
  calculateCakePrice,
  formatPrice,
} from "@/lib/pricing/calculatePrice";
import type { CakeType } from "@/lib/types";
import { CAKE_TYPE_LABELS } from "@/lib/types";

const OCCASIONS: CakeType[] = [
  "birthday",
  "wedding",
  "kids",
  "corporate",
  "other",
];

const WEIGHTS = [1.5, 2, 3, 4, 6];

export function QuickOrderWidget() {
  const [occasion, setOccasion] = useState<CakeType>("birthday");
  const [weightKg, setWeightKg] = useState(2);
  const [fillingId, setFillingId] = useState(FILLING_OPTIONS[0].id);
  const [creamId, setCreamId] = useState(CREAM_OPTIONS[0].id);

  const price = useMemo(
    () =>
      calculateCakePrice({
        configuration: {
          occasion,
          weightKg,
          shape: "round",
          fillingId,
          creamId,
          decorId: DECOR_OPTIONS[0].id,
        },
        fillings: FILLING_OPTIONS,
        creams: CREAM_OPTIONS,
        decors: DECOR_OPTIONS,
      }).total,
    [occasion, weightKg, fillingId, creamId],
  );

  const constructorHref = `/constructor?occasion=${occasion}&weight=${weightKg}&filling=${fillingId}&cream=${creamId}`;

  return (
    <div className="flex h-full flex-col p-5 sm:p-8">
      <div className="mb-5">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-terracotta">
          Быстрый расчёт
        </span>
        <h2 className="mt-1 font-serif text-xl font-semibold text-chocolate sm:text-3xl">
          Соберите свой торт
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-chocolate-light">
          Выберите параметры — увидите ориентировочную цену и перейдёте в
          конструктор.
        </p>
      </div>

      <div className="grid flex-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-chocolate-light">
            Повод
          </span>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value as CakeType)}
            className="w-full rounded-xl border border-cream-dark bg-cream/60 px-3 py-2.5 text-sm text-chocolate outline-none transition focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20"
          >
            {OCCASIONS.map((o) => (
              <option key={o} value={o}>
                {CAKE_TYPE_LABELS[o]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-chocolate-light">
            Вес, кг
          </span>
          <select
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="w-full rounded-xl border border-cream-dark bg-cream/60 px-3 py-2.5 text-sm text-chocolate outline-none transition focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20"
          >
            {WEIGHTS.map((w) => (
              <option key={w} value={w}>
                {w} кг
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-chocolate-light">
            Начинка
          </span>
          <select
            value={fillingId}
            onChange={(e) => setFillingId(e.target.value)}
            className="w-full rounded-xl border border-cream-dark bg-cream/60 px-3 py-2.5 text-sm text-chocolate outline-none transition focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20"
          >
            {FILLING_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-chocolate-light">
            Крем
          </span>
          <select
            value={creamId}
            onChange={(e) => setCreamId(e.target.value)}
            className="w-full rounded-xl border border-cream-dark bg-cream/60 px-3 py-2.5 text-sm text-chocolate outline-none transition focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20"
          >
            {CREAM_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-col items-start gap-4 border-t border-cream-dark/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-chocolate-light">Ориентировочно</p>
          <p className="font-serif text-2xl font-semibold text-terracotta sm:text-3xl">
            {formatPrice(price)}
          </p>
        </div>
        <StaticLink
          href={constructorHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-berry px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-berry-dark active:scale-[0.98] sm:w-auto"
        >
          Заказать торт
          <ArrowIcon />
        </StaticLink>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
