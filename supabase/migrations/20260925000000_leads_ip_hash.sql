-- Ограничение частоты заявок: не больше 5 с одного IP за 10 минут.
-- Сам IP не храним — только HMAC от него: для подсчёта этого достаточно,
-- а адрес был бы лишними персональными данными.

alter table public.leads add column if not exists ip_hash text;

comment on column public.leads.ip_hash is
  'HMAC-SHA256 от IP отправителя (32 hex) — для rate limit, не для идентификации';

-- Счётчик ищет заявки по ip_hash за последние 10 минут.
create index if not exists leads_ip_hash_created_at_idx
  on public.leads (ip_hash, created_at desc)
  where ip_hash is not null;
