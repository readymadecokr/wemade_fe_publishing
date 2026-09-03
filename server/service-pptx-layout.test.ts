import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");

describe("final reference service page layout", () => {
  it("renders the reference community presentation instead of an iframe-only section", () => {
    expect(homeSource).toContain("OFFICIAL COMMUNITY");
    expect(homeSource).toContain("Developer Note #1 is Here");
    expect(homeSource).toContain("Continue on Discord");
    expect(homeSource).toContain("Join Discord");
    expect(styleSource).toContain(".reference-community-card");
    expect(styleSource).toContain("grid-template-columns:196px 1fr");
  });

  it("keeps reference headings, media browsing, and live service routes together", () => {
    expect(homeSource).toContain("Latest from Midgard");
    expect(homeSource).toContain("Classic adventure.");
    expect(homeSource).toContain("A new way to play.");
    expect(homeSource).toContain("SEE THE WORLD IN MOTION");
    expect(homeSource).toContain('href="/game-info"');
    expect(homeSource).toContain('href="/news"');
    expect(layoutSource).toContain('href="/point-shop"');
  });
});
