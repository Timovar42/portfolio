"use client";

import { StaticImage } from "@/components/StaticImage";
import { StaticLink } from "@/components/StaticLink";
import { useMemo, useState } from "react";
import { BentoCard } from "./BentoCard";
import { QuickOrderWidget } from "./QuickOrderWidget";
import { PORTFOLIO_ITEMS } from "@/lib/data/catalog";
import type { CakeType, SiteSettings } from "@/lib/types";

interface BentoLandingProps {
  settings: SiteSettings;
}

type CategoryFilter = CakeType | "all" | "cupcakes";

interface CategoryCard {
  id: CategoryFilter;
  label: string;
  subtitle: string;
  imageUrl: string;
  span: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: "wedding",
    label: "Свадебные",
    subtitle: "Элегантность и романтика",
    imageUrl: "/cakes/portfolio-1.jpg",
    span: "order-3 md:col-span-3 lg:order-3 lg:col-span-2 lg:row-span-1",
  },
  {
    id: "kids",
    label: "Детские",
    subtitle: "Яркие и вкусные",
    imageUrl: "/cakes/portfolio-11.jpg",
    span: "order-4 md:col-span-3 lg:order-4 lg:col-span-2 lg:row-span-1",
  },
  {
    id: "corporate",
    label: "Корпоративные",
    subtitle: "Стильно и сдержанно",
    imageUrl: "/cakes/portfolio-6.jpg",
    span: "order-5 md:col-span-3 lg:order-5 lg:col-span-2 lg:row-span-1",
  },
  {
    id: "birthday",
    label: "Авторские",
    subtitle: "Уникальный декор",
    imageUrl: "/cakes/portfolio-8.jpg",
    span: "order-6 md:col-span-3 lg:order-6 lg:col-span-2 lg:row-span-1",
  },
  {
    id: "cupcakes",
    label: "Капкейки",
    subtitle: "Идеальны для праздника",
    imageUrl: "/cakes/portfolio-12.jpg",
    span: "order-7 md:col-span-3 lg:order-7 lg:col-span-2 lg:row-span-1",
  },
];

const REVIEWS = [
  {
    name: "Анна К.",
    text: "Свадебный торт превзошёл все ожидания — гости до сих пор спрашивают контакты кондитера.",
    rating: 5,
  },
  {
    name: "Михаил Д.",
    text: "Заказывали корпоративный торт с логотипом. Вкусно, аккуратно, доставили вовремя.",
    rating: 5,
  },
];

