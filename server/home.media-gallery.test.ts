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
    expect(homeSource).toContain('aria-label="Previous screenshots"');
    expect(homeSource).toContain('aria-label="Next screenshots"');
  });

  it("renders the first active admin video through the public Media procedure", () => {
    expect(homeSource).toContain("trpc.publicMedia.list.useQuery");
    expect(homeSource).toContain("const featuredVideo = managedVideos?.[0]");
    expect(homeSource).toContain("getYoutubeEmbedUrl");
    expect(homeSource).toContain("www.youtube-nocookie.com/embed/");
  });

  it("opens a keyboard-accessible enlarged screenshot dialog", () => {
    expect(homeSource).toContain("setSelectedScreenshot(index)");
    expect(homeSource).toContain('role="dialog" aria-modal="true"');
    expect(homeSource).toContain('event.key === "Escape"');
    expect(homeSource).toContain("react-home-gallery-modal");
  });

  it("keeps Media content inside the panel with compact video, non-cropping thumbnails, and a long position track", () => {
    expect(homeStyles).toContain(".react-home-media { display: flex; align-items: center; padding: clamp(28px,4vh,48px)");
    expect(homeStyles).toContain(".react-home-media__feature { aspect-ratio: 2.5 / 1; }");
    expect(stripStyles).toContain(".react-home-media__strip {\n  display: flex;");
    expect(stripStyles).toContain("gap: 4px;");
    expect(stripStyles).toContain("width: calc((100% - 20px) / 6);");
    expect(stripStyles).toContain("aspect-ratio: 700 / 360;");
    expect(stripStyles).toContain("object-fit: contain; object-position: center;");
    expect(homeStyles).toContain("box-sizing: border-box; width: 100%; height: clamp(84px,15vh,142px); overflow: hidden; border: 1px solid rgba(224,237,252,.54); border-radius: 0; padding: 0; background: transparent;");
    expect(homeStyles).toContain(".react-home-media__thumbnail { border-radius: 0; }");
    expect(stripStyles).toContain(".react-home-media__position-track");
    expect(stripStyles).toContain(".react-home-media__position-window");
    expect(stripStyles).toContain(".react-home-media__scroll-arrow");
  });
});
