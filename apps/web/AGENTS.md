# AGENTS.md

## Web rules

- Stack: Next.js App Router + TypeScript.
- Preserve current route structure.
- Prefer small edits to existing components over broad rewrites.
- Keep current API integration behavior unless explicitly asked to change it.

## Verification

- pnpm --filter @repo/web lint
- pnpm --filter @repo/web build
