import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React Home section navigation", () => {
  it("smoothly scrolls the mounted React sections without changing or reloading a document URL", () => {
    expect(homeSource).toContain('scrollIntoView({ behavior: "smooth", block: "start" })');
    expect(homeSource).toContain("new IntersectionObserver");
    expect(homeSource).not.toContain("postMessage({ type: \"ragnarok-reference-scroll\"");
  });

  it("retains full visual panels and avoids iframe-specific scroll styling", () => {
    expect(styleSource).toContain(".react-home-layout { display: grid; grid-template-columns: minmax(0, 1fr);");
    expect(styleSource).toContain(".react-home-panel { min-height: 100svh;");
    expect(styleSource).toContain(".react-home-news, .react-home-game-info, .react-home-media { box-sizing: border-box; min-height: calc(100svh - var(--react-home-header-height)); }");
    expect(styleSource).toContain(".react-home-hero { position: relative; display: grid;");
    expect(styleSource).not.toContain("reference-home-embed__frame");
  });
});
