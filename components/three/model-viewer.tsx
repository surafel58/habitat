"use client";

import { useEffect } from "react";

/**
 * Thin wrapper over Google's <model-viewer> web component (DESIGN.md §7.3).
 * Provides reliable AR on phones: Scene Viewer (Android) / Quick Look (iOS, via
 * ios-src USDZ) / WebXR, plus an orbit-able 3D model on desktop.
 */
export function ModelViewer({
  src,
  iosSrc,
  alt,
  poster,
}: {
  src: string;
  iosSrc?: string;
  alt: string;
  poster?: string;
}) {
  useEffect(() => {
    // Register the custom element on the client only.
    import("@google/model-viewer");
  }, []);

  return (
    <model-viewer
      src={src}
      ios-src={iosSrc}
      alt={alt}
      poster={poster}
      ar
      ar-modes="webxr scene-viewer quick-look"
      ar-scale="auto"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      exposure="1.1"
      style={{ width: "100%", height: "100%", backgroundColor: "#0e0c0b" }}
    />
  );
}
