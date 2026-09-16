import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/components/FloatingSocialLinks.tsx", import.meta.url), "utf8");

describe("Home floating social links", () => {
  it("keeps all four Hero social buttons free of white outline borders", () => {
    expect(source).toContain('aria-label="Visit Ragnarok Universe on Discord" className="floating-social-link flex h-12 w-12 items-center justify-center rounded-full border-0');
    expect(source).toContain('aria-label="Visit Ragnarok Universe on Facebook" className="floating-social-link flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-0');
    expect(source).toContain('aria-label="Visit Ragnarok Universe on YouTube" className="floating-social-link flex h-12 w-12 items-center justify-center rounded-full border-0');
    expect(source).toContain('aria-label="Visit Ragnarok Universe on X" className="floating-social-link flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-0');
    expect(source).not.toContain("border-white/70");
  });

  it("adds a visible but motion-safe glow on hover and keyboard focus", () => {
    expect(source).toContain("@keyframes floating-social-glow");
    expect(source).toContain(".floating-social-link:hover, .floating-social-link:focus-visible");
    expect(source).toContain("prefers-reduced-motion: reduce");
    expect(source.match(/floating-social-link flex/g)).toHaveLength(4);
  });
});
