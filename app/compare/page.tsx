import Link from "next/link";
import Image from "next/image";
import { ComparePicker } from "@/components/compare/compare-picker";
import {
  getPropertyOptions,
  getPropertiesBySlugs,
} from "@/lib/services/properties";
import { formatINR, formatArea } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Compare homes — Habitat" };

const TYPE_LABEL: Record<string, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  PLOT: "Plot",
  COMMERCIAL: "Commercial",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const slugs = (ids ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);

  const [options, properties] = await Promise.all([
    getPropertyOptions(),
    getPropertiesBySlugs(slugs),
  ]);

  const ppsf = (p: { price: number; areaSqft: number }) =>
    Math.round(p.price / p.areaSqft);
  const best =
    properties.length > 1
      ? {
          price: Math.min(...properties.map((p) => p.price)),
          ppsf: Math.min(...properties.map(ppsf)),
          area: Math.max(...properties.map((p) => p.areaSqft)),
        }
      : null;

  const hl = "bg-accent/10 font-semibold text-accent";

  return (
    <>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Compare homes
        </h1>
        <p className="mt-1 mb-6 text-muted">
          Put up to three homes side by side. Best value in each row is highlighted.
        </p>

        <div className="mb-8">
          <ComparePicker options={options} selected={slugs} />
        </div>

        {properties.length < 2 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted">
            Select at least two homes above to compare.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <tbody>
                <tr>
                  <Th />
                  {properties.map((p) => (
                    <td key={p.id} className="p-3 align-top">
                      <Link href={`/properties/${p.slug}`} className="group block">
                        <div className="relative mb-2 aspect-[3/2] overflow-hidden rounded-xl">
                          <Image
                            src={p.heroImage}
                            alt={p.title}
                            fill
                            sizes="240px"
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <span className="font-display text-base font-semibold leading-snug">
                          {p.title}
                        </span>
                      </Link>
                    </td>
                  ))}
                </tr>
                <Row label="Price">
                  {properties.map((p) => (
                    <Cell key={p.id} highlight={best?.price === p.price ? hl : ""}>
                      {formatINR(p.price)}
                    </Cell>
                  ))}
                </Row>
                <Row label="Price / sq ft">
                  {properties.map((p) => (
                    <Cell key={p.id} highlight={best?.ppsf === ppsf(p) ? hl : ""}>
                      ₹{ppsf(p).toLocaleString("en-IN")}
                    </Cell>
                  ))}
                </Row>
                <Row label="Type">
                  {properties.map((p) => (
                    <Cell key={p.id}>{TYPE_LABEL[p.type] ?? p.type}</Cell>
                  ))}
                </Row>
                <Row label="Bedrooms">
                  {properties.map((p) => (
                    <Cell key={p.id}>{p.bedrooms || "—"}</Cell>
                  ))}
                </Row>
                <Row label="Bathrooms">
                  {properties.map((p) => (
                    <Cell key={p.id}>{p.bathrooms || "—"}</Cell>
                  ))}
                </Row>
                <Row label="Area">
                  {properties.map((p) => (
                    <Cell key={p.id} highlight={best?.area === p.areaSqft ? hl : ""}>
                      {formatArea(p.areaSqft)}
                    </Cell>
                  ))}
                </Row>
                <Row label="Location">
                  {properties.map((p) => (
                    <Cell key={p.id}>
                      {p.locality}, {p.city}
                    </Cell>
                  ))}
                </Row>
                <Row label="Amenities">
                  {properties.map((p) => (
                    <Cell key={p.id}>
                      <span className="flex flex-wrap gap-1">
                        {p.amenities.map((a) => (
                          <span
                            key={a}
                            className="rounded-full border border-border px-2 py-0.5 text-xs text-muted"
                          >
                            {a}
                          </span>
                        ))}
                      </span>
                    </Cell>
                  ))}
                </Row>
                <Row label="">
                  {properties.map((p) => (
                    <Cell key={p.id}>
                      <Link
                        href={`/properties/${p.slug}/immersive`}
                        className="text-accent underline-offset-4 hover:underline"
                      >
                        Tour in 3D / AR →
                      </Link>
                    </Cell>
                  ))}
                </Row>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

function Th() {
  return <td className="w-36 p-3" />;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-t border-border">
      <td className="p-3 align-top text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </td>
      {children}
    </tr>
  );
}

function Cell({
  children,
  highlight = "",
}: {
  children: React.ReactNode;
  highlight?: string;
}) {
  return <td className={`p-3 align-top ${highlight}`}>{children}</td>;
}
