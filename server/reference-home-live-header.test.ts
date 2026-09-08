import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const headerStyles = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("reference Home live service header", () => {
  it("restores the two-tier navy service header over the supplied reference document", () => {
    expect(homeSource).toContain("reference-home-live-header");
    expect(homeSource).toContain("Ragnarok Universe service navigation");
    expect(homeSource).toContain("bg-[#1c3147]");
    expect(homeSource).toContain("ragnarok-reference-frame");
    expect(homeSource).toContain("reference-header-discord");
    expect(homeSource).toContain("reference-header-game-start");
    expect(homeSource).toContain("GAME_START_BUTTON_URL");
    expect(homeSource).toContain("reference-header-game-start__image");
    expect(homeSource).toContain("DISCORD_BUTTON_URL");
    expect(homeSource).toContain("reference-header-discord__image");
    expect(headerStyles).toContain("background: #5865f2;");
    expect(headerStyles).toContain(".reference-header-game-start {");
    expect(headerStyles).toContain("background: transparent;");
    expect(headerStyles).toContain("box-shadow: none;");
    expect(homeSource).toContain('const GAME_START_BUTTON_URL = "/manus-storage/gamestart_BTN_1c6449da.png"');
    expect(homeSource).toContain('const DISCORD_BUTTON_URL = "/manus-storage/Discord-Logo-White_b3128ea2.png"');
    expect(homeSource.indexOf('className="reference-header-game-start"')).toBeLessThan(homeSource.indexOf('className="reference-header-discord"'));
    expect(headerStyles).toContain("width: 154px;");
    expect(headerStyles).toContain("max-height: 22px;");
    expect(headerStyles).toContain(".reference-header-discord:hover");
    expect(headerStyles).toContain(".reference-header-game-start:hover");
    expect(headerStyles).toContain(".reference-header-game-start:hover");
    expect(headerStyles).toContain("transform: none;");
    expect(headerStyles).toContain("transition: none;");
    expect(headerStyles).toContain("transform: translateX(-8px);");
    expect(headerStyles).toContain("width: 78px;");
    expect(headerStyles).toContain("min-height: 34px;");
    expect(headerStyles).toContain("max-height: 18px;");
    expect(homeSource).toContain("lg:flex-nowrap");
    expect(homeSource).toContain("lg:order-none lg:flex");
  });

  it("uses the real OAuth session, balance query, and logout mutation instead of legacy local storage", () => {
    expect(homeSource).toContain("useAuth()");
    expect(homeSource).toContain("getLoginUrl()");
    expect(homeSource).toContain("trpc.shop.myBalance.useQuery");
    expect(homeSource).toContain("await logout()");
    expect(homeSource).not.toContain("rou_logged_in");
  });
});
