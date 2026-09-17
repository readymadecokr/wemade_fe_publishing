import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const homeStyles = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");
const stripStyles = readFileSync(new URL("../client/src/pages/media-strip.css", import.meta.url), "utf8");

describe("Home Media screenshot gallery", () => {
  it("uses only active administrator-managed screenshots and hides the gallery when none are selected", () => {
    expect(homeSource).toContain("trpc.publicScreenshots.list.useQuery");
    expect(homeSource).toContain("const mediaScreenshots = managedScreenshots?.map");
    expect(homeSource).not.toContain("DEFAULT_MEDIA_SCREENSHOTS");
    expect(homeSource).toContain("mediaScreenshots.length > 0 && <div className=\"react-home-media__gallery\"");
    expect(homeSource).toContain("mediaScreenshots.map");
    expect(homeSource).toContain('className="react-home-media__strip"');
    expect(homeSource).toContain('className="react-home-media__scrollbar"');
    expect(homeSource).toContain('aria-label="Browse screenshots"');
    expect(homeSource).toContain('aria-label="Previous screenshots"');
    expect(homeSource).toContain('aria-label="Next screenshots"');
    expect(homeSource).not.toContain("DRAG TO EXPLORE");
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
    expect(homeSource).toContain('loading={index < 6 ? "eager" : "lazy"}');
    expect(homeSource).not.toContain('<p>{selectedScreenshot + 1} / {MEDIA_SCREENSHOTS.length}');
  });

  it("keeps Media content inside the panel with compact video, non-cropping thumbnails, and a long position track", () => {
    expect(homeStyles).toContain(".react-home-discord, .react-home-news, .react-home-game-info, .react-home-media { display: block; min-height: 0; height: auto; padding: 30px 0; }");
    expect(homeStyles).toContain(".react-home-media__feature { aspect-ratio: 2.5 / 1; }");
    expect(stripStyles).toContain(".react-home-media__strip {\n  display: flex;");
    expect(stripStyles).toContain("gap: 4px;");
    expect(stripStyles).toContain("width: calc((100% - 20px) / 6);");
    expect(stripStyles).toContain(".react-home-media__gallery-label { margin-bottom: 8px; font-size: 8px; font-weight: 400; }");
    expect(stripStyles).toContain("width: calc((100% - 6px) / 3);");
    expect(stripStyles).toContain("aspect-ratio: 700 / 360;");
    expect(stripStyles).toContain("object-fit: contain; object-position: center;");
    expect(homeStyles).toContain("box-sizing: border-box; width: 100%; height: clamp(84px,15vh,142px); overflow: hidden; border: 1px solid rgba(224,237,252,.54); border-radius: 0; padding: 0; background: transparent;");
    expect(homeStyles).toContain(".react-home-media__thumbnail { border-radius: 0; }");
    expect(stripStyles).toContain(".react-home-media__position-track");
    expect(stripStyles).toContain(".react-home-media__position-window");
    expect(stripStyles).toContain(".react-home-media__scroll-arrow");
  });
});
