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
});
