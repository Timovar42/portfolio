import type {
  ColorOption,
  CreamOption,
  DecorOption,
  ExtraOption,
  FillingOption,
  PortfolioItem,
  ReadyCake,
  SpongeOption,
  TopperOption,
} from "../types";

export const SITE_CONFIG = {
  name: "Сладкие Торты",
  tagline: "Домашняя кондитерская с индивидуальным подходом",
  phone: "+7 (900) 123-45-67",
  location: {
    address: "Москва, ул. Пятницкая, 10",
    lat: 55.741,
    lng: 37.6276,
  },
};

export const SPONGE_OPTIONS: SpongeOption[] = [
  {
    id: "vanilla",
    name: "Ванильный бисквит",
    description: "Классический нежный корж",
    priceAdd: 0,
  },
  {
    id: "chocolate",
    name: "Шоколадный бисквит",
    description: "Насыщенный какао-корж",
    priceAdd: 0,
  },
  {
    id: "red-velvet",
    name: "Красный бархат",
    description: "Бархатистый корж с лёгким какао",
    priceAdd: 400,
  },
  {
    id: "honey",
    name: "Медовый",
    description: "Тонкие медовые коржи",
    priceAdd: 300,
  },
  {
    id: "carrot",
    name: "Морковный",
    description: "Пряный корж с орехами",
    priceAdd: 250,
  },
  {
    id: "almond",
    name: "Миндальный дакуаз",
    description: "Ореховый корж премиум",
    priceAdd: 500,
  },
];

export const FILLING_OPTIONS: FillingOption[] = [
  {
    id: "cream-classic",
    name: "Классическая кремовая",
    description: "Нежный крем без добавок",
    priceAdd: 0,
  },
  {
    id: "berry",
    name: "Ягодная",
    description: "Клубника, малина, смородина",
    priceAdd: 350,
  },
  {
    id: "caramel",
    name: "Солёная карамель",
    description: "Карамель с морской солью",
    priceAdd: 300,
  },
  {
    id: "chocolate-ganache",
    name: "Шоколадный ганаш",
    description: "Плотный шоколадный слой",
    priceAdd: 400,
  },
  {
    id: "curd",
    name: "Творожная",
    description: "Лёгкая творожная прослойка",
    priceAdd: 250,
  },
  {
    id: "nuts",
    name: "Орех и пралине",
    description: "Фундук, миндаль, пралине",
    priceAdd: 450,
  },
];

export const CREAM_OPTIONS: CreamOption[] = [
  {
    id: "cream-cheese",
    name: "Крем-чиз",
    description: "Сливочно-сырное покрытие",
    priceAdd: 0,
  },
  {
    id: "buttercream",
    name: "Сливочный крем",
    description: "Гладкое масляное покрытие",
    priceAdd: 0,
  },
  {
    id: "mascarpone",
    name: "Маскарпоне",
    description: "Воздушный крем на маскарпоне",
    priceAdd: 350,
  },
  {
    id: "ganache",
    name: "Ганаш",
    description: "Ровное шоколадное покрытие",
    priceAdd: 400,
  },
  {
    id: "velvet",
    name: "Велюр",
    description: "Бархатистое велюровое напыление",
    priceAdd: 600,
  },
  {
    id: "fondant",
    name: "Мастика",
    description: "Идеально гладкая под любой декор",
    priceAdd: 500,
  },
];

export const EXTRA_OPTIONS: ExtraOption[] = [
  { id: "fresh-berries", name: "Свежие ягоды", emoji: "🍓", priceAdd: 500 },
  { id: "macarons", name: "Макарон", emoji: "🍬", priceAdd: 600 },
  { id: "chocolate-drip", name: "Шоколадные потёки", emoji: "🍫", priceAdd: 350 },
  { id: "gold-leaf", name: "Поталь (золото)", emoji: "✨", priceAdd: 700 },
  { id: "edible-flowers", name: "Съедобные цветы", emoji: "🌸", priceAdd: 550 },
  { id: "meringue", name: "Безе", emoji: "🤍", priceAdd: 300 },
];

export const COLOR_OPTIONS: ColorOption[] = [
  { id: "cream", name: "Кремовый", hex: "#f2e2c9" },
  { id: "rose", name: "Пудровая роза", hex: "#f2c9c2" },
  { id: "berry", name: "Ягодный", hex: "#b83256" },
  { id: "chocolate", name: "Шоколад", hex: "#7a4a3a" },
  { id: "mint", name: "Мятный", hex: "#c8e6d0" },
  { id: "lavender", name: "Лавандовый", hex: "#d9c9ec" },
  { id: "gold", name: "Золото", hex: "#c2a35a" },
  { id: "white", name: "Белоснежный", hex: "#faf7f2" },
];

