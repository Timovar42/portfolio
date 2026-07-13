"use client";

import { useState } from "react";
import { navigateStatic } from "@/lib/navigation/staticPaths";
import { StaticImage } from "@/components/StaticImage";
import { formatOrderMessage } from "@/lib/order/formatOrderMessage";
import type { ReadyCake } from "@/lib/types";
import { formatPrice } from "@/lib/pricing/calculatePrice";

type OrderMethod = "choose" | "phone" | "form";

interface OrderFormProps {
  orderType: "constructor" | "ready";
  totalPrice: number;
  readyCake?: ReadyCake;
  configurationSummary?: string;
  configuration?: Record<string, unknown>;
  customDecorFile?: File | null;
  contactPhone?: string;
}

function OrderSummary({
  readyCake,
  configurationSummary,
  totalPrice,
}: {
  readyCake?: ReadyCake;
  configurationSummary?: string;
  totalPrice: number;
}) {
  if (readyCake) {
    return (
      <div className="flex gap-4 rounded-xl bg-cream p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <StaticImage
            src={readyCake.imageUrl}
            alt={readyCake.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium text-chocolate">{readyCake.title}</p>
          <p className="text-sm text-chocolate-light">{formatPrice(readyCake.price)}</p>
        </div>
      </div>
    );
  }

  if (configurationSummary) {
    return (
      <div className="rounded-xl bg-cream p-4">
        <p className="mb-2 text-sm font-medium text-chocolate">Ваш торт</p>
        <pre className="whitespace-pre-wrap text-sm text-chocolate-light">
          {configurationSummary}
        </pre>
        <p className="mt-3 text-lg font-bold text-rose-dark">
          Итого: {formatPrice(totalPrice)}
        </p>
      </div>
    );
  }

  return null;
}

export function OrderForm({
  orderType,
  totalPrice,
  readyCake,
  configurationSummary,
  configuration,
  customDecorFile,
  contactPhone = "",
}: OrderFormProps) {
  const allowPhone = orderType === "ready";
  const [method, setMethod] = useState<OrderMethod>(allowPhone ? "choose" : "form");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const phoneHref = `tel:${contactPhone.replace(/\D/g, "")}`;

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Укажите имя";
    if (!contact.trim()) nextErrors.contact = "Укажите телефон";
    if (!deliveryDate) nextErrors.deliveryDate = "Укажите дату";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const message = formatOrderMessage({
        customerName: name.trim(),
        contact: contact.trim(),
        deliveryDate,
        comment: comment.trim() || undefined,
        orderType,
        totalPrice,
        readyCakeId: readyCake?.id,
        configuration: configuration as never,
        customDecorImagePath: customDecorFile ? "local-reference" : undefined,
      });

      try {
        await navigator.clipboard.writeText(message);
      } catch {
        // Clipboard may be unavailable on file:// — still proceed
      }

      sessionStorage.setItem("lastOrderMessage", message);
      navigateStatic("/order/success/");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <OrderSummary
        readyCake={readyCake}
        configurationSummary={configurationSummary}
        totalPrice={totalPrice}
      />

      {allowPhone && method === "choose" && (
        <div className="space-y-4">
          <p className="text-center text-sm font-medium text-chocolate">
            Как хотите оформить заказ?
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMethod("phone")}
              className="rounded-2xl border-2 border-cream-dark bg-white p-5 text-left transition hover:border-rose hover:bg-rose/5"
            >
              <span className="text-2xl" aria-hidden>
                📞
              </span>
              <p className="mt-2 font-semibold text-chocolate">Позвонить</p>
              <p className="mt-1 text-sm text-chocolate-light">
                Связаться с кондитером по телефону и обсудить заказ
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMethod("form")}
              className="rounded-2xl border-2 border-cream-dark bg-white p-5 text-left transition hover:border-rose hover:bg-rose/5"
            >
              <span className="text-2xl" aria-hidden>
                📝
              </span>
              <p className="mt-2 font-semibold text-chocolate">Заявка на сайте</p>
              <p className="mt-1 text-sm text-chocolate-light">
                Заполнить форму — состав заказа скопируется для звонка
              </p>
            </button>
          </div>
        </div>
      )}

      {allowPhone && method === "phone" && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setMethod("choose")}
            className="text-sm text-chocolate-light hover:text-rose-dark"
          >
            ← Выбрать другой способ
          </button>

          <div className="rounded-2xl border border-cream-dark bg-cream p-6 text-center">
            <p className="text-sm text-chocolate-light">Телефон кондитера</p>
            <p className="mt-2 text-2xl font-bold text-chocolate">
              {contactPhone}
            </p>
            <a
              href={phoneHref}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-berry py-3.5 font-semibold text-white shadow-soft transition hover:bg-berry-dark active:scale-[0.98] sm:w-auto sm:px-10"
            >
              <span aria-hidden>📞</span>
              Позвонить сейчас
            </a>
            <p className="mt-4 text-sm text-chocolate-light">
              При звонке назовите выбранный торт, желаемую дату и пожелания по
              декору.
            </p>
          </div>
        </div>
      )}

      {method === "form" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {allowPhone && (
            <button
              type="button"
              onClick={() => setMethod("choose")}
              className="text-sm text-chocolate-light hover:text-rose-dark"
            >
              ← Выбрать другой способ
            </button>
          )}

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-chocolate">
              Имя *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-chocolate outline-none focus:border-rose"
              placeholder="Как к вам обращаться"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="contact" className="mb-1 block text-sm font-medium text-chocolate">
              Телефон *
            </label>
            <input
              id="contact"
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-chocolate outline-none focus:border-rose"
              placeholder="+7 900 123-45-67"
            />
            {errors.contact && (
              <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="deliveryDate"
              className="mb-1 block text-sm font-medium text-chocolate"
            >
              Дата, когда нужен торт *
            </label>
            <input
              id="deliveryDate"
              type="date"
              value={deliveryDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-chocolate outline-none focus:border-rose"
            />
            {errors.deliveryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.deliveryDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="comment" className="mb-1 block text-sm font-medium text-chocolate">
              Комментарий
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-cream-dark bg-white px-4 py-3 text-chocolate outline-none focus:border-rose"
              placeholder="Пожелания, аллергии, время доставки..."
            />
          </div>

          {customDecorFile && (
            <p className="rounded-xl bg-cream px-4 py-3 text-sm text-chocolate-light">
              Фото декора выбрано — при звонке кондитеру можно отправить его
              отдельно.
            </p>
          )}

          {submitError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-berry py-3 font-semibold text-white shadow-soft transition hover:bg-berry-dark active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Сохраняем..." : "Сохранить заявку"}
          </button>
        </form>
      )}
    </div>
  );
}
