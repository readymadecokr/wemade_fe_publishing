import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const serviceFooterSource = readFileSync(new URL("../client/src/components/ServiceFooter.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React Home CTA, headings, and footer", () => {
  it("keeps the closing CTA and footer as separate content regions", () => {
    expect(homeSource).toContain('aria-label="Ragnarok Universe closing call to action"');
    expect(homeSource).toContain('<div className="react-home-closing">');
    expect(homeSource).toContain('<ServiceFooter snapPanel />');
    expect(styleSource).toContain('.react-home-closing { padding: 80px 0; }');
  });

  it("uses the supplied illustration behind a maximum 800px readable Closing CTA", () => {
    expect(homeSource).toContain('className="react-home-closing__illustration" src="/manus-storage/ragnarok-universe-closing-cta-illustration_c16b4942.webp"');
    expect(styleSource).toContain('height: min(800px, calc(100dvh - var(--react-home-header-height)))');
    expect(styleSource).toContain('.react-home-closing::before');
    expect(styleSource).toContain('.react-home-closing__content { position: relative; z-index: 1;');
  });

  it("uses the white Gravity asset and borderless official social marks", () => {
    expect(serviceFooterSource).toContain('rou-gravity-logo-white_c5669483.png');
    expect(serviceFooterSource).toContain('/manus-storage/Discord_icon_230fdb89_6026051e.png');
    expect(serviceFooterSource).toContain('/manus-storage/facebook-logo-primary_2867583f.webp');
    expect(serviceFooterSource).toContain('/manus-storage/x-logo-black_193d8b29.webp');
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

  it("uses equal fixed outer image slots for the final CTA while preserving mobile stacking", () => {
    expect(styleSource).toContain('.react-home-closing .home-cta-pair .home-game-start { height: 77px; flex-basis: 77px; }');
    expect(styleSource).toContain('.react-home-closing .home-cta-pair .home-discord-button,\n  .react-home-closing .home-cta-pair .home-game-start { flex: 0 0 210px; width: 210px; }');
    expect(styleSource).toContain('.react-home-closing .home-cta-pair { width: min(444px, calc(100% - 44px)); margin-inline: auto; justify-content: center; gap: 24px; }');
    expect(styleSource).toContain('.react-home-closing .home-cta-pair .home-game-start img { width: 100%; max-width: 100%; }');
  });

  it("increases the mobile Hero description by exactly 2px at both clamp bounds", () => {
    expect(styleSource).toContain('font-size: clamp(9px,calc(1.8vw + 2px),11px);');
  });

  it("removes the Hero shade overlay and keeps Footer Privacy Settings bold at link size", () => {
    expect(homeSource).not.toContain('react-home-hero__shade');
    expect(styleSource).not.toContain('.react-home-hero__shade');
    expect(styleSource).toContain('font-size: 11px; font-weight: 700;');
    expect(styleSource).toContain('.react-home-footer nav a,\n.react-home-footer nav .react-home-footer__privacy-settings { font-weight: 700; }');
  });

  it("keeps the mobile Discord channel tall and places copyright under the Gravity mark", () => {
    expect(styleSource).toContain('.react-home-discord .react-home-widget__frame { height: min(64vh, 660px); min-height: 520px; }');
    expect(styleSource).toContain('.react-home-footer__inner > div:first-child { grid-template-columns: 1fr; }');
    expect(styleSource).toContain('.react-home-footer__inner > div:first-child > p span:first-child { grid-column: 1; grid-row: 4; margin-top: 10px; text-align: center; }');
  });

  it("floats the Hero Game Start independently on the Hero and Discord boundary", () => {
    expect(homeSource).toContain('className="react-home-boundary-game-start" aria-label="Hero Game Start"');
    expect(homeSource).not.toContain('className="react-home-discord__game-start"');
    expect(styleSource).toContain('.react-home-boundary-game-start { grid-area: discord; position: relative; z-index: 9;');
  });
});
