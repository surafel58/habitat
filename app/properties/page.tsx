import Link from "next/link";
import { CatalogFilters } from "@/components/catalog/filters";
import { SortSelect } from "@/components/catalog/sort-select";
import { PropertyCard } from "@/components/catalog/property-card";
import { NlSearch } from "@/components/concierge/nl-search";
import { listProperties, getFilterFacets } from "@/lib/services/properties";
import { getWishlistIds } from "@/lib/services/wishlist";
import { parsePropertyFilter } from "@/lib/validators/property";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filter = parsePropertyFilter(params);

  const session = await auth();
  const [{ items, total, page, pageCount }, facets, savedIds] = await Promise.all([
    listProperties(filter),
    getFilterFacets(),
    session?.user ? getWishlistIds(session.user.id) : Promise.resolve(new Set<string>()),
  ]);
  const authed = Boolean(session?.user);

  const buildPageHref = (p: number) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (typeof v === "string") next.set(k, v);
    }
    next.set("page", String(p));
    return `/properties?${next.toString()}`;
  };

  return (
    <>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Properties
          </h1>
          <p className="mt-1 mb-5 text-muted">
            Browse immersive listings — every featured home has a 3D tour and AR.
          </p>
          <NlSearch />
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <CatalogFilters cities={facets.cities} amenities={facets.amenities} />

          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm text-muted">
                {total} {total === 1 ? "home" : "homes"}
              </p>
              <SortSelect />
            </div>

            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="font-medium">No homes match your filters.</p>
                <Link
                  href="/properties"
                  className="mt-2 inline-block text-sm text-accent underline-offset-4 hover:underline"
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    saved={savedIds.has(p.id)}
                    authed={authed}
                  />
                ))}
              </div>
            )}

            {pageCount > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={buildPageHref(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={`grid h-9 w-9 place-items-center rounded-lg border text-sm transition-colors ${
                      p === page
                        ? "border-accent bg-accent text-white"
                        : "border-border text-muted hover:border-accent/40"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
