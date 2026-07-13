import { formatPrice } from "@/lib/pricing/calculatePrice";
import type { OrderRequest } from "@/lib/types";
import { OCCASION_LABELS, SHAPE_LABELS } from "@/lib/types";

function formatConfiguration(order: OrderRequest): string {
  if (!order.configuration) return "—";

  const cfg = order.configuration;
  const lines = [
    `Повод: ${OCCASION_LABELS[cfg.occasion]}`,
    cfg.guests ? `Гостей: ${cfg.guests}` : null,
    cfg.weightKg ? `Вес: ${cfg.weightKg} кг` : null,
    `Форма: ${SHAPE_LABELS[cfg.shape]}`,
    `Начинка ID: ${cfg.fillingId}`,
    `Крем ID: ${cfg.creamId}`,
    cfg.decorId ? `Декор ID: ${cfg.decorId}` : null,
    cfg.customDecorNote ? `Свой декор: ${cfg.customDecorNote}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export function formatOrderMessage(order: OrderRequest): string {
  const typeLabel =
    order.orderType === "constructor" ? "Конструктор" : "Готовый торт";

  return [
    "Новая заявка на торт",
    "",
    `Тип: ${typeLabel}`,
    `Имя: ${order.customerName}`,
    `Контакт: ${order.contact}`,
    `Дата: ${order.deliveryDate}`,
    `Сумма: ${formatPrice(order.totalPrice)}`,
    order.readyCakeId ? `Готовый торт ID: ${order.readyCakeId}` : null,
    order.orderType === "constructor"
      ? `Конфигурация:\n${formatConfiguration(order)}`
      : null,
    order.comment ? `Комментарий: ${order.comment}` : null,
    order.customDecorImagePath
      ? "Есть референс-фото декора (отправьте кондитеру при звонке)"
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}
