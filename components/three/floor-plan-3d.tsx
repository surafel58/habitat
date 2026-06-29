"use client";

/* eslint-disable react-hooks/immutability -- React Three Fiber mutates the
   three.js camera/scene objects in useFrame by design. */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PointerLockControls, Grid } from "@react-three/drei";
import { XR, createXRStore } from "@react-three/xr";
import * as THREE from "three";
import { parseFloorPlan } from "@/lib/validators/floorplan";
import { buildFloorplan, floorplanRadius } from "@/lib/three/build-floorplan";

type Mode = "orbit" | "walk";

// One XR store for the immersive scene (DESIGN.md §7.2 — WebXR VR walkthrough).
// emulate:false disables the localhost dev-emulator overlay; real headsets use
// native WebXR via the capability-gated "Enter VR" button below.
const xrStore = createXRStore({ emulate: false });

function WalkControls() {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    camera.position.set(0, 1.6, 0);
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [camera]);

  useFrame((_, dt) => {
    const speed = 3 * Math.min(dt, 0.05);
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();
    const right = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();
    const move = new THREE.Vector3();
    if (keys.current["KeyW"] || keys.current["ArrowUp"]) move.add(fwd);
    if (keys.current["KeyS"] || keys.current["ArrowDown"]) move.sub(fwd);
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) move.add(right);
    if (keys.current["KeyA"] || keys.current["ArrowLeft"]) move.sub(right);
    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed);
      camera.position.add(move);
      camera.position.y = 1.6;
    }
  });

  return <PointerLockControls />;
}

function Scene({ group, mode }: { group: THREE.Group; mode: Mode }) {
  return (
    <>
      <hemisphereLight args={[0xffffff, 0x4a4438, 1.1]} />
      <directionalLight
        position={[12, 18, 8]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ambientLight intensity={0.3} />
      <primitive object={group} />
      <Grid
        args={[60, 60]}
        position={[0, -0.01, 0]}
        cellColor="#9a9389"
        sectionColor="#c2683d"
        fadeDistance={45}
        infiniteGrid
      />
      {mode === "orbit" ? (
        <OrbitControls
          makeDefault
          target={[0, 1.2, 0]}
          maxPolarAngle={Math.PI / 2.05}
          enableDamping
        />
      ) : (
        <WalkControls />
      )}
    </>
  );
}

export function FloorPlan3D({ floorPlan }: { floorPlan: unknown }) {
  const [mode, setMode] = useState<Mode>("orbit");
  const [vrSupported, setVrSupported] = useState(false);

  useEffect(() => {
    navigator.xr
      ?.isSessionSupported("immersive-vr")
      .then(setVrSupported)
      .catch(() => setVrSupported(false));
  }, []);

  const group = useMemo(() => {
    const data = parseFloorPlan(floorPlan);
    return data ? buildFloorplan(data.rooms) : null;
  }, [floorPlan]);

  if (!group) {
    return (
      <div className="grid aspect-video place-items-center rounded-2xl border border-dashed border-border text-sm text-muted">
        Floor plan unavailable for this property.
      </div>
    );
  }

  const radius = floorplanRadius(group);
  const camPos: [number, number, number] = [radius * 1.7, radius * 1.3, radius * 1.7];

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-[#0e0c0b]">
      <Canvas shadows camera={{ position: camPos, fov: 50 }} dpr={[1, 2]}>
        <color attach="background" args={["#0e0c0b"]} />
        <XR store={xrStore}>
          <Scene group={group} mode={mode} />
        </XR>
      </Canvas>

      {/* Mode toggle */}
      <div className="absolute left-4 top-4 flex gap-1 rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur">
        {(["orbit", "walk"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              mode === m ? "bg-accent text-white" : "text-white/80 hover:text-white"
            }`}
          >
            {m === "orbit" ? "Dollhouse" : "Walk"}
          </button>
        ))}
      </div>

      {vrSupported && (
        <button
          type="button"
          onClick={() => xrStore.enterVR()}
          className="absolute right-4 top-4 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
        >
          Enter VR
        </button>
      )}

      <p className="pointer-events-none absolute bottom-4 left-4 text-xs text-white/70">
        {mode === "orbit"
          ? "Drag to orbit · scroll to zoom"
          : "Click to look · W A S D to move"}
      </p>
    </div>
  );
}
