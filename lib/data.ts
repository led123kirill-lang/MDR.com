// Данные перенесены 1:1 из прототипа `MDR Drones.html`
// (секция `<script type="text/x-dc">`, константы MODELS / CASES / FAQ / SUPPORT).

export type Spec = {
  label: string;
  value: string;
  unit: string;
  note: string;
};

export type Option = {
  id: string;
  name: string;
  note: string;
  /** Надбавка к базовой цене, ₽. Первая опция группы всегда 0 — она же дефолт. */
  delta: number;
};

export type Group = {
  key: string;
  label: string;
  hint: string;
  options: Option[];
};

export type Model = {
  id: string;
  name: string;
  short: string;
  titleA: string;
  titleB: string;
  kicker: string;
  tagline: string;
  base: number;
  price: string;
  lead: string;
  tag: string;
  desc: string;
  use: string;
  kit: string;
  specs: Spec[];
  groups: Group[];
};

export const MODELS: Model[] = [
  {
    id: 'heavy',
    name: 'MDR HEAVY',
    short: 'MDR Heavy',
    titleA: 'MDR',
    titleB: 'HEAVY',
    kicker: 'Гексакоптер · промышленная серия',
    tagline: 'Тяжёлая платформа для нагрузки до 9 кг',
    base: 2480000,
    price: '2 480 000 ₽',
    lead: 'отгрузка 8 недель',
    tag: 'Индустрия',
    desc: 'Шесть двигателей, резервирование питания и подвес под сменные камеры и сканеры.',
    use: 'Геодезия, LiDAR-съёмка, инспекция ЛЭП и промышленных объектов в любую погоду.',
    kit: 'Аппарат, 2 АКБ, гимбал 3-осевой, пульт с экраном 7", кейс.',
    specs: [
      { label: 'Полётное время', value: '52', unit: 'мин', note: 'с нагрузкой 4 кг' },
      { label: 'Дальность', value: '15', unit: 'км', note: 'канал с шифрованием AES' },
      { label: 'Макс. скорость', value: '68', unit: 'км/ч', note: 'ветер до 15 м/с' },
      { label: 'Нагрузка', value: '9', unit: 'кг', note: 'сменные подвесы' },
    ],
    groups: [
      {
        key: 'payload',
        label: 'Полезная нагрузка',
        hint: 'один подвес в комплекте',
        options: [
          { id: 'cam45', name: 'Камера 45 Мп', note: 'механический затвор, RTK-метки', delta: 0 },
          { id: 'lidar', name: 'LiDAR-сканер', note: 'плотность 240 точек/м²', delta: 890000 },
          { id: 'thermal', name: 'Термо + оптика', note: '640×512, 30-кратный зум', delta: 520000 },
        ],
      },
      {
        key: 'battery',
        label: 'Энергия',
        hint: 'резервирование питания',
        options: [
          { id: 'std', name: '2 × 16 000 мА·ч', note: 'базовый комплект', delta: 0 },
          { id: 'ext', name: '4 × 16 000 мА·ч', note: '+2 АКБ и зарядный хаб', delta: 210000 },
          { id: 'tether', name: 'Кабель-питание', note: 'непрерывная работа на точке', delta: 470000 },
        ],
      },
      {
        key: 'service',
        label: 'Сервис',
        hint: 'обслуживание и обучение',
        options: [
          { id: 'base', name: 'Гарантия 12 мес', note: 'диагностика в сервисе', delta: 0 },
          { id: 'plus', name: 'Гарантия 24 мес', note: 'подменный аппарат', delta: 180000 },
          { id: 'crew', name: 'Обучение экипажа', note: '5 дней, 2 оператора', delta: 145000 },
        ],
      },
    ],
  },
  {
    id: 'light',
    name: 'MDR ULTRA LIGHT',
    short: 'MDR Ultra Light',
    titleA: 'MDR ULTRA',
    titleB: 'LIGHT',
    kicker: 'Складной квадрокоптер · 1,4 кг',
    tagline: 'Быстрее, легче, эффективнее',
    base: 640000,
    price: '640 000 ₽',
    lead: 'отгрузка 2 недели',
    tag: 'Мобильность',
    desc: 'Складные лучи, вес 1,4 кг и запуск за 40 секунд из рюкзака.',
    use: 'Оперативная съёмка, картография небольших участков, работа в городе.',
    kit: 'Аппарат, 3 АКБ, гимбал 20 Мп, пульт, рюкзак.',
    specs: [
      { label: 'Полётное время', value: '38', unit: 'мин', note: 'без ветра, 1 АКБ' },
      { label: 'Дальность', value: '8', unit: 'км', note: 'уверенный канал' },
      { label: 'Макс. скорость', value: '74', unit: 'км/ч', note: 'спортивный режим' },
      { label: 'Вес', value: '1,4', unit: 'кг', note: 'со сложенными лучами' },
    ],
    groups: [
      {
        key: 'payload',
        label: 'Камера',
        hint: 'подвес несъёмный',
        options: [
          { id: 'c20', name: '20 Мп / 4K60', note: 'базовая оптика', delta: 0 },
          { id: 'c50', name: '50 Мп / 6K', note: 'матрица 1", D-Log', delta: 165000 },
          { id: 'ct', name: '20 Мп + термо', note: '256×192, наложение', delta: 240000 },
        ],
      },
      {
        key: 'battery',
        label: 'Комплект АКБ',
        hint: 'быстрая зарядка',
        options: [
          { id: 'b3', name: '3 аккумулятора', note: 'базовый комплект', delta: 0 },
          { id: 'b6', name: '6 аккумуляторов', note: 'смена без паузы', delta: 96000 },
          { id: 'car', name: '6 АКБ + авто-хаб', note: 'зарядка в машине', delta: 138000 },
        ],
      },
      {
        key: 'service',
        label: 'Дополнительно',
        hint: 'транспорт и связь',
        options: [
          { id: 'pack', name: 'Рюкзак', note: 'в базовом комплекте', delta: 0 },
          { id: 'case', name: 'Жёсткий кейс IP67', note: 'для перелётов', delta: 42000 },
          { id: 'relay', name: 'Ретранслятор связи', note: 'канал до 12 км', delta: 118000 },
        ],
      },
    ],
  },
  {
    id: 'fast',
    name: 'MDR SUPERFAST',
    short: 'MDR Superfast',
    titleA: 'MDR',
    titleB: 'SUPERFAST',
    kicker: 'VTOL самолётного типа · дальний радиус',
    tagline: 'Вертикальный старт, крыло для дальних маршрутов',
    base: 3150000,
    price: '3 150 000 ₽',
    lead: 'отгрузка 10 недель',
    tag: 'Дальний радиус',
    desc: 'Гибрид: вертикальный старт на четырёх роторах, крейсер на крыле.',
    use: 'Мониторинг трубопроводов, лесных массивов и границ на дистанции до 180 км.',
    kit: 'Аппарат, 2 крыла, наземная станция, антенна-трекер, транспортный кейс.',
    specs: [
      { label: 'Полётное время', value: '2,4', unit: 'ч', note: 'крейсерский режим' },
      { label: 'Дальность', value: '180', unit: 'км', note: 'с ретранслятором' },
      { label: 'Макс. скорость', value: '145', unit: 'км/ч', note: 'на крыле' },
      { label: 'Нагрузка', value: '3', unit: 'кг', note: 'отсек в фюзеляже' },
    ],
    groups: [
      {
        key: 'payload',
        label: 'Отсек нагрузки',
        hint: 'быстросменный модуль',
        options: [
          { id: 'survey', name: 'Картография', note: '61 Мп, RTK/PPK', delta: 0 },
          { id: 'patrol', name: 'Патрульный модуль', note: 'термо + 30× оптика', delta: 610000 },
          { id: 'gas', name: 'Газоанализатор', note: 'метан, утечки на трассе', delta: 780000 },
        ],
      },
      {
        key: 'battery',
        label: 'Силовая установка',
        hint: 'влияет на радиус',
        options: [
          { id: 'elec', name: 'Электро', note: '2,4 часа полёта', delta: 0 },
          { id: 'hyb', name: 'Гибрид', note: 'до 5,5 часа полёта', delta: 940000 },
        ],
      },
      {
        key: 'service',
        label: 'Земля и связь',
        hint: 'наземный сегмент',
        options: [
          { id: 'gcs', name: 'Станция управления', note: 'в базовом комплекте', delta: 0 },
          { id: 'track', name: 'Антенна-трекер', note: 'радиус до 180 км', delta: 260000 },
          { id: 'sat', name: 'Спутниковый канал', note: 'работа вне радиогоризонта', delta: 520000 },
        ],
      },
    ],
  },
];

