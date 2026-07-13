"use client";

import { useEffect, useMemo, useState } from "react";
import { StaticImage } from "@/components/StaticImage";
import {
  COLOR_OPTIONS,
  CREAM_OPTIONS,
  DECOR_OPTIONS,
  EXTRA_OPTIONS,
  FILLING_OPTIONS,
  INSCRIPTION_PRICE,
  SPONGE_OPTIONS,
  TOPPER_OPTIONS,
  SITE_CONFIG,
} from "@/lib/data/catalog";
import {
  calculateCakePrice,
  formatPrice,
} from "@/lib/pricing/calculatePrice";
import type { CakeConfiguration, CakeShape, Occasion } from "@/lib/types";
import { OCCASION_LABELS, SHAPE_LABELS } from "@/lib/types";
import { DecorPhotoUpload } from "./DecorPhotoUpload";
import { OrderForm } from "./OrderForm";

const STEPS = [
  { label: "Повод", hint: "Для какого события торт" },
  { label: "Размер", hint: "Гости или вес" },
  { label: "Форма и ярусы", hint: "Геометрия торта" },
  { label: "Коржи", hint: "Основа бисквита" },
  { label: "Начинка", hint: "Прослойка между коржами" },
  { label: "Крем / покрытие", hint: "Внешний слой" },
  { label: "Добавки", hint: "Ягоды, декор-акценты" },
  { label: "Цвет", hint: "Гамма оформления" },
  { label: "Декор", hint: "Стиль или своё фото" },
  { label: "Надпись и топперы", hint: "Финальные штрихи" },
  { label: "Оформление", hint: "Контакты и заявка" },
] as const;

const OCCASIONS: Occasion[] = [
  "birthday",
  "wedding",
  "kids",
  "corporate",
  "other",
];

const OCCASION_EMOJI: Record<Occasion, string> = {
  birthday: "🎂",
  wedding: "💍",
  kids: "🧸",
  corporate: "🏢",
  other: "✨",
};

const SHAPES: CakeShape[] = ["round", "square", "tiered"];

const SHAPE_EMOJI: Record<CakeShape, string> = {
  round: "⭕",
  square: "🟦",
  tiered: "🎂",
};

const TIER_CHOICES = [2, 3, 4];

const INITIAL_CONFIG: CakeConfiguration = {
  occasion: "birthday",
  guests: 10,
  tiers: 1,
  shape: "round",
  spongeId: SPONGE_OPTIONS[0].id,
  fillingId: FILLING_OPTIONS[0].id,
  creamId: CREAM_OPTIONS[0].id,
  colorId: COLOR_OPTIONS[0].id,
  extraIds: [],
  topperIds: [],
};

function buildInitialConfig(params: URLSearchParams): {
  config: CakeConfiguration;
  sizeMode: "guests" | "weight";
} {
  const config: CakeConfiguration = { ...INITIAL_CONFIG };
  let sizeMode: "guests" | "weight" = "guests";

  const occasion = params.get("occasion");
  if (occasion && OCCASIONS.includes(occasion as Occasion)) {
    config.occasion = occasion as Occasion;
  }

  const weight = Number(params.get("weight"));
  if (weight > 0) {
    config.weightKg = weight;
    config.guests = undefined;
    sizeMode = "weight";
  }

  const filling = params.get("filling");
  if (filling && FILLING_OPTIONS.some((f) => f.id === filling)) {
    config.fillingId = filling;
  }

  const cream = params.get("cream");
  if (cream && CREAM_OPTIONS.some((c) => c.id === cream)) {
    config.creamId = cream;
  }

  return { config, sizeMode };
}

function readQueryParams(): URLSearchParams {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
}

