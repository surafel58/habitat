"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleWishlist } from "@/lib/actions/wishlist";

export function WishlistButton({
  propertyId,
  initialSaved,
  authed,
  variant = "overlay",
  callbackUrl = "/properties",
}: {
  propertyId: string;
  initialSaved: boolean;
  authed: boolean;
  variant?: "overlay" | "full";
  callbackUrl?: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authed) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }
    startTransition(async () => {
      const res = await toggleWishlist(propertyId);
      if ("saved" in res) setSaved(res.saved);
      else router.push(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    });
  };

  const heart = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={saved ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handle}
        disabled={pending}
        aria-pressed={saved}
        className={`flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 font-medium transition-colors disabled:opacity-60 ${
          saved
            ? "border-accent bg-accent/10 text-accent"
            : "border-border hover:bg-card"
        }`}
      >
        {heart}
        {saved ? "Saved" : "Save this home"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={pending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save home"}
      className={`grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-colors ${
        saved
          ? "bg-accent text-white"
          : "bg-background/85 text-foreground hover:bg-background"
      }`}
    >
      {heart}
    </button>
  );
}
