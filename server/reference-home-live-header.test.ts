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
    expect(homeSource).not.toContain("ragnarok-reference-frame");
  });

  it("keeps header CTA sizing, rounded Discord styling, and pressed Game Start feedback on narrow screens", () => {
    expect(headerStyles).toContain("width: 154px; min-width: 154px; height: 44px; min-height: 44px;");
    expect(headerStyles).toContain("width: 104px; min-width: 104px; height: 34px; min-height: 34px;");
    expect(headerStyles).toContain("border-radius: 16px;");
    expect(headerStyles).toContain(".reference-header-game-start:hover { filter: drop-shadow(0 0 0 rgba(8,39,88,0)); transform: translateY(4px); }");
    expect(homeSource).toContain("2xl:flex-nowrap");
  });
});
