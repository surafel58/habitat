import Link from "next/link";

const PILLARS = [
  {
    title: "Immersive VR walkthroughs",
    body: "Step inside a property as a navigable digital twin — 360° tours and a walkable 3D floor plan, in your browser or a headset.",
  },
  {
    title: "AR in your space",
    body: "Place a scaled model of the building on your desk or floor with your phone. Works on Android and iPhone.",
  },
  {
    title: "AI property concierge",
    body: "Ask in plain language, get matched homes, neighbourhood insight, and instant EMI estimates.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-24 sm:py-32">
        <span className="w-fit rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted">
          Habitat · Immersive Real Estate
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          See a home before you ever set foot in it.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">
          Habitat turns every listing into an immersive digital twin — walk it in
          3D, tour it in VR, drop it into your room with AR, and let an AI
          concierge answer every question.
        </p>
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
      </section>

      {/* Pillars */}
      <section className="mx-auto grid w-full max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-3">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="mb-2 text-lg font-semibold">{p.title}</h2>
            <p className="text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </section>

      <footer className="mt-auto border-t border-border px-6 py-8 text-center text-sm text-muted">
        Habitat — built for the Grovyn AR/VR assignment.
      </footer>
    </main>
  );
}
