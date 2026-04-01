# PROJECT_SPEC.md

## Adaptive Web Application (Helpdesk / Ticket System)

Course: WEB-орієнтовані технології. Backend розробки  
University: КПІ ім. Ігоря Сікорського  
Lab: Лабораторна робота №1  
Topic: Вибір предметної області. Аналіз, моделювання та розроблення адаптивного WEB‑застосунку

_Last update: 2026-03-04_

---

## 1. Загальна ідея проєкту

Проєкт представляє собою адаптивний веб‑застосунок для керування заявками (Helpdesk / Ticket System).

Система дозволяє користувачам:
- створювати заявки (tickets)
- відстежувати статус
- отримувати відповіді від підтримки
- коментувати заявки

Адміністратори можуть:
- переглядати всі заявки
- змінювати статуси
- призначати виконавців
- керувати категоріями
- переглядати статистику

У майбутньому система може бути розширена Telegram‑ботом.

---

## 2. Архітектура проєкту

Проєкт розробляється у вигляді **monorepo**.

Структура (актуальна):
- `apps/web` — фронтенд (Next.js)
- `apps/api` — бекенд API на Fastify + Prisma (реалізовано базове ядро для Lab 2)
- `apps/bot` — Telegram bot (планується)
- `packages/shared` — спільні типи/DTO (планується)
- `packages/ui` — UI компоненти (планується)
- `infra/docker` — docker compose (планується)
- `docs` — документація

---

## 3. Технологічний стек

Frontend:
- Next.js (App Router)
- React
- TailwindCSS v4

Backend (план):
- Node.js
- Fastify
- Prisma ORM

Database:
- PostgreSQL

DevOps (план):
- Docker
- GitHub workflow (branches + PR)

---

## 4. Мета роботи

Розробити адаптивний веб‑застосунок з сучасною архітектурою та багаторівневою структурою.

---

## 5. Завдання роботи

1.  Обрати предметну область
2.  Провести аналіз предметної області
3.  Описати бізнес‑логіку
4.  Сформувати функціональні вимоги
5.  Сформувати нефункціональні вимоги
6.  Побудувати Use‑case діаграму
7.  Побудувати ER‑діаграму
8.  Реалізувати адаптивний UI
9.  Реалізувати backend API
10. Підключити PostgreSQL та ORM
11. Продемонструвати CRUD і прямі SQL-запити з Node.js

---

## 6. Бізнес‑логіка системи

Основні правила:
- Користувач може створити заявку
- Кожна заявка має статус
- Адміністратор може змінювати статус
- До заявки можна додавати коментарі
- Можна призначити відповідального

Типові статуси:
- Open
- In Progress
- Waiting
- Closed

---

## 7. Актори системи

- User
- Admin
- Support Agent

---

## 8. Основні сутності (ER)

- User
- Ticket
- Category
- Comment
- StatusHistory

---

## 9. Функціональні вимоги

FR1 — користувач може реєструватися  
FR2 — користувач може входити в систему  
FR3 — створювати заявки  
FR4 — переглядати заявки  
FR5 — коментувати заявки  
FR6 — адміністратор може змінювати статуси  
FR7 — система зберігає історію змін

---

## 10. Нефункціональні вимоги

NFR1 — адаптивний інтерфейс  
NFR2 — підтримка сучасних браузерів  
NFR3 — API response < 2 сек (ціль)  
NFR4 — масштабованість системи  
NFR5 — підтримка ролей

---

## 11. Інтерфейс (UI)

Header:
- логотип
- меню (desktop)
- burger menu (mobile)
- CTA button "Нова заявка"

Main:
- landing page
- tickets list (table/cards)
- ticket details (mock)
- create ticket form (mock)

Footer:
- навігаційні посилання + копірайт

---

## 12. Адаптивність (реалізовано на UI)

Target:
- Desktop
- Tablet
- Mobile

Використання:
- Flexbox
- CSS Grid
- Tailwind breakpoints (`md` для переключення table/cards)
- Relative units + responsive layout container

---

## 13. Git workflow (рекомендація)

main — стабільна версія  
develop — основна гілка розробки (опційно)

feature branches:
- feature/header
- feature/tickets
- feature/auth

Commit examples:
- feat: add responsive header
- feat: implement ticket list
- fix: mobile navigation

---

## 14. DevOps практика (план)

Передбачено:
- окрема гілка develop (опційно)
- стабільна гілка main
- feature branches для нових функцій
- merge через pull request

Планується:
- docker‑контейнери
- деплой на сервер
- CI/CD у майбутньому

---

## 15. Етапи виконання

Stage 1 — Аналіз предметної області  
Stage 2 — Проєктування системи  
Stage 3 — Розробка UI (частково виконано)  
Stage 4 — Розробка backend  
Stage 5 — Інтеграція  
Stage 6 — Деплой

---

## 16. Поточний стан (progress snapshot)

Готово (UI / Phase 1–3):
- Monorepo + pnpm workspaces + Turborepo
- Next.js web app в `apps/web`
- Адаптивний layout (Header/Main/Footer)
- Сторінки: `/`, `/tickets`, `/tickets/[id]`, `/tickets/new`
- Єдина палітра/стилі через `src/components/ui/ui.ts`

Готово в межах Lab 2:
- Fastify API в `apps/api`
- Prisma schema та PostgreSQL-моделі `User`, `Category`, `Ticket`
- CRUD для заявок
- Демо прямих SQL-запитів через `pg`
- Інтеграція сторінок `/tickets`, `/tickets/[id]`, `/tickets/new` з API або fallback-даними

---

## 17. Результат

1.  GitHub репозиторій
2.  Працюючий веб‑застосунок (UI)
3.  ER‑діаграма (планується)
4.  Use‑case діаграма (планується)
5.  Адаптивний інтерфейс (реалізовано)
6.  Лабораторний звіт (в процесі)
