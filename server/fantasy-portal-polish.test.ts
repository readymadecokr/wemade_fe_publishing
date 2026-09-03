import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("reference Ragnarok portal presentation", () => {
  it("uses separated fantasy surfaces for the Hero, community, editorial, information, and media panels", () => {
    ["reference-hero-panel", "reference-discord-panel", "reference-news-panel", "reference-game-info-panel", "reference-media-panel"].forEach((surface) => {
      expect(homeSource).toContain(surface);
    });
    expect(styleSource).toContain("linear-gradient(145deg,#0b1e35,#173354 58%,#0b2138)");
    expect(styleSource).toContain("linear-gradient(150deg,#f9f4e8,#e7dac1)");
  });

  it("keeps carousel, media gallery, fullscreen viewer, and official social routes accessible", () => {
    expect(homeSource).toContain("reference-banner-tabs");
    expect(homeSource).toContain("reference-shot-strip");
    expect(homeSource).toContain("reference-lightbox");
    expect(homeSource).toContain("VIEW FULLSCREEN");
    expect(layoutSource).toContain("Visit Ragnarok Universe on Discord");
    expect(layoutSource).toContain("Visit Ragnarok Universe on Facebook");
    expect(layoutSource).toContain("Visit Ragnarok Universe on YouTube");
    expect(layoutSource).toContain("Visit Ragnarok Universe on X");
  });

  it("keeps the fixed portal navigation and social floating panel visible above the reference Home", () => {
    expect(layoutSource).toContain("fixed inset-x-0 top-0 z-40");
    expect(layoutSource).toContain("floating-social-box fixed right-3 top-1/2 z-40");
    expect(layoutSource).toContain("portal-nav-link--active");
  });
});
