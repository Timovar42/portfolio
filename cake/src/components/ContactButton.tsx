"use client";

import { StaticLink } from "@/components/StaticLink";
import { useStaticPathname } from "@/lib/navigation/useStaticPathname";
import { normalizeAppPath } from "@/lib/navigation/staticPaths";
import { useEffect, useState } from "react";

interface ContactButtonProps {
  phone: string;
}

function shouldHideContactButton(pathname: string): boolean {
  const path = normalizeAppPath(pathname);
  if (path === "/constructor") return true;
  if (/^\/catalog\/\d+\/order$/.test(path)) return true;
  return false;
}

export function ContactButton({ phone }: ContactButtonProps) {
  const pathname = useStaticPathname();
  const [open, setOpen] = useState(false);
  const isHome = normalizeAppPath(pathname) === "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (shouldHideContactButton(pathname)) {
    return null;
  }

  const phoneHref = `tel:${phone.replace(/\D/g, "")}`;

  if (isHome) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-safe sm:hidden">
        <StaticLink
          href="/constructor"
          className="mb-3 flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-berry px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition hover:bg-berry-dark active:scale-[0.98]"
        >
          Заказать торт
        </StaticLink>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end gap-3 p-4 pb-safe sm:bottom-5 sm:right-5 sm:p-0">
      {open && (
        <div className="w-64 overflow-hidden rounded-2xl border border-cream-dark/70 bg-white shadow-lift">
          <div className="border-b border-cream-dark/70 bg-gradient-to-br from-cream to-rose/30 px-4 py-3">
            <p className="font-serif font-semibold text-chocolate">
              Связаться с нами
            </p>
            <p className="mt-0.5 text-xs text-chocolate-light">
              Ответим и поможем с заказом
            </p>
          </div>
          <div className="space-y-1 p-2">
            <a
              href={phoneHref}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-chocolate transition hover:bg-cream"
            >
              <PhoneIcon />
              <span>{phone}</span>
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Связаться с нами"
        className="flex items-center gap-2 rounded-2xl bg-berry px-5 py-3 text-sm font-semibold text-white shadow-lift transition hover:bg-berry-dark active:scale-[0.98]"
      >
        {open ? "✕" : "💬"}
        Связаться
      </button>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-terracotta" aria-hidden>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
