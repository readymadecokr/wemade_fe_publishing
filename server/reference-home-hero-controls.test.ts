import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const staticHomeSource = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll.html", "utf8");

describe("reference Home hero controls", () => {
  it("keeps the Hero rail hidden but restores only the minimal arrows and page indicators", () => {
    expect(homeSource).toContain("FINAL-fullpanel-scroll_dc0b36b9.html");
    expect(homeSource).toContain("src={REFERENCE_HOME_URL}");
    expect(staticHomeSource).toContain('class="hero-rail" aria-label="Main banners" hidden aria-hidden="true" style="display:none!important"');
    expect(staticHomeSource).toContain('id="manus-hero-controls-script"');
    expect(staticHomeSource).toContain("hero-minimal-controls");
    expect(staticHomeSource).toContain("hero-minimal-arrow--prev");
    expect(staticHomeSource).toContain("hero-minimal-arrow--next");
    expect(staticHomeSource).toContain("hero-minimal-dots");
    expect(staticHomeSource).toContain("hero-minimal-dot");
    expect(staticHomeSource).toContain(".hero-minimal-arrow:hover,");
    expect(staticHomeSource).toContain("transform:translateY(calc(-50% + 2px)) !important");
  });

  it("keeps external community and Game Start actions available from the live header", () => {
    expect(homeSource).toContain("https://discord.gg/yVWJkWdkAU");
    expect(homeSource).toContain('sectionHref("game-start")');
    expect(homeSource).toContain('const GAME_START_BUTTON_URL = "/manus-storage/Gamestart_Button2_6537c714.png"');
    expect(homeSource).toContain('src={GAME_START_BUTTON_URL}');
  });

  it("hides the floating community links in Hero and reveals them from Discord onward", () => {
    expect(staticHomeSource).toContain("floating-community.hero-hidden");
    expect(staticHomeSource).toContain('document.getElementById("discord")');
    expect(staticHomeSource).toContain('floating.classList.toggle("hero-hidden"');
  });
});
