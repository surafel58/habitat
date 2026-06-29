# Habitat — Immersive Digital-Twin Real Estate

An AR/VR-enabled real-estate platform: browse listings, step inside a property as
an immersive **digital twin** (360° tours + a walkable 3D floor plan), place a
scaled model in your room with **AR**, compare homes, and ask an **AI concierge**.

Built for the Grovyn AR/VR assignment. Full design rationale in [DESIGN.md](./DESIGN.md).

> **Status:** scaffolding in progress (see DESIGN.md §14 for the build plan).

## Tech stack

- **Next.js 16** (App Router, React 19) · TypeScript
- **React Three Fiber + drei + @react-three/xr** (WebXR VR/AR) · **@google/model-viewer** (mobile AR fallback)
- **Prisma 6 + Postgres (Neon)** · **Auth.js (NextAuth v5)** JWT
- **Tailwind CSS v4** · **Google Gemini** (AI concierge, free tier)
- **Vitest** (unit tests)

Everything runs on free tiers — see DESIGN.md §5.1.

## Local setup

```bash
pnpm install
cp .env.example .env        # then fill in DATABASE_URL, AUTH_SECRET, GEMINI_API_KEY
pnpm db:push                # apply schema to your Postgres
pnpm db:seed                # seed demo data
pnpm dev
```

App runs at http://localhost:3000.

## Scripts

| Script | Purpose |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm db:push` / `db:migrate` / `db:seed` / `db:studio` | Prisma DB tasks |

## Environment variables

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `AUTH_SECRET` | Auth.js session secret (`npx auth secret`) |
| `GEMINI_API_KEY` | Google AI Studio key (free tier) |

## Demo credentials

`demo@habitat.app` / `demo1234` (seeded).

## Deployment

Deployed on **Vercel** (Hobby, free). Set the three env vars in the Vercel project,
then `prisma migrate deploy` runs in the build and the seed is run once against Neon.
