import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { PropertyCard } from "@/components/catalog/property-card";
import {
  getPropertyBySlug,
  getSimilarProperties,
} from "@/lib/services/properties";
import { formatINR, formatArea } from "@/lib/format";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  PLOT: "Plot",
  COMMERCIAL: "Commercial",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found — Habitat" };
  return {
    title: `${property.title} — Habitat`,
    description: property.description.slice(0, 155),
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const similar = await getSimilarProperties(property);
  const hasImmersive = Boolean(property.modelUrl || property.panoramas.length);

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Link
          href="/properties"
          className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Back to properties
        </Link>

        {/* Gallery */}
        <div className="mt-4 grid gap-3 md:h-[460px] md:grid-cols-[2fr_1fr]">
          <div className="relative h-72 overflow-hidden rounded-2xl bg-muted/20 md:h-full">
            <Image
              src={property.heroImage}
              alt={property.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:grid-rows-3">
            {property.gallery.slice(0, 3).map((g, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted/20 md:aspect-auto md:h-full"
              >
                <Image
                  src={g}
                  alt={`${property.title} — view ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 22vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main */}
          <div>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted">
              {TYPE_LABEL[property.type] ?? property.type}
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {property.title}
            </h1>
            <p className="mt-1 text-muted">
              {property.locality}, {property.city}
            </p>

            <div className="mt-6 flex flex-wrap gap-6 border-y border-border py-4 text-sm">
              {property.bedrooms > 0 && (
                <Spec label="Bedrooms" value={String(property.bedrooms)} />
              )}
              {property.bathrooms > 0 && (
                <Spec label="Bathrooms" value={String(property.bathrooms)} />
              )}
              <Spec label="Area" value={formatArea(property.areaSqft)} />
              <Spec label="Status" value={property.status.replace("_", " ")} />
            </div>

            <h2 className="mt-8 font-display text-xl font-semibold">About this home</h2>
            <p className="mt-2 leading-relaxed text-muted">{property.description}</p>

            {property.amenities.length > 0 && (
              <>
                <h2 className="mt-8 font-display text-xl font-semibold">Amenities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-border px-3 py-1 text-sm text-muted"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="font-display text-3xl font-semibold text-accent">
                {formatINR(property.price)}
              </p>
              <p className="mt-1 text-sm text-muted">
                ₹{Math.round(property.price / property.areaSqft).toLocaleString("en-IN")}/sq ft
              </p>

              {hasImmersive && (
                <Link
                  href={`/properties/${property.slug}/immersive`}
                  className="mt-5 block rounded-full bg-accent px-5 py-3 text-center font-medium text-white transition-opacity hover:opacity-90"
                >
                  Tour in 3D / VR / AR
                </Link>
              )}
              <button
                type="button"
                disabled
                className="mt-3 w-full cursor-not-allowed rounded-full border border-border px-5 py-3 text-center font-medium text-muted opacity-70"
                title="Coming in the next build step"
              >
                Schedule a visit
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                Saved homes &amp; site-visit booking arrive in the next step.
              </p>
            </div>
          </aside>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-5 font-display text-2xl font-semibold tracking-tight">
              Similar homes
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 font-medium capitalize">{value}</dd>
    </div>
  );
}
