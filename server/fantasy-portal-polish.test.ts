import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const uploadedReference = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-scrollfix.html", "utf8");
const heroControlsReference = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-hero-controls.html", "utf8");
const originalReference = readFileSync("/home/ubuntu/upload/ragnarok-universe-fullpage-responsive-260831_FINAL.html", "utf8");
const originalWheelSelection = "const current=Math.max(0,sectionIds.indexOf(activeSection));";
const correctedWheelSelection = "const scrollAnchor=window.scrollY+window.innerHeight*.35;const current=sectionIds.reduce((closestIndex,sectionId,index)=>{const section=document.getElementById(sectionId);return section&&section.offsetTop<=scrollAnchor?index:closestIndex},0);";

describe("final Home source integrity", () => {
  it("uses the supplied HTML with targeted Latest scrolling and Hero control corrections", () => {
    expect(originalReference).toContain(originalWheelSelection);
    expect(uploadedReference).toContain(correctedWheelSelection);
    expect(uploadedReference.replace(correctedWheelSelection, originalWheelSelection)).toBe(originalReference);
    expect(heroControlsReference).toContain("hero-minimal-controls");
    expect(heroControlsReference).toContain("floating-community.hero-hidden");
    expect(homeSource).toContain("ragnarok-universe-fullpage-responsive-260831_FINAL-hero-controls_2b597045.html");
  });

  it("does not place a custom visual shell around the supplied document", () => {
    expect(homeSource).not.toContain("<Layout>");
    expect(homeSource).not.toContain("reference-hero-panel");
    expect(homeSource).not.toContain("reference-discord-panel");
  });
});
