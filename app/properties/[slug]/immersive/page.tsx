import Link from "next/link";
import { notFound } from "next/navigation";
import { ImmersiveViewer } from "@/components/three/immersive-viewer";
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

  // The AR model is the procedural digital twin exported to glTF (DESIGN.md §7.3).
  const modelUrl = property.modelUrl ? "/models/sample-home.gltf" : null;

  return (
    <>
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
          <ImmersiveViewer
            floorPlan={property.floorPlan}
            modelUrl={modelUrl}
            modelUsdzUrl={property.modelUsdzUrl}
            title={property.title}
          />
        </div>

        <p className="mt-4 text-xs text-muted">
          The 3D digital twin is generated procedurally from the property&apos;s floor-plan
          data. Walk it in first person, orbit it as a dollhouse, or place it in your room
          with AR from a phone.
        </p>
      </main>
    </>
  );
}
