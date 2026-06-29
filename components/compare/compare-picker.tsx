"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Option = { slug: string; title: string; city: string };

export function ComparePicker({
  options,
  selected,
}: {
  options: Option[];
  selected: string[];
}) {
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>(selected);

  const toggle = (slug: string) => {
    setPicked((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length >= 3
          ? prev
          : [...prev, slug]
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Pick up to 3 homes</h2>
        <button
          type="button"
          disabled={picked.length < 2}
          onClick={() => router.push(`/compare?ids=${picked.join(",")}`)}
          className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Compare {picked.length > 0 ? `(${picked.length})` : ""}
        </button>
      </div>
      <div className="flex max-h-56 flex-col gap-1 overflow-y-auto">
        {options.map((o) => {
          const on = picked.includes(o.slug);
          const full = !on && picked.length >= 3;
          return (
            <label
              key={o.slug}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                on ? "bg-accent/10" : "hover:bg-background"
              } ${full ? "opacity-40" : ""}`}
            >
              <input
                type="checkbox"
                checked={on}
                disabled={full}
                onChange={() => toggle(o.slug)}
                className="accent-accent"
              />
              <span className="flex-1">{o.title}</span>
              <span className="text-muted">{o.city}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
