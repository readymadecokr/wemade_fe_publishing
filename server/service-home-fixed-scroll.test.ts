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
    expect(homeSource).toContain("react-home-final-panel");
    expect(homeSource).toContain("react-home-closing");
    expect(homeSource).toContain("react-home-footer");
  });

  it("offsets sections for the fixed live header without a nested website iframe", () => {
    expect(styleSource).toContain("padding-top: var(--react-home-header-height)");
    expect(styleSource).toContain("scroll-padding-top: var(--react-home-header-height)");
    expect(styleSource).toContain(".react-home-news, .react-home-game-info, .react-home-media { scroll-snap-align: start; scroll-snap-stop: always; }");
    expect(styleSource).toContain(".react-home-home-stage, .react-home-discord { box-sizing: border-box; height: calc(100svh - var(--react-home-header-height)); height: calc(100dvh - var(--react-home-header-height));");
    expect(styleSource).toContain(".react-home-final-panel { box-sizing: border-box; height: 100svh; height: 100dvh; min-height: 100svh; min-height: 100dvh; margin-top: calc(-1 * var(--react-home-header-height)); padding-top: var(--react-home-header-height); scroll-snap-align: start; scroll-snap-stop: always; }");
    expect(styleSource).toContain(".react-home-final-panel .react-home-closing { min-height: 0; flex: 1 1 auto; }");
    expect(styleSource).toContain(":root { --react-home-header-height: 112px; }");
    expect(homeSource).toContain("react-home-hero-cta-row");
    expect(homeSource).not.toContain("<iframe\n        name=");
  });

  it("keeps each homepage region in an explicit single-column grid row", () => {
    expect(homeSource).toContain('className="react-home-layout"');
    expect(homeSource).toContain('className="react-home-home-stage" data-snap-panel');
    expect(styleSource).toContain('grid-template-areas: "home" "discord" "news" "game-info" "media" "final"');
    expect(styleSource).toContain(".react-home-home-stage { grid-area: home;");
    expect(styleSource).toContain(".react-home-final-panel { grid-area: final;");
    expect(styleSource).toContain("grid-template-rows: minmax(0, 1fr) clamp(66px,7.7vw,110px);");
  });

  it("moves one full-screen panel at a time on desktop wheel input", () => {
    expect(homeSource).toContain('querySelectorAll<HTMLElement>("[data-snap-panel]")');
    expect(homeSource).toContain('panels[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" })');
    expect(styleSource).toContain("scroll-snap-type: y mandatory;");
    expect(styleSource).toContain("scroll-snap-stop: always;");
  });
});
