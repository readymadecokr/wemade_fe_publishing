import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/components/FloatingSocialLinks.tsx", import.meta.url), "utf8");

describe("Home floating social links", () => {
  it("keeps all four Hero social buttons free of white outline borders", () => {
    expect(source).toContain('aria-label="Visit Ragnarok Universe on Discord" className="flex h-12 w-12 items-center justify-center rounded-full border-0');
    expect(source).toContain('aria-label="Visit Ragnarok Universe on Facebook" className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-0');
    expect(source).toContain('aria-label="Visit Ragnarok Universe on YouTube" className="flex h-12 w-12 items-center justify-center rounded-full border-0');
    expect(source).toContain('aria-label="Visit Ragnarok Universe on X" className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-0');
    expect(source).not.toContain("border-white/70");
  });

  it("renders the YouTube mark with explicit brand red and a white play glyph", () => {
    expect(source).toContain('fill="#ff0033"');
    expect(source).toContain('M10 8.5 16 12l-6 3.5Z" fill="#fff"');
  });

  it("does not add an extra glowing animation on hover or focus", () => {
    expect(source).not.toContain("@keyframes floating-social-glow");
    expect(source).not.toContain("floating-social-link:hover");
    expect(source).not.toContain("floating-social-link");
  });
});
