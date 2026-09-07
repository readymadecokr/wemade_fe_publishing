import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const staticHomeSource = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll.html", "utf8");

describe("reference Home hero controls", () => {
  it("uses the dedicated hero-control document that replaces card controls", () => {
    expect(homeSource).toContain("FINAL-fullpanel-scroll_ab0c5e2b.html");
    expect(homeSource).toContain("src={REFERENCE_HOME_URL}");
    expect(staticHomeSource).toContain(".hero-rail { display:none !important; }");
    expect(staticHomeSource).toContain("hero-minimal-controls");
    expect(staticHomeSource).toContain("hero-minimal-dot");
  });

  it("keeps external community and Game Start actions available from the live header", () => {
    expect(homeSource).toContain("https://discord.gg/yVWJkWdkAU");
    expect(homeSource).toContain('sectionHref("game-start")');
  });

  it("hides the floating community links in Hero and reveals them from Discord onward", () => {
    expect(staticHomeSource).toContain("floating-community.hero-hidden");
    expect(staticHomeSource).toContain('document.getElementById("discord")');
    expect(staticHomeSource).toContain('floating.classList.toggle("hero-hidden"');
  });
});
