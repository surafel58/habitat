import Link from "next/link";
import Image from "next/image";
import type { Property } from "@prisma/client";
import { formatINR, formatArea } from "@/lib/format";
import { WishlistButton } from "@/components/catalog/wishlist-button";

const TYPE_LABEL: Record<string, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  PLOT: "Plot",
  COMMERCIAL: "Commercial",
};

export function PropertyCard({
  property,
  saved = false,
  authed = false,
}: {
  property: Property;
  saved?: boolean;
  authed?: boolean;
}) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-accent/40"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-muted/20">
        <Image
          src={property.heroImage}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium backdrop-blur">
            {TYPE_LABEL[property.type] ?? property.type}
          </span>
          {property.modelUrl && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-white">
              3D · AR
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton
            propertyId={property.id}
            initialSaved={saved}
            authed={authed}
            callbackUrl="/properties"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-snug">
            {property.title}
          </h3>
          <span className="shrink-0 font-display text-lg font-semibold text-accent">
            {formatINR(property.price)}
          </span>
        </div>
        <p className="text-sm text-muted">
          {property.locality}, {property.city}
        </p>
        <p className="mt-auto pt-2 text-sm text-muted">
          {property.bedrooms > 0 && <>{property.bedrooms} bed · </>}
          {property.bathrooms > 0 && <>{property.bathrooms} bath · </>}
          {formatArea(property.areaSqft)}
        </p>
      </div>
    </Link>
  );
}
