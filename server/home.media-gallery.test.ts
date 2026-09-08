import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const homeStyles = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("Home Media screenshot gallery", () => {
  it("reuses twelve existing News image assets and displays three gallery items per view", () => {
    expect(homeSource).toContain("const MEDIA_SCREENSHOTS = [");
    expect(homeSource).toContain("RO1_pathupdate_17062026_f83f13b8_0ccbefaa.jpg");
    expect(homeSource).toContain("RO_PatchUpdate_22042026_337d2472_7c5c5406.webp");
    expect(homeSource).toContain('slidesToScroll: 3');
    expect(homeSource).toContain('className="basis-1/3 react-home-media__carousel-item"');
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
    expect(homeStyles).toContain(".react-home-media__thumbnail { position: relative; display: block; width: 100%; height: clamp(84px,15vh,142px)");
  });
});
