import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const homeHeaderSource = readFileSync(new URL("../client/src/components/HomeHeader.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React Home CTA, headings, and footer", () => {
  it("uses the provided artwork for every shared Game Start and Discord CTA", () => {
    expect(homeHeaderSource).toContain('const GAME_START_BUTTON_URL = "/manus-storage/gamestart_BTN_1c6449da.png"');
    expect(homeHeaderSource).toContain('const DISCORD_BUTTON_URL = "/manus-storage/Discord-Logo-White_b3128ea2.png"');
    expect(homeHeaderSource).toContain("function GameStartButton");
    expect(homeHeaderSource).toContain("function DiscordButton");
    expect(homeSource).toContain("function HomeCtaPair");
  });

  it("keeps Discord left, Game Start right, and the requested press-down interaction", () => {
    expect(homeSource).toContain("<DiscordButton /><GameStartButton />");
    expect(styleSource).toContain(".home-game-start img { display: block; width: auto; max-width: 100%; height: auto; max-height: 100%; object-fit: contain; }");
    expect(styleSource).toContain(".home-game-start:hover { filter: none; transform: translateY(4px); }");
    expect(styleSource).toContain(".home-discord-button { border-radius: 18px; background: #5865f2;");
    expect(styleSource).toContain(".home-discord-button img { display: block; width: 82%; max-height: 38px;");
  });

  it("keeps the closing CTA and footer as independent Home regions", () => {
    expect(homeSource).toContain('aria-label="Ragnarok Universe closing call to action"');
    expect(homeSource).toContain('<div className="react-home-closing">');
    expect(homeSource).toContain('<footer className="react-home-footer" data-snap-panel');
    expect(styleSource).toContain('.react-home-closing-panel { grid-area: closing; min-height: 0; overflow: visible; background: #fbf8f1; }');
    expect(styleSource).toContain('.react-home-closing { min-height: 0; padding: 30px 0; }');
    expect(styleSource).toContain('.react-home-footer { grid-area: footer; min-height: 0; padding: 30px 0; }');
    expect(styleSource).toContain('.react-home-closing h2 { color: #1b344c; font-size: clamp(31px,3.57vw,53px); line-height: .98; }');
    expect(styleSource).toContain('.react-home-section-heading > div > span, .react-home-game-info__copy > span, .react-home-closing__content > span { display: block; margin-bottom: 9px; border: 0; padding: 0; color: var(--home-gold); font-family: inherit; font-size: 11px; font-weight: 400; letter-spacing: .22em; line-height: normal; }');
    expect(styleSource).toContain('.react-home-footer { border-top: 0; background: #0c2038; color: #dce8f2; font-family: Arial, Helvetica, sans-serif; }');
    expect(homeSource).toContain('<span>Copyright © Gravity Co., LTD &amp; Lee MyoungJin(studio DTDS). All Rights Reserved.</span><span>All trademarks used on this website are the property of their respective owners.</span>');
    expect(styleSource).toContain('.react-home-footer p span { display: block; }');
    expect(styleSource).toContain('.react-home-footer__inner > div:first-child { display: grid; grid-template-columns: auto auto; align-items: center; justify-content: center; column-gap: 10px; }');
    expect(styleSource).toContain('.react-home-footer__inner > div:first-child > p span:first-child { grid-column: 2; grid-row: 3; margin: 0; white-space: nowrap; }');
    expect(styleSource).toContain('.react-home-footer__inner > div:first-child > p span:last-child { grid-column: 1 / -1; grid-row: 4; margin-top: 8px; }');
    expect(styleSource).toContain('.react-home-footer__inner > div:first-child > img { width: clamp(112px,11vw,142px); }');
    expect(styleSource).toContain('.react-home-footer__inner > div:first-child > p span { font-size: clamp(9px,.85vw,11px); line-height: 1.35; }');
  });

  it("keeps the two-line Game Info heading, unified fact typography, borderless artwork, and blue Gravity footer asset", () => {
    expect(homeSource).toContain("CLASSIC ADVENTURE<br />A NEW WAY TO PLAY");
    expect(homeSource).toContain('className="react-home-game-info__facts"');
    expect(homeSource).toContain("Web Browser");
    expect(homeSource).toContain("Fantasy MMORPG");
    expect(homeSource).toContain("Beta Testing");
    expect(homeSource).toContain("No Download");
    expect(homeSource).toContain('className="react-home-game-info__art"');
    expect(homeSource).toContain('className="react-home-game-info__art-paper"');
    expect(homeSource).toContain('alt="Ragnarok Universe gameplay" loading="eager"');
    expect(homeSource).not.toContain('className="react-home-game-info__art-frame"');
    expect(homeSource).not.toContain('/manus-storage/game-info-adventure-frame_fbed9714.png');
    expect(homeSource).not.toContain('react-home-game-info__art-tape');
    expect(homeSource).toContain("LATEST FROM MIDGARD");
    expect(homeSource).toContain("ABOUT RAGNAROK UNIVERSE");
    expect(styleSource).toContain('.react-home-closing h2 { font-size: clamp(22px,7.15vw,37px); line-height: .98; }');
    expect(homeSource).not.toContain("EXPLORE MIDGARD");
    expect(homeSource).toContain("SEE THE WORLD IN MOTION");
    expect(homeSource).toContain("gravity_logo_light_c14f48f8_5e3a7c41.png");
    expect(homeSource).toContain("FloatingSocialLinks");
    expect(homeSource).toContain("<FloatingSocialLinks />");
    expect(homeSource).not.toContain('hidden={activeSection === "home"}');
    expect(homeSource).toContain("https://www.youtube.com/@RagnarokUniverse");
    expect(styleSource).toContain(".react-home-section-heading h2 { font-size: clamp(28px,3.5vw,49px);");
    expect(styleSource).toContain(".react-home-game-info__copy h2 { color: #1a344d; font-size: clamp(31px,3.57vw,53px); line-height: .98; white-space: nowrap;");
    expect(styleSource).toContain(".react-home-game-info__facts { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); margin: 0 0 26px; border-top: 1px solid rgba(30,55,77,.22); border-left: 1px solid rgba(30,55,77,.22); font-family: inherit;");
    expect(styleSource).toContain(".react-home-game-info__facts strong { display: block; color: #1a344d; font-family: inherit;");
    expect(styleSource).toContain('.react-home-game-info__art { border: 0; border-radius: 0; }');
    expect(styleSource).toContain(".react-home-footer__inner { position: relative; justify-content: center; }");
    expect(styleSource).toContain(".react-home-footer p { text-align: center; }");
    expect(styleSource).toContain(".react-home-game-info__grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); align-items: center; gap: clamp(26px,3.2vw,48px);");
    expect(styleSource).toContain('.react-home-game-info__art { width: 100%; height: clamp(230px,20vw,310px); margin-top: clamp(24px,2.2vw,34px); justify-self: stretch; align-self: start; }');
    expect(styleSource).toContain('.react-home-game-info__art-paper img { max-width: 100%; object-fit: cover; }');
    expect(styleSource).toContain(".react-home-game-info__art { position: relative; z-index: 1; width: 100%; justify-self: stretch;");
    expect(styleSource).toContain("transform: none;");
    expect(styleSource).toContain(".react-home-game-info__art { width: min(100%,220px); justify-self: center;");
    expect(styleSource).toContain(".react-home-game-info__art { width: 100%; max-width: none; justify-self: stretch; }");
    expect(styleSource).toContain(".react-home-game-info__art-paper img { display: block; width: 100%; height: auto; max-height: none; border: 0; object-fit: initial; filter: saturate(1.08) contrast(1.03); transform: none;");
  });

  it("uses content-driven heights and equal 50px vertical breathing room for every main content section", () => {
    expect(styleSource).toContain('.react-home-discord, .react-home-news, .react-home-game-info, .react-home-media { padding: 50px 0; }');
    expect(styleSource).toContain('.react-home-layout > [data-snap-panel] { height: auto; min-height: 0; overflow: visible; }');
  });

  it("keeps desktop wheel navigation aligned to the start of independent content regions", () => {
    expect(homeSource).toContain('querySelectorAll<HTMLElement>("[data-snap-panel]")');
    expect(homeSource).toContain('window.scrollTo({ top: getPanelScrollTop(panels[nextIndex]), behavior });');
    expect(homeSource).toContain('<footer className="react-home-footer" data-snap-panel');
  });

  it("centers mobile Media and keeps the header Game Start separated while the Hero uses its own centered solo action", () => {
    expect(styleSource).toContain('.react-home-discord, .react-home-news, .react-home-game-info, .react-home-media { padding: 50px 0; }');
    expect(styleSource).toContain('.reference-mobile-menu-toggle { margin-right: -6px; border: 0; }');
    expect(styleSource).toContain('.reference-header-cta { gap: 22px; }');
    expect(styleSource).toContain('.reference-header-game-start { transform: translateY(-3px) scale(1.254); transform-origin: center; }');
    expect(styleSource).toContain('.home-game-start--hero-solo { width: min(264px,66vw); height: clamp(72px,21.6vw,86px); transform: translateY(calc(-50% - 3px)); }');
    expect(styleSource).toContain('.react-home-hero__tags span { padding: 7px 11px; font-size: 16px; }');
    expect(styleSource).toContain('.react-home-white-cta { gap: 5px; padding: 6px 8px; font-size: 9px; }');
    expect(styleSource).toContain('.react-home-white-cta b { font-size: 8px; }');
    expect(styleSource).toContain('.react-home-home-stage { grid-template-rows: minmax(0,1fr) 72px; }');
  });

  it("keeps a single-line Hero title, aligned top controls, and matching UPDATE / VIEW MORE height", () => {
    expect(styleSource).toContain('.react-home-hero h1 { font-size: clamp(25px,3.65vw,52px); letter-spacing: -.045em; }');
    expect(styleSource).toContain('.react-home-hero__tags span, .react-home-white-cta { box-sizing: border-box; min-height: 44px; height: 44px; }');
    expect(styleSource).toContain('.react-home-hero__controls { top: max(6px, calc(clamp(16px,2vw,30px) - 10px));');
    expect(styleSource).toContain('.react-home-hero__dots { position: absolute; z-index: 3; top: clamp(16px,2vw,30px); left: 50%; transform: translateX(-50%); }');
  });

  it("keeps final Discord and Game Start actions side-by-side on desktop and stacked on mobile", () => {
    expect(styleSource).toContain('.react-home-closing .home-cta-pair { width: min(660px, calc(100% - 44px)); min-height: 64px; flex-direction: row; gap: 20px; }');
    expect(styleSource).toContain('.react-home-closing .home-cta-pair .home-discord-button, .react-home-closing .home-cta-pair .home-game-start { box-sizing: border-box; flex: 1 1 0; width: auto; height: 64px; }');
    expect(styleSource).toContain('.react-home-closing .home-cta-pair { width: min(276px,calc(100% - 44px)); flex-direction: column; gap: 16px; }');
  });

  it("uses the official Discord, Facebook, YouTube, and X marks in the Home footer", () => {
    expect(homeSource).toContain('/manus-storage/Discord_icon_230fdb89_6026051e.png');
    expect(homeSource).toContain('/manus-storage/facebook-logo-primary_2867583f.webp');
    expect(homeSource).toContain('aria-label="YouTube"><svg');
    expect(homeSource).toContain('/manus-storage/x-logo-black_193d8b29.webp');
    expect(styleSource).toContain('.react-home-footer__social a { box-sizing: border-box; width: 31px; height: 31px;');
    expect(styleSource).toContain('.react-home-footer__social a:nth-child(1) img { width: 24px; height: 24px; }');
    expect(styleSource).toContain('.react-home-footer__social a, .react-home-footer__social a:nth-child(4) { border: 0; }');
    expect(styleSource).toContain('@media (max-width: 760px) { .react-home-footer__social a { width: 24px; height: 24px; }');
  });

  it("provides the requested in-page Rune-Midgarts Library coming-soon modal", () => {
    expect(homeSource).toContain("RUNE-MIDGARTS LIBRARY");
    expect(homeSource).toContain("Rune-Midgarts Library is coming soon.");
    expect(homeSource).toContain("setLibraryOpen(true)");
    expect(homeSource).not.toContain('window.alert("Coming Soon")');
  });
});
