import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React Home section navigation", () => {
  it("smoothly scrolls the mounted React sections without changing or reloading a document URL", () => {
    expect(homeSource).toContain("const getPanelScrollTop = (panel: HTMLElement) => {");
    expect(homeSource).toContain("window.scrollTo({ top: getPanelScrollTop(panels[nextIndex]), behavior });");
    expect(homeSource).toContain("new IntersectionObserver");
    expect(homeSource).toContain("let touchStartPanelIndex: number | null = null;");
    expect(homeSource).toContain("const movePanel = (direction: -1 | 1, startingIndex = getCurrentPanelIndex()) =>");
    expect(homeSource).toContain('window.addEventListener("touchstart", handleTouchStart, { passive: true })');
    expect(homeSource).toContain('window.addEventListener("touchmove", handleTouchMove, { passive: false })');
    expect(homeSource).toContain('window.addEventListener("touchend", handleTouchEnd, { passive: true })');
    expect(homeSource).toContain("touchStartPanelIndex = getCurrentPanelIndex();");
    expect(homeSource).toContain("movePanel(verticalTravel > 0 ? -1 : 1, startingPanelIndex ?? getCurrentPanelIndex())");
    expect(homeSource).toContain("let pendingWheelDelta = 0;");
    expect(homeSource).toContain("const isDesktopPanelViewport = () => window.matchMedia(\"(min-width: 761px)\").matches;");
    expect(homeSource).toContain("if (!isDesktopPanelViewport() || event.ctrlKey) return;\n      event.preventDefault();");
    expect(homeSource).toContain("if (Math.abs(pendingWheelDelta) < 12) return;");
    expect(homeSource).toContain("const releaseTransitionLock = () => {");
    expect(homeSource).toContain("if (verticalTravel > 8 && verticalTravel > horizontalTravel) event.preventDefault();");
    expect(homeSource).not.toContain("!isPanelViewport()");
    expect(homeSource).not.toContain('event.target.closest(".react-home-widget")');
    expect(homeSource).not.toContain("react-home-mobile-panel-return");
    expect(styleSource).toContain(".react-home-widget__frame { pointer-events: none; }");
    expect(homeSource).not.toContain("postMessage({ type: \"ragnarok-reference-scroll\"");
  });

  it("retains full visual panels and avoids iframe-specific scroll styling", () => {
    expect(styleSource).toContain(".react-home-layout { display: grid; grid-template-columns: minmax(0, 1fr);");
    expect(styleSource).toContain(".react-home-panel { min-height: 100svh;");
    expect(styleSource).toContain(".react-home-layout > [data-snap-panel] { box-sizing: border-box; height: calc(100svh - var(--react-home-header-height)); height: calc(100dvh - var(--react-home-header-height)); min-height: calc(100svh - var(--react-home-header-height)); min-height: calc(100dvh - var(--react-home-header-height)); overflow: hidden; }");
    expect(styleSource).toContain(".react-home-news, .react-home-game-info, .react-home-media { box-sizing: border-box; height: calc(100svh - var(--react-home-header-height)); height: calc(100dvh - var(--react-home-header-height)); min-height: calc(100svh - var(--react-home-header-height)); min-height: calc(100dvh - var(--react-home-header-height)); overflow: hidden; }");
    expect(styleSource).toContain(".react-home-home-stage, .react-home-discord { box-sizing: border-box; height: calc(100svh - var(--react-home-header-height)); height: calc(100dvh - var(--react-home-header-height)); min-height: calc(100svh - var(--react-home-header-height)); min-height: calc(100dvh - var(--react-home-header-height)); overflow: hidden; scroll-snap-align: start; scroll-snap-stop: normal; }");
    expect(styleSource).toContain(".react-home-discord__shell { display: flex; width: calc(100% - 28px); min-height: 0; margin-inline: auto; flex: 0 1 auto; flex-direction: column; }");
    expect(styleSource).toContain(".react-home-media { height: 100svh; height: 100dvh; min-height: 100svh; min-height: 100dvh; }");
    expect(styleSource).toContain("html.react-home-snap { scroll-padding-top: var(--react-home-header-height); scroll-behavior: auto; scroll-snap-type: none; }");
    expect(styleSource).toContain(".react-home-discord, .react-home-news, .react-home-game-info, .react-home-media { scroll-snap-align: start; scroll-snap-stop: normal; }");
    expect(styleSource).toContain(".react-home-final-panel { box-sizing: border-box; height: 100svh; height: 100dvh; min-height: 100svh; min-height: 100dvh; margin-top: calc(-1 * var(--react-home-header-height)); padding-top: var(--react-home-header-height); scroll-snap-align: start; scroll-snap-stop: normal; }");
    expect(styleSource).toContain(".react-home-hero { position: relative; display: grid;");
    expect(styleSource).not.toContain("reference-home-embed__frame");
  });
});
