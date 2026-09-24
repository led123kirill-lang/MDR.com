'use client';

// Единое состояние лендинга — прямой перенос `class Component extends DCLogic`
// из прототипа. Один провайдер вместо prop drilling по 11 компонентам.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { MODELS, type Model } from './data';
import { fmt, maskName, maskPhone, nameIsValid } from './format';

export type Config = Record<string, string>;

/** Дефолтная сборка модели — первая опция каждой группы (у неё delta === 0). */
function defaultsFor(i: number): Config {
  const c: Config = {};
  MODELS[i].groups.forEach((g) => {
    c[g.key] = g.options[0].id;
  });
  return c;
}

/** Ширина, ниже которой шапка сворачивается в бургер (как в прототипе — 860px). */
const NARROW_MQ = '(max-width: 859px)';
/** Высота фиксированной шапки — компенсация при скролле к якорю. */
const HEADER_OFFSET = 76;

type SiteValue = {
  // ── модель ──
  i: number;
  model: Model;
  animKey: string;
  pick: (n: number) => void;
  stepModel: (d: number) => void;
  scrollTo: (id: string) => void;
  navTo: (id: string) => (e: React.MouseEvent) => void;
  menuNavTo: (id: string) => (e: React.MouseEvent) => void;

  // ── герой ──
  hot: boolean;
  toggleHot: () => void;

  // ── навигация ──
  narrow: boolean;
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;

  // ── конфигуратор ──
  config: Config;
  setOption: (groupKey: string, optionId: string) => void;
  resetConfig: () => void;
  total: number;
  summary: { label: string; value: string }[];

  // ── FAQ ──
  faqOpen: number;
  toggleFaq: (n: number) => void;

  // ── модалка заявки ──
  orderOpen: boolean;
  openOrder: () => void;
  closeOrder: () => void;
  step: 1 | 2;
  sent: boolean;
  err: string;
  qty: number;
  incQty: () => void;
  decQty: () => void;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  toStep1: () => void;
  toStep2: () => void;
  submit: () => void;
  borderFor: (ok: boolean) => string;
  nameOk: boolean;
  phoneOk: boolean;
  emailOk: boolean;
  totalPrice: string;
  formHint: string;
  hintColor: string;
  sentNote: string;
};

const SiteContext = createContext<SiteValue | null>(null);

export function useSite(): SiteValue {
  const v = useContext(SiteContext);
  if (!v) throw new Error('useSite must be used inside <SiteProvider>');
  return v;
}

