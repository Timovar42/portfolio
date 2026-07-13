import Link from "next/link";
import { StaticImage } from "@/components/StaticImage";
import type { PortfolioItem } from "@/lib/types";
import { CAKE_TYPE_LABELS } from "@/lib/types";
import { formatPrice } from "@/lib/pricing/calculatePrice";

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <Link
      href={`/portfolio/${item.id}`}
      className="group overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <StaticImage
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-chocolate">
          {CAKE_TYPE_LABELS[item.cakeType]}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-chocolate group-hover:text-rose-dark">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-chocolate-light">
          {item.weightKg} кг · от {formatPrice(item.approximatePrice)}
        </p>
      </div>
    </Link>
  );
}