export const TOPPER_OPTIONS: TopperOption[] = [
  { id: "figurine", name: "Фигурка из мастики", emoji: "🧸", priceAdd: 900 },
  { id: "number", name: "Цифра-топпер", emoji: "🔢", priceAdd: 400 },
  { id: "candles", name: "Свечи", emoji: "🕯️", priceAdd: 150 },
  { id: "acrylic-topper", name: "Акриловый топпер", emoji: "🪄", priceAdd: 350 },
  { id: "sparkler", name: "Бенгальские огни", emoji: "🎆", priceAdd: 200 },
];

export const INSCRIPTION_PRICE = 250;

export const DECOR_OPTIONS: DecorOption[] = [
  {
    id: "minimal",
    name: "Свадебный многоярусный",
    imageUrl: "/cakes/decor-1.jpg",
    priceAdd: 0,
  },
  {
    id: "flowers",
    name: "Кремовый слоёный",
    imageUrl: "/cakes/decor-2.jpg",
    priceAdd: 800,
  },
  {
    id: "berries",
    name: "Цветочный в горшке",
    imageUrl: "/cakes/decor-3.jpg",
    priceAdd: 600,
  },
  {
    id: "kids-theme",
    name: "Торт «Опера»",
    imageUrl: "/cakes/decor-4.jpg",
    priceAdd: 900,
  },
  {
    id: "elegant",
    name: "С розами и бабочками",
    imageUrl: "/cakes/decor-5.jpg",
    priceAdd: 700,
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: "Свадебный торт с вафельными лепестками",
    imageUrl: "/cakes/portfolio-1.jpg",
    cakeType: "wedding",
    occasion: "wedding",
    weightKg: 4,
    filling: "Ванильный бисквит",
    cream: "Крем-чиз",
    approximatePrice: 12000,
    description:
      "Двухъярусный свадебный торт в молочных тонах с воздушными вафельными лепестками, золотой поталью и рваными краями.",
  },
  {
    id: 2,
    title: "Шоколадный гато",
    imageUrl: "/cakes/portfolio-2.jpg",
    cakeType: "birthday",
    occasion: "birthday",
    weightKg: 2.5,
    filling: "Шоколадный бисквит",
    cream: "Ганаш",
    approximatePrice: 6800,
    description:
      "Классический шоколадный гато с глянцевой глазурью и аккуратной подачей — уровень кондитерской.",
  },
  {
    id: 3,
    title: "Кремовый слоёный торт",
    imageUrl: "/cakes/portfolio-3.jpg",
    cakeType: "birthday",
    occasion: "birthday",
    weightKg: 2,
    filling: "Ванильный бисквит",
    cream: "Сливочный крем",
    approximatePrice: 5500,
    description:
      "Нежный многослойный торт с ровным кремовым покрытием и чистыми срезами.",
  },
  {
    id: 4,
    title: "Торт «Опера»",
    imageUrl: "/cakes/portfolio-4.jpg",
    cakeType: "other",
    occasion: "other",
    weightKg: 1.5,
    filling: "Миндальный бисквит",
    cream: "Кофейный крем",
    approximatePrice: 6200,
    description:
      "Французская классика: слои бисквита, кофейного крема и ганаша с золотой надписью Opera.",
  },
  {
    id: 5,
    title: "Чизкейк Нью-Йорк",
    imageUrl: "/cakes/portfolio-5.jpg",
    cakeType: "other",
    occasion: "other",
    weightKg: 1.5,
    filling: "Сырная начинка",
    cream: "Крем-чиз",
    approximatePrice: 4500,
    description:
      "Плотный чизкейк с ровной поверхностью и идеальным срезом — фирменная подача.",
  },
  {
    id: 6,
    title: "Шоколадный торт с глазурью",
    imageUrl: "/cakes/portfolio-6.jpg",
    cakeType: "birthday",
    occasion: "birthday",
    weightKg: 3,
    filling: "Шоколадный бисквит",
    cream: "Ганаш",
    approximatePrice: 7500,
    description:
      "Насыщенный шоколадный торт с зеркальной глазурью и декором из шоколада.",
  },
  {
    id: 7,
    title: "Торт «Чёрный лес»",
    imageUrl: "/cakes/portfolio-7.jpg",
    cakeType: "birthday",
    occasion: "birthday",
    weightKg: 2.5,
    filling: "Шоколадный бисквит",
    cream: "Взбитые сливки",
    approximatePrice: 6200,
    description:
      "Классический Schwarzwälder Kirschtorte с вишней, шоколадной стружкой и сливками.",
  },
  {
    id: 8,
    title: "Торт-кашпо с цветами",
    imageUrl: "/cakes/portfolio-8.jpg",
    cakeType: "other",
    occasion: "other",
    weightKg: 2,
    filling: "Ванильный бисквит",
    cream: "Мастика",
    approximatePrice: 8500,
    description:
      "Авторский торт в виде цветочного горшка с реалистичными сахарными цветами.",
  },
  {
    id: 9,
    title: "Захерторте",
    imageUrl: "/cakes/portfolio-9.jpg",
    cakeType: "other",
    occasion: "other",
    weightKg: 1.5,
    filling: "Шоколадный бисквит",
    cream: "Абрикосовый джем",
    approximatePrice: 5800,
    description:
      "Венский классический торт Sachertorte с глазурью и взбитыми сливками.",
  },
  {
    id: 10,
    title: "Осенняя композиция из мастики",
    imageUrl: "/cakes/portfolio-10.jpg",
    cakeType: "kids",
    occasion: "kids",
    weightKg: 2.5,
    filling: "Ванильный бисквит",
    cream: "Мастика",
    approximatePrice: 7200,
    description:
      "Торт с осенним декором: листья, ягоды и фигурки из сахарной мастики.",
  },
  {
    id: 11,
    title: "Детский торт с мишкой",
    imageUrl: "/cakes/portfolio-11.jpg",
    cakeType: "kids",
    occasion: "kids",
    weightKg: 2,
    filling: "Ванильный бисквит",
    cream: "Мастика",
    approximatePrice: 6500,
    description:
      "Нежный детский торт с фигуркой мишки из мастики и аккуратным кремовым декором.",
  },
  {
    id: 12,
    title: "Сен-Оноре",
    imageUrl: "/cakes/portfolio-12.jpg",
    cakeType: "other",
    occasion: "other",
    weightKg: 1.5,
    filling: "Заварное тесто",
    cream: "Крем Шантильи",
    approximatePrice: 4800,
    description:
      "Французский десерт Saint Honoré: профитроли, карамель и ванильный крем.",
  },
  {
    id: 14,
    title: "Муссовый торт",
    imageUrl: "/cakes/portfolio-14.jpg",
    cakeType: "birthday",
    occasion: "birthday",
    weightKg: 1.5,
    filling: "Мусс",
    cream: "Шоколадный мусс",
    approximatePrice: 5200,
    description:
      "Воздушный муссовый торт с гладким покрытием и декором из ягод.",
  },
  {
    id: 15,
    title: "Тирамису",
    imageUrl: "/cakes/portfolio-15.jpg",
    cakeType: "other",
    occasion: "other",
    weightKg: 1.2,
    filling: "Савоярди",
    cream: "Маскарпоне",
    approximatePrice: 3800,
    description:
      "Классический итальянский тирамису с маскарпоне, кофе и какао-пудрой.",
  },
  {
    id: 16,
    title: "Зеркальная глазурь",
    imageUrl: "/cakes/portfolio-16.jpg",
    cakeType: "birthday",
    occasion: "birthday",
    weightKg: 2,
    filling: "Шоколадный бисквит",
    cream: "Ганаш",
    approximatePrice: 6500,
    description:
      "Шоколадный торт с идеальной зеркальной глазурью — фирменная техника кондитера.",
  },
];

