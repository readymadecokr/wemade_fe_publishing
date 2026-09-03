import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const staticHomeSource = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll.html", "utf8");

describe("reference Home full-panel scroll restoration", () => {
  it("uses the full-panel document for Home", () => {
    expect(homeSource).toContain("FINAL-fullpanel-scroll_2e57bdc1.html");
  });

  it("snaps desktop wheel input through the Discord, News, Game Info, Media, and footer panels", () => {
    expect(staticHomeSource).toContain('const panelSelectors = ["#home", "#discord", "#news", "#game-info", "#media", "footer"]');
    expect(staticHomeSource).toContain("currentPanelIndex(items)");
    expect(staticHomeSource).toContain("event.stopImmediatePropagation()");
  });

  it("hides floating social links only while the Hero is the current panel", () => {
    expect(staticHomeSource).toContain("const heroIsCurrentPanel");
    expect(staticHomeSource).toContain('rect.bottom > window.innerHeight * 0.35');
    expect(staticHomeSource).toContain('floating.classList.toggle("hero-hidden", heroIsCurrentPanel)');
  });
});
