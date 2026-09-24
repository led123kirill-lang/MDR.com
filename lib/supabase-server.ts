import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// `server-only` сверху — предохранитель: если этот модуль случайно
// импортируют в клиентский компонент, сборка упадёт, а не утечёт ключ.

let cached: SupabaseClient | null = null;

/**
 * Клиент под service_role. Обходит RLS, поэтому существует только на сервере.
 *
 * Ключи читаются лениво, внутри функции: на этапе сборки переменных окружения
 * может не быть, и чтение на верхнем уровне модуля роняло бы `next build`.
 */
export function getServiceClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Не заданы NEXT_PUBLIC_SUPABASE_URL и/или SUPABASE_SERVICE_ROLE_KEY — см. .env.local.example',
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
