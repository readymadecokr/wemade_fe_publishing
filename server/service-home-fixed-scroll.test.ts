import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React full-page service Home", () => {
  it("renders Hero, Discord, News, Game Info, Media, closing CTA, and footer in the current application", () => {
    expect(homeSource).toContain("react-home-hero");
    expect(homeSource).toContain("react-home-discord");
    expect(homeSource).toContain("react-home-news");
    expect(homeSource).toContain("react-home-game-info");
    expect(homeSource).toContain("react-home-media");
    expect(homeSource).toContain("react-home-closing");
    expect(homeSource).toContain("react-home-footer");
  });

  it("offsets sections for the fixed live header without a nested website iframe", () => {
    expect(styleSource).toContain("scroll-margin-top: var(--react-home-header-height)");
    expect(styleSource).toContain("padding-top: var(--react-home-header-height)");
    expect(homeSource).toContain("react-home-hero-cta-row");
    expect(homeSource).not.toContain("<iframe\n        name=");
  });

  it("keeps each homepage region in an explicit single-column grid row", () => {
    expect(homeSource).toContain('className="react-home-layout"');
    expect(homeSource).toContain('className="react-home-home-stage" data-snap-panel');
    expect(styleSource).toContain('grid-template-areas: "home" "discord" "news" "game-info" "media" "closing" "footer"');
    expect(styleSource).toContain(".react-home-home-stage { grid-area: home;");
    expect(styleSource).toContain(".react-home-footer { grid-area: footer;");
    expect(styleSource).toContain("grid-template-rows: minmax(0, 1fr) auto;");
  });

  it("moves one full-screen panel at a time on desktop wheel input", () => {
    expect(homeSource).toContain('querySelectorAll<HTMLElement>("[data-snap-panel]")');
    expect(homeSource).toContain('panels[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" })');
    expect(styleSource).toContain("scroll-snap-type: y mandatory;");
    expect(styleSource).toContain("scroll-snap-stop: always;");
  });
});
