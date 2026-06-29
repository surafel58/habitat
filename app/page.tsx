import Link from "next/link";
import { HeroStage } from "@/components/site/hero-stage";
import { NlSearch } from "@/components/concierge/nl-search";

const PILLARS = [
  {
    title: "Immersive VR walkthroughs",
    body: "Step inside a property as a navigable digital twin — 360° tours and a walkable 3D floor plan, in your browser or a headset.",
    icon: (
      <path d="M3 12a9 4 0 1 0 18 0 9 4 0 1 0-18 0M3 12v0c0 2.2 4 4 9 4s9-1.8 9-4M7 10.5l2.5 2 2-3 2 2.5 1.5-1.5" />
    ),
  },
  {
    title: "AR in your space",
    body: "Place a scaled model of the building on your desk or floor with your phone. Works on Android and iPhone.",
    icon: (
      <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3ZM4 7.5 12 12l8-4.5M12 12v9" />
    ),
  },
  {
    title: "AI property concierge",
    body: "Ask in plain language, get matched homes, neighbourhood insight, and instant EMI estimates.",
    icon: (
      <path d="M12 3v3M12 18v3M5 12H2M22 12h-3M6.3 6.3 4.2 4.2M19.8 19.8l-2.1-2.1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
    ),
  },
];

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted">
              Immersive Real Estate
            </span>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              See a home before you ever set foot in it.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-muted">
              Habitat turns every listing into an immersive digital twin — walk
              it in 3D, tour it in VR, drop it into your room with AR, and let an
              AI concierge answer every question.
            </p>
            <div className="pt-2">
              <NlSearch />
              <p className="mt-2 text-xs text-muted">
                Ask in plain language — our AI turns it into a search.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/properties"
                className="rounded-full bg-accent px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                Explore properties
              </Link>
              <Link
                href="/properties"
                className="rounded-full border border-border px-6 py-3 font-medium transition-colors hover:bg-card"
              >
                How it works
              </Link>
            </div>
            <dl className="flex gap-8 pt-6">
              {[
                ["360°", "Virtual tours"],
                ["VR + AR", "On every home"],
                ["AI", "Concierge"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-semibold">{stat}</dt>
                  <dd className="text-sm text-muted">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroStage />
        </section>

        {/* Pillars */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="grid gap-6 sm:grid-cols-3">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40"
              >
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {p.icon}
                  </svg>
                </span>
                <h2 className="mb-2 text-lg font-semibold">{p.title}</h2>
                <p className="text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-auto border-t border-border px-6 py-8 text-center text-sm text-muted">
          Habitat — immersive real estate, right in your browser.
        </footer>
      </main>
    </>
  );
}
