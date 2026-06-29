import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PropertyCard } from "@/components/catalog/property-card";
import { getSavedProperties } from "@/lib/services/wishlist";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — Habitat" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/dashboard");
  const userId = session.user.id;

  const [saved, inquiries] = await Promise.all([
    getSavedProperties(userId),
    prisma.inquiry.findMany({
      where: { userId },
      include: { property: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Hello{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-muted">Your saved homes and visit requests.</p>

        {/* Saved homes */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight">
            Saved homes
          </h2>
          {saved.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <p className="text-muted">You haven&apos;t saved any homes yet.</p>
              <Link
                href="/properties"
                className="mt-2 inline-block text-sm text-accent underline-offset-4 hover:underline"
              >
                Browse properties
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((p) => (
                <PropertyCard key={p.id} property={p} saved authed />
              ))}
            </div>
          )}
        </section>

        {/* Inquiries */}
        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight">
            Visit requests &amp; inquiries
          </h2>
          {inquiries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted">
              No inquiries yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-card text-left text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Property</th>
                    <th className="px-4 py-3 font-medium">Visit date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((i) => (
                    <tr key={i.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <Link
                          href={`/properties/${i.property.slug}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {i.property.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {i.visitDate
                          ? i.visitDate.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                          {i.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
