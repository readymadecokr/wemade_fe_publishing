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
    expect(headerStyles).toContain("background: #2252a2;");
    expect(homeSource).toContain('const GAME_START_BUTTON_URL = "/manus-storage/Gamestart_Button2_6537c714.png"');
    expect(headerStyles).toContain("width: 154px;");
    expect(headerStyles).toContain(".reference-header-discord:hover");
    expect(headerStyles).toContain(".reference-header-game-start:hover");
    expect(headerStyles).toContain("transform: translateY(4px);");
    expect(headerStyles).toContain("transition: none;");
  });

  it("uses the real OAuth session, balance query, and logout mutation instead of legacy local storage", () => {
    expect(homeSource).toContain("useAuth()");
    expect(homeSource).toContain("getLoginUrl()");
    expect(homeSource).toContain("trpc.shop.myBalance.useQuery");
    expect(homeSource).toContain("await logout()");
    expect(homeSource).not.toContain("rou_logged_in");
  });
});
