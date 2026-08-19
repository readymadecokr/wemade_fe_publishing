import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");

describe("Shop category header", () => {
  it("uses the shared dark-neon category header and page-title hierarchy", () => {
    expect(source).toContain('border-b border-cyan-300/20');
    expect(source).toContain('bg-[linear-gradient(120deg,#081b32_0%,#091326_44%,#27123d_100%)]');
    expect(source).toContain('Secure top up');
    expect(source).toContain('text-4xl font-black mb-2');
    expect(source).toContain('>Shop</h1>');
    expect(source).toContain('Top up rCoin');
  });
});
