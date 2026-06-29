/**
 * Mortgage / EMI helpers — used by the AI concierge (DESIGN.md §8.2, §8.5).
 *
 * The figure is computed deterministically here on the server; the LLM only
 * narrates it. Never trust model arithmetic for anything binding.
 */

export interface EmiInput {
  /** Loan principal in whole INR rupees. */
  principal: number;
  /** Annual nominal interest rate as a percentage, e.g. 9 for 9%. */
  annualRatePct: number;
  /** Loan tenure in years. */
  years: number;
}

export interface EmiResult {
  /** Equated Monthly Instalment, rounded to whole rupees. */
  monthly: number;
  /** Total amount paid over the full tenure. */
  totalPayable: number;
  /** Total interest paid over the full tenure. */
  totalInterest: number;
}

/**
 * Standard amortising-loan EMI.
 *
 *   EMI = P · r · (1 + r)^n / ((1 + r)^n − 1)
 *
 * where r is the monthly rate and n the number of monthly instalments.
 * Handles the 0% edge case (straight-line repayment).
 */
export function calculateEmi({ principal, annualRatePct, years }: EmiInput): EmiResult {
  if (principal <= 0 || years <= 0) {
    throw new Error("principal and years must be positive");
  }
  if (annualRatePct < 0) {
    throw new Error("annualRatePct cannot be negative");
  }

  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;

  const monthlyRaw =
    r === 0
      ? principal / n
      : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const monthly = Math.round(monthlyRaw);
  const totalPayable = monthly * n;
  const totalInterest = totalPayable - principal;

  return { monthly, totalPayable, totalInterest };
}
