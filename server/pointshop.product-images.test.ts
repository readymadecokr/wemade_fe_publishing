import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");

describe("Shop product image paths", () => {
  it("uses the supplied common rCoin image for every Shop product card", () => {
    expect(source).toContain('const SHOP_RCOIN_IMAGE = "/manus-storage/ragnarok-universe-rcoin_782d398f.png";');
    expect(source).toContain('<img src={SHOP_RCOIN_IMAGE} alt="rCoin package"');
    expect(source).not.toContain("rcoin-product-normalized-");
  });
});
