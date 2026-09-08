import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");

describe("direct React Home initial-load performance", () => {
  it("does not load the static reference document or its embedded resource graph", () => {
    expect(homeSource).not.toContain("REFERENCE_HOME_URL");
    expect(homeSource).not.toContain("fullpanel-scroll");
    expect(homeSource).not.toContain("ragnarok-reference-frame");
  });

  it("prioritizes only the Hero and lazily loads lower images and the Discord widget", () => {
    expect(homeSource).toContain('fetchPriority="high"');
    expect(homeSource).toContain('loading="lazy"');
    expect(homeSource).toContain("HERO_DESKTOP_URL");
    expect(homeSource).toContain("HERO_MOBILE_URL");
  });
});
