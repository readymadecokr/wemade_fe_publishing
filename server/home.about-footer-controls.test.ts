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

  it("uses the provided white Discord symbol and a unified #5865F2 button style for every Join Discord CTA", () => {
    expect(staticHomeSource).toContain('id="manus-cta-unification-style"');
    expect(staticHomeSource).toContain('const communityDiscordSymbol = "https://raguniverse-izcifhmz.manus.space/manus-storage/Discord-Symbol-White_5305126f.png"');
    expect(staticHomeSource).toContain('document.querySelectorAll(".hero-discord, .closing-discord")');
    expect(staticHomeSource).toContain('document.querySelectorAll(".widgetbot-join")');
    expect(staticHomeSource).toContain("widgetbot-join__symbol");
    expect(staticHomeSource).toContain("background:#5865f2 !important");
    expect(staticHomeSource).toContain("border:0 !important");
  });

  it("matches the Discord read-only CTA to the Two Clicks Join Discord desktop dimensions and typography", () => {
    expect(staticHomeSource).toContain("#discord .widgetbot-readonly-bar { height:80px !important; min-height:80px !important; padding:0 !important; display:flex; align-items:center; justify-content:center; }");
    expect(staticHomeSource).toContain("#discord .widgetbot-join { width:285px !important; min-width:285px !important; height:76px !important; min-height:76px !important; padding:0 24px !important");
    expect(staticHomeSource).toContain("gap:15px !important; border:0 !important; border-radius:10px !important");
    expect(staticHomeSource).toContain("#discord .widgetbot-join__symbol { display:block; width:42px !important; height:42px !important");
    expect(staticHomeSource).toContain("#discord .widgetbot-join__copy b { font:900 italic 21px/1 Arial,Helvetica,sans-serif !important; letter-spacing:normal; white-space:nowrap; }");
    expect(staticHomeSource).toContain("#discord .widgetbot-join__copy small { font:800 9px/1 Arial,Helvetica,sans-serif !important");
  });

  it("removes the outer yellow Game Start treatment and makes shadow buttons press down on hover", () => {
    expect(staticHomeSource).toContain(".hero-game-start,\n  .closing-game-start");
    expect(staticHomeSource).toContain("background:transparent !important");
    expect(staticHomeSource).toContain("box-shadow:none !important");
    expect(staticHomeSource).toContain(".hero-game-start:hover,\n  .closing-game-start:hover { transform:translateY(4px) !important; filter:none !important; }");
    expect(staticHomeSource).toContain(".hero-discord:hover,\n  .closing-discord:hover { background:#5865f2 !important; box-shadow:0 0 0 #4049b8");
    expect(staticHomeSource).toContain("#discord .widgetbot-join:hover { background:#5865f2 !important; box-shadow:0 0 0 #4049b8");
  });
});
