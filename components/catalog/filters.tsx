"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { PROPERTY_TYPES } from "@/lib/validators/property";

const TYPE_LABEL: Record<string, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  PLOT: "Plot",
  COMMERCIAL: "Commercial",
};

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function CatalogFilters({
  cities,
  amenities,
}: {
  cities: string[];
  amenities: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      next.delete("page"); // reset pagination on any filter change
      router.push(`/properties?${next.toString()}`);
    },
    [params, router]
  );

  const current = (k: string) => params.get(k) ?? "";

  const selectedAmenities = (params.get("amenities") ?? "")
    .split(",")
    .filter(Boolean);

  const toggleAmenity = (a: string) => {
    const set = new Set(selectedAmenities);
    if (set.has(a)) set.delete(a);
    else set.add(a);
    update({ amenities: [...set].join(",") || null });
  };

  return (
    <aside className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Search
        </label>
        <input
          type="search"
          defaultValue={current("q")}
          placeholder="Locality, city…"
          className={fieldClass}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              update({ q: (e.target as HTMLInputElement).value || null });
          }}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Type
        </label>
        <select
          className={fieldClass}
          value={current("type")}
          onChange={(e) => update({ type: e.target.value || null })}
        >
          <option value="">Any type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABEL[t]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          City
        </label>
        <select
          className={fieldClass}
          value={current("city")}
          onChange={(e) => update({ city: e.target.value || null })}
        >
          <option value="">Any city</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
            Min price (₹)
          </label>
          <input
            type="number"
            min={0}
            step={500000}
            defaultValue={current("minPrice")}
            placeholder="0"
            className={fieldClass}
            onBlur={(e) => update({ minPrice: e.target.value || null })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
            Max price (₹)
          </label>
          <input
            type="number"
            min={0}
            step={500000}
            defaultValue={current("maxPrice")}
            placeholder="Any"
            className={fieldClass}
            onBlur={(e) => update({ maxPrice: e.target.value || null })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Min bedrooms
        </label>
        <select
          className={fieldClass}
          value={current("minBedrooms")}
          onChange={(e) => update({ minBedrooms: e.target.value || null })}
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </div>

      {amenities.length > 0 && (
        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
            Amenities
          </span>
          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => {
              const active = selectedAmenities.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  aria-pressed={active}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border text-muted hover:border-accent/40"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => router.push("/properties")}
        className="cursor-pointer text-left text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
      >
        Clear all filters
      </button>
    </aside>
  );
}
