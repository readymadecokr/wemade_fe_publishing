import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");

describe("PPTX service page layout", () => {
  it("uses separated account and game navigation with the requested game links", () => {
    expect(layoutSource).toContain("Two-tier Global Navigation");
    expect(layoutSource).toContain("HOME");
    expect(layoutSource).toContain("GAME INFO");
    expect(layoutSource).toContain("COMMUNITY");
    expect(layoutSource).toContain("GAME START");
    expect(layoutSource).toContain("https://discord.gg/yVWJkWdkAU");
  });

  it("adds PPTX copy and media browsing without removing service routes", () => {
    expect(homeSource).toContain("Official Community");
    expect(homeSource).toContain("Development news and community updates from the official Ragnarok Universe Discord.");
    expect(homeSource).toContain("News and Notice");
    expect(homeSource).toContain("Latest From Midgard");
    expect(homeSource).toContain("Classic Adventure");
    expect(homeSource).toContain("Rune-Midgarts Library");
    expect(homeSource).toContain("See the World in Motion");
    expect(homeSource).toContain("slice(0, 12)");
    expect(homeSource).toContain("REFERENCE_MEDIA_SCREENSHOTS");
    expect(homeSource).toContain("REFERENCE_MEDIA_SCREENSHOTS.slice(0, 12)");
    expect(homeSource).toContain("aria-label={`View screenshot ${index + 1} full screen`}");
    expect(homeSource).toContain("aria-label=\"Next screenshot\"");
    expect(layoutSource).toContain("Your story begins here");
    expect(layoutSource).toContain("Two Clicks to Midgard");
  });
});
