import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");

describe("Shop category header", () => {
  it("uses the bright-fantasy portal header and sibling-page spacing", () => {
    expect(source).toContain('bg-[linear-gradient(110deg,#314b66,#557494_55%,#314b66)]');
    expect(source).toContain('font-serif text-4xl font-bold');
    expect(source).toContain('>Shop</h1>');
    expect(source).toContain('Top up rCoin');
  });
});
