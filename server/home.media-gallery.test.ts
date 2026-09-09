import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const homeStyles = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");
const stripStyles = readFileSync(new URL("../client/src/pages/media-strip.css", import.meta.url), "utf8");

describe("Home Media screenshot gallery", () => {
  it("reuses twelve existing News image assets in a continuous three-item screenshot strip", () => {
    expect(homeSource).toContain("const MEDIA_SCREENSHOTS = [");
    expect(homeSource).toContain("RO1_pathupdate_17062026_f83f13b8_0ccbefaa.jpg");
    expect(homeSource).toContain("RO_PatchUpdate_22042026_337d2472_7c5c5406.webp");
    expect(homeSource).toContain('className="react-home-media__strip"');
    expect(homeSource).toContain('className="react-home-media__scrollbar"');
    expect(homeSource).toContain('aria-label="Browse screenshots"');
  });

  it("opens a keyboard-accessible enlarged screenshot dialog", () => {
    expect(homeSource).toContain("setSelectedScreenshot(index)");
    expect(homeSource).toContain('role="dialog" aria-modal="true"');
    expect(homeSource).toContain('event.key === "Escape"');
    expect(homeSource).toContain("react-home-gallery-modal");
  });

  it("keeps Media content inside the panel with a compact feature and gallery height", () => {
    expect(homeStyles).toContain(".react-home-media { display: flex; align-items: center; padding: clamp(28px,4vh,48px)");
    expect(homeStyles).toContain(".react-home-media__feature { position: relative; overflow: hidden; aspect-ratio: 3.15 / 1");
    expect(stripStyles).toContain(".react-home-media__strip {\n  display: flex;");
    expect(stripStyles).toContain("width: calc((100% - 24px) / 3);");
    expect(stripStyles).toContain(".react-home-media__scrollbar input {\n  display: block;");
  });
});
