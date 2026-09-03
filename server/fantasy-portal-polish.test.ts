import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const uploadedReference = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL.html");
const originalReference = readFileSync("/home/ubuntu/upload/ragnarok-universe-fullpage-responsive-260831_FINAL.html");

describe("final Home source integrity", () => {
  it("serves byte-identical user-supplied HTML as the Home screen source", () => {
    expect(uploadedReference.equals(originalReference)).toBe(true);
    expect(homeSource).toContain("ragnarok-universe-fullpage-responsive-260831_FINAL_95e295ba.html");
  });

  it("does not place a custom visual shell around the supplied document", () => {
    expect(homeSource).not.toContain("<Layout>");
    expect(homeSource).not.toContain("reference-hero-panel");
    expect(homeSource).not.toContain("reference-discord-panel");
  });
});
