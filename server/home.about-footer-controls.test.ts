import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const referenceSource = readFileSync("/home/ubuntu/upload/ragnarok-universe-fullpage-responsive-260831_FINAL.html", "utf8");
const staticHomeSource = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll.html", "utf8");

describe("user-supplied final Home closing panel", () => {
  it("removes the custom Home footer layer in favor of the supplied document", () => {
    expect(homeSource).not.toContain("Two Clicks to Midgard");
    expect(homeSource).not.toContain("View More");
    expect(referenceSource).toMatch(/your story begins here/i);
  });

  it("removes the faint Hero background from the Two Clicks to Midgard panel", () => {
    expect(staticHomeSource).toContain('id="manus-closing-background-cleanup"');
    expect(staticHomeSource).toContain(".closing-content::before");
    expect(staticHomeSource).toContain("background-image:none !important");
    expect(staticHomeSource).toContain("opacity:0 !important");
  });
});
