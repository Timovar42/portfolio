import { StaticLink } from "@/components/StaticLink";

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="rounded-3xl border border-cream-dark/70 bg-white p-8 shadow-soft sm:p-10">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose/15 to-gold/15 text-4xl">
          🎂
        </div>
        <h1 className="font-serif text-2xl font-semibold text-chocolate">
          Заявка сохранена!
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-chocolate-light">
          Состав заказа скопирован в буфер обмена. Позвоните кондитеру и
          продиктуйте детали для подтверждения.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <StaticLink
            href="/catalog"
            className="rounded-full bg-berry px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-berry-dark active:scale-[0.98]"
          >
            В каталог
          </StaticLink>
          <StaticLink
            href="/constructor"
            className="rounded-full border border-cream-dark px-6 py-2.5 text-sm font-medium text-chocolate transition hover:border-rose/50 hover:text-rose-dark"
          >
            В конструктор
          </StaticLink>
        </div>
      </div>
    </div>
  );
}
