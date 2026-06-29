"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NlSearch({
  placeholder = "Try “3 BHK in Pune under ₹1.5cr with parking”",
}: {
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/concierge/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      const filters: Record<string, unknown> = data.filters ?? { q };
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(filters)) {
        if (v == null) continue;
        if (Array.isArray(v)) {
          if (v.length) params.set(k, v.join(","));
        } else {
          params.set(k, String(v));
        }
      }
      router.push(`/properties?${params.toString()}`);
    } catch {
      router.push(`/properties?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-4 shadow-sm"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-accent"
        aria-hidden="true"
      >
        <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2.5 6.5L22 12l-6.5 2.5L13 21l-2.5-6.5L4 12l6.5-2.5L13 3Z" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search properties in natural language"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        disabled={loading}
        className="shrink-0 rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "…" : "Search"}
      </button>
    </form>
  );
}