export function CakeConstructor() {
  const [step, setStep] = useState(0);
  const [sizeMode, setSizeMode] = useState<"guests" | "weight">("guests");
  const [config, setConfig] = useState<CakeConfiguration>(INITIAL_CONFIG);
  const [customDecorNote, setCustomDecorNote] = useState("");
  const [customDecorFile, setCustomDecorFile] = useState<File | null>(null);

  useEffect(() => {
    const { config: initial, sizeMode: mode } = buildInitialConfig(
      readQueryParams(),
    );
    setConfig(initial);
    setSizeMode(mode);
  }, []);

  const isCustomDecor =
    Boolean(customDecorFile) || customDecorNote.trim().length > 0;

  const priceBreakdown = useMemo(
    () =>
      calculateCakePrice({
        configuration: {
          ...config,
          customDecorNote: isCustomDecor ? customDecorNote : undefined,
          decorId: isCustomDecor ? undefined : config.decorId,
        },
      }),
    [config, isCustomDecor, customDecorNote],
  );

  const sponge = SPONGE_OPTIONS.find((s) => s.id === config.spongeId);
  const filling = FILLING_OPTIONS.find((f) => f.id === config.fillingId);
  const cream = CREAM_OPTIONS.find((c) => c.id === config.creamId);
  const color = COLOR_OPTIONS.find((c) => c.id === config.colorId);
  const decor = DECOR_OPTIONS.find((d) => d.id === config.decorId);
  const selectedExtras = EXTRA_OPTIONS.filter((e) =>
    config.extraIds?.includes(e.id),
  );
  const selectedToppers = TOPPER_OPTIONS.filter((t) =>
    config.topperIds?.includes(t.id),
  );

  const configurationSummary = [
    `Повод: ${OCCASION_LABELS[config.occasion]}`,
    config.guests ? `Гостей: ${config.guests}` : null,
    config.weightKg ? `Вес: ${config.weightKg} кг` : null,
    `Форма: ${SHAPE_LABELS[config.shape]}`,
    (config.tiers ?? 1) > 1 ? `Ярусов: ${config.tiers}` : null,
    sponge ? `Коржи: ${sponge.name}` : null,
    filling ? `Начинка: ${filling.name}` : null,
    cream ? `Крем: ${cream.name}` : null,
    selectedExtras.length
      ? `Добавки: ${selectedExtras.map((e) => e.name).join(", ")}`
      : null,
    color ? `Цвет: ${color.name}` : null,
    !isCustomDecor && decor ? `Декор: ${decor.name}` : null,
    isCustomDecor && customDecorNote ? `Свой декор: ${customDecorNote}` : null,
    isCustomDecor && customDecorFile ? "Приложено фото-пример декора" : null,
    config.inscription?.trim() ? `Надпись: «${config.inscription.trim()}»` : null,
    selectedToppers.length
      ? `Топперы: ${selectedToppers.map((t) => t.name).join(", ")}`
      : null,
    `Расчётный вес: ${priceBreakdown.weightKg} кг`,
  ]
    .filter(Boolean)
    .join("\n");

  function updateConfig(patch: Partial<CakeConfiguration>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function toggleInArray(key: "extraIds" | "topperIds", id: string) {
    setConfig((prev) => {
      const current = prev[key] ?? [];
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      return { ...prev, [key]: next };
    });
  }

  function canGoNext(): boolean {
    if (step === 1) {
      if (sizeMode === "guests") return (config.guests ?? 0) > 0;
      return (config.weightKg ?? 0) > 0;
    }
    if (step === 3) return Boolean(config.spongeId);
    if (step === 4) return Boolean(config.fillingId);
    if (step === 5) return Boolean(config.creamId);
    if (step === 8) {
      if (customDecorFile) return true;
      if (customDecorNote.trim().length > 0) return true;
      return Boolean(config.decorId);
    }
    return true;
  }

  const isLastStep = step === STEPS.length - 1;

  function handleNext() {
    if (!canGoNext()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="mx-auto max-w-6xl">
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

      {/* Прогресс */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-chocolate-light">
          <span>
            Шаг {step + 1} из {STEPS.length}
          </span>
          <span className="font-medium text-rose-dark">
            {STEPS[step].hint}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-cream-dark">
          <div
            className="h-full rounded-full bg-rose transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-2">
          {STEPS.map((s, index) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setStep(index)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                index === step
                  ? "bg-rose text-white shadow-soft"
                  : index < step
                    ? "bg-rose/15 text-rose-dark hover:bg-rose/25"
                    : "bg-cream-dark/70 text-chocolate-light hover:bg-cream-dark"
              }`}
            >
              {index + 1}. {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Основная колонка */}
        <div className="rounded-2xl border border-cream-dark/70 bg-white p-6 shadow-soft sm:p-8">
          {step === 0 && (
            <div className="space-y-4">
              <StepHeading
                title="Выберите повод"
                subtitle="От этого зависит стиль и подача торта"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {OCCASIONS.map((occasion) => (
                  <OptionCard
                    key={occasion}
                    active={config.occasion === occasion}
                    onClick={() => updateConfig({ occasion })}
                  >
                    <span className="text-2xl" aria-hidden>
                      {OCCASION_EMOJI[occasion]}
                    </span>
                    <span className="font-medium text-chocolate">
                      {OCCASION_LABELS[occasion]}
                    </span>
                  </OptionCard>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <StepHeading
                title="Количество гостей или вес"
                subtitle="Мы рассчитаем оптимальный вес торта"
              />
              <div className="flex gap-2">
                <ToggleChip
                  active={sizeMode === "guests"}
                  onClick={() => {
                    setSizeMode("guests");
                    updateConfig({ weightKg: undefined, guests: 10 });
                  }}
                >
                  По гостям
                </ToggleChip>
                <ToggleChip
                  active={sizeMode === "weight"}
                  onClick={() => {
                    setSizeMode("weight");
                    updateConfig({ guests: undefined, weightKg: 2 });
                  }}
                >
                  По весу (кг)
                </ToggleChip>
              </div>

              {sizeMode === "guests" ? (
                <div>
                  <label className="mb-2 block text-sm text-chocolate-light">
                    Количество гостей
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={config.guests ?? ""}
                    onChange={(e) =>
                      updateConfig({
                        guests: Number(e.target.value),
                        weightKg: undefined,
                      })
                    }
                    className="w-full rounded-xl border border-cream-dark px-4 py-3 outline-none focus:border-rose"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[6, 10, 15, 20, 30].map((n) => (
                      <ToggleChip
                        key={n}
                        active={config.guests === n}
                        onClick={() =>
                          updateConfig({ guests: n, weightKg: undefined })
                        }
                      >
                        {n} чел.
                      </ToggleChip>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm text-chocolate-light">
                    Вес торта (кг)
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    max={50}
                    step={0.5}
                    value={config.weightKg ?? ""}
                    onChange={(e) =>
                      updateConfig({
                        weightKg: Number(e.target.value),
                        guests: undefined,
                      })
                    }
                    className="w-full rounded-xl border border-cream-dark px-4 py-3 outline-none focus:border-rose"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[1.5, 2, 3, 4, 6].map((n) => (
                      <ToggleChip
                        key={n}
                        active={config.weightKg === n}
                        onClick={() =>
                          updateConfig({ weightKg: n, guests: undefined })
                        }
                      >
                        {n} кг
                      </ToggleChip>
                    ))}
                  </div>
                </div>
              )}

              <p className="rounded-xl bg-cream px-4 py-3 text-sm text-chocolate-light">
                Расчётный вес: ~{priceBreakdown.weightKg} кг
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <StepHeading
                title="Форма торта"
                subtitle="Для многоярусного укажите количество ярусов"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                {SHAPES.map((shape) => (
                  <OptionCard
                    key={shape}
                    active={config.shape === shape}
                    onClick={() =>
                      updateConfig({
                        shape,
                        tiers: shape === "tiered" ? Math.max(2, config.tiers ?? 2) : 1,
                      })
                    }
                  >
                    <span className="text-2xl" aria-hidden>
                      {SHAPE_EMOJI[shape]}
                    </span>
                    <span className="font-medium text-chocolate">
                      {SHAPE_LABELS[shape]}
                    </span>
                  </OptionCard>
                ))}
              </div>

              {config.shape === "tiered" && (
                <div>
                  <label className="mb-2 block text-sm text-chocolate-light">
                    Количество ярусов
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TIER_CHOICES.map((t) => (
                      <ToggleChip
                        key={t}
                        active={config.tiers === t}
                        onClick={() => updateConfig({ tiers: t })}
                      >
                        {t} яруса
                      </ToggleChip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <StepHeading
                title="Коржи (бисквит)"
                subtitle="Основа вкуса вашего торта"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                {SPONGE_OPTIONS.map((s) => (
                  <ListOption
                    key={s.id}
                    active={config.spongeId === s.id}
                    onClick={() => updateConfig({ spongeId: s.id })}
                    name={s.name}
                    description={s.description}
                    priceAdd={s.priceAdd}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <StepHeading
                title="Начинка"
                subtitle="Прослойка между коржами"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                {FILLING_OPTIONS.map((f) => (
                  <ListOption
                    key={f.id}
                    active={config.fillingId === f.id}
                    onClick={() => updateConfig({ fillingId: f.id })}
                    name={f.name}
                    description={f.description}
                    priceAdd={f.priceAdd}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <StepHeading
                title="Крем и покрытие"
                subtitle="Внешний слой торта"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                {CREAM_OPTIONS.map((c) => (
                  <ListOption
                    key={c.id}
                    active={config.creamId === c.id}
                    onClick={() => updateConfig({ creamId: c.id })}
                    name={c.name}
                    description={c.description}
                    priceAdd={c.priceAdd}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <StepHeading
                title="Добавки и акценты"
                subtitle="Можно выбрать несколько — или пропустить"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                {EXTRA_OPTIONS.map((e) => (
                  <ListOption
                    key={e.id}
                    active={config.extraIds?.includes(e.id) ?? false}
                    onClick={() => toggleInArray("extraIds", e.id)}
                    name={`${e.emoji ?? ""} ${e.name}`.trim()}
                    priceAdd={e.priceAdd}
                    multi
                  />
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <StepHeading
                title="Цветовая гамма"
                subtitle="Основной оттенок оформления"
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => updateConfig({ colorId: c.id })}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition ${
                      config.colorId === c.id
                        ? "border-rose bg-rose/5"
                        : "border-cream-dark hover:border-rose/50"
                    }`}
                  >
                    <span
                      className="h-12 w-12 rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                      aria-hidden
                    />
                    <span className="text-xs font-medium text-chocolate">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-5">
              <StepHeading
                title="Декор"
                subtitle="Выберите готовый стиль или загрузите свой пример"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {DECOR_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      updateConfig({ decorId: d.id });
                      setCustomDecorFile(null);
                      setCustomDecorNote("");
                    }}
                    className={`overflow-hidden rounded-xl border-2 text-left transition ${
                      !isCustomDecor && config.decorId === d.id
                        ? "border-rose"
                        : "border-cream-dark hover:border-rose/50"
                    }`}
                  >
                    <div className="relative aspect-video">
                      <StaticImage
                        src={d.imageUrl}
                        alt={d.name}
                        fill
                        className="object-cover"
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

              <div className="relative flex items-center py-1">
                <div className="grow border-t border-cream-dark" />
                <span className="mx-4 shrink-0 text-sm text-chocolate-light">
                  или
                </span>
                <div className="grow border-t border-cream-dark" />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-chocolate">Свой пример</p>
                <DecorPhotoUpload
                  file={customDecorFile}
                  onChange={(file) => {
                    setCustomDecorFile(file);
                    if (file) updateConfig({ decorId: undefined });
                  }}
                />
                <div>
                  <label className="mb-2 block text-sm text-chocolate-light">
                    Комментарий к декору (необязательно)
                  </label>
                  <textarea
                    value={customDecorNote}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomDecorNote(value);
                      if (value.trim()) updateConfig({ decorId: undefined });
                    }}
                    rows={2}
                    className="w-full rounded-xl border border-cream-dark px-4 py-3 outline-none focus:border-rose"
                    placeholder="Розы, надпись, цвета..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="space-y-6">
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
                  type="text"
                  maxLength={60}
                  value={config.inscription ?? ""}
                  onChange={(e) => updateConfig({ inscription: e.target.value })}
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
                    <ListOption
                      key={t.id}
                      active={config.topperIds?.includes(t.id) ?? false}
                      onClick={() => toggleInArray("topperIds", t.id)}
                      name={`${t.emoji ?? ""} ${t.name}`.trim()}
                      priceAdd={t.priceAdd}
                      multi
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 10 && (
            <div className="space-y-6">
              <StepHeading
                title="Оформление заказа"
                subtitle="Проверьте состав и оставьте заявку"
              />
              <PriceDetails breakdown={priceBreakdown} />
              <OrderForm
                orderType="constructor"
                totalPrice={priceBreakdown.total}
                configurationSummary={configurationSummary}
                configuration={{
                  ...config,
                  decorId: isCustomDecor ? undefined : config.decorId,
                  customDecorNote: isCustomDecor ? customDecorNote : undefined,
                }}
                customDecorFile={isCustomDecor ? customDecorFile : null}
                contactPhone={SITE_CONFIG.phone}
              />
            </div>
          )}

          {!isLastStep && (
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-cream-dark/70 pt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 0}
                className="rounded-full px-6 py-2.5 text-sm font-medium text-chocolate transition hover:bg-cream-dark disabled:opacity-40"
              >
                Назад
              </button>
              <div className="flex items-center gap-4">
                <span className="hidden text-sm text-chocolate-light sm:inline">
                  Итого:{" "}
                  <span className="font-semibold text-rose-dark">
                    {formatPrice(priceBreakdown.total)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canGoNext()}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-berry to-berry-dark px-8 py-3 text-sm font-semibold text-white shadow-lift transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:brightness-100"
                >
                  Далее
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Живой итог */}
        <aside className="lg:sticky lg:top-28 lg:z-0 lg:self-start">
          <div className="rounded-2xl border border-cream-dark/70 bg-white p-5 shadow-soft sm:p-6">
            <CakePreview
              tiers={config.shape === "tiered" ? config.tiers ?? 2 : 1}
              colorHex={color?.hex ?? "#f2e2c9"}
            />

            <div className="mt-5 border-t border-cream-dark/70 pt-4">
              <p className="text-xs uppercase tracking-[0.14em] text-chocolate-light">
                Ваш торт
              </p>
              <dl className="mt-3 space-y-1.5 text-sm">
                <SummaryRow label="Повод" value={OCCASION_LABELS[config.occasion]} />
                <SummaryRow
                  label="Размер"
                  value={
                    config.guests
                      ? `${config.guests} гостей`
                      : `${config.weightKg} кг`
                  }
                />
                <SummaryRow
                  label="Форма"
                  value={
                    config.shape === "tiered"
                      ? `${SHAPE_LABELS[config.shape]} (${config.tiers})`
                      : SHAPE_LABELS[config.shape]
                  }
                />
                <SummaryRow label="Коржи" value={sponge?.name} />
                <SummaryRow label="Начинка" value={filling?.name} />
                <SummaryRow label="Крем" value={cream?.name} />
                {selectedExtras.length > 0 && (
                  <SummaryRow
                    label="Добавки"
                    value={selectedExtras.map((e) => e.name).join(", ")}
                  />
                )}
                <SummaryRow label="Цвет" value={color?.name} />
                <SummaryRow
                  label="Декор"
                  value={
                    isCustomDecor ? "Свой пример" : decor?.name ?? "—"
                  }
                />
                {config.inscription?.trim() && (
                  <SummaryRow
                    label="Надпись"
                    value={`«${config.inscription.trim()}»`}
                  />
                )}
                {selectedToppers.length > 0 && (
                  <SummaryRow
                    label="Топперы"
                    value={selectedToppers.map((t) => t.name).join(", ")}
                  />
                )}
              </dl>
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-cream-dark/70 pt-4">
              <div>
                <p className="text-xs text-chocolate-light">Ориентировочно</p>
                <p className="font-serif text-2xl font-semibold text-rose-dark">
                  {formatPrice(priceBreakdown.total)}
                </p>
              </div>
              <p className="text-xs text-chocolate-light">
                ~{priceBreakdown.weightKg} кг
              </p>
            </div>

            {!isLastStep && (
              <button
                type="button"
                onClick={() => setStep(STEPS.length - 1)}
                className="mt-4 w-full rounded-full bg-gradient-to-r from-berry to-berry-dark py-3 text-sm font-semibold text-white shadow-lift transition hover:brightness-110 active:scale-[0.98]"
              >
                Перейти к заявке
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-chocolate sm:text-xl">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-chocolate-light">{subtitle}</p>
      )}
    </div>
  );
}

