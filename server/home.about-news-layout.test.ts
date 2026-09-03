import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const referenceSource = readFileSync("/home/ubuntu/upload/ragnarok-universe-fullpage-responsive-260831_FINAL.html", "utf8");

describe("user-supplied final Home news and game information", () => {
  it("does not retain custom React copies of the News or About panels", () => {
    expect(homeSource).not.toContain("reference-news-grid");
    expect(homeSource).not.toContain("reference-game-info-panel");
  });

  it("preserves the final document’s authored News and Game Info copy", () => {
    [/latest from midgard/i, /classic adventure/i, /new way to play/i, /explore game info/i].forEach((content) => {
      expect(referenceSource).toMatch(content);
    });
  });
});
