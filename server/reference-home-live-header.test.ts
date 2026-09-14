import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const homeHeaderSource = readFileSync(new URL("../client/src/components/HomeHeader.tsx", import.meta.url), "utf8");
const headerStyles = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React service header", () => {
  it("keeps the live OAuth header, direct in-page navigation, and supplied CTA artwork", () => {
    expect(homeHeaderSource).toContain("useAuth()");
    expect(homeHeaderSource).toContain("getLoginUrl()");
    expect(homeHeaderSource).toContain("trpc.shop.myBalance.useQuery");
    expect(homeHeaderSource).toContain("await logout()");
    expect(homeHeaderSource).toContain('className="reference-header-game-start"');
    expect(homeHeaderSource).toContain('className="reference-header-discord"');
    expect(homeSource).toContain("scrollIntoView({ behavior: \"smooth\", block: \"start\" })");
    expect(homeHeaderSource).toContain('href="#discord"');
    expect(homeHeaderSource).toContain('activeSection === sectionId ? "portal-nav-link--active" : ""');
    expect(homeSource).toContain('window.location.hash.slice(1)');
    expect(homeSource).not.toContain("ragnarok-reference-frame");
  });

  it("keeps the compact header while the logo artwork bridges both stacked header bars", () => {
    expect(headerStyles).toContain(".reference-header-main-row { position: relative; display: grid;");
    expect(headerStyles).toContain("grid-template-columns: clamp(90px,9.4vw,138px) minmax(300px,1fr) auto; min-height: clamp(58px,4.6vw,68px);");
    expect(headerStyles).toContain("position: absolute; top: 50%; left: 0;");
    expect(headerStyles).toContain("height: clamp(64px,5.8vw,80px);");
    expect(headerStyles).toContain("transform: translateY(-74%);");
    expect(homeHeaderSource).toContain('container flex h-9 items-center justify-end gap-2 py-0.5');
    expect(headerStyles).toContain("width: clamp(96px,9vw,110px); height: 30px; padding: 0; border-radius: 8px;");
    expect(headerStyles).toContain(".reference-header-game-start { width: clamp(92px,12vw,150px); height: clamp(32px,3.85vw,48px); }");
    expect(headerStyles).toContain(".reference-header-cta .reference-header-discord { width: clamp(96px, 9vw, 110px); height: 30px; border-radius: 8px; }");
    expect(headerStyles).toContain("width: clamp(90px,26vw,118px);");
    expect(headerStyles).toContain(".reference-header-logo { z-index: 3; width: 82px; height: 40px; overflow: visible; }");
    expect(headerStyles).toContain("width: 82px; height: auto; max-width: none; max-height: none; transform: translateY(-63%);");
    expect(headerStyles).toContain("border-radius: 7px;");
    expect(headerStyles).toContain(".reference-header-game-start:hover { filter: drop-shadow(0 0 0 rgba(8,39,88,0)); transform: translateY(4px); }");
    expect(homeHeaderSource).toContain('className="container reference-header-main-row"');
    expect(homeHeaderSource).toContain('className="reference-header-logo"');
    expect(homeHeaderSource).not.toContain('className="border-b border-white/10 bg-[#1c3147]');
    expect(homeHeaderSource).toContain('className="bg-[#1c3147] [background-image:linear-gradient(100deg,rgba(32,56,78,1),rgba(58,84,110,.96),rgba(24,45,66,1))]"');
  });

  it("places Discord before Game Start in every CTA pair and matches the Hero Discord size to the closing CTA", () => {
    const headerCta = homeHeaderSource.indexOf('className="reference-header-cta shrink-0"');
    const headerDiscord = homeHeaderSource.indexOf('<DiscordButton className="reference-header-discord" />', headerCta);
    const headerGameStart = homeHeaderSource.indexOf('<GameStartButton className="reference-header-game-start" />', headerCta);
    expect(headerDiscord).toBeGreaterThan(headerCta);
    expect(headerGameStart).toBeGreaterThan(headerDiscord);
    expect(homeSource).toContain('<DiscordButton /><GameStartButton />');
    expect(headerStyles).toContain('.home-cta-pair--hero .home-discord-button, .home-discord-button { width: min(280px, 48vw); height: 70px;');
  });

  it("preserves the Hero artwork and separates the expanded quick-action row", () => {
    expect(headerStyles).toContain(".react-home-hero__visual { aspect-ratio: 1000 / 600; object-fit: cover;");
    expect(headerStyles).toContain(".react-home-hero-cta-row { display: flex; min-height: clamp(150px,17vh,196px);");
    expect(homeSource).toContain('className="react-home-hero-cta-row"');
    expect(homeSource).not.toContain("PLAY IN YOUR BROWSER");
    expect(homeSource).toContain('aria-label="Ragnarok Universe closing call to action and footer"');
    expect(homeSource).toContain('className="react-home-footer" aria-label="Ragnarok Universe footer"');
    expect(headerStyles).toContain('grid-template-areas: "home" "discord" "news" "game-info" "media" "final";');
  });

  it("places COMMUNITY after HOME and keeps its external-link indicator inside the responsive menu box", () => {
    const homeIndex = homeHeaderSource.indexOf('href="#home"');
    const communityIndex = homeHeaderSource.indexOf('href="#discord"');
    const newsIndex = homeHeaderSource.indexOf('(["news", "game-info", "media"] as const)');
    expect(homeIndex).toBeGreaterThan(-1);
    expect(communityIndex).toBeGreaterThan(homeIndex);
    expect(newsIndex).toBeGreaterThan(communityIndex);
    expect(homeHeaderSource).toContain('portal-nav-link__label">COMMUNITY</span>');
    expect(homeHeaderSource).toContain('className="portal-nav-link__icon"');
    expect(homeHeaderSource).toContain('<Link href="/point-shop" className={navigationClass("shop")}>SHOP</Link>');
    expect(homeHeaderSource).not.toContain('SHOP <ChevronDown');
    expect(headerStyles).toContain(".portal-nav-link--active { border-color:");
    expect(headerStyles).toContain(".portal-nav-link { display: inline-flex; width: 100%;");
    expect(headerStyles).toContain("grid-template-columns: minmax(0,.83fr) minmax(56px,1.1fr)");
    expect(headerStyles).toContain(".portal-nav-link--external { min-width: 56px;");
    expect(headerStyles).toContain(".portal-nav-link__icon { width:");
    expect(headerStyles).toContain("flex: none;");
  });
});
