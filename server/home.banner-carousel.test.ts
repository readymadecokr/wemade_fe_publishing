import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");

describe("Home banner carousel safety", () => {
  it("clamps the current index when the active banner list becomes shorter", () => {
    expect(homeSource).toContain("const currentBanner = bannerImages[currentBannerIndex] ?? bannerImages[0]");
    expect(homeSource).toContain("setCurrentBannerIndex(previous => bannerImages.length ? Math.min(previous, bannerImages.length - 1) : 0)");
    expect(homeSource).toContain("}, [bannerImages.length]);");
  });

  it("does not calculate modulo zero or expose carousel arrows for one banner", () => {
    expect(homeSource).toContain("bannerImages.length ? (prev + 1) % bannerImages.length : 0");
    expect(homeSource).toContain("bannerImages.length ? (prev - 1 + bannerImages.length) % bannerImages.length : 0");
    expect(homeSource).toContain("if (bannerImages.length < 2) return;");
    expect(homeSource).toContain("{bannerImages.length > 1 && <>");
  });

  it("renders a safe fallback when there are no available banners", () => {
    expect(homeSource).toContain("No banner is currently available.");
  });
});
