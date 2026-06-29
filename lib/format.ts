/** Format whole INR rupees using the Indian crore/lakh convention. */
export function formatINR(rupees: number): string {
  const fmt = (n: number) => {
    const s = n.toFixed(2);
    return s.endsWith(".00") ? s.slice(0, -3) : s.replace(/0$/, "");
  };
  if (rupees >= 1_00_00_000) return `₹${fmt(rupees / 1_00_00_000)} Cr`;
  if (rupees >= 1_00_000) return `₹${fmt(rupees / 1_00_000)} L`;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/** Short area label. */
export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString("en-IN")} sq ft`;
}
