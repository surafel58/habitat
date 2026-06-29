import { z } from "zod";

const pointSchema = z.tuple([z.number(), z.number()]);

export const roomSchema = z.object({
  name: z.string().default("Room"),
  polygon: z.array(pointSchema).min(3),
  height: z.number().positive().max(20).default(3),
});

export const floorPlanSchema = z.object({
  units: z.string().optional(),
  rooms: z.array(roomSchema).min(1).max(40),
});

export type FloorPlanData = z.infer<typeof floorPlanSchema>;
export type Room = z.infer<typeof roomSchema>;

/**
 * Validate untrusted floor-plan JSON before it drives geometry (DESIGN.md §7.4).
 * Returns null on any problem so the 3D scene can fall back gracefully instead
 * of throwing.
 */
export function parseFloorPlan(json: unknown): FloorPlanData | null {
  const result = floorPlanSchema.safeParse(json);
  return result.success ? result.data : null;
}