function OptionCard({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-4 text-left transition ${
        active
          ? "border-rose bg-rose/5"
          : "border-cream-dark hover:border-rose/50"
      }`}
    >
      {children}
    </button>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-rose text-white"
          : "bg-cream-dark text-chocolate hover:bg-cream-dark/70"
      }`}
    >
      {children}
    </button>
  );
}

function ListOption({
  active,
  onClick,
  name,
  description,
  priceAdd,
  multi = false,
}: {
  active: boolean;
  onClick: () => void;
  name: string;
  description?: string;
  priceAdd: number;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
        active
          ? "border-rose bg-rose/5"
          : "border-cream-dark hover:border-rose/50"
      }`}
    >
      <span className="flex items-start gap-2.5">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 text-white ${
            multi ? "rounded-md" : "rounded-full"
          } ${active ? "border-rose bg-rose" : "border-cream-dark bg-transparent"}`}
          aria-hidden
        >
          {active && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </span>
        <span>
          <span className="block text-sm font-medium text-chocolate">
            {name}
          </span>
          {description && (
            <span className="mt-0.5 block text-xs text-chocolate-light">
              {description}
            </span>
          )}
        </span>
      </span>
      {priceAdd > 0 && (
        <span className="shrink-0 text-sm text-chocolate-light">
          +{formatPrice(priceAdd)}
        </span>
      )}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-chocolate-light">{label}</dt>
      <dd className="text-right font-medium text-chocolate">{value ?? "—"}</dd>
    </div>
  );
}

