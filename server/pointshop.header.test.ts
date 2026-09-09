import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");

describe("Shop page top spacing", () => {
  it("removes the separate Shop title banner and begins beneath the shared Home header", () => {
    expect(source).not.toContain('bg-[linear-gradient(110deg,#314b66,#557494_55%,#314b66)]');
    expect(source).not.toContain('>Shop</h1>');
    expect(source).not.toContain('<p className="text-[#e9dfc8]">Purchase rCoin</p>');
    expect(source).toContain('fantasy-content-guide pt-6 pb-8 md:pt-8');
  });
});
