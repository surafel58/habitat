# Grovyn AR/VR Assignment — Design Document

**Project:** **Habitat** — an immersive **Digital-Twin Real-Estate platform**
**Author:** Surafel
**Date:** 2026-06-29
**Deadline:** 24 hours from start
**Live URL (target):** Vercel deployment + GitHub repo

---

## 0. TL;DR

We are building **Habitat**, an AR/VR-enabled real-estate platform where a buyer can browse listings, step *inside* a property as an immersive **digital twin** (360° tours + a walkable 3D model), drop a scaled model of the building onto their real desk/floor with their phone (AR), compare units, talk to an **AI property concierge**, save favourites, and book a site visit.

It is a single **Next.js 15 (App Router) full-stack app**, **Postgres (Neon) + Prisma**, **Auth.js (JWT)**, **React Three Fiber + @react-three/xr + @google/model-viewer** for 3D/AR/VR, **Tailwind v4 + shadcn/ui** for the interface, and the **Google Gemini API** (free tier) for the concierge and recommendations. One repo, one deploy.

---

## 1. Why this domain (assessment rationale)

This assignment is the technical screen for **Founding AR/VR Software Engineer @ Grovyn**. The job is explicitly about **Spatial Computing, XR, digital twins, real-time rendering, and AI integration**. The assignment is web-based, so the goal is to demonstrate the *web-native equivalents* of those skills at as high a level as 24 hours allows.


| Role signal (from JD)                                 | How Habitat demonstrates it on the web                                                                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Spatial Computing / Digital Twin** (explicit bonus) | A property modelled as a navigable digital twin: 360° tour + extruded 3D floor plan you can walk.                                                 |
| **WebXR** (explicit bonus)                            | Real `immersive-vr` walkthrough and `immersive-ar` hit-test placement via `@react-three/xr`.                                                      |
| **ARCore / ARKit / spatial mapping**                  | WebXR **hit-test** reticle places models on detected real-world planes; `<model-viewer>` falls back to Scene Viewer (Android) / Quick Look (iOS). |
| **Three.js / real-time rendering / 3D math**          | R3F scene graph, PBR materials, procedural floor-plan → 3D extrusion, instancing, LOD.                                                            |
| **AI Integration / RAG** (explicit bonus)             | Gemini-powered natural-language search + property concierge grounded in listing data.                                                             |
| **Multiplayer XR** (explicit bonus, stretch)          | Optional shared-presence avatars inside the VR tour.                                                                                              |
| **Backend / REST / system design**                    | Next.js route handlers, Prisma data layer, auth, clean architecture.                                                                              |


> The assignment says reference prototypes are "basic" and evaluation **favours significantly improving upon them**. Choosing the same domain as Grovyn's real-estate reference is deliberate: it lets the evaluator directly compare and see the leap (immersive WebXR, digital twin, AR spatial mapping, AI concierge) rather than guess.

### 1.1 The differentiation commitment (the win condition)

Because Grovyn *built* the real-estate reference, they will benchmark this against it directly. That makes the bar asymmetric: being merely *comparable* reads as replication (the worst outcome), while being *clearly beyond* it is the strongest possible signal. We therefore treat the following as **non-negotiable P0 differentiators** — features a "basic" prototype almost certainly lacks. If any one of these is at risk, it is escalated before lower-priority polish:

1. **True immersive WebXR VR walkthrough** (headset session + teleport locomotion) — not just a 360° image pan.
2. **AR hit-test placement** on real-world surfaces (web ≈ ARCore spatial mapping), with a reliable `<model-viewer>` fallback so it works on *any* phone.
3. **Procedural floor-plan → 3D digital twin** generated from data (not a static pre-rendered model).
4. **Gemini AI concierge** — NL search, grounded Q&A, EMI math.

The litmus test for every feature: *"Would a basic prototype already have this?"* If yes, it is table stakes, not where we spend the marginal hour. The marginal hour goes to the four items above.

