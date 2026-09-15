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
    expect(headerStyles).toContain(".reference-home-live-header .reference-header-main-row, .reference-home-live-header .reference-header-utility { box-sizing: border-box; width: calc(100% - clamp(40px,6vw,64px)); max-width: none !important; margin-inline: auto; padding-inline: 0 !important; }");
    expect(headerStyles).toContain(".reference-home-live-header .reference-header-main-row { grid-template-columns: clamp(92px,10.3vw,166px) minmax(440px,1fr) auto; }");
    expect(headerStyles).toContain("position: absolute; top: 50%; left: 0;");
    expect(headerStyles).toContain("height: clamp(60px,6.55vw,96px); max-width: 166px;");
    expect(headerStyles).toContain("transform: translateY(-74%);");
    expect(homeHeaderSource).toContain('container flex h-9 items-center justify-end gap-2 py-0.5');
    expect(headerStyles).toContain("width: clamp(96px,9vw,110px); height: 30px; padding: 0; border-radius: 8px;");
    expect(headerStyles).toContain(".reference-header-game-start { width: clamp(92px,12vw,150px); height: clamp(32px,3.85vw,48px); }");
    expect(headerStyles).toContain(".reference-header-cta .reference-header-discord { width: clamp(96px, 9vw, 110px); height: 30px; border-radius: 8px; }");
    expect(headerStyles).toContain("width: clamp(90px,26vw,118px);");
    expect(headerStyles).toContain(".reference-header-logo { z-index: 3; width: 82px; height: 40px; overflow: visible; }");
    expect(headerStyles).toContain(".reference-header-logo { width: clamp(64px,14vw,98px); height: clamp(34px,6.8vw,48px); margin-left: 0; }");
    expect(headerStyles).toContain(".reference-header-logo img { left: 0; width: clamp(64px,14vw,98px); }");
    expect(headerStyles).toContain(".reference-home-live-header { --bi-logo-width: clamp(60px,11vw,166px); }");
    expect(headerStyles).toContain(".reference-header-logo { width: var(--bi-logo-width); }");
    expect(headerStyles).toContain(".reference-header-logo img { width: var(--bi-logo-width); height: auto; max-width: none; }");
    expect(headerStyles).toContain("border-radius: 7px;");
    expect(headerStyles).toContain(".reference-header-game-start:hover { filter: drop-shadow(0 0 0 rgba(8,39,88,0)); transform: translateY(4px); }");
    expect(homeHeaderSource).toContain('className="container reference-header-main-row"');
    expect(homeHeaderSource).toContain('className="reference-header-logo"');
    expect(homeHeaderSource).not.toContain('className="border-b border-white/10 bg-[#1c3147]');
    expect(homeHeaderSource).toContain('className="bg-[#1c3147] [background-image:linear-gradient(100deg,rgba(32,56,78,1),rgba(58,84,110,.96),rgba(24,45,66,1))]"');
  });

  it("uses a compact hamburger menu for the primary navigation on mobile widths", () => {
    expect(homeHeaderSource).toContain('const [mobileMenuOpen, setMobileMenuOpen] = useState(false);');
    expect(homeHeaderSource).toContain('className="reference-mobile-menu-toggle"');
    expect(homeHeaderSource).toContain('id="reference-mobile-navigation"');
    expect(homeHeaderSource).toContain('className={`reference-mobile-menu${mobileMenuOpen ? " is-open" : ""}`}');
    expect(headerStyles).toContain('.reference-mobile-menu-toggle, .reference-mobile-menu { display: none; }');
    expect(headerStyles).toContain('.portal-nav { display: none; }.reference-mobile-menu-toggle { display: grid;');
    expect(headerStyles).toContain('.reference-mobile-menu { position: absolute; z-index: 6; top: 100%; right: 0; left: 0; display: none;');
    expect(headerStyles).toContain('.reference-mobile-menu.is-open { display: grid; }');
    expect(homeHeaderSource).toContain('const renderUtilityControls = (mobile = false)');
    expect(homeHeaderSource).toContain('className="reference-header-utility container flex h-9 items-center justify-end gap-2 py-0.5 sm:gap-3"');
    expect(homeHeaderSource).toContain('className="reference-mobile-menu__utility">{renderUtilityControls(true)}');
    expect(headerStyles).toContain('.reference-header-utility { display: none; }');
    expect(headerStyles).toContain('.reference-mobile-menu__utility { grid-column: 1 / -1; display: flex;');
  });

  it("keeps Discord before Game Start in the shared header and uses a solo Hero Game Start", () => {
    const headerCta = homeHeaderSource.indexOf('className="reference-header-cta shrink-0"');
    const headerDiscord = homeHeaderSource.indexOf('<DiscordButton className="reference-header-discord" />', headerCta);
    const headerGameStart = homeHeaderSource.indexOf('<GameStartButton className="reference-header-game-start" />', headerCta);
    expect(headerDiscord).toBeGreaterThan(headerCta);
    expect(headerGameStart).toBeGreaterThan(headerDiscord);
    expect(homeSource).toContain('<div className="react-home-hero-cta-row" aria-label="Hero Game Start"><GameStartButton className="home-game-start--hero-solo" /></div>');
    expect(homeSource).toContain('<DiscordButton /><GameStartButton />');
    expect(headerStyles).toContain('.home-game-start--hero-solo { position: relative; top: 0; left: auto; width: min(350px,55vw); height: 110px; transform: translateY(-50%); transform-origin: center; }');
  });

  it("preserves the Hero artwork and separates the expanded quick-action row", () => {
    expect(headerStyles).toContain(".react-home-home-stage { grid-area: home; display: grid; grid-template-rows: minmax(0, 1fr) clamp(66px,7.7vw,110px);");
    expect(headerStyles).toContain(".react-home-hero__visual { aspect-ratio: 1000 / 600; object-fit: cover;");
    expect(headerStyles).toContain(".react-home-hero-cta-row { position: relative; z-index: 4; display: flex; min-height: clamp(66px,7.7vw,110px);");
    expect(homeSource).toContain('className="react-home-hero-cta-row"');
    expect(homeSource).not.toContain("PLAY IN YOUR BROWSER");
    expect(homeSource).toContain('aria-label="Ragnarok Universe closing call to action and footer"');
    expect(homeSource).toContain('className="react-home-footer" aria-label="Ragnarok Universe footer"');
    expect(headerStyles).toContain('grid-template-areas: "home" "discord" "news" "game-info" "media" "final";');
    expect(headerStyles).toContain(".react-home-home-stage { grid-template-rows: minmax(0,1fr) 72px; }");
  });

  it("places COMMUNITY after HOME without an external-link indicator", () => {
    const homeIndex = homeHeaderSource.indexOf('href="#home"');
    const communityIndex = homeHeaderSource.indexOf('href="#discord"');
    const newsIndex = homeHeaderSource.indexOf('(["news", "game-info", "media"] as const)');
    expect(homeIndex).toBeGreaterThan(-1);
    expect(communityIndex).toBeGreaterThan(homeIndex);
    expect(newsIndex).toBeGreaterThan(communityIndex);
    expect(homeHeaderSource).toContain('className={navigationClass("discord")}>COMMUNITY');
    expect(homeHeaderSource).not.toContain("ExternalLink");
    expect(homeHeaderSource).not.toContain('className="portal-nav-link__icon"');
    expect(homeHeaderSource).toContain('<Link href="/point-shop" className={navigationClass("shop")}>SHOP</Link>');
    expect(homeHeaderSource).not.toContain('SHOP <ChevronDown');
    expect(headerStyles).toContain(".portal-nav-link--active { border-color:");
    expect(headerStyles).toContain(".portal-nav-link { display: inline-flex; width: 100%;");
    expect(headerStyles).toContain(".portal-nav { grid-template-columns: minmax(48px,.7fr) minmax(95px,1.45fr) minmax(48px,.75fr) minmax(90px,1.32fr) minmax(52px,.8fr) minmax(48px,.7fr); font-size: clamp(12px,1.29vw,16.5px); }");
    expect(headerStyles).toContain("@media (min-width: 761px) and (max-width: 1000px) {");
    expect(headerStyles).toContain(".reference-home-live-header .reference-header-main-row { grid-template-columns: clamp(72px,10.8vw,92px) minmax(0,1fr) clamp(158px,22vw,192px); gap: clamp(6px,1.1vw,10px); }");
    expect(headerStyles).toContain(".reference-home-live-header .reference-header-main-row { grid-template-columns: var(--bi-logo-width) minmax(0,1fr) clamp(158px,22vw,192px); }");
    expect(headerStyles).toContain(".portal-nav { grid-template-columns: minmax(40px,.65fr) minmax(82px,1.4fr) minmax(40px,.65fr) minmax(76px,1.25fr) minmax(42px,.72fr) minmax(40px,.65fr); gap: 1px; font-size: clamp(8px,1.25vw,11px); }");
    expect(headerStyles).toContain(".reference-mobile-menu .portal-nav-link { font-size: 15px; }");
  });
});
