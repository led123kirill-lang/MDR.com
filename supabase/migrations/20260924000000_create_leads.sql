-- Таблица заявок с формы предзаказа.
-- Пишет в неё только серверный маршрут под service role; anon-ключ доступа не имеет.

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz      not null default now(),

  -- шаг 1 формы: контакты
  name        text,
  phone       text,
  email       text,
  company     text,

  -- шаг 2: конфигурация и комментарий
  note        text,
  model_id    text,
  model_name  text,
  config      jsonb,
  qty         int,
  total_price numeric,

  status      text default 'new'
);

comment on table  public.leads            is 'Заявки на предзаказ с лендинга MDR Aero';
comment on column public.leads.config     is 'Выбранные опции конфигуратора: { ключ_группы: id_опции }';
comment on column public.leads.total_price is 'Итог с учётом количества, ₽';
comment on column public.leads.status     is 'Стадия обработки: new -> in_progress -> done/rejected';

-- Свежие заявки в админке идут первыми.
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);

alter table public.leads enable row level security;

-- RLS применяется и к владельцу таблицы: без этого политики можно обойти.
alter table public.leads force row level security;

-- Единственная политика — вставка для service role.
-- Для anon и authenticated политик нет вовсе, а при включённом RLS
-- отсутствие политики означает полный запрет: они не прочитают и не запишут
-- ни строки. service_role в PostgREST обходит RLS сам, но политика задаёт
-- намерение явно и продолжает работать, если роль когда-нибудь потеряет bypassrls.
drop policy if exists "service role can insert leads" on public.leads;
create policy "service role can insert leads"
  on public.leads
  for insert
  to service_role
  with check (true);

-- Отзываем права, которые PostgREST раздаёт своим ролям по умолчанию.
revoke all on public.leads from anon, authenticated;
grant insert on public.leads to service_role;
