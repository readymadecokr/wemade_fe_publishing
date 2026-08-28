import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");

describe("Shop product image paths", () => {
  it("restores the original 1,500 rCoin product asset instead of a generated replacement", () => {
    expect(source).toContain('4: "/manus-storage/rcoin-product-normalized-4-original_0c88b775.png"');
    expect(source).not.toContain("rcoin-product-1500_2a3acd2f.png");
  });
});
