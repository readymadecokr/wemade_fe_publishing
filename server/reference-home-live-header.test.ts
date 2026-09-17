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

  it("uses a dark authentication/action bar above a separate white GNB", () => {
    expect(homeHeaderSource).toContain('className="reference-header-utility-surface bg-[#1c3147]');
    expect(homeHeaderSource).toContain('className="reference-header-gnb-surface"');
    expect(homeHeaderSource).toContain('className="reference-header-auth-link"');
    expect(homeHeaderSource).toContain('"Sign in / Sign up"');
    expect(homeHeaderSource).toContain('className="reference-header-top-actions"');
    expect(homeHeaderSource).toContain('className="reference-header-top-action reference-header-top-action--discord"');
    expect(homeHeaderSource).toContain('<DiscordBrandIcon />');
    expect(homeHeaderSource).toContain('className="reference-header-top-action reference-header-top-action--game-start"');
    expect(headerStyles).toContain('.reference-header-utility-surface { position: relative; z-index: 2; }');
    expect(headerStyles).toContain('.reference-header-gnb-surface { position: relative; z-index: 1; border-bottom: 1px solid #d9e1e8; background: #fff;');
    expect(headerStyles).toContain('.reference-header-auth-link, .reference-header-account-links a, .reference-header-account-links button { border: 0; padding: 0; background: transparent;');
  });

  it("keeps the logo, left-aligned evenly spaced menu, and language on the lower GNB", () => {
    expect(homeHeaderSource).toContain('className="reference-header-logo"');
    expect(homeHeaderSource).toContain('{renderLanguage()}');
    expect(headerStyles).toContain('.portal-nav { display: flex; min-width: 0; align-items: stretch; justify-content: flex-start; gap: clamp(16px,2.3vw,40px);');
    expect(headerStyles).toContain('.portal-nav-link { width: auto; min-height: 64px; justify-content: flex-start;');
    expect(headerStyles).toContain('.portal-nav-link { flex: 0 0 auto; overflow: visible; white-space: nowrap; }');
    expect(headerStyles).toContain('.reference-header-language { border-left: 0; }');
    expect(headerStyles).toContain('.reference-header-top-action { font-size: 12px; }');
    expect(headerStyles).toContain('.reference-header-language { display: inline-flex; min-width: 42px; min-height: 36px; align-items: center; justify-content: center; gap: 6px; border: 0; border-left: 1px solid #dbe3e9;');
    expect(homeHeaderSource).toContain('import { Gamepad2, Languages, Menu, X } from "lucide-react";');
    expect(homeHeaderSource).toContain('<Languages size={16} aria-hidden="true" /> <span>EN</span>');
    expect(headerStyles).toContain('.reference-home-live-header .reference-header-main-row, .reference-home-live-header .reference-header-utility { width: min(1180px, calc(100% - 64px)); }');
  });

  it("retains all lower-GNB information at mobile widths without requiring the hamburger panel", () => {
    expect(headerStyles).toContain('.reference-home-live-header .reference-header-main-row { display: grid !important; width: calc(100% - 46px) !important; grid-template-columns: minmax(62px,82px) minmax(0,1fr) auto; grid-template-rows: 44px 35px;');
    expect(headerStyles).toContain('.portal-nav { display: flex !important; grid-column: 1 / -1; grid-row: 2; width: 100%; justify-content: space-between; gap: 0; }');
    expect(headerStyles).toContain('.reference-mobile-menu-toggle, .reference-mobile-menu { display: none !important; }');
    expect(headerStyles).toContain('.reference-header-top-action { gap: 3px; font-size: 7px; }');
  });

  it("preserves the Hero artwork at a true 500px minimum and places Hero Game Start on the Discord surface", () => {
    expect(headerStyles).toContain(".react-home-home-stage { grid-area: home; display: block; min-width: 0; min-height: max(500px, calc(100svh - var(--react-home-header-height))); }");
    expect(headerStyles).toContain(".react-home-hero__visual { aspect-ratio: 1000 / 600; object-fit: cover;");
    expect(headerStyles).toContain('.react-home-discord__game-start { display: flex; min-height: clamp(96px,11vw,136px); align-items: center; justify-content: center; padding: 0 24px 20px; }');
    expect(homeSource).toContain('<div className="react-home-discord__game-start" aria-label="Hero Game Start"><GameStartButton className="home-game-start--discord-hero" /></div>');
    expect(homeSource).not.toContain('react-home-hero-cta-row');
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
