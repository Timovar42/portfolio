import { StaticLink } from "@/components/StaticLink";
import type { SiteSettings } from "@/lib/types";

interface FooterProps {
  settings: Pick<SiteSettings, "name" | "tagline" | "phone" | "address">;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="border-t border-cream-dark/60 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-lg font-semibold text-chocolate">
              {settings.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-chocolate-light">
              {settings.tagline}
            </p>
            <a
              href={`tel:${settings.phone.replace(/\D/g, "")}`}
              className="mt-3 inline-block text-sm text-chocolate transition hover:text-terracotta"
            >
              {settings.phone}
            </a>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-chocolate-light">
              Разделы
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <StaticLink
                href="/"
                className="block text-chocolate transition hover:text-terracotta"
              >
                Главная
              </StaticLink>
              <StaticLink
                href="/catalog"
                className="block text-chocolate transition hover:text-terracotta"
              >
                Каталог
              </StaticLink>
              <StaticLink
                href="/constructor"
                className="block text-chocolate transition hover:text-terracotta"
              >
                Конструктор
              </StaticLink>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-cream-dark/50 pt-6 text-xs text-chocolate-light sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.name}
          </p>
          <p>{settings.address}</p>
        </div>
      </div>
    </footer>
  );
}
