"use client";

import { Component, type ReactNode } from "react";

/**
 * Catches any WebGL/3D render error and shows a 2D fallback instead of a blank
 * white screen (DESIGN.md §7.4 — graceful degradation is the reliability thesis).
 */
export class CanvasErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
