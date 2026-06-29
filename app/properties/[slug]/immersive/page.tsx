import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/navbar";
import { HeroStage } from "@/components/site/hero-stage";
import { getPropertyBySlug } from "@/lib/services/properties";

export const dynamic = "force-dynamic";

export default async function ImmersivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <Link
          href={`/properties/${slug}`}
          className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Back to {property.title}
        </Link>

        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
          Immersive tour — {property.title}
        </h1>
        <p className="mt-1 text-muted">
          {property.locality}, {property.city}
        </p>

        <div className="mt-6">
          <HeroStage />
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
          The live 360° tour, walkable 3D floor plan, WebXR VR walkthrough and AR
          placement render here. This route is wired and the data
          ({property.panoramas.length} panorama node
          {property.panoramas.length === 1 ? "" : "s"}
          {property.floorPlan ? " + floor plan" : ""}) is ready — the R3F canvas
          is built in the next step.
        </div>
      </main>
    </>
  );
}
