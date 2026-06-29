"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { CanvasErrorBoundary } from "./canvas-error-boundary";
import { ModelViewer } from "./model-viewer";

const FloorPlan3D = dynamic(
  () => import("./floor-plan-3d").then((m) => m.FloorPlan3D),
  {
    ssr: false,
    loading: () => (
      <div className="grid aspect-video place-items-center rounded-2xl border border-border bg-card text-sm text-muted">
        Loading 3D digital twin…
      </div>
    ),
  }
);

type Tab = "3d" | "ar";

export function ImmersiveViewer({
  floorPlan,
  modelUrl,
  modelUsdzUrl,
  title,
}: {
  floorPlan: unknown;
  modelUrl: string | null;
  modelUsdzUrl: string | null;
  title: string;
}) {
  const has3d = Boolean(floorPlan);
  const hasAr = Boolean(modelUrl);
  const [tab, setTab] = useState<Tab>(has3d ? "3d" : "ar");

  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: "3d", label: "3D Floor Plan", show: has3d },
    { id: "ar", label: "View in AR", show: hasAr },
  ];
  const visible = tabs.filter((t) => t.show);

  const fallback = (
    <div className="grid aspect-video place-items-center rounded-2xl border border-dashed border-border text-sm text-muted">
      3D view couldn&apos;t load on this device — try the gallery instead.
    </div>
  );

  return (
    <div>
      {visible.length > 1 && (
        <div className="mb-4 inline-flex gap-1 rounded-full border border-border p-1">
          {visible.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t.id ? "bg-accent text-white" : "text-muted hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {tab === "3d" && has3d && (
        <CanvasErrorBoundary fallback={fallback}>
          <FloorPlan3D floorPlan={floorPlan} />
        </CanvasErrorBoundary>
      )}

      {tab === "ar" && hasAr && (
        <>
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border">
            <ModelViewer
              src={modelUrl!}
              iosSrc={modelUsdzUrl ?? undefined}
              alt={`3D model of ${title}`}
            />
          </div>
          <p className="mt-3 text-sm text-muted">
            On a phone, tap the <span className="font-medium">AR</span> button to place this
            home in your space. On desktop, drag to orbit the model.
          </p>
        </>
      )}
    </div>
  );
}
