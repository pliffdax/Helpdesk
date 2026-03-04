# ROADMAP.md

## Development Roadmap for Helpdesk System

This file tracks project development progress.

_Last update: 2026-03-04_

Legend:
- [✓] Completed
- [~] In progress
- [ ] Not started

---

## Phase 1 — Project Setup

- [✓] Create monorepo
- [✓] Setup pnpm workspaces
- [✓] Setup folder structure (`apps/*`, `packages/*`, `infra/*`, `docs/*`)
- [✓] Setup Turborepo tasks (`dev/build/lint`)
- [✓] Create initial documentation

Status: **[✓] Completed**

---

## Phase 2 — Frontend UI (Core)

Tasks:
- [✓] Setup Next.js project in `apps/web`
- [✓] Install TailwindCSS v4
- [~] Setup shadcn/ui (optional / later)
- [✓] Create layout (Header/Main/Footer)
- [ ] Implement sidebar (optional / later)
- [ ] Create dashboard page (optional / later)

Status: **[~] In progress (core done)**

---

## Phase 3 — Tickets UI

Tasks:
- [✓] Ticket list page (`/tickets`) — responsive table/cards
- [✓] Ticket details page (`/tickets/[id]`) — mock
- [✓] Ticket create page (`/tickets/new`) — mock form
- [~] Ticket cards — implemented as part of list
- [~] Ticket filters UI — input + selects (UI only)
- [ ] Ticket search logic — planned (hook + API)

Status: **[~] In progress (UI done, logic later)**

---

## Phase 4 — Authentication

Tasks:
- [ ] Login page
- [ ] Register page
- [ ] JWT authentication
- [ ] Protected routes

Status: **[ ] Not started**

---

## Phase 5 — Backend API

Tasks:
- [ ] Setup backend server
- [ ] Setup Prisma
- [ ] Setup PostgreSQL
- [ ] Implement auth API
- [ ] Implement tickets API
- [ ] Implement comments API

Status: **[ ] Not started**

---

## Phase 6 — Integration

Tasks:
- [ ] Connect frontend to API
- [ ] Error handling
- [ ] Loading states

Status: **[ ] Not started**

---

## Phase 7 — DevOps

Tasks:
- [ ] Docker setup
- [ ] Environment variables
- [ ] Staging environment
- [ ] Production deploy

Status: **[ ] Not started**

---

## Phase 8 — Extensions

Tasks:
- [ ] Telegram bot
- [ ] Notifications
- [ ] Analytics

Status: **[ ] Not started**

---

## Notes / Next steps

Immediate (for Lab #1 reporting):
- [ ] Add placeholder pages: `/categories`, `/profile`, `/login` (no 404 from header)
- [ ] Prepare screenshots (desktop + mobile) for: `/`, `/tickets`, burger menu, `/tickets/new`
- [ ] Add Use-case diagram + ER diagram (PlantUML / draw.io)

Next chat plan:
- Refactor nested UI code into reusable components (extract UI pieces into reusable components), but **not now**.
