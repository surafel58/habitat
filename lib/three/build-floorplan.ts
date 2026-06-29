import * as THREE from "three";
import type { Room } from "@/lib/validators/floorplan";

const WALL_THICKNESS = 0.12;
const FLOOR_PALETTE = [0xb98a5a, 0xcdb393, 0xa9b0a0, 0xc4a07a, 0xb0a89a];
const WALL_COLOR = 0xf3efe9;

/**
 * Build a navigable 3D digital twin from room polygons — pure three.js so the
 * exact same geometry can be rendered by React Three Fiber AND exported to a
 * GLB for AR (DESIGN.md §7.2). Coordinates are in metres, floor on the y=0 plane.
 */
export function buildFloorplan(rooms: Room[]): THREE.Group {
  const group = new THREE.Group();

  const wallMat = new THREE.MeshStandardMaterial({
    color: WALL_COLOR,
    roughness: 0.85,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  rooms.forEach((room, i) => {
    const floorMat = new THREE.MeshStandardMaterial({
      color: FLOOR_PALETTE[i % FLOOR_PALETTE.length],
      roughness: 0.9,
      metalness: 0,
      side: THREE.DoubleSide,
    });

    // Floor: polygon (x,z) -> Shape (x,y) -> rotate into the XZ plane.
    const shape = new THREE.Shape();
    room.polygon.forEach(([x, z], idx) =>
      idx === 0 ? shape.moveTo(x, z) : shape.lineTo(x, z)
    );
    shape.closePath();
    const floorGeo = new THREE.ShapeGeometry(shape);
    floorGeo.rotateX(Math.PI / 2);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.receiveShadow = true;
    group.add(floor);

    // Walls: a thin box along each polygon edge.
    const n = room.polygon.length;
    for (let e = 0; e < n; e++) {
      const [x0, z0] = room.polygon[e];
      const [x1, z1] = room.polygon[(e + 1) % n];
      const dx = x1 - x0;
      const dz = z1 - z0;
      const len = Math.hypot(dx, dz);
      if (len < 0.01) continue;

      const wallGeo = new THREE.BoxGeometry(len, room.height, WALL_THICKNESS);
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set((x0 + x1) / 2, room.height / 2, (z0 + z1) / 2);
      wall.rotation.y = -Math.atan2(dz, dx);
      wall.castShadow = true;
      wall.receiveShadow = true;
      group.add(wall);
    }
  });

  // Recentre on the origin (keep it sitting on the ground).
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.set(-center.x, 0, -center.z);

  return group;
}

/** Footprint radius, used to frame the camera. */
export function floorplanRadius(group: THREE.Group): number {
  const box = new THREE.Box3().setFromObject(group);
  const size = box.getSize(new THREE.Vector3());
  return Math.max(size.x, size.z) / 2;
}