export const READY_CAKES: ReadyCake[] = [
  {
    id: 1,
    title: "Захерторте",
    imageUrl: "/cakes/ready-1.jpg",
    description:
      "Венский шоколадный торт с абрикосовым джемом и глазурью. 1.2 кг.",
    price: 3800,
  },
  {
    id: 2,
    title: "Муссовый торт",
    imageUrl: "/cakes/ready-2.jpg",
    description:
      "Нежный муссовый торт с ягодным декором. 1.2 кг.",
    price: 3400,
  },
  {
    id: 3,
    title: "Тирамису",
    imageUrl: "/cakes/ready-3.jpg",
    description: "Классический тирамису с маскарпоне и какао. 1 кг.",
    price: 2800,
  },
  {
    id: 4,
    title: "Шоколадный гато",
    imageUrl: "/cakes/ready-4.jpg",
    description:
      "Шоколадный торт с глянцевой глазурью. 1.5 кг.",
    price: 3200,
  },
  {
    id: 5,
    title: "Шоколадный торт премиум",
    imageUrl: "/cakes/ready-5.jpg",
    description: "Насыщенный шоколадный торт с декором. 1.5 кг.",
    price: 3500,
  },
  {
    id: 6,
    title: "Тирамису в форме",
    imageUrl: "/cakes/ready-6.jpg",
    description:
      "Тирамису в круглой форме — идеален для небольшой компании. 1.3 кг.",
    price: 2900,
  },
];

export function getPortfolioItem(id: number): PortfolioItem | undefined {
  return PORTFOLIO_ITEMS.find((item) => item.id === id);
}
