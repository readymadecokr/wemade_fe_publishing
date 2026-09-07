import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const staticHomeSource = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll.html", "utf8");

describe("reference Home full-panel scroll restoration", () => {
  it("uses the full-panel document for Home", () => {
    expect(homeSource).toContain("FINAL-fullpanel-scroll_8e3ad00e.html");
  });

  it("snaps desktop wheel input through the Discord, News, Game Info, Media, and footer panels", () => {
    expect(staticHomeSource).toContain('const panelSelectors = ["#home", "#discord", "#news", "#game-info", "#media", "footer"]');
    expect(staticHomeSource).toContain("currentPanelIndex(items)");
    expect(staticHomeSource).toContain("event.stopImmediatePropagation()");
  });

  it("hides floating social links only while the Hero is the current panel", () => {
    expect(staticHomeSource).toContain("const heroIsCurrentPanel");
    expect(staticHomeSource).toContain("window.scrollY < discord.offsetTop - 4");
    expect(staticHomeSource).toContain('floating.classList.toggle("hero-hidden", heroIsCurrentPanel)');
    expect(staticHomeSource).toContain('<nav class="floating-community hero-hidden"');
  });

  it("uses the requested Library CTA modal and official Facebook and X destinations", () => {
    expect(staticHomeSource).toContain('id="manus-cta-social-links"');
    expect(staticHomeSource).toContain('libraryLink.innerHTML = "Rune-Midgarts Library <span>›</span>"');
    expect(staticHomeSource).toContain('className = "library-coming-soon-modal"');
    expect(staticHomeSource).toContain("Rune-Midgarts Library is coming soon.");
    expect(staticHomeSource).toContain('libraryLink.href = "#"');
    expect(staticHomeSource).toContain("event.preventDefault()");
    expect(staticHomeSource).toContain("event.stopImmediatePropagation()");
    expect(staticHomeSource).toContain('document.addEventListener("click", (event) =>');
    expect(staticHomeSource).toContain("}, true);");
    expect(staticHomeSource).not.toContain('window.alert("Coming Soon")');
    expect(staticHomeSource).toContain("https://facebook.com/RagnarokUniverseEN");
    expect(staticHomeSource).toContain("https://x.com/RagUniOfficial");
  });
});
