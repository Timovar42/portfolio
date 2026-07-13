import { StaticLink } from "@/components/StaticLink";
import { READY_CAKES } from "@/lib/data/catalog";
import { getReadyCake, getSiteSettings } from "@/lib/site/repository";
import { OrderForm } from "@/components/OrderForm";
import { notFound } from "next/navigation";

interface ReadyCakeOrderPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return READY_CAKES.map((cake) => ({ id: String(cake.id) }));
}

export default async function ReadyCakeOrderPage({
  params,
}: ReadyCakeOrderPageProps) {
  const { id } = await params;
  const cake = getReadyCake(Number(id));
  const settings = getSiteSettings();

  if (!cake) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg">
      <StaticLink
        href="/catalog"
        className="mb-6 inline-flex text-sm text-chocolate-light hover:text-rose-dark"
      >
        ← Назад к каталогу
      </StaticLink>

      <h1 className="mb-2 font-serif text-2xl font-semibold text-chocolate sm:text-3xl">
        Оформление заказа
      </h1>
      <p className="mb-6 text-sm text-chocolate-light">{cake.title}</p>

      <div className="rounded-2xl border border-cream-dark/70 bg-white p-6 shadow-soft">
        <OrderForm
          orderType="ready"
          totalPrice={cake.price}
          readyCake={cake}
          contactPhone={settings.phone}
        />
      </div>
    </div>
  );
}
