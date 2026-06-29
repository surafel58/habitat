import { describe, it, expect } from "vitest";
import { calculateEmi } from "./finance";

describe("calculateEmi", () => {
  it("matches the known EMI for a standard home loan", () => {
    // ₹50,00,000 @ 9% for 20 years → ~₹44,986/month (well-known value).
    const { monthly } = calculateEmi({
      principal: 5_000_000,
      annualRatePct: 9,
      years: 20,
    });
    expect(monthly).toBeGreaterThan(44_900);
    expect(monthly).toBeLessThan(45_100);
  });

  it("handles a 0% loan as straight-line repayment", () => {
    const { monthly, totalInterest } = calculateEmi({
      principal: 1_200_000,
      annualRatePct: 0,
      years: 10,
    });
    expect(monthly).toBe(10_000); // 1,200,000 / 120
    expect(totalInterest).toBe(0);
  });

  it("computes total payable and interest consistently", () => {
    const { monthly, totalPayable, totalInterest } = calculateEmi({
      principal: 2_000_000,
      annualRatePct: 8,
      years: 15,
    });
    expect(totalPayable).toBe(monthly * 180);
    expect(totalInterest).toBe(totalPayable - 2_000_000);
    expect(totalInterest).toBeGreaterThan(0);
  });

  it("rejects invalid input", () => {
    expect(() => calculateEmi({ principal: 0, annualRatePct: 9, years: 20 })).toThrow();
    expect(() => calculateEmi({ principal: 1000, annualRatePct: -1, years: 5 })).toThrow();
    expect(() => calculateEmi({ principal: 1000, annualRatePct: 9, years: 0 })).toThrow();
  });
});
