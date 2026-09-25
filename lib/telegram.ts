import 'server-only';

import { MODELS } from './data';
import { fmt, maskPhone } from './format';
import type { LeadInput } from './lead-schema';

// Уведомления о заявках в Telegram. `server-only`: токен бота не должен
// попасть в клиентский бандл.

const API = 'https://api.telegram.org';
/** Telegram иногда отвечает долго — не держим функцию дольше этого. */
const TIMEOUT_MS = 5000;
/** Полный комментарий лежит в базе; в сообщении хватит начала (лимит Telegram — 4096). */
const NOTE_MAX = 1000;

// parse_mode HTML: экранировать нужно только & < >, это проще и надёжнее MarkdownV2.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const orDash = (s?: string | null) => (s && s.trim() ? esc(s.trim()) : '—');

/**
 * В заявке конфигурация хранится id опций ({ payload: 'c50' }) — для человека
 * переводим её в подписи из каталога: «Камера: 50 Мп / 6K».
 */
function configLines(lead: LeadInput): string[] {
  const cfg = lead.config ?? {};
  const model = MODELS.find((m) => m.id === lead.model_id);
  if (!model) {
    return Object.entries(cfg).map(([k, v]) => `• ${esc(k)}: ${esc(v)}`);
  }
  return model.groups
    .filter((g) => cfg[g.key])
    .map((g) => {
      const opt = g.options.find((o) => o.id === cfg[g.key]);
      return `• ${esc(g.label)}: ${esc(opt?.name ?? cfg[g.key])}`;
    });
}

export function formatLeadMessage(lead: LeadInput, id: string): string {
  const note = lead.note?.trim();
  const noteShort = note && note.length > NOTE_MAX ? note.slice(0, NOTE_MAX) + '…' : note;
  const cfg = configLines(lead);

  return [
    `🛩 <b>Новая заявка</b> · ${orDash(lead.model_name)}`,
    '',
    `<b>Имя:</b> ${esc(lead.name)}`,
    `<b>Телефон:</b> ${esc(maskPhone(lead.phone, ''))}`,
    `<b>Email:</b> ${esc(lead.email)}`,
    `<b>Компания:</b> ${orDash(lead.company)}`,
    '',
    `<b>Модель:</b> ${orDash(lead.model_name)}`,
    `<b>Конфигурация:</b>${cfg.length ? '\n' + cfg.join('\n') : ' —'}`,
    `<b>Количество:</b> ${lead.qty ?? 1}`,
    `<b>Итого:</b> ${lead.total_price != null ? fmt(lead.total_price) : '—'}`,
    '',
    `<b>Комментарий:</b> ${orDash(noteShort)}`,
    '',
    `<code>${esc(id)}</code>`,
  ].join('\n');
}

/**
 * Отправляет уведомление о заявке. Никогда не бросает: заявка к этому моменту
 * уже в базе, и сбой Telegram не должен превращать успех в ошибку — только лог.
 */
export async function notifyTelegram(lead: LeadInput, id: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('[telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы — уведомление пропущено', { leadId: id });
    return false;
  }

  try {
    const res = await fetch(`${API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatLeadMessage(lead, id),
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; description?: string; result?: { message_id?: number } }
      | null;

    if (!res.ok || !data?.ok) {
      console.error(`[telegram] sendMessage отклонён: HTTP ${res.status} — ${data?.description ?? 'без описания'}`, { leadId: id });
      return false;
    }

    console.info('[telegram] уведомление отправлено', { leadId: id, messageId: data.result?.message_id });
    return true;
  } catch (e) {
    // Логируем только имя и сообщение ошибки: токен сидит в URL запроса,
    // и выводить сам объект ошибки целиком рискованно.
    const err = e as { name?: string; message?: string; cause?: { code?: string } };
    console.error(`[telegram] сбой отправки: ${err?.name ?? 'Error'}: ${err?.message ?? e}${err?.cause?.code ? ` (${err.cause.code})` : ''}`, { leadId: id });
    return false;
  }
}
