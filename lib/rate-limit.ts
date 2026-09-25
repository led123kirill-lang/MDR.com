import 'server-only';

import { createHmac } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';

/** Не больше 5 заявок с одного IP за 10 минут. */
export const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 } as const;

/**
 * IP клиента из заголовков прокси. На Vercel их выставляет сама платформа
 * (x-real-ip — то же, что читает ipAddress() из @vercel/functions), подделать
 * их из браузера нельзя. Без прокси заголовкам доверять не стоит — лимит
 * рассчитан именно на деплой за Vercel. Нет заголовков — null.
 */
export function clientIp(request: Request): string | null {
  const real = request.headers.get('x-real-ip')?.trim();
  if (real) return real;
  const first = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return first || null;
}

/**
 * В базу пишем не IP, а HMAC от него. Ключ — service-role ключ: он и так есть
 * только на сервере, а его ротация всего лишь обнулит текущее окно лимита.
 */
export function hashIp(ip: string): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  return createHmac('sha256', key).update(ip).digest('hex').slice(0, 32);
}

/**
 * true — лимит исчерпан. Считаем уже сохранённые заявки с этого IP за окно.
 *
 * Проверка и вставка не атомарны: при одновременных запросах пройти может
 * на пару заявок больше. Для защиты от спама этого достаточно.
 * Если счётчик упал — пропускаем: лучше лишняя заявка, чем потерянный клиент.
 */
export async function isRateLimited(supabase: SupabaseClient, ipHash: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT.windowMs).toISOString();
  const { count, error } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', since);

  if (error) {
    console.error('[rate-limit] не удалось посчитать заявки:', error.message);
    return false;
  }
  return (count ?? 0) >= RATE_LIMIT.max;
}
