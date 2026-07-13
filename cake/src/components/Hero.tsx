import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

interface HeroProps {
  settings: Pick<SiteSettings, "name" | "tagline" | "description">;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cream-dark/70 bg-gradient-to-br from-white via-cream to-rose/10 px-6 py-10 shadow-soft sm:px-12 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-rose/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-gold/10 blur-2xl"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-rose/30 bg-white/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.14em] text-rose-dark">
          Кондитерская ручной работы
        </span>

        <h1 className="mt-5 text-balance font-serif text-3xl font-semibold leading-tight text-chocolate sm:text-5xl">
          {settings.tagline}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-chocolate-light sm:text-base">
          {settings.description}
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/constructor"
            className="w-full rounded-full bg-berry px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-berry-dark hover:shadow-lift active:scale-[0.98] sm:w-auto"
          >
            Собрать свой торт
          </Link>
          <Link
            href="#catalog"
            className="w-full rounded-full border border-cream-dark bg-white/70 px-7 py-3 text-sm font-medium text-chocolate transition hover:border-rose/50 hover:text-rose-dark sm:w-auto"
          >
            Смотреть каталог
          </Link>
        </div>
      </div>
    </section>
  );
}
