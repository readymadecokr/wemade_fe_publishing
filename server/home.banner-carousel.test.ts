import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");

describe("Home banner carousel safety", () => {
  it("clamps the visible banner index when the active source list becomes shorter", () => {
    expect(homeSource).toContain("const activeBanner = banners[bannerIndex] ?? banners[0]");
    expect(homeSource).toContain("if (bannerIndex >= banners.length) setBannerIndex(0)");
    expect(homeSource).toContain("}, [bannerIndex, banners.length]);");
  });

  it("keeps a non-empty fallback collection so navigation never calculates modulo zero", () => {
    expect(homeSource).toContain("const fallbackBanners = [");
    expect(homeSource).toContain("const source = dbBanners && dbBanners.length > 0 ? dbBanners : fallbackBanners");
    expect(homeSource).toContain("if (paused || banners.length < 2) return;");
    expect(homeSource).toContain("(current - 1 + banners.length) % banners.length");
    expect(homeSource).toContain("(current + 1) % banners.length");
  });

  it("provides a complete fallback banner message and action when administration data is unavailable", () => {
    expect(homeSource).toContain("MIDGARD RUNS IN YOUR BROWSER");
    expect(homeSource).toContain("EXPLORE THE BETA");
    expect(homeSource).toContain("A NEW CHAPTER AWAITS");
  });
});
