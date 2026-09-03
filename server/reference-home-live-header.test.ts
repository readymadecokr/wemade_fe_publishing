import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");

describe("reference Home live service header", () => {
  it("restores the two-tier navy service header over the supplied reference document", () => {
    expect(homeSource).toContain("reference-home-live-header");
    expect(homeSource).toContain("Ragnarok Universe service navigation");
    expect(homeSource).toContain("bg-[#1c3147]");
    expect(homeSource).toContain("ragnarok-reference-frame");
    expect(homeSource).toContain("reference-header-discord");
    expect(homeSource).toContain("reference-header-game-start");
  });

  it("uses the real OAuth session, balance query, and logout mutation instead of legacy local storage", () => {
    expect(homeSource).toContain("useAuth()");
    expect(homeSource).toContain("getLoginUrl()");
    expect(homeSource).toContain("trpc.shop.myBalance.useQuery");
    expect(homeSource).toContain("await logout()");
    expect(homeSource).not.toContain("rou_logged_in");
  });
});
