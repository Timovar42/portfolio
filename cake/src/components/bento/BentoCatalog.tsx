"use client";

import { StaticImage } from "@/components/StaticImage";
import { StaticLink } from "@/components/StaticLink";
import { BentoCard } from "./BentoCard";
import type { ReadyCake } from "@/lib/types";
import { formatPrice } from "@/lib/pricing/calculatePrice";

interface BentoCatalogProps {
  cakes: ReadyCake[];
}

interface CakeLayout {
  /** Ширина карточки в колонках на десктопе (lg, сетка из 6 колонок) */
  lgCols: number;
  /** Широкая «избранная» карточка — горизонтальная композиция */
  wide: boolean;
}

const LG_COL_CLASS: Record<number, string> = {
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  6: "lg:col-span-6",
};

/**
 * Раскладывает карточки строками так, чтобы каждая строка полностью заполняла
 * 6 колонок сетки — без пустот при любом количестве тортов. Ширины из набора
 * {2, 3, 4, 6} дают бенто-асимметрию (широкие карточки + обычные).
 */
function computeCakeLayout(count: number): CakeLayout[] {
  const layout: CakeLayout[] = [];
  let placed = 0;
  let row = 0;

  const pushRow = (...cols: number[]) => {
    for (const cols_ of cols) {
      layout.push({ lgCols: cols_, wide: cols_ >= 3 });
    }
    placed += cols.length;
    row += 1;
  };

  while (placed < count) {
    const remaining = count - placed;
    const evenRow = row % 2 === 0;
    if (remaining === 1) {
      pushRow(6);
    } else if (remaining === 2 || remaining === 4) {
      if (evenRow) pushRow(4, 2);
      else pushRow(3, 3);
    } else if (remaining === 3) {
      pushRow(2, 2, 2);
    } else if (evenRow) {
      pushRow(4, 2);
    } else {
      pushRow(2, 2, 2);
    }
  }

  return layout;
}

