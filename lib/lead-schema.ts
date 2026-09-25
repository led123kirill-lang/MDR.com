// Правила валидации заявки. Живут отдельно от React, потому что их применяют
// обе стороны: браузер (мгновенная подсказка) и маршрут /api/order (последнее
// слово — клиенту доверять нельзя, POST можно отправить и в обход формы).

import { nameIsValid } from './format';

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  company?: string;
  note?: string;
  model_id?: string;
  model_name?: string;
  config?: Record<string, string>;
  qty?: number;
  total_price?: number;
};

/**
 * Скрытое поле-ловушка (honeypot). Человек его не видит и до него не дотянется
 * с клавиатуры, а боты-автозаполнители заполняют все поля подряд.
 */
export const HONEYPOT_FIELD = 'website';

/** Ловушка заполнена — заявку прислал бот. */
export function honeypotTripped(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return false;
  const v = (raw as Record<string, unknown>)[HONEYPOT_FIELD];
  return v != null && String(v).trim() !== '';
}

/** Телефон считается валидным по 11 цифрам, начинающимся с 7 — как их даёт maskPhone. */
export function phoneIsValid(raw: string): boolean {
  const d = String(raw ?? '').replace(/\D/g, '');
  return d.length === 11 && d.startsWith('7');
}

export function emailIsValid(raw: string): boolean {
  const v = String(raw ?? '').trim();
  // Без экзотики: непустые части, одна @, точка в домене, без пробелов.
  return v.length <= 320 && /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v);
}

/** Телефон в канонический вид `+7XXXXXXXXXX` — в базе удобнее хранить без маски. */
export function normalizePhone(raw: string): string {
  return '+' + String(raw ?? '').replace(/\D/g, '');
}

export type Validated = {
  ok: boolean;
  error?: string;
  /** Поле, на котором споткнулись — пригодится, если захотим подсветить конкретный инпут. */
  field?: 'name' | 'phone' | 'email' | 'qty';
  value?: Required<Pick<LeadInput, 'name' | 'phone' | 'email'>> & LeadInput;
};

const MAX = { name: 120, company: 200, note: 2000, model: 80 } as const;

const trim = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

/**
 * Единственный источник правды по валидности заявки.
 * Возвращает уже обрезанные и нормализованные значения — то, что пойдёт в базу.
 */
export function validateLead(raw: unknown): Validated {
  const b = (raw ?? {}) as Record<string, unknown>;

  const name = trim(b.name, MAX.name);
  if (name.length < 2 || !nameIsValid(name)) {
    return { ok: false, field: 'name', error: 'Укажите имя и фамилию.' };
  }

  if (!phoneIsValid(String(b.phone ?? ''))) {
    return { ok: false, field: 'phone', error: 'Телефон в формате +7 (999) 123-45-67.' };
  }

  const email = trim(b.email, 320);
  if (!emailIsValid(email)) {
    return { ok: false, field: 'email', error: 'Проверьте e-mail для коммерческого предложения.' };
  }

  // Количество: то же окно 1..50, что у счётчика в модалке.
  const qtyNum = Number(b.qty);
  const qty = Number.isFinite(qtyNum) ? Math.min(50, Math.max(1, Math.trunc(qtyNum))) : 1;

  const priceNum = Number(b.total_price);
  const total_price = Number.isFinite(priceNum) && priceNum >= 0 ? priceNum : null;

  // config берём только как плоскую карту строк — чужие вложенные структуры в jsonb не пускаем.
  const config: Record<string, string> = {};
  if (b.config && typeof b.config === 'object' && !Array.isArray(b.config)) {
    for (const [k, v] of Object.entries(b.config as Record<string, unknown>)) {
      if (typeof v === 'string' && k.length <= 40) config[k.slice(0, 40)] = v.slice(0, 80);
    }
  }

  return {
    ok: true,
    value: {
      name,
      phone: normalizePhone(String(b.phone ?? '')),
      email: email.toLowerCase(),
      company: trim(b.company, MAX.company) || undefined,
      note: trim(b.note, MAX.note) || undefined,
      model_id: trim(b.model_id, MAX.model) || undefined,
      model_name: trim(b.model_name, MAX.model) || undefined,
      config,
      qty,
      total_price: total_price ?? undefined,
    },
  };
}
