import type { SiteSettings } from "@/lib/types";

interface LocationMapProps {
  settings: Pick<SiteSettings, "address" | "lat" | "lng">;
}

export function LocationMap({ settings }: LocationMapProps) {
  const { lat, lng, address } = settings;
  const mapEmbedUrl = `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat},pm2rdm`;
  const mapLinkUrl = `https://yandex.ru/maps/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat},pm2rdm&text=${encodeURIComponent(address)}`;

  return (
    <section className="border-t border-cream-dark/80 bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 text-center sm:text-left">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-rose-dark">
            Контакты
          </span>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-chocolate">
            Как нас найти
          </h2>
          <p className="mt-1 text-sm text-chocolate-light">{address}</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-cream-dark/70 shadow-soft">
          <iframe
            title={`Карта: ${address}`}
            src={mapEmbedUrl}
            className="h-64 w-full border-0 sm:h-80"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href={mapLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-rose-dark hover:text-chocolate"
        >
          Открыть в Яндекс.Картах →
        </a>
      </div>
    </section>
  );
}
