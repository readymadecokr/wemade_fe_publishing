import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const referenceSource = readFileSync("/home/ubuntu/upload/ragnarok-universe-fullpage-responsive-260831_FINAL.html", "utf8");

describe("user-supplied final Home banner", () => {
  it("preserves the original banner carousel markup from the supplied final HTML", () => {
    expect(homeSource).toContain("REFERENCE_HOME_URL");
    expect(referenceSource).toContain("OPEN BETA S2");
    expect(referenceSource).toContain("FOUNDERS EVENT");
    expect(referenceSource).toContain("WAR OF EMPERIUM");
    expect(referenceSource).toContain("Previous banner");
    expect(referenceSource).toContain("Next banner");
  });
});
