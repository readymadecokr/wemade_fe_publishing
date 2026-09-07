import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const referenceSource = readFileSync("/home/ubuntu/upload/ragnarok-universe-fullpage-responsive-260831_FINAL.html", "utf8");
const scrollFixedReferenceSource = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-scrollfix.html", "utf8");
const widgetbotReferenceSource = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll.html", "utf8");

describe("user-supplied final Home full-page navigation", () => {
  it("renders the supplied final document directly with targeted scrolling and minimal Hero controls", () => {
    expect(homeSource).toContain("ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll_09edf74c.html");
    expect(homeSource).toContain("reference-home-embed__frame");
    expect(homeSource).not.toContain("window.addEventListener(\"wheel\"");
    expect(widgetbotReferenceSource).toContain("hero-minimal-controls");
    expect(widgetbotReferenceSource).toContain("hero-minimal-arrow--prev");
    expect(widgetbotReferenceSource).toContain("hero-minimal-arrow--next");
    expect(widgetbotReferenceSource).toContain("hero-minimal-dots");
    expect(widgetbotReferenceSource).toContain('class="hero-rail" aria-label="Main banners" hidden aria-hidden="true" style="display:none!important"');
  });

  it("retains the reference document navigation and section anchors unchanged", () => {
    ["#home", "#discord", "#news", "#game-info", "#media"].forEach((anchor) => expect(referenceSource).toContain(anchor));
    expect(referenceSource).toMatch(/game\s+start/i);
    expect(referenceSource).toMatch(/join\s+discord/i);
  });

  it("uses scroll position to select the next panel when the News observer state is stale", () => {
    expect(scrollFixedReferenceSource).toContain("const scrollAnchor=window.scrollY+window.innerHeight*.35");
    expect(scrollFixedReferenceSource).toContain("section.offsetTop<=scrollAnchor?index:closestIndex");
  });
});
