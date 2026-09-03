import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const referenceSource = readFileSync("/home/ubuntu/upload/ragnarok-universe-fullpage-responsive-260831_FINAL.html", "utf8");

describe("user-supplied final service page layout", () => {
  it("keeps the final supplied document as the Home canvas while restoring the live service header", () => {
    expect(homeSource).toContain("The supplied final document remains the complete Home canvas;");
    expect(homeSource).toContain("src={REFERENCE_HOME_URL}");
    expect(homeSource).toContain("<ReferenceHomeHeader />");
    expect(homeSource).not.toContain("reference-community-card");
  });

  it("keeps the final document’s community, news, game information, and media content", () => {
    [/official\s+community/i, /latest\s+from\s+midgard/i, /explore\s+game\s+info/i, /see\s+the\s+world\s+in\s+motion/i, /view\s+fullscreen/i].forEach((content) => {
      expect(referenceSource).toMatch(content);
    });
  });
});
