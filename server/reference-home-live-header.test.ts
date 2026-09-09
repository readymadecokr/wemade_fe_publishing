import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const headerStyles = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React service header", () => {
  it("keeps the live OAuth header, direct in-page navigation, and supplied CTA artwork", () => {
    expect(homeSource).toContain("useAuth()");
    expect(homeSource).toContain("getLoginUrl()");
    expect(homeSource).toContain("trpc.shop.myBalance.useQuery");
    expect(homeSource).toContain("await logout()");
    expect(homeSource).toContain('className="reference-header-game-start"');
    expect(homeSource).toContain('className="reference-header-discord"');
    expect(homeSource).toContain("scrollIntoView({ behavior: \"smooth\", block: \"start\" })");
    expect(homeSource).toContain('href="#discord"');
    expect(homeSource).toContain('activeSection === "discord" ? "portal-nav-link--active"');
    expect(homeSource).toContain('window.location.hash.slice(1)');
    expect(homeSource).not.toContain("ragnarok-reference-frame");
  });

  it("keeps non-wrapping fluid header CTA sizing, rounded Discord styling, and pressed Game Start feedback", () => {
    expect(headerStyles).toContain(".reference-header-main-row { display: grid;");
    expect(headerStyles).toContain("width: clamp(96px,9vw,110px); height: 30px; padding: 0; border-radius: 7px;");
    expect(headerStyles).toContain(".reference-header-game-start { width: clamp(92px,12vw,150px); height: clamp(32px,3.85vw,48px); }");
    expect(headerStyles).toContain(".reference-header-cta .reference-header-discord { width: clamp(96px, 9vw, 110px); height: 30px; }");
    expect(headerStyles).toContain("width: clamp(90px,26vw,118px);");
    expect(headerStyles).toContain("border-radius: 7px;");
    expect(headerStyles).toContain(".reference-header-game-start:hover { filter: drop-shadow(0 0 0 rgba(8,39,88,0)); transform: translateY(4px); }");
    expect(homeSource).toContain('className="container reference-header-main-row"');
    expect(homeSource).toContain('className="reference-header-logo"');
  });

  it("places Discord before Game Start in every CTA pair and matches the Hero Discord size to the closing CTA", () => {
    const headerCta = homeSource.indexOf('className="reference-header-cta shrink-0"');
    const headerDiscord = homeSource.indexOf('<DiscordButton className="reference-header-discord" />', headerCta);
    const headerGameStart = homeSource.indexOf('<GameStartButton className="reference-header-game-start" />', headerCta);
    expect(headerDiscord).toBeGreaterThan(headerCta);
    expect(headerGameStart).toBeGreaterThan(headerDiscord);
    expect(homeSource).toContain('<DiscordButton /><GameStartButton />');
    expect(headerStyles).toContain('.home-cta-pair--hero .home-discord-button, .home-discord-button { width: min(280px, 48vw); height: 70px;');
  });

  it("preserves the Hero artwork and separates the expanded quick-action row", () => {
    expect(headerStyles).toContain(".react-home-hero__visual { object-fit: contain;");
    expect(headerStyles).toContain(".react-home-hero-cta-row { display: flex; min-height: clamp(184px,20vh,220px);");
    expect(homeSource).toContain('className="react-home-hero-cta-row"');
  });

  it("places DISCORD after HOME and keeps its external-link indicator inside the responsive menu box", () => {
    const homeIndex = homeSource.indexOf('href="#home"');
    const communityIndex = homeSource.indexOf('href="#discord"');
    const newsIndex = homeSource.indexOf('(["news", "game-info", "media"] as const)');
    expect(homeIndex).toBeGreaterThan(-1);
    expect(communityIndex).toBeGreaterThan(homeIndex);
    expect(newsIndex).toBeGreaterThan(communityIndex);
    expect(homeSource).toContain('portal-nav-link__label">DISCORD</span>');
    expect(homeSource).toContain('className="portal-nav-link__icon"');
    expect(headerStyles).toContain(".portal-nav-link--active { border-color:");
    expect(headerStyles).toContain(".portal-nav-link { display: inline-flex; width: 100%;");
    expect(headerStyles).toContain(".portal-nav-link__icon { width:");
    expect(headerStyles).toContain("flex: none;");
  });
});
