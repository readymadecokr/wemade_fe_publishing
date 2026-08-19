import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("fantasy portal visual polish", () => {
  it("keeps all home news cards at a consistent content height", () => {
    expect(homeSource).toContain('flex h-full flex-col overflow-hidden');
    expect(homeSource).toContain('min-h-[84px] flex-1 flex-col');
    expect(homeSource).toContain('min-h-[2.5rem]');
    expect(homeSource).toContain('mt-auto text-[11px]');
  });

  it("uses the fantasy atlas and ornament assets for portal decoration", () => {
    expect(styleSource).toContain('ragnarok-fantasy-parchment-atlas-bg_ff7c9fce.png');
    expect(styleSource).toContain('ragnarok-fantasy-section-ornament_f3f3bf5d.png');
    expect(homeSource).toContain('fantasy-section-decorated');
  });

  it("keeps the logged-in Logout control legible against the dark header", () => {
    expect(layoutSource).toContain('bg-[#fffaf0]');
    expect(layoutSource).toContain('text-[#263b5b]');
    expect(layoutSource).toContain('>\n                Logout\n');
  });

  it("keeps the portal header translucent and the sign-in call to action distinguishable", () => {
    expect(layoutSource).toContain('bg-[#1c3147]/72');
    expect(layoutSource).toContain('backdrop-blur-xl');
    expect(layoutSource).toContain('portal-nav');
    expect(layoutSource).toContain('hover:border-[#fff0bd]');
  });

  it("keeps the footer atlas, View More ornament, and mobile social control placement", () => {
    expect(layoutSource).toContain('ragnarok-fantasy-footer-atlas_e83c8727.png');
    expect(styleSource).toContain('.fantasy-view-more::before');
    expect(styleSource).toContain('.floating-social-box');
    expect(homeSource).toContain('className="mb-6"');
  });
});
