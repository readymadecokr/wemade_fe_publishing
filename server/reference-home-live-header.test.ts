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
    expect(headerStyles).toContain("width: clamp(92px,12vw,150px);");
    expect(headerStyles).toContain("height: clamp(32px,3.85vw,48px);");
    expect(headerStyles).toContain("width: clamp(90px,26vw,118px);");
    expect(headerStyles).toContain("border-radius: 18px;");
    expect(headerStyles).toContain(".reference-header-game-start:hover { filter: drop-shadow(0 0 0 rgba(8,39,88,0)); transform: translateY(4px); }");
    expect(homeSource).toContain('className="container reference-header-main-row"');
    expect(homeSource).toContain('className="reference-header-logo"');
  });

  it("preserves the Hero artwork and separates the expanded quick-action row", () => {
    expect(headerStyles).toContain(".react-home-hero__visual { object-fit: contain;");
    expect(headerStyles).toContain(".react-home-hero-cta-row { display: flex; min-height: clamp(154px,16vh,190px);");
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
