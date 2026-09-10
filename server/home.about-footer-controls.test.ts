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

  it("keeps the closing CTA and footer as separate children in one desktop final panel", () => {
    expect(homeSource).toContain('aria-label="Ragnarok Universe closing call to action and footer"');
    expect(homeSource).toContain('<div className="react-home-closing">');
    expect(homeSource).toContain('<footer className="react-home-footer"');
    expect(styleSource).toContain('.react-home-final-panel { height: calc(100svh - var(--react-home-header-height));');
    expect(styleSource).toContain('.react-home-final-panel .react-home-closing { min-height: 0; flex: 1 1 auto;');
  });

  it("keeps the two-line Game Info heading, uppercase section titles, and blue Gravity footer asset", () => {
    expect(homeSource).toContain("CLASSIC ADVENTURE<br />A NEW WAY TO PLAY");
    expect(homeSource).toContain('className="react-home-game-info__facts"');
    expect(homeSource).toContain("Web Browser");
    expect(homeSource).toContain("Fantasy MMORPG");
    expect(homeSource).toContain("Beta Testing");
    expect(homeSource).toContain("No Download");
    expect(homeSource).toContain('className="react-home-game-info__art"');
    expect(homeSource).toContain("LATEST FROM MIDGARD");
    expect(homeSource).toContain("SEE THE WORLD IN MOTION");
    expect(homeSource).toContain("gravity_logo_light_c14f48f8_5e3a7c41.png");
    expect(homeSource).toContain("FloatingSocialLinks");
    expect(homeSource).toContain("https://www.youtube.com/@RagnarokUniverse");
    expect(styleSource).toContain(".react-home-section-heading h2 { font-size: clamp(28px,3.5vw,49px);");
    expect(styleSource).toContain(".react-home-game-info__copy h2 { color: #1a344d; font-size: clamp(31px,3.57vw,53px); line-height: .98; white-space: nowrap;");
    expect(styleSource).toContain(".react-home-game-info__art { position: relative;");
  });

  it("provides the requested in-page Rune-Midgarts Library coming-soon modal", () => {
    expect(homeSource).toContain("RUNE-MIDGARTS LIBRARY");
    expect(homeSource).toContain("Rune-Midgarts Library is coming soon.");
    expect(homeSource).toContain("setLibraryOpen(true)");
    expect(homeSource).not.toContain('window.alert("Coming Soon")');
  });
});
