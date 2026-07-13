import {
  CONSTRUCTOR_OCCASIONS,
  CONSTRUCTOR_SHAPES,
  CONSTRUCTOR_STEPS,
  getConstructorRuntimeData,
} from "@/lib/constructor/staticData";
import {
  COLOR_OPTIONS,
  CREAM_OPTIONS,
  DECOR_OPTIONS,
  EXTRA_OPTIONS,
  FILLING_OPTIONS,
  INSCRIPTION_PRICE,
  SPONGE_OPTIONS,
  TOPPER_OPTIONS,
} from "@/lib/data/catalog";
import { formatPrice } from "@/lib/pricing/calculatePrice";

const CARD =
  "flex items-center gap-3 rounded-xl border-2 px-4 py-4 text-left transition";
const CARD_ACTIVE = "border-rose bg-rose/5";
const CARD_IDLE = "border-cream-dark hover:border-rose/50";
const CHIP =
  "rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer";
const LIST_BTN =
  "flex w-full items-start justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition";

export function ConstructorStatic() {
  const data = getConstructorRuntimeData();

  return (
    <div id="constructor-app" className="mx-auto max-w-6xl">
      <script
        type="application/json"
        id="constructor-data"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <ConstructorBody />
    </div>
  );
}

function ConstructorBody() {
  return (
    <>
      <div className="mb-8 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-rose-dark">
          Индивидуальный заказ
        </span>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-chocolate sm:text-4xl">
          Конструктор торта
        </h1>
        <p className="mt-2 text-sm text-chocolate-light">
          Соберите торт по шагам — цена и превью пересчитываются автоматически
        </p>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-chocolate-light">
          <span>
            Шаг <span data-step-num>1</span> из {CONSTRUCTOR_STEPS.length}
          </span>
          <span className="font-medium text-rose-dark" data-step-hint>
            {CONSTRUCTOR_STEPS[0].hint}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-cream-dark">
          <div
            data-progress-bar
            className="h-full rounded-full bg-rose transition-all duration-500"
            style={{ width: `${(1 / CONSTRUCTOR_STEPS.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-2">
          {CONSTRUCTOR_STEPS.map((step, index) => (
            <button
              key={step.label}
              type="button"
              data-step-pill={index}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                index === 0
                  ? "bg-rose text-white shadow-soft"
                  : "bg-cream-dark/70 text-chocolate-light hover:bg-cream-dark"
              }`}
            >
              {index + 1}. {step.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-cream-dark/70 bg-white p-6 shadow-soft sm:p-8">
          {/* Шаг 0 — Повод */}
          <section data-step-panel={0} className="space-y-4">
            <StepHeading
              title="Выберите повод"
              subtitle="От этого зависит стиль и подача торта"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {CONSTRUCTOR_OCCASIONS.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  data-select="occasion"
                  data-value={item.id}
                  className={`${CARD} ${i === 0 ? CARD_ACTIVE : CARD_IDLE}`}
                >
                  <span className="text-2xl" aria-hidden>
                    {item.emoji}
                  </span>
                  <span className="font-medium text-chocolate">{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Шаг 1 — Размер */}
          <section data-step-panel={1} hidden className="space-y-5">
            <StepHeading
              title="Количество гостей или вес"
              subtitle="Мы рассчитаем оптимальный вес торта"
            />
            <div className="flex gap-2" data-size-mode>
              <button
                type="button"
                data-select="size-mode"
                data-value="guests"
                data-chip
                className={`${CHIP} bg-rose text-white`}
              >
                По гостям
              </button>
              <button
                type="button"
                data-select="size-mode"
                data-value="weight"
                data-chip
                className={`${CHIP} bg-cream-dark text-chocolate hover:bg-cream-dark/70`}
              >
                По весу (кг)
              </button>
            </div>
            <div data-guests-block>
              <label className="mb-2 block text-sm text-chocolate-light">
                Количество гостей
              </label>
              <input
                data-guests-input
                type="number"
                min={1}
                max={200}
                defaultValue={10}
                className="w-full rounded-xl border border-cream-dark px-4 py-3 outline-none focus:border-rose"
              />
              <div className="mt-3 flex flex-wrap gap-2" data-guests-presets>
                {[6, 10, 15, 20, 30].map((n) => (
                  <button
                    key={n}
                    type="button"
                    data-select="guests-preset"
                    data-value={n}
                    data-chip
                    className={`${CHIP} ${n === 10 ? "bg-rose text-white" : "bg-cream-dark text-chocolate hover:bg-cream-dark/70"}`}
                  >
                    {n} чел.
                  </button>
                ))}
              </div>
            </div>
            <div data-weight-block hidden>
              <label className="mb-2 block text-sm text-chocolate-light">
                Вес торта (кг)
              </label>
              <input
                data-weight-input
                type="number"
                min={0.5}
                max={50}
                step={0.5}
                defaultValue={2}
                className="w-full rounded-xl border border-cream-dark px-4 py-3 outline-none focus:border-rose"
              />
              <div className="mt-3 flex flex-wrap gap-2" data-weight-presets>
                {[1.5, 2, 3, 4, 6].map((n) => (
                  <button
                    key={n}
                    type="button"
                    data-select="weight-preset"
                    data-value={n}
                    data-chip
                    className={`${CHIP} ${n === 2 ? "bg-rose text-white" : "bg-cream-dark text-chocolate hover:bg-cream-dark/70"}`}
                  >
                    {n} кг
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Шаг 2 — Форма */}
          <section data-step-panel={2} hidden className="space-y-5">
            <StepHeading
              title="Форма и ярусы"
              subtitle="Выберите геометрию торта"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              {CONSTRUCTOR_SHAPES.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  data-select="shape"
                  data-value={item.id}
                  className={`${CARD} ${i === 0 ? CARD_ACTIVE : CARD_IDLE}`}
                >
                  <span className="text-2xl" aria-hidden>
                    {item.emoji}
                  </span>
                  <span className="font-medium text-chocolate">{item.label}</span>
                </button>
              ))}
            </div>
            <div data-tier-panel hidden>
              <p className="mb-2 text-sm font-medium text-chocolate">
                Количество ярусов
              </p>
              <div className="flex flex-wrap gap-2" data-tiers>
                {[2, 3, 4].map((t) => (
                  <button
                    key={t}
                    type="button"
                    data-select="tiers"
                    data-value={t}
                    data-chip
                    className={`${CHIP} ${t === 2 ? "bg-rose text-white" : "bg-cream-dark text-chocolate hover:bg-cream-dark/70"}`}
                  >
                    {t} яруса
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Шаг 3 — Коржи */}
          <section data-step-panel={3} hidden className="space-y-4">
            <StepHeading title="Коржи" subtitle="Основа бисквита" />
            <div className="grid gap-2">
              {SPONGE_OPTIONS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  data-select="sponge"
                  data-value={s.id}
                  className={`${LIST_BTN} ${i === 0 ? CARD_ACTIVE : CARD_IDLE}`}
                >
                  <span>
                    <span className="block text-sm font-medium text-chocolate">
                      {s.name}
                    </span>
                    {s.description && (
                      <span className="mt-0.5 block text-xs text-chocolate-light">
                        {s.description}
                      </span>
                    )}
                  </span>
                  {s.priceAdd > 0 && (
                    <span className="shrink-0 text-sm text-chocolate-light">
                      +{formatPrice(s.priceAdd)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Шаг 4 — Начинка */}
          <section data-step-panel={4} hidden className="space-y-4">
            <StepHeading title="Начинка" subtitle="Прослойка между коржами" />
            <div className="grid gap-2">
              {FILLING_OPTIONS.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  data-select="filling"
                  data-value={f.id}
                  className={`${LIST_BTN} ${i === 0 ? CARD_ACTIVE : CARD_IDLE}`}
                >
                  <span>
                    <span className="block text-sm font-medium text-chocolate">
                      {f.name}
                    </span>
                    {f.description && (
                      <span className="mt-0.5 block text-xs text-chocolate-light">
                        {f.description}
                      </span>
                    )}
                  </span>
                  {f.priceAdd > 0 && (
                    <span className="shrink-0 text-sm text-chocolate-light">
                      +{formatPrice(f.priceAdd)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Шаг 5 — Крем */}
          <section data-step-panel={5} hidden className="space-y-4">
            <StepHeading title="Крем / покрытие" subtitle="Внешний слой" />
            <div className="grid gap-2">
              {CREAM_OPTIONS.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  data-select="cream"
                  data-value={c.id}
                  className={`${LIST_BTN} ${i === 0 ? CARD_ACTIVE : CARD_IDLE}`}
                >
                  <span>
                    <span className="block text-sm font-medium text-chocolate">
                      {c.name}
                    </span>
                    {c.description && (
                      <span className="mt-0.5 block text-xs text-chocolate-light">
                        {c.description}
                      </span>
                    )}
                  </span>
                  {c.priceAdd > 0 && (
                    <span className="shrink-0 text-sm text-chocolate-light">
                      +{formatPrice(c.priceAdd)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Шаг 6 — Добавки */}
          <section data-step-panel={6} hidden className="space-y-4">
            <StepHeading title="Добавки" subtitle="Можно выбрать несколько" />
            <div className="grid gap-2 sm:grid-cols-2">
              {EXTRA_OPTIONS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  data-select="extra"
                  data-value={e.id}
                  className={`${LIST_BTN} ${CARD_IDLE}`}
                >
                  <span className="flex items-start gap-2.5">
                    <span
                      data-check
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-cream-dark bg-transparent"
                      aria-hidden
                    />
                    <span className="text-sm font-medium text-chocolate">
                      {e.emoji ? `${e.emoji} ` : ""}
                      {e.name}
                    </span>
                  </span>
                  {e.priceAdd > 0 && (
                    <span className="shrink-0 text-sm text-chocolate-light">
                      +{formatPrice(e.priceAdd)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Шаг 7 — Цвет */}
          <section data-step-panel={7} hidden className="space-y-4">
            <StepHeading title="Цвет" subtitle="Гамма оформления" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {COLOR_OPTIONS.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  data-select="color"
                  data-value={c.id}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition ${i === 0 ? CARD_ACTIVE : CARD_IDLE}`}
                >
                  <span
                    className="h-10 w-10 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: c.hex }}
                    aria-hidden
                  />
                  <span className="text-xs font-medium text-chocolate">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Шаг 8 — Декор */}
          <section data-step-panel={8} hidden className="space-y-5">
            <StepHeading
              title="Декор"
              subtitle="Выберите готовый стиль или опишите свой"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {DECOR_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  data-select="decor"
                  data-value={d.id}
                  className={`overflow-hidden rounded-xl border-2 text-left transition ${CARD_IDLE}`}
                >
                  <div className="relative aspect-video bg-cream-dark/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      data-decor-img={d.imageUrl}
                      alt={d.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-sm font-medium text-chocolate">
                      {d.name}
                    </span>
                    {d.priceAdd > 0 && (
                      <span className="text-xs text-chocolate-light">
                        +{formatPrice(d.priceAdd)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div>
              <label className="mb-2 block text-sm text-chocolate-light">
                Свой вариант (текст)
              </label>
              <textarea
                data-custom-decor-note
                rows={3}
                className="w-full resize-none rounded-xl border border-cream-dark px-4 py-3 outline-none focus:border-rose"
                placeholder="Опишите желаемый декор..."
              />
            </div>
          </section>

          {/* Шаг 9 — Надпись */}
          <section data-step-panel={9} hidden className="space-y-6">
            <StepHeading
              title="Надпись и топперы"
              subtitle="Финальные акценты — всё по желанию"
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-chocolate">
                Надпись на торте{" "}
                <span className="text-xs font-normal text-chocolate-light">
                  (+{formatPrice(INSCRIPTION_PRICE)})
                </span>
              </label>
              <input
                data-inscription
                type="text"
                maxLength={60}
                className="w-full rounded-xl border border-cream-dark px-4 py-3 outline-none focus:border-rose"
                placeholder="Например: С днём рождения, Аня!"
              />
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-chocolate">
                Топперы и украшения
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {TOPPER_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    data-select="topper"
                    data-value={t.id}
                    className={`${LIST_BTN} ${CARD_IDLE}`}
                  >
                    <span className="flex items-start gap-2.5">
                      <span
                        data-check
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-cream-dark bg-transparent"
                        aria-hidden
                      />
                      <span className="text-sm font-medium text-chocolate">
                        {t.emoji ? `${t.emoji} ` : ""}
                        {t.name}
                      </span>
                    </span>
                    {t.priceAdd > 0 && (
                      <span className="shrink-0 text-sm text-chocolate-light">
                        +{formatPrice(t.priceAdd)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Шаг 10 — Заявка (демо) */}
          <section data-step-panel={10} hidden className="space-y-6">
            <StepHeading
              title="Оформление заказа"
              subtitle="Демо-форма для портфолио — отправка не выполняется"
            />
            <div className="rounded-xl bg-cream p-5">
              <p className="text-sm text-chocolate-light">
                Итоговая стоимость:{" "}
                <span className="text-lg font-bold text-rose-dark" data-price-final>
                  {formatPrice(8500)}
                </span>
              </p>
            </div>
            <form data-demo-form className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-chocolate">
                  Имя *
                </label>
                <input
                  required
                  type="text"
                  className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 outline-none focus:border-rose"
                  placeholder="Как к вам обращаться"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-chocolate">
                  Телефон *
                </label>
                <input
                  required
                  type="tel"
                  className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 outline-none focus:border-rose"
                  placeholder="+7 900 123-45-67"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-chocolate">
                  Дата *
                </label>
                <input
                  required
                  type="date"
                  className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 outline-none focus:border-rose"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-berry py-3 font-semibold text-white shadow-soft transition hover:bg-berry-dark"
              >
                Отправить заявку (демо)
              </button>
            </form>
            <div
              data-demo-success
              hidden
              className="rounded-2xl border border-rose/30 bg-rose/10 p-6 text-center"
            >
              <p className="font-serif text-xl font-semibold text-chocolate">
                Заявка принята!
              </p>
              <p className="mt-2 text-sm text-chocolate-light">
                Это демонстрационный шаблон — реальная отправка не выполняется.
              </p>
            </div>
          </section>

          <div
            data-step-nav
            className="mt-8 flex items-center justify-between gap-4 border-t border-cream-dark/70 pt-6"
          >
            <button
              type="button"
              data-action="back"
              disabled
              className="rounded-full px-6 py-2.5 text-sm font-medium text-chocolate transition hover:bg-cream-dark disabled:opacity-40"
            >
              Назад
            </button>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-chocolate-light sm:inline">
                Итого:{" "}
                <span className="font-semibold text-rose-dark" data-price-total>
                  {formatPrice(8500)}
                </span>
              </span>
              <button
                type="button"
                data-action="next"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-berry to-berry-dark px-8 py-3 text-sm font-semibold text-white shadow-lift transition hover:brightness-110 active:scale-[0.98]"
              >
                Далее
              </button>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:z-0 lg:self-start">
          <div className="rounded-2xl border border-cream-dark/70 bg-white p-5 shadow-soft sm:p-6">
            <div data-cake-preview />
            <div className="mt-5 border-t border-cream-dark/70 pt-4">
              <p className="text-xs uppercase tracking-[0.14em] text-chocolate-light">
                Ваш торт
              </p>
              <dl className="mt-3 space-y-1.5 text-sm">
                <SummaryRow dataKey="occasion" label="Повод" />
                <SummaryRow dataKey="size" label="Размер" />
                <SummaryRow dataKey="shape" label="Форма" />
                <SummaryRow dataKey="sponge" label="Коржи" />
                <SummaryRow dataKey="filling" label="Начинка" />
                <SummaryRow dataKey="cream" label="Крем" />
                <SummaryRow dataKey="extras" label="Добавки" />
                <SummaryRow dataKey="color" label="Цвет" />
                <SummaryRow dataKey="decor" label="Декор" />
                <SummaryRow dataKey="inscription" label="Надпись" />
                <SummaryRow dataKey="toppers" label="Топперы" />
              </dl>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-cream-dark/70 pt-4">
              <div>
                <p className="text-xs text-chocolate-light">Ориентировочно</p>
                <p
                  className="font-serif text-2xl font-semibold text-rose-dark"
                  data-price-total
                >
                  {formatPrice(8500)}
                </p>
              </div>
              <p className="text-xs text-chocolate-light" data-price-weight>
                ~1.5 кг
              </p>
            </div>
            <button
              type="button"
              data-action="goto-order"
              className="mt-4 w-full rounded-full bg-gradient-to-r from-berry to-berry-dark py-3 text-sm font-semibold text-white shadow-lift transition hover:brightness-110 active:scale-[0.98]"
            >
              Перейти к заявке
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

function StepHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-chocolate sm:text-xl">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-chocolate-light">{subtitle}</p>
      )}
    </div>
  );
}

function SummaryRow({ dataKey, label }: { dataKey: string; label: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-chocolate-light">{label}</dt>
      <dd
        data-summary={dataKey}
        className="text-right font-medium text-chocolate"
      >
        —
      </dd>
    </div>
  );
}
