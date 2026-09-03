import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const referenceSource = readFileSync("/home/ubuntu/upload/ragnarok-universe-fullpage-responsive-260831_FINAL.html", "utf8");

describe("user-supplied final Home closing panel", () => {
  it("removes the custom Home footer layer in favor of the supplied document", () => {
    expect(homeSource).not.toContain("Two Clicks to Midgard");
    expect(homeSource).not.toContain("View More");
    expect(referenceSource).toMatch(/your story begins here/i);
  });
});
