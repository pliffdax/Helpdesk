# AGENTS.md

## Project overview

- This is a pnpm monorepo for the Helpdesk project.
- Main apps:
  - apps/web — Next.js frontend
  - apps/api — Fastify + Prisma backend
  - apps/bot — placeholder / incomplete area
- Docs and support files live in docs, infra, and postman.

## Working rules

- Prefer minimal diffs over broad rewrites.
- Inspect existing code paths before editing.
- Reuse current helpers and patterns before adding new abstractions.
- Do not rename files, routes, scripts, or packages unless explicitly requested.
- Do not add dependencies unless necessary.
- Keep comments short, neutral, and technical.

## Boundaries

- Preserve current behavior unless the task explicitly requires changing it.
- Treat apps/bot as a non-primary area unless the task is specifically about it.
- Do not change Prisma schema, Docker config, or shared project setup unless required for the task.
- Do not edit .env files with real secrets.

## Verification

- Run the smallest relevant check after changes.
- Prefer app-level verification over full-repo checks when possible.
- In the final response, state what changed and how it was verified.

## Done when

- The requested behavior is implemented.
- Unrelated files are not changed unnecessarily.
- Relevant checks were run, or explicitly marked as not run.
