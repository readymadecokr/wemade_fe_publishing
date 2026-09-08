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

  it("keeps header CTA sizing, rounded Discord styling, and pressed Game Start feedback on narrow screens", () => {
    expect(headerStyles).toContain("width: min(150px, 100%); min-width: 150px; height: 48px; min-height: 48px;");
    expect(headerStyles).toContain("width: 104px; min-width: 104px; height: 34px; min-height: 34px;");
    expect(headerStyles).toContain("border-radius: 18px;");
    expect(headerStyles).toContain(".reference-header-game-start:hover { filter: drop-shadow(0 0 0 rgba(8,39,88,0)); transform: translateY(4px); }");
    expect(homeSource).toContain("xl:flex-nowrap");
    expect(homeSource).toContain("xl:order-none xl:flex xl:w-auto xl:flex-1 xl:justify-center");
  });

  it("places COMMUNITY after HOME and highlights the menu when Discord is the active panel", () => {
    const homeIndex = homeSource.indexOf('href="#home"');
    const communityIndex = homeSource.indexOf('href="#discord"');
    const newsIndex = homeSource.indexOf('(["news", "game-info", "media"] as const)');
    expect(homeIndex).toBeGreaterThan(-1);
    expect(communityIndex).toBeGreaterThan(homeIndex);
    expect(newsIndex).toBeGreaterThan(communityIndex);
    expect(headerStyles).toContain(".portal-nav-link--active { border-color:");
  });
});
