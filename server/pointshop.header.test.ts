import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");

describe("Shop category header", () => {
  it("uses the rCoin deep-red header with an icon and sibling-page spacing", () => {
    expect(source).toContain('bg-[#a51f24] py-12 text-white');
    expect(source).toContain('text-4xl font-black mb-2');
    expect(source).toContain('🪙 Shop');
    expect(source).toContain('Top up rCoin');
  });
});
