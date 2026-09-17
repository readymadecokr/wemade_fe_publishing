import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React Home CTA, headings, and footer", () => {
  it("keeps the closing CTA and footer as separate content regions", () => {
    expect(homeSource).toContain('aria-label="Ragnarok Universe closing call to action"');
    expect(homeSource).toContain('<div className="react-home-closing">');
    expect(homeSource).toContain('<footer className="react-home-footer" data-snap-panel');
    expect(styleSource).toContain('.react-home-closing { padding: 80px 0; }');
  });

  it("uses the white Gravity asset and borderless official social marks", () => {
    expect(homeSource).toContain('rou-gravity-logo-white_c5669483.png');
    expect(homeSource).toContain('/manus-storage/Discord_icon_230fdb89_6026051e.png');
    expect(homeSource).toContain('/manus-storage/facebook-logo-primary_2867583f.webp');
    expect(homeSource).toContain('/manus-storage/x-logo-black_193d8b29.webp');
    expect(styleSource).toContain('.react-home-footer__social a, .react-home-footer__social a:nth-child(4) { border: 0; }');
  });

  it("keeps 80px vertical breathing room across every requested content section", () => {
    expect(styleSource).toContain('.react-home-discord, .react-home-news, .react-home-game-info, .react-home-media { padding: 80px 0; }');
    expect(styleSource).toContain('.react-home-closing { padding: 80px 0; }');
    expect(styleSource).toContain('.react-home-footer { padding-block: 80px; }');
  });

  it("matches the Game Info artwork height to the left content on desktop", () => {
    expect(homeSource).toContain('className="react-home-game-info__copy"');
    expect(homeSource).toContain('className="react-home-game-info__art"');
    expect(styleSource).toContain('.react-home-game-info__grid { align-items: stretch; }');
    expect(styleSource).toContain('.react-home-game-info__art { height: auto; min-height: 100%; margin-top: 0; align-self: stretch; }');
  });

  it("enlarges only the final Game Start CTA while preserving mobile stacking", () => {
    expect(styleSource).toContain('.react-home-closing .home-cta-pair .home-game-start { flex: 1.2 1.2 0; height: 77px; }');
    expect(styleSource).toContain('.react-home-closing .home-cta-pair .home-game-start { height: 77px; flex-basis: 77px; }');
    expect(styleSource).toContain('.react-home-closing .home-cta-pair .home-discord-button { flex: 0 1 266px; width: min(266px,42vw); height: 64px; }');
  });

  it("floats the Hero Game Start independently on the Hero and Discord boundary", () => {
    expect(homeSource).toContain('className="react-home-boundary-game-start" aria-label="Hero Game Start"');
    expect(homeSource).not.toContain('className="react-home-discord__game-start"');
    expect(styleSource).toContain('.react-home-boundary-game-start { grid-area: discord; position: relative; z-index: 9;');
  });
});
