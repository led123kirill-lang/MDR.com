# CLAUDE.md

**Проект:** лендинг производителя дронов MDR Aero.

**Стек:** Next.js (App Router), Supabase (таблица `leads`), Telegram-бот для уведомлений о заявках, деплой на Vercel.

**Источник дизайна:** `MDR Drones.html` в корне — это прототип-артефакт, содержит 3 модели дронов
(MDR Heavy, MDR Ultra Light, MDR Superfast), конфигуратор с пересчётом цены и модальную форму заявки
(шаг 1: имя, телефон, email, компания; шаг 2: сводка конфигурации, количество, комментарий).

**Задача:** превратить прототип в рабочий сайт с реальной отправкой формы.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
