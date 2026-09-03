import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const referenceSource = readFileSync("/home/ubuntu/upload/ragnarok-universe-fullpage-responsive-260831_FINAL.html", "utf8");

describe("user-supplied final Home full-page navigation", () => {
  it("renders the original final document directly rather than recreating its scroll shell", () => {
    expect(homeSource).toContain("ragnarok-universe-fullpage-responsive-260831_FINAL_95e295ba.html");
    expect(homeSource).toContain("reference-home-embed__frame");
    expect(homeSource).not.toContain("window.addEventListener(\"wheel\"");
  });

  it("retains the reference document navigation and section anchors unchanged", () => {
    ["#home", "#discord", "#news", "#game-info", "#media"].forEach((anchor) => expect(referenceSource).toContain(anchor));
    expect(referenceSource).toMatch(/game\s+start/i);
    expect(referenceSource).toMatch(/join\s+discord/i);
  });
});
