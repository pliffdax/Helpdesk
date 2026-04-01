This is a [Next.js](https://nextjs.org) app inside the Helpdesk monorepo.

## Development

From the repository root:

```bash
pnpm install
pnpm dev:web
```

Or from the app directory:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- Local development uses `next dev --webpack` to avoid Turbopack issues in this lab setup.
- API base URL is configured through `.env.local`.
