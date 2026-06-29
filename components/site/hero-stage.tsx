/**
 * Hero visual stage — a placeholder for the live 3D/immersive scene
 * (replaced by an R3F canvas in a later block). Pure CSS/SVG so it loads
 * instantly and never blocks first paint.
 */
export function HeroStage() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-[#0e0c0b] shadow-2xl">
      {/* warm glow */}
      <div
        className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, #e08a5a, transparent 70%)" }}
      />
      {/* floor grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(to bottom, transparent, black 60%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 60%)",
        }}
      />

      {/* isometric house wireframe */}
      <svg
        viewBox="0 0 240 200"
        className="absolute left-1/2 top-1/2 w-3/4 -translate-x-1/2 -translate-y-1/2"
        fill="none"
        stroke="#f2ede6"
        strokeWidth="1.5"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M120 30 220 85v60L120 200 20 145V85Z" stroke="#e08a5a" strokeWidth="2" />
        <path d="M120 30 120 200" opacity="0.4" />
        <path d="M20 85 120 142 220 85" opacity="0.4" />
        <path d="M120 142 120 200" opacity="0.4" />
        <path d="M70 113 70 57 120 30" opacity="0.5" />
        <path d="M170 113 170 57 120 30" opacity="0.5" />
      </svg>

      {/* AR reticle */}
      <svg
        viewBox="0 0 60 60"
        className="absolute bottom-8 left-10 h-12 w-12 opacity-70"
        fill="none"
        stroke="#e08a5a"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M6 18V6h12M42 6h12v12M54 42v12H42M18 54H6V42" strokeLinecap="round" />
        <circle cx="30" cy="30" r="4" fill="#e08a5a" stroke="none" />
      </svg>

      {/* mode pills */}
      <div className="absolute right-5 top-5 flex flex-col items-end gap-2">
        {["360° Tour", "VR Walk", "AR Place"].map((m) => (
          <span
            key={m}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
