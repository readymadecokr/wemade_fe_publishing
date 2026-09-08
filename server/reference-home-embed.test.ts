import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("user-supplied final HTML Home", () => {
  it("uses the original final reference HTML without a React restyle layer", () => {
    expect(homeSource).toContain('const REFERENCE_HOME_URL = "/manus-storage/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll_c2bdfcbf.html"');
    expect(homeSource).toContain("src={REFERENCE_HOME_URL}");
    expect(homeSource).toContain('title="Ragnarok Universe homepage"');
    expect(homeSource).toContain("useState(false)");
    expect(homeSource).toContain('reference-home-embed--loading');
    expect(homeSource).toContain("onLoad={() => setIsReferenceFrameReady(true)}");
    expect(homeSource).not.toContain("reference-hero-panel");
    expect(homeSource).not.toContain("reference-community-card");
  });

  it("places the reference canvas directly below the fixed live header", () => {
    expect(styleSource).toContain("--reference-live-header-height: 112px");
    expect(styleSource).toContain("height: calc(100svh - var(--reference-live-header-height))");
    expect(styleSource).toContain("margin-top: var(--reference-live-header-height)");
    expect(styleSource).toContain("--reference-live-header-height: 124px");
    expect(styleSource).toContain("width: 100%");
    expect(styleSource).toContain("height: 100%");
    expect(styleSource).toContain("border: 0");
    expect(styleSource).toContain(".reference-home-embed--loading::before");
    expect(styleSource).toContain("ragnarok-universe-initial-hero_547a4c97.png");
    expect(styleSource).toContain(".reference-home-embed--loading .reference-home-embed__frame");
  });

  it("removes the reference document header so the live header is the only header above Hero", () => {
    const staticHomeSource = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll.html", "utf8");
    expect(staticHomeSource).toContain('id="manus-reference-inner-header-hide"');
    expect(staticHomeSource).toContain(".site-header { display:none !important; }");
    expect(staticHomeSource).not.toContain('<header class="site-header">');
    expect(staticHomeSource).toContain(".page-panel { height:100svh !important; min-height:100svh !important; scroll-margin-top:0 !important; }");
  });
});
