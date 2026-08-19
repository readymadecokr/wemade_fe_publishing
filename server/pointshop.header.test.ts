import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");

describe("Shop category header", () => {
  it("uses the reference-style account panel, reward banner, filters, and product grid", () => {
    expect(source).toContain("function AccountPanel");
    expect(source).toContain("POWER UP");
    expect(source).toContain("YOUR ADVENTURE");
    expect(source).toContain("TOP UP NOW");
    expect(source).toContain("PurchaseDialog");
    expect(source).toContain("BEST\\nSELLER");
    expect(source).toContain("BEST\\nVALUE");
  });
});
