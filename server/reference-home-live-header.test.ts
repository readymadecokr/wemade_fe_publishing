import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const homeHeaderSource = readFileSync(new URL("../client/src/components/HomeHeader.tsx", import.meta.url), "utf8");
const headerStyles = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React service header", () => {
  it("keeps live OAuth controls and direct in-page navigation", () => {
    expect(homeHeaderSource).toContain("useAuth()");
    expect(homeHeaderSource).toContain("getLoginUrl()");
    expect(homeHeaderSource).toContain("trpc.shop.myBalance.useQuery");
    expect(homeHeaderSource).toContain("await logout()");
    expect(homeHeaderSource).toContain('href="#discord"');
    expect(homeHeaderSource).toContain('activeSection === sectionId ? "portal-nav-link--active" : ""');
    expect(homeSource).toContain('scrollIntoView({ behavior: "smooth", block: "start" })');
    expect(homeSource).not.toContain("ragnarok-reference-frame");
  });

  it("uses a dark text-only authentication bar above a separate white GNB", () => {
    expect(homeHeaderSource).toContain('className="reference-header-utility-surface bg-[#1c3147]');
    expect(homeHeaderSource).toContain('className="reference-header-gnb-surface"');
    expect(homeHeaderSource).toContain('className="reference-header-auth-link"');
    expect(homeHeaderSource).toContain('"Sign in / Sign up"');
    expect(headerStyles).toContain('.reference-header-utility-surface { position: relative; z-index: 2; }');
    expect(headerStyles).toContain('.reference-header-gnb-surface { position: relative; z-index: 1; border-bottom: 1px solid #d9e1e8; background: #fff;');
    expect(headerStyles).toContain('.reference-header-auth-link, .reference-header-account-links a, .reference-header-account-links button { border: 0; padding: 0; background: transparent;');
  });

  it("keeps the logo, left-aligned evenly spaced menu, language, and text actions on the lower GNB", () => {
    expect(homeHeaderSource).toContain('className="reference-header-logo"');
    expect(homeHeaderSource).toContain('className="reference-header-text-actions"');
    expect(homeHeaderSource).toContain('reference-header-text-action--discord');
    expect(homeHeaderSource).toContain('reference-header-text-action--game-start');
    expect(homeHeaderSource).toContain('<MessageCircle aria-hidden="true" size={15} />');
    expect(homeHeaderSource).toContain('<Gamepad2 aria-hidden="true" size={15} />');
    expect(homeHeaderSource).toContain('{renderLanguage()}');
    expect(headerStyles).toContain('.portal-nav { display: flex; min-width: 0; align-items: stretch; justify-content: flex-start; gap: clamp(16px,2.3vw,40px);');
    expect(headerStyles).toContain('.portal-nav-link { width: auto; min-height: 64px; justify-content: flex-start;');
    expect(headerStyles).toContain('.reference-header-language { display: inline-flex; align-items: center; gap: 4px; border: 0; border-left: 1px solid #dbe3e9;');
    expect(headerStyles).toContain('.reference-home-live-header .reference-header-main-row, .reference-home-live-header .reference-header-utility { width: min(1180px, calc(100% - 64px)); }');
  });

  it("retains all lower-GNB information at mobile widths without requiring the hamburger panel", () => {
    expect(headerStyles).toContain('.reference-home-live-header .reference-header-main-row { display: grid !important; width: calc(100% - 46px) !important; grid-template-columns: minmax(62px,82px) minmax(0,1fr) auto; grid-template-rows: 44px 35px;');
    expect(headerStyles).toContain('.portal-nav { display: flex !important; grid-column: 1 / -1; grid-row: 2; width: 100%; justify-content: space-between; gap: 0; }');
    expect(headerStyles).toContain('.reference-mobile-menu-toggle, .reference-mobile-menu { display: none !important; }');
    expect(headerStyles).toContain('.reference-header-text-action { gap: 3px; font-size: 8px; }');
  });

  it("preserves the Hero artwork and separate solo Hero Game Start", () => {
    expect(headerStyles).toContain(".react-home-home-stage { grid-area: home; display: grid; grid-template-rows: minmax(0, 1fr) clamp(66px,7.7vw,110px);");
    expect(headerStyles).toContain(".react-home-hero__visual { aspect-ratio: 1000 / 600; object-fit: cover;");
    expect(homeSource).toContain('<div className="react-home-hero-cta-row" aria-label="Hero Game Start"><GameStartButton className="home-game-start--hero-solo" /></div>');
    expect(homeSource).toContain('<DiscordButton /><GameStartButton />');
    expect(homeSource).not.toContain("PLAY IN YOUR BROWSER");
  });

  it("keeps the requested menu order and active-state behavior", () => {
    const homeIndex = homeHeaderSource.indexOf('href="#home"');
    const communityIndex = homeHeaderSource.indexOf('href="#discord"');
    const newsIndex = homeHeaderSource.indexOf('(["news", "game-info", "media"] as const)');
    expect(homeIndex).toBeGreaterThan(-1);
    expect(communityIndex).toBeGreaterThan(homeIndex);
    expect(newsIndex).toBeGreaterThan(communityIndex);
    expect(homeHeaderSource).toContain('className={navigationClass("discord")}>COMMUNITY');
    expect(homeHeaderSource).toContain('<Link href="/point-shop" className={navigationClass("shop")}>SHOP</Link>');
    expect(headerStyles).toContain('.portal-nav-link--active { border-color: #0f74ac; background: transparent; color: #0e5d91; box-shadow: none; text-shadow: none; }');
  });
});
