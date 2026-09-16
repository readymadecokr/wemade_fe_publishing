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
    expect(homeSource).toContain("react-home-closing-panel");
    expect(homeSource).toContain("react-home-closing");
    expect(homeSource).toContain("react-home-footer");
  });

  it("keeps the fixed live header separate from content-driven Home regions without a nested website iframe", () => {
    expect(styleSource).toContain("padding-top: var(--react-home-header-height)");
    expect(styleSource).toContain("scroll-padding-top: var(--react-home-header-height)");
    expect(styleSource).toContain(".react-home-layout > [data-snap-panel] { height: auto; min-height: 0; overflow: visible; }");
    expect(styleSource).toContain(".react-home-home-stage { height: calc(100svh - var(--react-home-header-height)); min-height: calc(100svh - var(--react-home-header-height)); }");
    expect(styleSource).toContain(".react-home-discord, .react-home-news, .react-home-game-info, .react-home-media { display: block; min-height: 0; height: auto; padding: 30px 0; }");
    expect(styleSource).toContain(".react-home-closing { min-height: 0; padding: 30px 0; }");
    expect(styleSource).toContain(".react-home-footer { grid-area: footer; min-height: 0; padding: 30px 0; }");
    expect(styleSource).toContain(":root { --react-home-header-height: 112px; }");
    expect(homeSource).toContain("react-home-hero-cta-row");
    expect(homeSource).not.toContain("<iframe\n        name=");
  });

  it("keeps each homepage region in an explicit single-column grid row", () => {
    expect(homeSource).toContain('className="react-home-layout"');
    expect(homeSource).toContain('className="react-home-home-stage" data-snap-panel');
    expect(styleSource).toContain('grid-template-areas: "home" "discord" "news" "game-info" "media" "closing" "footer"');
    expect(styleSource).toContain(".react-home-home-stage { grid-area: home;");
    expect(styleSource).toContain(".react-home-closing-panel { grid-area: closing;");
    expect(styleSource).toContain("grid-template-rows: minmax(0, 1fr) clamp(66px,7.7vw,110px);");
  });

  it("moves to each variable-height region start on desktop wheel input", () => {
    expect(homeSource).toContain('querySelectorAll<HTMLElement>("[data-snap-panel]")');
    expect(styleSource).toContain("scroll-snap-type: none;");
    expect(homeSource).toContain("window.scrollTo({ top: getPanelScrollTop(panels[nextIndex]), behavior });");
    expect(homeSource).not.toContain('panels[nextIndex].scrollIntoView');
  });
});
