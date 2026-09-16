import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React Home section navigation", () => {
  it("moves desktop wheel input to the mounted section start without changing or reloading a document URL", () => {
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

  it("uses content-driven regions with 30px vertical padding and separates the CTA from the footer", () => {
    expect(styleSource).toContain('grid-template-areas: "home" "discord" "news" "game-info" "media" "closing" "footer";');
    expect(styleSource).toContain(".react-home-discord, .react-home-news, .react-home-game-info, .react-home-media { display: block; min-height: 0; height: auto; padding: 30px 0; }");
    expect(styleSource).toContain(".react-home-closing-panel { grid-area: closing; min-height: 0; overflow: visible; background: #fbf8f1; }");
    expect(styleSource).toContain(".react-home-footer { grid-area: footer; min-height: 0; padding: 30px 0; }");
    expect(styleSource).toContain(".react-home-layout > [data-snap-panel] { height: auto; min-height: 0; overflow: visible; }");
    expect(homeSource).toContain('className="react-home-panel react-home-closing-panel"');
    expect(homeSource).toContain('<footer className="react-home-footer" data-snap-panel');
    expect(styleSource).toContain(".react-home-hero { position: relative; display: grid;");
    expect(styleSource).not.toContain("reference-home-embed__frame");
  });
});
