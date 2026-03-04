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
  api/        # backend API (planned)
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

## 3. Backend Architecture (Planned)

Architecture style: **Layered Architecture**

Layers:
- Controller layer
- Service layer
- Repository layer
- Database layer

Main modules (planned):
- Auth module
- Users module
- Tickets module
- Comments module
- Categories module

---

## 4. Database (Planned)

Database: **PostgreSQL**  
ORM: **Prisma**

Main entities:
- `User`
- `Ticket`
- `Category`
- `Comment`
- `StatusHistory`

Relations:
- User → Ticket (creator)
- User → Ticket (assigned)
- Ticket → Comment
- Ticket → Category

---

## 5. API Structure (Planned)

Example endpoints:
- `POST /auth/login`
- `POST /auth/register`

- `GET /tickets`
- `POST /tickets`
- `GET /tickets/:id`
- `PATCH /tickets/:id/status`

- `POST /comments`
- `GET /users`

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

docker-compose services (target):
- postgres
- api
- web

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