export function SiteProvider({
  children,
  defaultModel = 'light',
}: {
  children: ReactNode;
  defaultModel?: string;
}) {
  const found = MODELS.findIndex((m) => m.id === defaultModel);
  const startIndex = found < 0 ? 1 : found;

  const [i, setI] = useState(startIndex);
  const [config, setConfig] = useState<Config>(() => defaultsFor(startIndex));
  const [hot, setHot] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Брейкпоинт шапки. На сервере ширины нет, поэтому серверный снимок —
  // всегда десктопная раскладка; клиент уточняет её при гидратации.
  const narrow = useSyncExternalStore(
    useCallback((onChange: () => void) => {
      const mq = window.matchMedia(NARROW_MQ);
      const handle = () => {
        setMenuOpen(false); // при смене раскладки бургер-меню закрываем
        onChange();
      };
      mq.addEventListener('change', handle);
      return () => mq.removeEventListener('change', handle);
    }, []),
    () => window.matchMedia(NARROW_MQ).matches,
    () => false,
  );

  const [orderOpen, setOrderOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [sent, setSent] = useState(false);
  const [qty, setQty] = useState(1);
  const [name, setNameRaw] = useState('');
  const [phone, setPhoneRaw] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');

  const model = MODELS[i];

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
        behavior: 'smooth',
      });
    }
  }, []);

  // Смена модели всегда сбрасывает сборку на дефолтную — опции у моделей разные.
  const pick = useCallback(
    (n: number) => {
      if (n === i) return;
      setI(n);
      setConfig(defaultsFor(n));
    },
    [i],
  );

  const stepModel = useCallback(
    (d: number) => {
      const n = (i + d + MODELS.length) % MODELS.length;
      setI(n);
      setConfig(defaultsFor(n));
    },
    [i],
  );

  const navTo = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      scrollTo(id);
    },
    [scrollTo],
  );

  const menuNavTo = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      setMenuOpen(false);
      // Ждём закрытия оверлея, иначе скролл считает позицию под ним.
      setTimeout(() => scrollTo(id), 40);
    },
    [scrollTo],
  );

  const setOption = useCallback((groupKey: string, optionId: string) => {
    setConfig((c) => ({ ...c, [groupKey]: optionId }));
  }, []);

  const resetConfig = useCallback(() => setConfig(defaultsFor(i)), [i]);

  const total = useMemo(() => {
    let sum = model.base;
    model.groups.forEach((g) => {
      const o = g.options.find((x) => x.id === config[g.key]);
      if (o) sum += o.delta;
    });
    return sum;
  }, [model, config]);

  const summary = useMemo(
    () =>
      model.groups.map((g) => {
        const o = g.options.find((x) => x.id === config[g.key]) || g.options[0];
        return { label: g.label, value: o.name };
      }),
    [model, config],
  );

  // Цифры и символы отсеиваются на вводе — в поле они просто не появляются.
  const setName = useCallback((v: string) => {
    setNameRaw(maskName(v));
  }, []);

  const setPhone = useCallback((v: string) => {
    setPhoneRaw((prev) => maskPhone(v, prev));
  }, []);

  const nameOk = nameIsValid(name);
  const phoneOk = phone.replace(/\D/g, '').length === 11;
  const emailOk = /.+@.+\..+/.test(email.trim());

  const borderFor = useCallback(
    (ok: boolean) => (err && !ok ? '#ff6a5a' : 'rgba(255,255,255,.14)'),
    [err],
  );

  const openOrder = useCallback(() => {
    setOrderOpen(true);
    setSent(false);
    setStep(1);
    setErr('');
  }, []);
  const closeOrder = useCallback(() => setOrderOpen(false), []);

  const toStep1 = useCallback(() => {
    setStep(1);
    setErr('');
  }, []);

  const toStep2 = useCallback(() => {
    if (!nameOk) return setErr('Укажите имя и фамилию.');
    if (!phoneOk) return setErr('Телефон в формате +7 (999) 123-45-67.');
    if (!emailOk) return setErr('Проверьте e-mail для коммерческого предложения.');
    setStep(2);
    setErr('');
  }, [nameOk, phoneOk, emailOk]);

  // TODO: здесь будет POST в /api/leads (Supabase `leads` + уведомление в Telegram).
  // В прототипе отправка была заглушкой — поведение сохранено один в один.
  const submit = useCallback(() => {
    setSent(true);
    setErr('');
  }, []);

  // ── Esc закрывает модалку, стрелки листают модели ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOrderOpen(false);
      if (orderOpen) return;
      if (e.key === 'ArrowRight') stepModel(1);
      if (e.key === 'ArrowLeft') stepModel(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [orderOpen, stepModel]);

  // ── Появление блоков при скролле (data-reveal), как в прототипе ──
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    nodes.forEach((n) => {
      n.style.opacity = '0';
      n.style.transform = 'translateY(22px)';
      n.style.transition =
        'opacity .7s cubic-bezier(.16,.84,.3,1), transform .7s cubic-bezier(.16,.84,.3,1)';
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.intersectionRatio > 0.08) {
            (en.target as HTMLElement).style.opacity = '1';
            (en.target as HTMLElement).style.transform = 'none';
            io.unobserve(en.target);
          }
        });
      },
      { threshold: [0, 0.08, 0.3], rootMargin: '0px 0px -8% 0px' },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const value: SiteValue = {
    i,
    model,
    animKey: 'm' + i,
    pick,
    stepModel,
    scrollTo,
    navTo,
    menuNavTo,

    hot,
    toggleHot: () => setHot((h) => !h),

    narrow,
    menuOpen,
    toggleMenu: () => setMenuOpen((m) => !m),
    closeMenu: () => setMenuOpen(false),

    config,
    setOption,
    resetConfig,
    total,
    summary,

    faqOpen,
    toggleFaq: (n: number) => setFaqOpen((cur) => (cur === n ? -1 : n)),

    orderOpen,
    openOrder,
    closeOrder,
    step,
    sent,
    err,
    qty,
    incQty: () => setQty((q) => Math.min(50, q + 1)),
    decQty: () => setQty((q) => Math.max(1, q - 1)),
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    company,
    setCompany,
    note,
    setNote,
    toStep1,
    toStep2,
    submit,
    borderFor,
    nameOk,
    phoneOk,
    emailOk,
    totalPrice: fmt(total * qty),
    formHint:
      err ||
      (step === 1
        ? 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных.'
        : 'Расчёт предварительный: финальная смета — после разговора с инженером.'),
    hintColor: err ? '#ff6a5a' : '#7f8899',
    sentNote:
      'Инженер свяжется по конфигурации ' +
      model.name +
      ' в течение рабочего дня. Сумма расчёта: ' +
      fmt(total * qty) +
      '.',
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
