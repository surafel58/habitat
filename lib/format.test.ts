import { describe, it, expect } from "vitest";
import { formatINR } from "./format";

describe("formatINR", () => {
  it("formats crores", () => {
    expect(formatINR(42_500_000)).toBe("₹4.25 Cr");
    expect(formatINR(320_000_000)).toBe("₹32 Cr");
    expect(formatINR(10_000_000)).toBe("₹1 Cr");
  });

  it("formats lakhs", () => {
    expect(formatINR(5_200_000)).toBe("₹52 L");
    expect(formatINR(680_000)).toBe("₹6.8 L");
    expect(formatINR(100_000)).toBe("₹1 L");
  });

  it("formats small amounts with Indian grouping", () => {
    expect(formatINR(50_000)).toBe("₹50,000");
  });
});
