"use client";

import { StaticLink } from "@/components/StaticLink";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/types";

interface HeaderProps {
  settings: Pick<SiteSettings, "name" | "tagline">;
}

const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/constructor", label: "Конструктор" },
];

export function Header({ settings }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const monogram = settings.name.trim().charAt(0).toUpperCase() || "С";

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-cream-dark/80 bg-cream/95 shadow-soft backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <StaticLink href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta to-terracotta-dark font-serif text-base font-semibold text-white shadow-soft sm:h-11 sm:w-11 sm:text-lg">
              {monogram}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-serif text-base font-semibold leading-tight text-chocolate transition group-hover:text-terracotta sm:text-xl">
                {settings.name}
              </span>
              <span className="truncate text-[10px] uppercase tracking-[0.12em] text-chocolate-light sm:text-xs">
                {settings.tagline}
              </span>
            </span>
          </StaticLink>

          <nav className="hidden items-center gap-1 sm:flex sm:gap-2">
            {NAV_LINKS.map((link) => (
              <StaticLink
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-chocolate-light transition hover:bg-cream-dark/70 hover:text-chocolate sm:px-4"
              >
                {link.label}
              </StaticLink>
            ))}
            <StaticLink
              href="/constructor"
              className="ml-1 rounded-2xl bg-berry px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-berry-dark active:scale-[0.98]"
            >
              Заказать
            </StaticLink>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-cream-dark/80 bg-white/80 text-chocolate transition active:scale-[0.96]"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <StaticLink
              href="/constructor"
              className="rounded-2xl bg-berry px-3.5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-berry-dark active:scale-[0.98]"
            >
              Заказать
            </StaticLink>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-chocolate/30 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute left-4 right-4 top-[4.25rem] overflow-hidden rounded-2xl border border-cream-dark/80 bg-cream shadow-lift">
            <div className="p-2">
              {NAV_LINKS.map((link) => (
                <StaticLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center rounded-xl px-4 py-3.5 text-sm font-medium text-chocolate transition active:bg-cream-dark/70"
                >
                  {link.label}
                </StaticLink>
              ))}
              <StaticLink
                href="/constructor"
                onClick={() => setMenuOpen(false)}
                className="mt-1 flex items-center justify-center rounded-xl bg-berry px-4 py-3.5 text-sm font-semibold text-white transition active:scale-[0.98]"
              >
                Заказать торт
              </StaticLink>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
