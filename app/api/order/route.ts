import { randomUUID } from 'node:crypto';
import { after, NextResponse } from 'next/server';
import { honeypotTripped, validateLead } from '@/lib/lead-schema';
import { clientIp, hashIp, isRateLimited, RATE_LIMIT } from '@/lib/rate-limit';
import { getServiceClient } from '@/lib/supabase-server';
import { notifyTelegram } from '@/lib/telegram';

// Заявка пишется в БД на каждый запрос — кешировать нечего.
export const dynamic = 'force-dynamic';

type Ok = { ok: true; id: string };
type Fail = { ok: false; error: string; field?: string };

const fail = (error: string, status: number, field?: string, headers?: HeadersInit) =>
  NextResponse.json<Fail>({ ok: false, error, ...(field ? { field } : {}) }, { status, headers });

export async function POST(request: Request): Promise<NextResponse<Ok | Fail>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail('Некорректный запрос.', 400);
  }

  // Honeypot — первым и молча. Боту отвечаем обычным «успехом» с фиктивным id:
  // по ответу не должно быть видно, что заявку отбросили. В базу и в Telegram
  // ничего не уходит.
  if (honeypotTripped(body)) {
    console.warn('[api/order] honeypot заполнен — заявка отброшена');
    return NextResponse.json<Ok>({ ok: true, id: randomUUID() });
  }

  // Валидация повторяется на сервере намеренно: клиентские проверки —
  // это подсказка пользователю, а не защита. POST может прийти и мимо формы.
  const checked = validateLead(body);
  if (!checked.ok || !checked.value) {
    return fail(checked.error ?? 'Проверьте заполнение формы.', 400, checked.field);
  }

  const lead = checked.value;

  let supabase;
  try {
    supabase = getServiceClient();
  } catch (e) {
    // Не отдаём наружу текст про переменные окружения — это деталь инфраструктуры.
    console.error('[api/order] конфигурация Supabase:', e);
    return fail('Сервис приёма заявок временно недоступен.', 503);
  }

  // Ограничение частоты: не больше RATE_LIMIT.max заявок с одного IP за окно.
  const ip = clientIp(request);
  const ipHash = ip ? hashIp(ip) : null;
  if (!ipHash) {
    console.warn('[api/order] IP клиента не определён — лимит частоты не применён');
  } else if (await isRateLimited(supabase, ipHash)) {
    return fail(
      'Слишком много заявок подряд. Попробуйте через несколько минут.',
      429,
      undefined,
      { 'Retry-After': String(RATE_LIMIT.windowMs / 1000) },
    );
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      company: lead.company ?? null,
      note: lead.note ?? null,
      model_id: lead.model_id ?? null,
      model_name: lead.model_name ?? null,
      config: lead.config ?? null,
      qty: lead.qty ?? null,
      total_price: lead.total_price ?? null,
      ip_hash: ipHash,
    })
    .select('id')
    .single();

  if (error || !data) {
    // Подробности — в лог сервера; пользователю обобщённый текст.
    console.error('[api/order] insert failed:', error);
    return fail('Не удалось сохранить заявку. Попробуйте ещё раз.', 502);
  }

  // Уведомление в Telegram — после ответа клиенту: пользователь не ждёт
  // Telegram, а сбой отправки не трогает заявку, она уже в базе.
  // notifyTelegram не бросает исключений — ошибки только логирует.
  const id = data.id as string;
  after(() => notifyTelegram(lead, id));

  return NextResponse.json<Ok>({ ok: true, id });
}

/** Явный 405 на всё, кроме POST, — иначе Next вернёт невнятную ошибку. */
export async function GET() {
  return NextResponse.json<Fail>({ ok: false, error: 'Метод не поддерживается.' }, { status: 405 });
}