export type Case = {
  sector: string;
  title: string;
  body: string;
  metric: string;
  metricNote: string;
  model: string;
};

export const CASES: Case[] = [
  {
    sector: 'Энергетика',
    title: 'Инспекция 640 км ЛЭП',
    body: 'Два экипажа заменили вертолётный облёт: съёмка опор с термоканалом и автоматическим маршрутом.',
    metric: '−68%',
    metricNote: 'стоимость облёта',
    model: 'MDR Heavy',
  },
  {
    sector: 'Геодезия',
    title: 'Съёмка карьера раз в неделю',
    body: 'Регулярные замеры объёмов вскрыши с RTK-привязкой, отчёт готов в день вылета.',
    metric: '3 см',
    metricNote: 'точность по высоте',
    model: 'MDR Heavy',
  },
  {
    sector: 'Строительство',
    title: 'Контроль стройплощадки',
    body: 'Ежедневный облёт площадки одним оператором из рюкзака, без остановки работ.',
    metric: '40 сек',
    metricNote: 'от рюкзака до взлёта',
    model: 'MDR Ultra Light',
  },
  {
    sector: 'Трубопроводы',
    title: 'Патруль трассы 180 км',
    body: 'Один вылет вместо трёх: вертикальный старт с площадки, крейсер на крыле, газоанализ на борту.',
    metric: '1 вылет',
    metricNote: 'на участок в день',
    model: 'MDR Superfast',
  },
];

