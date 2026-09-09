import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
describe("direct React service page layout", () => {
  it("uses the final supplied design as a direct Home layout instead of an iframe canvas", () => {
    expect(homeSource).toContain('import HomeHeader, { DiscordButton, GameStartButton } from "@/components/HomeHeader"');
    expect(homeSource).toContain("<HomeHeader activeSection={activeSection as");
    expect(homeSource).toContain('className="react-home"');
    expect(homeSource).not.toContain("REFERENCE_HOME_URL");
    expect(homeSource).not.toContain("ragnarok-reference-frame");
  });

  it("keeps the community, news, game information, and media content in the direct layout", () => {
    [/OFFICIAL COMMUNITY/, /LATEST FROM MIDGARD/, /RUNE-MIDGARTS LIBRARY/, /SEE THE WORLD IN MOTION/].forEach((content) => {
      expect(homeSource).toMatch(content);
    });
  });
});
