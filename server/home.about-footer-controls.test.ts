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

  it("uses the light-mode blue GRAVITY logo in the footer", () => {
    expect(staticHomeSource).toContain("gravity_logo_light_c14f48f8_5e3a7c41.png");
    expect(staticHomeSource).toContain("replaceGravityLogo(document)");
    expect(staticHomeSource).toContain("replaceGravityLogo(footerTemplate.content)");
    expect(staticHomeSource).toContain('footer .footer-legal img[alt="GRAVITY"] { filter:none !important; }');
  });

  it("unifies requested Home titles with the Two Clicks uppercase italic style", () => {
    expect(staticHomeSource).toContain('id="manus-section-heading-and-footer-logo-style"');
    expect(staticHomeSource).toContain("#discord .widgetbot-community__title");
    expect(staticHomeSource).toContain("#news h2");
    expect(staticHomeSource).toContain("#game-info h2");
    expect(staticHomeSource).toContain("#media h2");
    expect(staticHomeSource).toContain("font-style:italic !important");
    expect(staticHomeSource).toContain("font-weight:900 !important");
    expect(staticHomeSource).toContain("text-transform:uppercase !important");
    expect(staticHomeSource).toContain("#media .media-heading > p { display:none !important; }");
  });

  it("uses a compact two-line Game Info title and matching Home heading scale", () => {
    expect(staticHomeSource).toContain("<h2>Classic adventure<br>A new way to play</h2>");
    expect(staticHomeSource).not.toContain("<h2>Classic adventure.<br>A new way to play.</h2>");
    expect(staticHomeSource).toContain("font-size:clamp(30px,3.4vw,42px) !important");
    expect(staticHomeSource).toContain("line-height:1.04 !important");
    expect(staticHomeSource).toContain("font-size:clamp(28px,8vw,34px) !important");
  });

  it("uses the provided white Discord symbol in the #5865F2-style closing Join Discord button", () => {
    expect(staticHomeSource).toContain('id="manus-closing-discord-button-style"');
    expect(staticHomeSource).toContain('const closingDiscordSymbol = "https://raguniverse-izcifhmz.manus.space/manus-storage/Discord-Symbol-White_5305126f.png"');
    expect(staticHomeSource).toContain('button.querySelector(".closing-discord__symbol")');
    expect(staticHomeSource).toContain("background:#5865f2 !important");
    expect(staticHomeSource).toContain("border:0 !important");
  });
});