export function BentoLanding({ settings }: BentoLandingProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const filteredGallery = useMemo(() => {
    if (activeCategory === "all") return PORTFOLIO_ITEMS.slice(0, 8);
    if (activeCategory === "cupcakes") {
      return PORTFOLIO_ITEMS.filter((item) =>
        item.title.toLowerCase().includes("капкейк"),
      ).slice(0, 8);
    }
    return PORTFOLIO_ITEMS.filter(
      (item) => item.cakeType === activeCategory,
    ).slice(0, 8);
  }, [activeCategory]);

  const galleryItems =
    filteredGallery.length > 0 ? filteredGallery : PORTFOLIO_ITEMS.slice(0, 8);

  const mapEmbedUrl = `https://yandex.ru/map-widget/v1/?ll=${settings.lng}%2C${settings.lat}&z=15&pt=${settings.lng}%2C${settings.lat},pm2rdm`;
  const mapStaticLinkUrl = `https://yandex.ru/maps/?ll=${settings.lng}%2C${settings.lat}&z=15&pt=${settings.lng}%2C${settings.lat},pm2rdm&text=${encodeURIComponent(settings.address)}`;

  return (
    <div className="bento-grid bento-reveal-stagger min-w-0 pb-8">
      {/* Hero 2x2 */}
      <BentoCard
        as="section"
        span="order-1 md:order-1 lg:order-1 md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-1 lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:row-span-2 min-h-[300px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[480px]"
        className="group relative"
      >
        <StaticImage
          src="/cakes/portfolio-1.jpg"
          alt="Фирменный торт"
          fill
          priority
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/85 via-chocolate/35 to-chocolate/10" />
        <div className="relative flex h-full flex-col justify-end p-5 sm:p-10">
          <span className="font-hand text-xl text-rose sm:text-3xl">
            с любовью, вручную
          </span>
          <h1 className="mt-2 max-w-lg text-balance font-serif text-2xl font-semibold leading-tight text-cream sm:text-4xl lg:text-5xl">
            Торты, которые запоминают
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/85 sm:mt-3 sm:text-base">
            {settings.description}
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
            <StaticLink
              href="/constructor"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-berry px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition hover:bg-berry-dark active:scale-[0.98] sm:w-auto sm:px-7"
            >
              Заказать торт
              <ArrowIcon />
            </StaticLink>
            <StaticLink
              href="/catalog"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-cream/30 bg-cream/15 px-6 py-3.5 text-sm font-medium text-cream backdrop-blur-sm transition hover:bg-cream/25 active:scale-[0.98] sm:w-auto sm:px-7"
            >
              Смотреть каталог
            </StaticLink>
          </div>
        </div>
      </BentoCard>

      {/* About 1x1 */}
      <BentoCard
        as="section"
        span="order-2 md:order-2 lg:order-2 md:col-span-1 md:row-span-2 md:col-start-3 md:row-start-1 lg:col-start-5 lg:col-span-2 lg:row-start-1 lg:row-span-2"
        className="bg-white"
        delay={80}
      >
        <div className="flex h-full flex-col">
          <div className="relative h-40 shrink-0 overflow-hidden sm:h-48">
            <StaticImage
              src="/cakes/portfolio-16.jpg"
              alt="Процесс приготовления"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-terracotta">
              О кондитерской
            </span>
            <h2 className="mt-2 font-serif text-xl font-semibold text-chocolate">
              {settings.name}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-chocolate-light">
              Домашняя кондитерская без компромиссов: натуральные продукты,
              ручная работа и внимание к каждой детали — от начинки до последней
              розы на торте.
            </p>
            <p className="mt-4 font-hand text-2xl text-terracotta">
              — с 2018 года
            </p>
          </div>
        </div>
      </BentoCard>

      {/* Categories — mobile: horizontal scroll */}
      <BentoCard
        span="order-3 md:col-span-3 lg:hidden"
        delay={120}
        className="bg-white p-4"
      >
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-terracotta">
          Категории
        </span>
        <p className="mt-1 text-sm text-chocolate-light">
          Нажмите, чтобы отфильтровать галерею
        </p>
        <div className="bento-scroll-x mt-3">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`relative h-[120px] w-[130px] overflow-hidden rounded-xl text-left transition active:scale-[0.98] ${
              activeCategory === "all"
                ? "ring-2 ring-berry ring-offset-2"
                : ""
            }`}
          >
            <StaticImage
              src="/cakes/portfolio-1.jpg"
              alt="Все работы"
              fill
              className="object-cover"
              sizes="130px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-3 font-serif text-sm font-semibold text-cream">
              Все
            </span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                setActiveCategory((prev) => (prev === cat.id ? "all" : cat.id))
              }
              className={`relative h-[120px] w-[130px] overflow-hidden rounded-xl text-left transition active:scale-[0.98] ${
                activeCategory === cat.id
                  ? "ring-2 ring-berry ring-offset-2"
                  : ""
              }`}
            >
              <StaticImage
                src={cat.imageUrl}
                alt={cat.label}
                fill
                className="object-cover"
                sizes="130px"
            />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3 font-serif text-sm font-semibold text-cream">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </BentoCard>

      {/* Category cards — desktop only */}
      {CATEGORIES.map((cat, i) => (
        <BentoCard
          key={cat.id}
          span={cat.span}
          delay={120 + i * 40}
          onClick={() =>
            setActiveCategory((prev) => (prev === cat.id ? "all" : cat.id))
          }
          className={`group relative hidden min-h-[160px] cursor-pointer text-left lg:block ${
            activeCategory === cat.id ? "ring-2 ring-berry ring-offset-2" : ""
          }`}
        >
          <StaticImage
            src={cat.imageUrl}
            alt={cat.label}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 50vw, 16vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-serif text-lg font-semibold text-cream">
              {cat.label}
            </h3>
            <p className="mt-0.5 text-xs text-cream/75">{cat.subtitle}</p>
          </div>
          {activeCategory === cat.id && (
            <span className="absolute right-3 top-3 rounded-full bg-berry px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              Активно
            </span>
          )}
        </BentoCard>
      ))}

      {/* Reviews 1x1 */}
      <BentoCard
        as="section"
        span="order-8 md:col-span-3 lg:order-8 lg:col-span-2 lg:row-span-1"
        className="bg-gradient-to-br from-rose/40 to-cream p-5 sm:p-6"
        delay={200}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} filled />
              ))}
            </div>
            <p className="mt-3 text-sm font-medium text-chocolate">
              4.9 · 120+ отзывов
            </p>
          </div>
          <blockquote className="mt-4">
            <p className="text-sm leading-relaxed text-chocolate-light">
              «{REVIEWS[0].text}»
            </p>
            <footer className="mt-3 font-hand text-xl text-terracotta">
              — {REVIEWS[0].name}
            </footer>
          </blockquote>
        </div>
      </BentoCard>

      {/* Gallery 2x1 wide */}
      <BentoCard
        as="section"
        span="order-9 md:col-span-3 lg:order-9 lg:col-span-4 lg:row-span-2"
        className="bg-white p-4 sm:p-6"
        delay={160}
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-terracotta">
              Галерея работ
            </span>
            <h2 className="mt-1 font-serif text-xl font-semibold text-chocolate">
              {activeCategory === "all"
                ? "Наши торты"
                : CATEGORIES.find((c) => c.id === activeCategory)?.label ??
                  "Подборка"}
            </h2>
          </div>
          {activeCategory !== "all" && (
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="text-xs font-medium text-berry transition hover:text-berry-dark"
            >
              Сбросить фильтр
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {galleryItems.map((item, i) => (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-xl ${
                i === 0
                  ? "col-span-2 row-span-2 aspect-[4/3] sm:aspect-square"
                  : "aspect-square"
              }`}
            >
              <StaticImage
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition duration-300 hover:scale-105"
                sizes="(max-width: 640px) 50vw, 12vw"
              />
            </div>
          ))}
        </div>
        <StaticLink
          href="/catalog"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta transition hover:text-terracotta-dark"
        >
          Весь каталог
          <ArrowIcon />
        </StaticLink>
      </BentoCard>

      {/* Video vertical 1x2 */}
      <BentoCard
        as="section"
        span="order-10 md:col-span-3 lg:order-10 lg:col-span-2 lg:row-span-2 min-h-[200px] sm:min-h-[280px]"
        className="group relative"
        delay={240}
      >
        <StaticImage
          src="/cakes/portfolio-3.jpg"
          alt="Процесс декорирования"
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-chocolate/40 transition group-hover:bg-chocolate/30" />
        <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/90 text-chocolate shadow-lift transition group-hover:scale-110">
            <PlayIcon />
          </span>
          <p className="mt-4 font-serif text-lg font-semibold text-cream">
            За кулисами
          </p>
          <p className="mt-1 text-xs text-cream/80">
            Как рождается ваш торт
          </p>
        </div>
      </BentoCard>

      {/* Quick order - large block */}
      <BentoCard
        as="section"
        span="order-11 md:col-span-3 lg:order-11 lg:col-span-4 lg:row-span-2"
        className="bg-white"
        delay={200}
        id="order"
      >
        <QuickOrderWidget />
      </BentoCard>

      {/* Delivery 1x1 */}
      <BentoCard
        as="section"
        span="order-12 md:col-span-3 lg:order-12 lg:col-span-2 lg:row-span-1"
        className="bg-cream-dark/50 p-5 sm:p-6"
        delay={280}
      >
        <DeliveryIcon className="text-terracotta" />
        <h3 className="mt-4 font-serif text-lg font-semibold text-chocolate">
          Доставка
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-chocolate-light">
          <li className="flex items-start gap-2">
            <CheckIcon />
            По Москве — от 500 ₽
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon />
            За МКАД — по договорённости
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon />
            Самовывоз бесплатно
          </li>
        </ul>
      </BentoCard>

      {/* Second review */}
      <BentoCard
        as="section"
        span="order-13 md:col-span-3 lg:order-13 lg:col-span-2 lg:row-span-1"
        className="bg-white p-5 sm:p-6"
        delay={300}
      >
        <div className="flex items-center gap-1">
          {Array.from({ length: REVIEWS[1].rating }).map((_, i) => (
            <StarIcon key={i} filled />
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-chocolate-light">
          «{REVIEWS[1].text}»
        </p>
        <p className="mt-3 font-hand text-xl text-terracotta">
          — {REVIEWS[1].name}
        </p>
      </BentoCard>

      {/* Contacts wide block */}
      <BentoCard
        as="section"
        span="order-14 md:col-span-3 lg:order-14 lg:col-span-6 lg:row-span-2"
        className="bg-white"
        delay={320}
        id="contacts"
      >
        <div className="grid h-full lg:grid-cols-2">
          <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-terracotta">
              Контакты
            </span>
            <h2 className="mt-2 font-serif text-xl font-semibold text-chocolate sm:text-3xl">
              Свяжитесь с нами
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-chocolate-light">
              {settings.address}
            </p>

            <div className="mt-5 grid gap-2.5 sm:mt-6">
              <a
                href={`tel:${settings.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 rounded-2xl border border-cream-dark bg-cream/50 px-4 py-3.5 text-sm text-chocolate transition hover:border-terracotta/40 hover:shadow-soft active:scale-[0.99]"
              >
                <PhoneIcon />
                <span className="truncate">{settings.phone}</span>
              </a>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <SocialStaticLink href="https://instagram.com" label="Instagram">
                <InstagramIcon />
              </SocialStaticLink>
            </div>

            <a
              href={mapStaticLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-berry transition hover:text-berry-dark"
            >
              Открыть в Яндекс.Картах
              <ArrowIcon />
            </a>
          </div>

          <div className="relative min-h-[200px] overflow-hidden sm:min-h-[240px] lg:min-h-full">
            <iframe
              title={`Карта: ${settings.address}`}
              src={mapEmbedUrl}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </BentoCard>
    </div>
  );
}

function SocialStaticLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-cream-dark text-chocolate transition hover:border-terracotta/50 hover:bg-rose/30"
    >
      {children}
    </a>
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

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-terracotta"
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mt-0.5 shrink-0 text-terracotta"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0 text-terracotta"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DeliveryIcon({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <path d="M1 3h15v13H1zM16 8h4l3 5v3h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
