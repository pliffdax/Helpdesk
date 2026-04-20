# AGENTS.md

## API rules

- Stack: Fastify + Prisma + TypeScript.
- Preserve current response shapes unless the task requires changing them.
- Prefer targeted route, service, or mapper fixes over architecture rewrites.
- Avoid Prisma schema changes unless explicitly requested.

## Verification

- pnpm --filter @repo/api lint
- pnpm --filter @repo/api build
