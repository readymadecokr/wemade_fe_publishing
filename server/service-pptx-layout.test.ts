import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const referenceSource = readFileSync("/home/ubuntu/upload/ragnarok-universe-fullpage-responsive-260831_FINAL.html", "utf8");

describe("user-supplied final service page layout", () => {
  it("uses the final supplied document as the sole Home visual source", () => {
    expect(homeSource).toContain("The user supplied this final design as the source of truth.");
    expect(homeSource).toContain("src={REFERENCE_HOME_URL}");
    expect(homeSource).not.toContain("reference-community-card");
  });

  it("keeps the final document’s community, news, game information, and media content", () => {
    [/official\s+community/i, /latest\s+from\s+midgard/i, /explore\s+game\s+info/i, /see\s+the\s+world\s+in\s+motion/i, /view\s+fullscreen/i].forEach((content) => {
      expect(referenceSource).toMatch(content);
    });
  });
});