export type FaqItem = { q: string; a: string };

export const FAQ: FaqItem[] = [
  {
    q: 'Нужна ли регистрация аппарата?',
    a: 'Да, аппараты тяжелее 150 г регистрируются в реестре БАС. Мы готовим документы к отгрузке и помогаем с постановкой на учёт.',
  },
  {
    q: 'Можно ли поставить свою камеру?',
    a: 'На MDR Heavy и Superfast — да, подвес и отсек рассчитаны под сторонние модули. Мы согласуем крепление и питание на этапе расчёта.',
  },
  {
    q: 'Как быстро приедет сервис?',
    a: 'Диагностика по видеосвязи в день обращения. Ремонт в сервисе — 5 рабочих дней, с расширенной гарантией выдаём подменный аппарат.',
  },
  {
    q: 'Обучаете операторов?',
    a: 'Да, курс 5 дней на вашей площадке: предполётные процедуры, планирование маршрутов, действия при отказах, обработка данных.',
  },
  {
    q: 'Работают ли аппараты в мороз?',
    a: 'Диапазон −25…+50 °C. Для зимних работ поставляем подогрев аккумуляторов и рекомендуем сокращать полётное время на 20%.',
  },
];

export type SupportItem = { n: string; title: string; body: string };

export const SUPPORT: SupportItem[] = [
  {
    n: '01',
    title: 'Ввод в эксплуатацию',
    body: 'Инженер настраивает аппарат под ваш регламент и проводит первый вылет вместе с экипажем.',
  },
  {
    n: '02',
    title: 'Плановое обслуживание',
    body: 'Каждые 100 часов: диагностика, замена расходников, калибровка камеры и компаса.',
  },
  {
    n: '03',
    title: 'Запас деталей',
    body: 'Лучи, винты, моторы и аккумуляторы на складе в Москве — отправка в день заказа.',
  },
];

export type Fact = { n: string; t: string };

export const FACTS: Fact[] = [
  { n: '2016', t: 'год основания' },
  { n: '340+', t: 'аппаратов в эксплуатации' },
  { n: '40 ч', t: 'испытаний до отгрузки' },
  { n: '24/7', t: 'инженерная поддержка' },
];
