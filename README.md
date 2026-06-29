# Habitat — Immersive Digital-Twin Real Estate

An AR/VR-enabled real-estate platform: browse listings, step inside a property as
an immersive **digital twin** (360° tours + a walkable 3D floor plan), place a
scaled model in your room with **AR**, compare homes, and ask an **AI concierge**.

A project exploring how far browser-based 3D, AR, VR, and AI can go for property browsing. Full design rationale in [DESIGN.md](./DESIGN.md).

## Features

- **Immersive 3D digital twin** — walls extruded procedurally from each property's floor-plan data; explore as a **dollhouse (orbit)** or in **first-person (WASD)**.
- **WebXR VR** — "Enter VR" on supported headsets (native `navigator.xr`).
- **AR** — `<model-viewer>` (Scene Viewer / Quick Look / WebXR) loads the twin exported to glTF, so you can place the home in your room from a phone.
- **AI concierge (Gemini)** — natural-language search ("3 BHK in Pune under ₹1.5cr with parking") → structured filters, plus a grounded Q&A chat with **server-computed EMI**.
- **Auth** (Auth.js JWT + one-click demo login), **wishlist**, **inquiry / site-visit booking**, and a **dashboard** of saved homes + requests.
- **Catalog** with faceted filters, sort, pagination; **property detail** with gallery, specs, amenities, similar homes; **compare** up to 3 homes side by side.
- Responsive, dark/light, accessible; graceful fallbacks everywhere (3D errors → 2D gallery, AI offline → deterministic answers).

## Device / AR support

| Device         | 3D twin         | VR          | AR                         |
| -------------- | --------------- | ----------- | -------------------------- |
| Android Chrome | ✅              | ✅ WebXR    | ✅ WebXR + Scene Viewer    |
| iOS Safari     | ✅              | ➖          | ✅ Quick Look (needs USDZ) |
| Desktop        | ✅ orbit / walk | ➖          | open on phone              |
| Quest browser  | ✅              | ✅ Enter VR | —                          |

## Tech stack

- **Next.js 16** (App Router, React 19) · TypeScript
- **React Three Fiber + drei + @react-three/xr** (WebXR VR/AR) · **@google/model-viewer** (mobile AR fallback)
- **Prisma 6 + Postgres (Neon)** · **Auth.js (NextAuth v5)** JWT
- **Tailwind CSS v4** · **Google Gemini** (AI concierge, free tier)
- **Vitest** (unit tests)

Everything runs on free tiers (Vercel, Neon, Google AI Studio).

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

| Script                                                  | Purpose                  |
| ------------------------------------------------------- | ------------------------ |
| `pnpm dev`                                              | Start the dev server     |
| `pnpm build` / `pnpm start`                             | Production build / serve |
| `pnpm test`                                             | Run unit tests (Vitest)  |
| `pnpm typecheck`                                        | `tsc --noEmit`           |
| `pnpm lint`                                             | ESLint                   |
| `pnpm db:push` / `db:migrate` / `db:seed` / `db:studio` | Prisma DB tasks          |

## Environment variables

| Var              | Purpose                                    |
| ---------------- | ------------------------------------------ |
| `DATABASE_URL`   | Neon Postgres connection string            |
| `AUTH_SECRET`    | Auth.js session secret (`npx auth secret`) |
| `GEMINI_API_KEY` | Google AI Studio key (free tier)           |

## Demo credentials

`demo@habitat.app` / `demo1234` (seeded).

## Deployment

Deployed on **Vercel** (Hobby, free). Set the three env vars in the Vercel project,
then `prisma migrate deploy` runs in the build and the seed is run once against Neon.
