import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const staticHomeSource = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll.html", "utf8");

describe("reference Home hero controls", () => {
  it("removes the Hero rail and minimal controls before the document is rendered", () => {
    expect(homeSource).toContain("FINAL-fullpanel-scroll_8e3ad00e.html");
    expect(homeSource).toContain("src={REFERENCE_HOME_URL}");
    expect(staticHomeSource).toContain('class="hero-rail" aria-label="Main banners" hidden aria-hidden="true" style="display:none!important"');
    expect(staticHomeSource).not.toContain('id="manus-hero-controls-script"');
    expect(staticHomeSource).not.toContain("hero-minimal-controls");
    expect(staticHomeSource).not.toContain("hero-minimal-dot");
  });

  it("keeps external community and Game Start actions available from the live header", () => {
    expect(homeSource).toContain("https://discord.gg/yVWJkWdkAU");
    expect(homeSource).toContain('sectionHref("game-start")');
    expect(homeSource).toContain('const GAME_START_BUTTON_URL = "/manus-storage/Gamestart_Button-header-latest_83e85578.png"');
    expect(homeSource).toContain('src={GAME_START_BUTTON_URL}');
  });

  it("hides the floating community links in Hero and reveals them from Discord onward", () => {
    expect(staticHomeSource).toContain("floating-community.hero-hidden");
    expect(staticHomeSource).toContain('document.getElementById("discord")');
    expect(staticHomeSource).toContain('floating.classList.toggle("hero-hidden"');
  });
});