function CakePreview({ tiers, colorHex }: { tiers: number; colorHex: string }) {
  const count = Math.min(Math.max(tiers, 1), 4);
  const layers = Array.from({ length: count });

  return (
    <div className="flex flex-col items-center justify-end rounded-xl bg-gradient-to-b from-cream to-rose/20 p-5">
      <div className="flex flex-col items-center">
        <span className="mb-1 h-3 w-1 rounded-full bg-terracotta" aria-hidden />
        {layers.map((_, i) => {
          const widthPx = 80 + (count - 1 - i) * 34;
          return (
            <div
              key={i}
              className="rounded-t-md border border-black/5 shadow-sm"
              style={{
                width: widthPx,
                height: 28,
                backgroundColor: colorHex,
                marginTop: i === 0 ? 0 : -1,
              }}
              aria-hidden
            />
          );
        })}
        <div
          className="h-2.5 rounded-b-lg bg-chocolate/15"
          style={{ width: 80 + (count - 1) * 34 + 12 }}
          aria-hidden
        />
      </div>
      <p className="mt-3 text-xs text-chocolate-light">
        {count > 1 ? `${count}-ярусный торт` : "Одноярусный торт"}
      </p>
    </div>
  );
}

function PriceDetails({
  breakdown,
}: {
  breakdown: ReturnType<typeof calculateCakePrice>;
}) {
  const rows = [
    { label: "Базовая стоимость", value: breakdown.basePrice, sign: "" },
    { label: "Форма", value: breakdown.shapeAdd },
    { label: "Ярусы", value: breakdown.tierAdd },
    { label: "Коржи", value: breakdown.spongeAdd },
    { label: "Начинка", value: breakdown.fillingAdd },
    { label: "Крем", value: breakdown.creamAdd },
    { label: "Добавки", value: breakdown.extrasAdd },
    { label: "Декор", value: breakdown.decorAdd },
    { label: "Надпись и топперы", value: breakdown.topperAdd },
  ];

  return (
    <div className="rounded-xl bg-cream p-5">
      <h3 className="text-lg font-semibold text-chocolate">Расчёт стоимости</h3>
      <dl className="mt-4 space-y-2 text-sm">
        {rows.map((row, i) =>
          i === 0 || row.value > 0 ? (
            <div key={row.label} className="flex justify-between">
              <dt className="text-chocolate-light">{row.label}</dt>
              <dd>
                {i === 0 ? "" : "+"}
                {formatPrice(row.value)}
              </dd>
            </div>
          ) : null,
        )}
        {breakdown.occasionMultiplier !== 1 && (
          <div className="flex justify-between">
            <dt className="text-chocolate-light">Коэффициент повода</dt>
            <dd>×{breakdown.occasionMultiplier}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-cream-dark pt-2 text-base font-bold">
          <dt>Итого</dt>
          <dd className="text-rose-dark">{formatPrice(breakdown.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