**Rejected alternatives:** *Jewelry* (gorgeous PBR + reliable model-viewer AR, but weaker on "spatial computing" — it's product configuration, not space). *General e-commerce* (broad but unfocused). Real estate maximises overlap with the role's core.

---

## 2. Goals & non-goals

### Goals

- Hit **100% of the assignment's Minimum Requirements** (see §3 matrix).
- A genuinely immersive, *reliable* AR/VR experience that **degrades gracefully** across desktop, phone, and headset — engineering maturity over a single fragile demo.
- One AI bonus feature done well (Gemini concierge + NL search + recommendations).
- Polished, modern, responsive UI. Production-shaped code (typed, layered, documented).
- Deployed to a public URL with seeded demo data and a demo login.

### Non-goals (explicit scope cuts for 24h)

- Real payment processing (real estate has no "buy now"; we do **inquiry + site-visit booking** instead — the domain-appropriate "checkout").
- Photoreal, surveyed 3D models of real buildings. We use **procedurally-generated digital twins** from floor-plan JSON + free CC panoramas/HDRIs. This is a *feature* (shows 3D math) and removes asset-pipeline risk.
- Native apps, Unity/Unreal (out of scope for a web assignment; mentioned in JD but not the medium here).
- Production-grade multi-tenant admin. A light analytics/management view only.

---

## 3. Requirements coverage matrix


| Assignment requirement                 | Habitat feature                                        | Priority     |
| -------------------------------------- | ------------------------------------------------------ | ------------ |
| Responsive web application             | Tailwind responsive layout, mobile-first               | P0           |
| Modern UI/UX                           | shadcn/ui + custom design system, motion               | P0           |
| Authentication system                  | Auth.js credentials + JWT sessions, protected routes   | P0           |
| Product/listing management             | Property CRUD (seed + admin-lite), Prisma              | P0           |
| AR **or** VR integration               | **Both:** WebXR VR walkthrough + WebXR/model-viewer AR | P0           |
| 3D product visualization               | 3D floor plan + 360° tour + GLB viewer                 | P0           |
| Search & filtering                     | Faceted filters + Gemini NL search                     | P0           |
| Wishlist functionality                 | Save/favourite properties (auth-gated)                 | P0           |
| Contact/inquiry system                 | Inquiry form + **site-visit scheduling**               | P0           |
| Deployment on public URL               | Vercel + Neon                                          | P0           |
| *Bonus:* AI recommendations            | Gemini concierge + similar-property recs               | P1           |
| *Bonus:* Compare properties (Option 1) | Side-by-side comparison view                           | P1           |
| *Bonus:* Multi-user showroom           | Shared VR presence (avatars)                           | P2 (stretch) |
| *Bonus:* Voice search                  | Web Speech API into NL search                          | P2 (stretch) |
| *Bonus:* Analytics dashboard           | Admin metrics view                                     | P2 (stretch) |


P0 = must ship. P1 = ship if on schedule. P2 = stretch / only if ahead.

---

## 4. Architecture

### 4.1 High-level

```
┌───────────────────────────────────────────────────────────────┐
│                     Next.js 15 (App Router)                     │
│                                                                 │
│  Client Components                Server (Route Handlers /      │
│  ───────────────                  Server Actions)               │
│  • R3F scenes (3D/VR/AR)          • /api/properties  (search)   │
│  • model-viewer (AR fallback)     • /api/wishlist               │
│  • shadcn/ui pages                • /api/inquiries              │
│  • Zustand UI/XR store            • /api/concierge  (Gemini)    │
│                                   • /api/recommendations        │
│           │                                  │                  │
│           └──────────── fetch / RSC ─────────┘                  │
│                                  │                              │
│                          Prisma Client                          │
└──────────────────────────────────┼──────────────────────────────┘
                                    │
                          ┌─────────▼─────────┐      ┌────────────┐
                          │  Neon Postgres    │      │  Gemini    │
                          │  (serverless)     │      │   API      │
                          └───────────────────┘      └────────────┘

   Static 3D assets (GLB/Draco, equirectangular panoramas, HDRIs)
     served from /public (small, compressed) or Cloudflare R2 free tier (large)
```

### 4.2 Layering

- **UI layer** — App Router pages/layouts, shadcn components, R3F canvases. Client components only where interactivity/3D requires (`"use client"`); everything else is RSC for fast first paint and SEO of listings.
- **API layer** — Route handlers under `app/api/`* (REST-ish) + a few Server Actions for mutations (wishlist toggle, inquiry submit). Zod-validated inputs.
- **Domain/service layer** — `lib/services/`* (properties, search, recommendations, concierge). Keeps route handlers thin and testable.
- **Data layer** — Prisma client singleton (`lib/db.ts`), repository-style helpers.
- **AI layer** — `lib/ai/`*: Gemini client (`@google/genai`), prompt builders, listing-grounding (RAG-lite) and function-declaration schema for structured filter extraction.

### 4.3 Rendering strategy

- Listing pages: **RSC + streaming** for fast TTFB and crawlable content.
- 3D/XR experiences: **client-only**, lazy-loaded with `next/dynamic({ ssr: false })` and a `<Suspense>` skeleton so WebGL never blocks first paint.
- Heavy R3F bundles code-split per route so the catalog stays light.

---

## 5. Tech stack (pinned intent)


| Concern            | Choice                                                                | Why                                                                                                                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework          | **Next.js 15** (App Router, React 19)                                 | One app: SSR catalog + API + client 3D. Single Vercel deploy.                                                                                                                                                                                     |
| Language           | **TypeScript** (strict)                                               | Type safety across data + 3D props.                                                                                                                                                                                                               |
| 3D                 | **three.js** + **@react-three/fiber v9** + **@react-three/drei**      | Declarative scene graph; drei helpers (Environment, OrbitControls, Bounds, useGLTF, Html).                                                                                                                                                        |
| XR                 | **@react-three/xr v6** (`createXRStore`)                              | Modern WebXR: `immersive-vr`, `immersive-ar`, hand tracking, hit-test, controllers.                                                                                                                                                               |
| Reliable mobile AR | **@google/model-viewer**                                              | Battle-tested AR via Scene Viewer (Android) / Quick Look (iOS, USDZ). Works when full WebXR isn't available.                                                                                                                                      |
| Styling            | **Tailwind CSS v4** + **shadcn/ui**                                   | Fast, consistent, accessible primitives; easy theming.                                                                                                                                                                                            |
| State              | **Zustand**                                                           | Small global store for cart-like wishlist UI + XR session state. Server data via fetch/RSC.                                                                                                                                                       |
| Forms/validation   | **react-hook-form** + **Zod**                                         | Shared schemas client+server.                                                                                                                                                                                                                     |
| DB                 | **Postgres on Neon**                                                  | Serverless, generous free tier, plays well with Vercel.                                                                                                                                                                                           |
| ORM                | **Prisma**                                                            | Typed schema + migrations + seed.                                                                                                                                                                                                                 |
| Auth               | **Auth.js (NextAuth v5)** — Credentials + JWT                         | Assignment asks JWT; Credentials provider with bcrypt; JWT session strategy.                                                                                                                                                                      |
| AI                 | **Google Gemini API** (`@google/genai`) — free tier                   | Concierge + NL filter extraction (function calling) + recommendations. `gemini-2.5-flash` for latency-sensitive search/chat; `gemini-2.5-pro` optional for richer concierge answers. Free tier (Google AI Studio key) is sufficient for the demo. |
| Animation          | **Framer Motion**                                                     | Page/section transitions, micro-interactions.                                                                                                                                                                                                     |
| Asset compression  | **Draco / meshopt** via gltf-pipeline; `gltfjsx` for typed components | Small, fast-loading models.                                                                                                                                                                                                                       |
| Deploy             | **Vercel** Hobby (app) + **Neon** free (db) + **Cloudflare R2** free tier (large assets, optional) | Zero-config, public URL, env management. All free tiers — see §5.1.                                                                                                                                                                                |

### 5.1 Cost audit — everything runs on free tiers (hard constraint)

**Principle:** the entire platform must run on $0 — no credit card, no trial that converts to billing, no metered key. Every dependency below is either open-source (self-hosted in our own deploy) or used strictly within a provider's free developer tier. Where a popular option requires billing, we explicitly pick the free alternative.

| Category | Tool | Plan / cost | Free-tier limit (ample for a demo) |
|---|---|---|---|
| Framework, 3D, XR, UI | Next.js, React, three.js, R3F, drei, @react-three/xr, model-viewer, Tailwind, shadcn/ui, Zustand, RHF, Zod, Framer Motion | **Open-source, MIT/Apache** | n/a — runs inside our own deploy, no service cost |
| App hosting | **Vercel Hobby** | Free | Generous for a personal project; HTTPS (required for WebXR) included |
| Database | **Neon Postgres free** | Free | ~0.5 GB storage, autosuspend — far beyond ~12 seed listings |
| AI | **Google Gemini API (AI Studio key)** | Free | `gemini-2.5-flash` free RPM/RPD; we debounce + cache to stay under |
| Auth | **Auth.js (NextAuth) self-hosted JWT** | Free | No external auth vendor; bcrypt + JWT in our app |
| Asset hosting | **`/public` in repo** (primary) → **Cloudflare R2 free** (overflow) | Free | R2: 10 GB storage, **0 egress fees**; chosen over Vercel Blob (smaller free allowance) |
| Map (P1) | **Leaflet + OpenStreetMap tiles** | Free | No API key; OSM tile policy fine for low-volume demo. (Not Google Maps / Mapbox — those need billable keys) |
| 3D / image assets | **Poly Haven, HDRI Haven (CC0), Sketchfab CC, Unsplash/Pexels** | Free | CC0 / CC-BY; credited in README |
| Realtime (P2 stretch) | **Supabase Realtime / Ably / Pusher free tier** | Free | Only if multi-user XR is attempted; stays on free plan |
| Compression tooling | gltf-pipeline, gltfjsx, Draco, meshopt | Open-source | Build-time only |

**Explicitly avoided (would cost money):** Google Maps / Mapbox keys, Vercel Blob beyond its tiny free allowance, paid LLM APIs, Firebase paid plans, Matterport/3D-scanning services, paid asset marketplaces. If any free tier is exhausted during evaluation, the non-AI/static fallbacks (§8.4, §7) keep the core product fully functional.

---

## 6. Data model (Prisma)

```prisma
model User {
  id          String     @id @default(cuid())
  email       String     @unique
  name        String?
  passwordHash String
  role        Role       @default(USER)
  wishlist    Wishlist[]
  inquiries   Inquiry[]
  createdAt   DateTime   @default(now())
}

enum Role { USER ADMIN }

model Property {
  id            String     @id @default(cuid())
  slug          String     @unique
  title         String
  description   String
  type          PropertyType            // APARTMENT, VILLA, PLOT, COMMERCIAL
  status        ListingStatus @default(FOR_SALE)
  price         Int                      // whole INR rupees (see §18); fits comfortably in Int
  currency      String     @default("INR")
  bedrooms      Int
  bathrooms     Int
  areaSqft      Int
  city          String
  locality      String
  lat           Float?
  lng           Float?
  amenities     String[]                 // ["Gym","Pool","Parking"]
  heroImage     String
  gallery       String[]
  // --- immersive assets ---
  modelUrl      String?                  // GLB digital-twin model
  modelUsdzUrl  String?                  // iOS Quick Look fallback
  panoramas     Panorama[]               // 360° tour nodes
  floorPlan     Json?                    // room polygons → procedural 3D extrusion
  featured      Boolean    @default(false)
  views         Int        @default(0)   // simple analytics
  wishlistedBy  Wishlist[]
  inquiries     Inquiry[]
  createdAt     DateTime   @default(now())
}

enum PropertyType { APARTMENT VILLA PLOT COMMERCIAL }
enum ListingStatus { FOR_SALE FOR_RENT SOLD }

model Panorama {                          // one 360° tour node ("room")
  id          String   @id @default(cuid())
  property    Property @relation(fields: [propertyId], references: [id])
  propertyId  String
  name        String                      // "Living Room"
  imageUrl    String                      // equirectangular
  hotspots    Json                        // [{label, yaw, pitch, targetPanoramaId}]
}

model Wishlist {
  id         String   @id @default(cuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  property   Property @relation(fields: [propertyId], references: [id])
  propertyId String
  createdAt  DateTime @default(now())
  @@unique([userId, propertyId])
}

model Inquiry {
  id           String      @id @default(cuid())
  property     Property    @relation(fields: [propertyId], references: [id])
  propertyId   String
  user         User?       @relation(fields: [userId], references: [id])
  userId       String?
  name         String
  email        String
  phone        String?
  message      String
  visitDate    DateTime?                  // site-visit scheduling
  status       InquiryStatus @default(NEW)
  createdAt    DateTime    @default(now())
}

enum InquiryStatus { NEW CONTACTED SCHEDULED CLOSED }
```

**Seed:** ~8–12 properties across 2–3 cities, each with: hero + gallery, 2–4 equirectangular panoramas with hotspots, a floor-plan JSON, and at least 2–3 with a GLB digital-twin model. A demo user (`demo@habitat.app` / `demo1234`) and an admin user.

**Schema & DB notes (review additions):**
- **`amenities` / `gallery` are Postgres scalar lists**, so local dev uses a **Neon branch or local Postgres — not SQLite** (SQLite can't store `String[]`). One DB engine across dev/prod avoids schema drift.
- **Auth uses the JWT session strategy**, so no Prisma-adapter `Account`/`Session` tables are needed; `User.passwordHash` (bcrypt) is the credential store.
- Add `updatedAt DateTime @updatedAt` to mutable models (`Property`, `Inquiry`) for admin sorting/auditing.
- **`floorPlan` JSON is Zod-validated at read time**; malformed/missing → fall back to the GLB or a flat plate, never a crash (see §7.4).
- **Migrations & seed in prod:** `prisma generate && prisma migrate deploy` runs in the Vercel **build command**; the seed runs **once**, manually, against the Neon URL (`pnpm seed`, or a one-off admin-guarded route) — *not* on every build, so deploys stay idempotent.

---

## 7. AR/VR technical design (the core)

This is where the assessment is won. Three immersive surfaces, each with a guaranteed fallback.

### 7.1 360° Virtual Tour (works everywhere — the reliable baseline)

- Equirectangular panorama mapped onto an inverted sphere (`THREE.SphereGeometry` + `BackSide`) inside an R3F `<Canvas>`.
- **Hotspots** rendered with drei `<Html>` or billboarded sprites at `(yaw, pitch)`; clicking transitions to the linked panorama (crossfade).
- Drag to look, scroll to zoom; gyro look on mobile.
- **"Enter VR"** button: if `immersive-vr` is supported, the same sphere becomes a headset experience via `@react-three/xr` (you stand at the centre and look around).
- *Fallback:* on any device without WebGL, show the gallery + a static panorama image. (Never a blank canvas.)

### 7.2 3D Floor Plan / Walkable Digital Twin

- `floorPlan` JSON = array of rooms `{ name, polygon: [[x,z],...], height, doors }`.
- At runtime we **procedurally extrude** walls from polygons (`THREE.Shape` → `ExtrudeGeometry`), lay floors, cut door gaps. This demonstrates real 3D math and removes dependence on hand-modelled assets.
- Two camera modes:
  - **Orbit / dollhouse** (desktop default) — drei `<OrbitControls>` + `<Bounds>` to frame the model.
  - **First-person walk** — pointer-lock + WASD on desktop; on-screen joystick on mobile; **teleport locomotion** in VR (`@react-three/xr` controller ray → floor hit → move `<XROrigin>`). Teleport (not smooth locomotion) is the comfort-correct default for VR. On hand-tracking-capable headsets, a **pinch gesture** can trigger teleport/select — this directly claims the JD's *hand tracking & gesture recognition* bonus; controllers remain the default where hands aren't tracked.
- PBR materials, baked-ish lighting via drei `<Environment>` (HDRI), soft shadows, instanced furniture props.
- Where a property has a real **GLB** model, we load that instead of the procedural twin (drei `useGLTF`, Draco-compressed).

### 7.3 AR — "Place this property in your space"

Two-tier strategy for maximum device coverage:

1. **WebXR hit-test (preferred, Android/Chrome):**
  - `immersive-ar` session via `@react-three/xr` with `hit-test` + `dom-overlay` features.
  - `useXRHitTest` drives a **reticle** that snaps to detected real-world planes (the web analogue of ARCore plane detection / spatial mapping).
  - Tap places a scaled model at the reticle; pinch/drag to rescale/rotate. Shows the building footprint or a unit at "tabletop" scale.
2. **`<model-viewer>` fallback (everyone else, incl. all iPhones):**
  - `ar ar-modes="scene-viewer webxr quick-look"` with `src` (GLB, Android Scene Viewer) **and** `ios-src` (USDZ, iOS Quick Look).
  - **iOS reality check:** iOS Safari has **no WebXR AR** — so Quick Look (USDZ) is the *only* AR path on iPhone, which makes a USDZ per AR-enabled model **required, not optional**. We pre-generate USDZ from GLB (Reality Converter / `usd_from_gltf`) for the 2–3 AR models, or source asset pairs that already ship both formats. A model without a USDZ simply hides its iOS AR button (graceful), it never errors.
  - One tap → native AR on Android **and** iOS. This is the *guaranteed* "an evaluator can try AR on their phone right now" path.

Desktop with no AR: the same model shows in an interactive 3D viewer with an "Open on your phone (QR)" prompt so reviewers can jump to AR instantly.

### 7.4 Capability detection & graceful degradation

A single `useXRCapabilities()` hook checks `navigator.xr?.isSessionSupported('immersive-vr' | 'immersive-ar')` and WebGL availability, then the UI offers the **best available** entry point and never shows a broken/blank state. This robustness *is* the senior-engineer signal.

**Runtime safety:** every R3F `<Canvas>` is wrapped in an **error boundary** that falls back to the 2D gallery if WebGL or a model throws, and all `floorPlan` JSON is **Zod-validated before extrusion**. A single corrupt asset or an unsupported GPU can therefore never white-screen the page — degradation is always to a usable 2D view, which is the whole reliability thesis made concrete.

### 7.5 Performance budget

- Target: interactive 3D in **< 2.5s** on a mid phone; **60fps** desktop, **72/90fps** target in VR.
- Techniques: Draco/meshopt compression, texture downscaling + KTX2 where possible, `<PerformanceMonitor>` (drei) to auto-drop DPR/effects on weak GPUs, instancing for repeated props, lazy route-level code splitting, panorama images served at responsive sizes, suspense skeletons.

### 7.6 Stretch — multi-user presence (Multiplayer XR)

If ahead of schedule: lightweight presence via a free-tier realtime channel (e.g. **Supabase Realtime free**, or **Ably/Pusher free tier** — all have no-cost developer plans) broadcasting position/rotation; render other users as simple avatars in the VR tour. Scoped as P2 — only if P0/P1 are solid, and only on a free plan.

---

## 8. AI integration (Gemini) — the chosen bonus

### 8.1 Natural-language search (function calling → structured filters)

- User types: *"3 BHK apartment in Pune under ₹1.5cr with parking and a balcony."*
- Server route `/api/concierge/search` calls Gemini with a **function declaration** (or `responseSchema` JSON mode) describing our filter shape `{ type, city, maxPrice, minBedrooms, amenities[] }`.
- Gemini returns a structured function call / JSON object → we run the normal Prisma query. Deterministic results, natural input. Falls back to keyword search if AI is unavailable.

### 8.2 Property concierge (RAG-lite)

- Chat widget on a listing: *"Is this good for a family? How far is it from schools? Estimate my EMI at 9% over 20 years."*
- We **ground** the prompt with the selected property's structured data (price, area, amenities, locality) + a short curated neighbourhood note, and let Gemini answer + do the mortgage math. Streamed response (`generateContentStream`).
- Model: `**gemini-2.5-flash`** for snappy latency; `**gemini-2.5-pro**` available for richer concierge turns.

### 8.3 Recommendations

- "Similar homes you may like" — hybrid: cheap structured similarity (type/price band/city/beds) for the candidate set, optionally re-ranked/explained by Gemini ("why this matches you") for the top few. Cached.

### 8.4 Safety & cost

- All AI calls server-side (key never reaches the client), rate-limited, with timeouts and a non-AI fallback path so the product never hard-depends on the API for core flows.
- **Free tier:** a Google AI Studio API key (`gemini-2.5-flash`) is free within generous rate limits — sufficient for the demo and evaluation. Requests are debounced/cached to stay well under per-minute limits.

### 8.5 LLM safety (prompt injection & output handling)

- **Server-side only** — the Gemini key and all prompts live in route handlers; the client never calls Gemini directly.
- **Prompt injection:** user text is treated as untrusted *data*, not instructions. The system prompt pins role + scope, grounding facts come from our DB (never from the user), and the NL-search path only ever returns a **structured filter object that we re-validate with Zod** before querying — the model never reaches the database directly.
- **Output handling:** concierge replies are rendered as **escaped text / sanitized markdown** (no raw HTML), so a crafted response can't XSS the page.
- **Don't trust model arithmetic for anything binding:** the EMI figure is recomputed **server-side** with a deterministic formula; Gemini only narrates it.

---

## 9. API surface


| Route                    | Method            | Purpose                                           | Auth          |
| ------------------------ | ----------------- | ------------------------------------------------- | ------------- |
| `/api/properties`        | GET               | List + faceted filter + pagination                | public        |
| `/api/properties/[slug]` | GET               | Detail (increments views)                         | public        |
| `/api/concierge/search`  | POST              | NL → structured filters (Gemini function calling) | public        |
| `/api/concierge/chat`    | POST              | Grounded concierge chat (stream)                  | public        |
| `/api/recommendations`   | GET               | Similar properties                                | public        |
| `/api/wishlist`          | GET/POST/DELETE   | Read/toggle favourites                            | user          |
| `/api/inquiries`         | POST              | Submit inquiry / book visit                       | optional user |
| `/api/admin/properties`  | POST/PATCH/DELETE | Listing management                                | admin         |
| `/api/admin/metrics`     | GET               | Analytics (views, inquiries)                      | admin         |


Auth via Auth.js JWT session; route handlers guard with a `requireUser()/requireAdmin()` helper. All bodies Zod-validated.

**Admin asset flow (scoped):** listing management accepts **asset URLs** (image / GLB / USDZ / panorama) as string fields — no binary-upload pipeline is in scope for 24h. Assets live in `/public` (or R2) and are referenced by URL, keeping CRUD simple while still demonstrating full listing management.

---

## 10. UI/UX & design system

- **Brand:** "Habitat" — calm, premium, architectural. Deep ink/charcoal base, warm accent (terracotta/gold), generous whitespace, large editorial imagery, real typography (e.g. a serif display + clean sans).
- **Dark + light** themes (real estate browsing happens at night on phones).
- **Key screens:**
  1. **Landing** — hero with a live 3D/rotating model, value props, featured listings, NL search bar.
  2. **Catalog** — filter sidebar (type, price, beds, city, amenities) + responsive card grid + map toggle; NL + voice search entry.
  3. **Property detail** — gallery, specs, amenities, **"Tour in 3D / VR" + "View in AR" + "Walk the floor plan"** CTAs, concierge chat, similar homes, inquiry/visit form, wishlist heart.
  4. **Immersive view** — full-bleed canvas with mode switcher (360 / 3D / VR / AR) and capability-aware controls.
  5. **Compare** — pick 2–3, side-by-side spec + price table with highlight-the-best-value.
  6. **Auth** — sign in / sign up (+ one-click demo login).
  7. **Dashboard** — saved homes, my inquiries; admin → listings + metrics.
- **Motion:** Framer Motion page transitions, card hover lift, skeleton loaders for 3D.
- **Accessibility:** keyboard nav, focus states, reduced-motion respected, alt text, semantic landmarks; AR/VR entry buttons are real buttons with labels.
- **Responsive:** mobile-first; 3D controls adapt (touch joystick, gyro look, model-viewer AR button).

---

## 11. Project structure

```
habitat/
├─ app/
│  ├─ (marketing)/page.tsx            # landing
│  ├─ properties/page.tsx             # catalog (RSC)
│  ├─ properties/[slug]/page.tsx      # detail (RSC)
│  ├─ properties/[slug]/immersive/    # client 3D/VR/AR experience
│  ├─ compare/page.tsx
│  ├─ dashboard/                      # saved + inquiries (+ admin)
│  ├─ (auth)/sign-in, sign-up
│  └─ api/…                           # route handlers (§9)
├─ components/
│  ├─ ui/                             # shadcn primitives
│  ├─ three/                          # Canvas, PanoSphere, FloorPlan3D, ARViewer, XRButton, Reticle
│  ├─ catalog/                        # filters, cards, map
│  └─ concierge/                      # chat widget, NL search bar
├─ lib/
│  ├─ db.ts  auth.ts  ai/  services/  validators(zod)/  xr/
├─ prisma/  schema.prisma  seed.ts
├─ public/models, public/panoramas
├─ README.md  DESIGN.md
```

---

## 12. Asset strategy (zero-budget, low-risk)

- **Panoramas:** free CC0 equirectangular interiors (Poly Haven, HDRI Haven) — reliable, beautiful, no modelling.
- **HDRIs:** Poly Haven for lighting.
- **GLB models:** a few CC0/CC-BY house/apartment models (Sketchfab CC, Poly Haven) + the **procedural floor-plan extrusion** for the rest (no asset dependency, demonstrates 3D math). Compress with Draco; generate USDZ for iOS where feasible.
- **Imagery:** royalty-free real-estate photos (Unsplash/Pexels) for gallery/hero.
- All third-party assets credited in README.

---

## 13. Deployment

- **App:** Vercel (Git-connected, auto-deploy on push). `next build`.
- **DB:** Neon Postgres; `DATABASE_URL` + pooled URL in Vercel env. `prisma migrate deploy` + `prisma db seed` on first deploy.
- **Large assets:** `/public` for small (Draco/KTX2-compressed) GLBs/panoramas — served free by Vercel from the repo. Only if they exceed limits, **Cloudflare R2 free tier** (10 GB storage, **zero egress fees**) — chosen over Vercel Blob, whose free allowance is smaller.
- **Env vars:** `DATABASE_URL`, `AUTH_SECRET`, `GEMINI_API_KEY` (Google AI Studio), `NEXT_PUBLIC_`* flags.
- **Headers:** correct CORS/`Cross-Origin-`* and HTTPS (WebXR requires secure context — Vercel gives HTTPS).
- Submit: deployed link emailed to [grovyn.in@gmail.com](mailto:grovyn.in@gmail.com), CC [tech@grovyn.in](mailto:tech@grovyn.in) + GitHub repo.

---

## 14. 24-hour execution timeline


| Block                            | Hours | Deliverable                                                                                                                     |
| -------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| **0. Scaffold**                  | 0–2   | Next.js + TS + Tailwind + shadcn; Prisma + Neon connected; Auth.js skeleton; deploy a "hello" to Vercel early (de-risk deploy). |
| **1. Data + catalog**            | 2–6   | Schema + seed (properties, panoramas, floor plans); catalog page with filters; detail page (RSC).                               |
| **2. Auth + wishlist + inquiry** | 6–9   | Sign in/up + demo login; wishlist toggle; inquiry/visit form; dashboard.                                                        |
| **3. 360° tour + 3D floor plan** | 9–14  | PanoSphere with hotspots; procedural FloorPlan3D with orbit + first-person.                                                     |
| **4. WebXR VR + AR**             | 14–18 | `createXRStore`, VR teleport walkthrough, AR hit-test reticle + model placement, model-viewer fallback, capability detection.   |
| **5. AI concierge**              | 18–20 | NL search (function calling) + grounded concierge chat + recommendations.                                                       |
| **6. Polish + compare + perf**   | 20–22 | Compare view, motion, responsive pass, perf tuning, empty/error states.                                                         |
| **7. Deploy + docs + demo**      | 22–24 | Final deploy, README, seed on prod, smoke test on phone + desktop, demo script (optional video).                                |
| **Stretch (only if ahead)**      | —     | Multi-user presence, voice search, admin metrics.                                                                               |


**Critical path / de-risking:** deploy at hour 2 (not hour 23); build the *reliable* AR (model-viewer) before the *fancy* AR (WebXR hit-test); procedural twin removes asset blockers; every immersive surface has a non-3D fallback.

---

## 15. Risks & mitigations


| Risk                                       | Likelihood | Mitigation                                                                                               |
| ------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------- |
| WebXR unsupported on evaluator's device    | High       | Tiered fallbacks: VR→3D orbit; AR→model-viewer→QR-to-phone; always a usable view.                        |
| 3D asset sourcing eats time                | Med        | Procedural floor-plan twin + CC panoramas; only 2–3 GLBs needed.                                         |
| 3D perf on mobile                          | Med        | Draco compression, DPR scaling via PerformanceMonitor, lazy loading, budgets in §7.5.                    |
| Gemini API latency / free-tier rate limits | Med        | Server-side, debounce + cache, timeouts, keyword-search + static-rec fallback; AI never gates core flow. |
| Deploy/env surprises at the end            | Med        | Deploy at hour 2; keep secrets in Vercel; `migrate deploy` tested early.                                 |
| Scope creep (P2 features)                  | High       | Strict P0→P1→P2 ordering; P2 only if P0/P1 done.                                                         |
| `@react-three/xr` v6 API churn             | Med        | Pin versions; isolate XR behind `components/three/xr/`*; model-viewer as the safety net.                 |


---

**Additional risks surfaced in this review:**

| Risk | Likelihood | Mitigation |
|---|---|---|
| iOS AR needs USDZ (iOS Safari has no WebXR AR) | Med | Pre-generate USDZ for the few AR models; hide the iOS AR button when absent; Android keeps WebXR hit-test (§7.3). |
| LLM prompt injection / unsafe HTML output | Med | Server-side only; user text treated as data; structured filters re-validated with Zod; output escaped/sanitized; EMI recomputed server-side (§8.5). |
| Local dev vs Postgres scalar lists | Low | Dev uses a Neon branch / local Postgres, not SQLite (§6). |
| 3D runtime crash white-screens the page | Med | R3F error boundary → 2D gallery fallback; `floorPlan` JSON Zod-validated before extrusion (§7.4). |
| Prod seed/migrations not run | Med | `migrate deploy` in the Vercel build command; seed run once manually against Neon (§6, §13). |

---

## 16. Testing & verification

- **Manual smoke matrix:** desktop Chrome (3D/orbit/first-person), Android Chrome (WebXR AR hit-test + VR if cardboard), iPhone Safari (model-viewer Quick Look), small-screen responsive.
- **Type safety:** `tsc --noEmit` clean; Zod at all API boundaries.
- **A couple of unit tests** for the floor-plan extrusion math and the NL-filter parser (highest-value, logic-heavy bits).
- **Lighthouse** pass on catalog/detail for perf + a11y.
- Seed data guarantees the demo always has rich content.

**Device / AR support matrix (what works where):**

| Device | 3D + 360° | VR | AR |
|---|---|---|---|
| Android Chrome | ✅ | ✅ WebXR (if headset/Cardboard) | ✅ WebXR hit-test **+** model-viewer Scene Viewer |
| iOS Safari | ✅ | ➖ (no WebXR) | ✅ model-viewer **Quick Look (USDZ)** only |
| Desktop browser | ✅ orbit / first-person | ➖ | ➖ → "Open on your phone (QR)" |
| VR headset (Quest browser) | ✅ | ✅ immersive walkthrough + teleport / pinch | — |

Every cell that's ➖ degrades to the next-best usable view — never a broken state.

---

## 17. Evaluation-criteria mapping


| Criterion                        | Where we earn it                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Innovation & creativity**      | Digital-twin framing, procedural floor-plan→3D, AI concierge w/ EMI math, tiered AR.                              |
| **AR/VR implementation quality** | Real WebXR VR (teleport) + AR (hit-test/spatial mapping) + reliable model-viewer fallback + capability detection. |
| **User experience**              | Modern design system, graceful degradation, fast loads, accessible, responsive.                                   |
| **Technical architecture**       | Layered Next.js full-stack, typed end-to-end, clean API + services + data, isolated XR layer.                     |
| **Performance & scalability**    | Perf budgets, compression, code-splitting, serverless DB, caching of recs.                                        |
| **Code quality & documentation** | Strict TS, README + this DESIGN.md, seed/demo login, comments on the hard 3D math.                                |


---

## 18. Open decisions (default chosen, flag if you disagree)

- **Price units:** store INR rupees as integers (not paise) for simplicity — *default chosen*.
- **Concierge model:** `gemini-2.5-flash` for chat/search latency; `gemini-2.5-pro` only if answer depth matters — *default Flash* (free tier).
- **Map:** **Leaflet + free OpenStreetMap tiles** (no API key, no cost) vs none — *default lightweight Leaflet, P1*. (Avoids Google Maps / Mapbox, which need billable keys.)
- **Multi-user XR:** stretch only — *default off unless ahead of schedule*.

---

## 19. README & documentation plan

"Code quality & **documentation**" is a graded criterion, so the repo ships a README covering:

- One-paragraph pitch + **live URL** + a screenshot/GIF.
- **Demo credentials** (`demo@habitat.app` / `demo1234`) and an admin login.
- Feature list mapped to the assignment's Minimum Requirements (mirrors §3).
- **Local setup:** `pnpm i` → env vars → `prisma migrate dev` → `pnpm seed` → `pnpm dev`.
- **Env-var reference** (`DATABASE_URL`, `AUTH_SECRET`, `GEMINI_API_KEY`).
- Architecture summary with a link to this `DESIGN.md`.
- **Device / AR support matrix** (from §16) so reviewers know to try AR on a phone.
- **Asset credits & licences** (CC0/CC-BY sources).
- Known limitations & what's stretch (P2).

**Demo video (optional deliverable) script (~3–4 min):** landing → NL search → catalog/filter → property detail → 360° tour (hotspots) → walk the 3D floor plan → enter VR → **AR on a phone** → AI concierge (EMI question) → wishlist + book a site visit.

---

*Next step on approval: scaffold the Next.js app, wire Neon + Prisma + Auth.js, and deploy a stub to Vercel within the first 2 hours (deploy-early to de-risk), then build along the §14 timeline.*