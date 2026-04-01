# ARCHITECTURE.md

## Helpdesk System Architecture

This document describes the technical architecture of the **Helpdesk / Ticket System** project.

_Last update: 2026-03-04_

---

## 1. Monorepo Structure

Repository root: `helpdesk/`

```
apps/
  web/        # Next.js frontend (App Router)
  api/        # Fastify backend API (Lab 2 core implemented)
  bot/        # Telegram bot (planned)

packages/
  shared/     # shared types / DTO (planned)
  ui/         # reusable UI components (planned)

infra/
  docker/     # docker-compose, infrastructure (planned)

docs/
  PROJECT_SPEC.md
  ARCHITECTURE.md
  ROADMAP.md
```

Tooling:
- **pnpm workspaces** for package management
- **Turborepo** for task orchestration (`dev`, `build`, `lint`) across packages

---

## 2. Frontend Architecture (Implemented)

Framework: **Next.js (App Router)**  
Styling: **TailwindCSS v4**

Key folders (current):
- `src/app/` — routes/pages
- `src/components/` — UI building blocks (layout + feature components)
- `src/components/ui/ui.ts` — shared class tokens for buttons/cards/inputs (lightweight design system)

Implemented routes:
- `/` — landing/entry page
- `/tickets` — ticket list (responsive: table on desktop, cards on mobile)
- `/tickets/[id]` — ticket details (mock)
- `/tickets/new` — new ticket form (mock)

Layout:
- `Header` (desktop nav + mobile burger)
- `Main`
- `Footer`

Responsiveness:
- Breakpoints: Tailwind `md` split for mobile vs desktop ticket list
- Interaction: hover/focus states, transitions, sticky header

---

## 3. Backend Architecture (Core Implemented)

Architecture style: **Layered Architecture**

Layers:
- Controller layer
- Service layer
- Repository layer
- Database layer

Main modules:
- Users module
- Tickets module
- Categories module

Implemented approach for Lab 2:
- Fastify routes as controller layer
- Prisma Client as data-access layer
- PostgreSQL as primary relational database
- Raw SQL script via `pg` for direct query demonstration

---

## 4. Database (Core Implemented)

Database: **PostgreSQL**  
ORM: **Prisma**

Main entities used in Lab 2:
- `User`
- `Ticket`
- `Category`

Relations:
- User → Ticket (creator, One-to-Many)
- Category → Ticket (One-to-Many)

---

## 5. API Structure (Implemented for Lab 2)

Example endpoints:
- `GET /health`
- `GET /api/users`
- `POST /api/users`
- `GET /api/categories`
- `POST /api/categories`
- `GET /api/tickets`
- `POST /api/tickets`
- `GET /api/tickets/:id`
- `PATCH /api/tickets/:id`
- `DELETE /api/tickets/:id`

---

## 6. DevOps & Environments (Planned)

Environment separation:
- development
- staging
- production

Branches (recommended):
- `main` → production
- `develop` → development
- `feature/*`, `bugfix/*`

Deployment idea:
- `main` deploy → production server
- `develop` deploy → staging environment

---

## 7. Docker Infrastructure (Planned)

docker-compose services (current minimum):
- postgres

Future:
- redis
- worker
- bot

---

## 8. Future Extensions

- Telegram bot integration
- Notifications
- Analytics dashboard
- File attachments