export function BentoCatalog({ cakes }: BentoCatalogProps) {
  const cakeCount = cakes.length;
  const layout = computeCakeLayout(cakeCount);

  return (
    <div className="bento-grid bento-reveal-stagger min-w-0 pb-8" id="catalog">
      {/* Заголовок каталога */}
      <BentoCard
        as="section"
        span="md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-1 lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:row-span-2 min-h-[260px] sm:min-h-[320px] lg:min-h-[380px]"
        className="group relative"
      >
        <StaticImage
          src="/cakes/ready-4.jpg"
          alt="Готовые торты"
          fill
          priority
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-chocolate/40 to-chocolate/15" />
        <div className="relative flex h-full flex-col justify-end p-5 sm:p-10">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-rose">
            Каталог
          </span>
          <h1 className="mt-2 font-serif text-2xl font-semibold leading-tight text-cream sm:text-4xl lg:text-5xl">
            Готовые торты
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-cream/85 sm:mt-3 sm:text-base">
            Выберите готовую позицию и закажите как есть — без конструктора.
            Каждый торт свежий, из натуральных ингредиентов.
          </p>
          <p className="mt-4 font-hand text-2xl text-terracotta">
            {cakeCount} {pluralCakes(cakeCount)} в наличии
          </p>
        </div>
      </BentoCard>

      {/* Боковой блок — конструктор */}
      <BentoCard
        as="section"
        span="md:col-span-1 md:row-span-2 md:col-start-3 md:row-start-1 lg:col-start-5 lg:col-span-2 lg:row-start-1 lg:row-span-2"
        className="bg-gradient-to-br from-rose/50 to-cream p-5 sm:p-8"
        delay={80}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <CakeIcon className="text-terracotta" />
            <h2 className="mt-4 font-serif text-xl font-semibold text-chocolate">
              Нужен особый торт?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-chocolate-light">
              Соберите свой в конструкторе — выберите начинку, крем, форму и
              декор под ваш праздник.
            </p>
          </div>
          <StaticLink
            href="/constructor"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-berry px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-berry-dark active:scale-[0.98]"
          >
            Конструктор
            <ArrowIcon />
          </StaticLink>
        </div>
      </BentoCard>

      {/* Карточки тортов */}
      {cakes.map((cake, index) => (
        <CakeBentoCard
          key={cake.id}
          cake={cake}
          lgCols={layout[index].lgCols}
          wide={layout[index].wide}
          delay={120 + index * 50}
        />
      ))}

      {/* Нижний CTA */}
      <BentoCard
        as="section"
        span="md:col-span-3 lg:col-span-6 lg:row-span-1"
        className="bg-white p-5 sm:p-8"
        delay={200 + cakes.length * 50}
      >
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-xl font-semibold text-chocolate sm:text-2xl">
              Не нашли подходящий вариант?
            </h2>
            <p className="mt-1 text-sm text-chocolate-light">
              Создайте торт с нуля или вернитесь на главную, чтобы посмотреть
              портфолио работ.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <StaticLink
              href="/constructor"
              className="inline-flex items-center gap-2 rounded-2xl bg-berry px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-berry-dark active:scale-[0.98]"
            >
              Собрать торт
              <ArrowIcon />
            </StaticLink>
            <StaticLink
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-cream-dark bg-cream/60 px-6 py-3 text-sm font-medium text-chocolate transition hover:border-terracotta/40"
            >
              На главную
            </StaticLink>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}

function CakeBentoCard({
  cake,
  lgCols,
  wide,
  delay,
}: {
  cake: ReadyCake;
  lgCols: number;
  wide: boolean;
  delay: number;
}) {
  const lgColClass = LG_COL_CLASS[lgCols] ?? "lg:col-span-2";
  const heightClass = wide
    ? "min-h-[240px] lg:min-h-[260px]"
    : "min-h-[280px] sm:min-h-[300px]";

  return (
    <BentoCard
      as="article"
      span={`md:col-span-3 ${lgColClass} ${heightClass}`}
      delay={delay}
      className="group relative bg-white"
    >
      <div className={`flex h-full ${wide ? "flex-col lg:flex-row" : "flex-col"}`}>
        <div
          className={`relative overflow-hidden ${
            wide ? "h-48 lg:h-auto lg:min-h-[240px] lg:flex-1" : "h-44 sm:h-48"
          }`}
        >
          <StaticImage
            src={cake.imageUrl}
            alt={cake.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes={
              wide
                ? "(max-width: 1024px) 100vw, 45vw"
                : "(max-width: 1024px) 100vw, 25vw"
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate/30 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        </div>

        <div
          className={`flex flex-col p-4 sm:p-5 ${wide ? "lg:flex-1 lg:justify-center lg:p-7" : ""}`}
        >
          <h3
            className={`font-serif font-semibold text-chocolate ${wide ? "text-lg sm:text-2xl" : "text-base sm:text-lg"}`}
          >
            {cake.title}
          </h3>
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-chocolate-light sm:mt-2">
            {cake.description}
          </p>
          <div className="mt-3 flex flex-col gap-3 border-t border-cream-dark/70 pt-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
            <p
              className={`font-serif font-semibold text-terracotta ${wide ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}
            >
              {formatPrice(cake.price)}
            </p>
            <StaticLink
              href={`/catalog/${cake.id}/order`}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-berry px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-berry-dark active:scale-[0.98] sm:w-auto"
            >
              Заказать
            </StaticLink>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

function pluralCakes(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return "позиций";
  if (mod10 === 1) return "позиция";
  if (mod10 >= 2 && mod10 <= 4) return "позиции";
  return "позиций";
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

function CakeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <path d="M12 3v4M6 7h12v2a6 6 0 01-6 6 6 6 0 01-6-6V7z" />
      <path d="M8 21h8M10 15v6M14 15v6" />
    </svg>
  );
}
