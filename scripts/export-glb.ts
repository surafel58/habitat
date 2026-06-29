/**
 * Export the sample procedural floor plan to a GLB so <model-viewer> can show
 * it in AR (DESIGN.md §7.3). The AR model IS the digital twin — no external
 * asset dependency. Run: pnpm export:glb
 */
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { buildFloorplan } from "../lib/three/build-floorplan";
import type { Room } from "../lib/validators/floorplan";

// GLTFExporter is browser code that uses FileReader. Node lacks it, so polyfill
// both readAsArrayBuffer and readAsDataURL using Blob.arrayBuffer().
class NodeFileReader {
  result: ArrayBuffer | string | null = null;
  onload: (() => void) | null = null;
  onloadend: (() => void) | null = null;
  private handlers: Record<string, Array<() => void>> = {};

  addEventListener(type: string, cb: () => void) {
    (this.handlers[type] ??= []).push(cb);
  }

  private fire() {
    this.onload?.();
    this.onloadend?.();
    for (const cb of this.handlers["load"] ?? []) cb();
    for (const cb of this.handlers["loadend"] ?? []) cb();
  }

  readAsArrayBuffer(blob: Blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      this.fire();
    });
  }

  readAsDataURL(blob: Blob) {
    blob.arrayBuffer().then((buf) => {
      const base64 = Buffer.from(buf).toString("base64");
      this.result = `data:${blob.type || "application/octet-stream"};base64,${base64}`;
      this.fire();
    });
  }
}
(globalThis as unknown as { FileReader: typeof NodeFileReader }).FileReader =
  NodeFileReader;

const rooms: Room[] = [
  { name: "Living Room", polygon: [[0, 0], [6, 0], [6, 4.5], [0, 4.5]], height: 3 },
  { name: "Kitchen", polygon: [[6, 0], [9.5, 0], [9.5, 4.5], [6, 4.5]], height: 3 },
  { name: "Bedroom", polygon: [[0, 4.5], [4.5, 4.5], [4.5, 9], [0, 9]], height: 3 },
  { name: "Bathroom", polygon: [[4.5, 4.5], [6.5, 4.5], [6.5, 7], [4.5, 7]], height: 3 },
];

async function main() {
  const scene = new THREE.Scene();
  scene.add(buildFloorplan(rooms));

  // Export JSON .gltf with embedded base64 buffers — self-contained, loads in
  // <model-viewer>, and avoids the browser-only FileReader the binary path needs.
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(scene, { binary: false });
  const json = JSON.stringify(result);
  mkdirSync("public/models", { recursive: true });
  writeFileSync("public/models/sample-home.gltf", json);
  console.log(`Wrote public/models/sample-home.gltf (${json.length} bytes)`);
}

main().catch((err) => {
  console.error("GLTF export failed:", err);
  process.exit(1);
});
