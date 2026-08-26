import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");

describe("Shop product image paths", () => {
  it("uses the available 1,500 rCoin product asset instead of the broken legacy path", () => {
    expect(source).toContain('4: "/manus-storage/rcoin-product-1500_2a3acd2f.png"');
    expect(source).not.toContain("rcoin-product-normalized-4_c97d1c25.png");
  });
});
