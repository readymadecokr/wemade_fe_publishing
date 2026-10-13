import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const homeHeaderSource = readFileSync(new URL("../client/src/components/HomeHeader.tsx", import.meta.url), "utf8");
const headerStyles = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React service header", () => {
  it("keeps OAuth controls and direct in-page navigation", () => {
    expect(homeHeaderSource).toContain("useAuth()");
    expect(homeHeaderSource).toContain("getLoginUrl()");
    expect(homeHeaderSource).toContain("trpc.shop.myBalance.useQuery");
    expect(homeHeaderSource).toContain('href="#discord"');
    expect(homeHeaderSource).toContain('activeSection === sectionId ? "portal-nav-link--active" : ""');
    expect(homeSource).toContain('scrollIntoView({ behavior: "smooth", block: "start" })');
  });

  it("uses rCoin images instead of balance labels and omits Logout", () => {
    expect(homeHeaderSource).toContain('/manus-storage/rou-rcoin_b489d271.png');
    expect(homeHeaderSource).toContain('/manus-storage/rou-bonus-rcoin_c8d21829.png');
    expect(homeHeaderSource).toContain('className="reference-header-coin-link"');
    expect(homeHeaderSource).not.toContain('>Logout<');
    expect(headerStyles).toContain('.reference-header-coin-link img { display: block; width: 22px; height: 22px; object-fit: contain; }');
  });

  it("uses the dark utility bar, white GNB, and restored globe language control", () => {
    expect(homeHeaderSource).toContain('className="reference-header-utility-surface bg-[#1c3147]');
    expect(homeHeaderSource).toContain('className="reference-header-gnb-surface"');
    expect(homeHeaderSource).toContain('import { Gamepad2, Globe2, Menu, X } from "lucide-react";');
    expect(homeHeaderSource).toContain('<Globe2 size={17} aria-hidden="true" /> <span>EN</span>');
    expect(headerStyles).toContain('.reference-header-language { gap: 5px; padding-inline: 8px; font-size: clamp(11px,.86vw,13px); }');
    expect(headerStyles).toContain('.reference-header-language { font-size: clamp(12px,calc(.52vw + 6px),16px); }');
    expect(headerStyles).toContain('.reference-header-language { font-size: clamp(7px,2vw,10px); }');
  });

  it("keeps all long lower-GNB labels visible and uses section-start active tracking", () => {
    expect(headerStyles).toContain('.portal-nav-link { flex: 0 0 auto; overflow: visible; white-space: nowrap; }');
    expect(homeSource).toContain('const activationLine = headerHeight + 8;');
    expect(homeSource).toContain('if (top <= activationLine && bottom > activationLine)');
    expect(homeSource).toContain('window.addEventListener("scroll", syncActiveSection, { passive: true });');
    expect(headerStyles).toContain('.portal-nav-link--active { border-color: #0f74ac; background: transparent; color: #0e5d91; box-shadow: none; text-shadow: none; }');
  });

  it("keeps the Hero at 600px and moves Game Start onto the Discord boundary", () => {
    expect(headerStyles).toContain('#home.react-home-hero { height: 600px; min-height: 600px; }');
    expect(homeSource).toContain('<div className="react-home-boundary-game-start" aria-label="Hero Game Start"><GameStartButton className="home-game-start--discord-hero" /></div>');
    expect(headerStyles).toContain('.react-home-boundary-game-start { grid-area: discord; position: relative; z-index: 9;');
    expect(headerStyles).toContain('.react-home-boundary-game-start .home-game-start--discord-hero { position: relative; z-index: 10;');
  });
});
