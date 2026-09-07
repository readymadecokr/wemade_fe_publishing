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

  it("uses the provided Game Start and Discord logo images for all homepage CTAs", () => {
    expect(staticHomeSource).toContain('id="manus-cta-unification-style"');
    expect(staticHomeSource).toContain('const gameStartButtonImage = "https://raguniverse-izcifhmz.manus.space/manus-storage/gamestart_BTN_1c6449da.png"');
    expect(staticHomeSource).toContain('const discordButtonLogo = "https://raguniverse-izcifhmz.manus.space/manus-storage/Discord-Logo-White_b3128ea2.png"');
    expect(staticHomeSource).toContain('document.querySelectorAll(".hero-game-start, .closing-game-start")');
    expect(staticHomeSource).toContain('document.querySelectorAll(".hero-discord, .closing-discord")');
    expect(staticHomeSource).toContain('document.querySelectorAll(".widgetbot-join")');
    expect(staticHomeSource).toContain("widgetbot-game-start");
    expect(staticHomeSource).toContain("home-game-start-art");
    expect(staticHomeSource).toContain("home-discord-logo");
    expect(staticHomeSource).toContain("width:100% !important; max-width:none !important; height:auto !important; max-height:none !important");
    expect(staticHomeSource).toContain("background:#5865f2 !important");
    expect(staticHomeSource).toContain("border:0 !important");
  });

  it("keeps Game Start left and Discord right in every homepage CTA pair", () => {
    expect(staticHomeSource).toContain("#discord .widgetbot-readonly-bar { height:96px !important; min-height:96px !important; padding:0 !important; display:flex; align-items:center; justify-content:center; gap:16px !important; }");
    expect(staticHomeSource).toContain("#discord .widgetbot-game-start,\n  #discord .widgetbot-join { width:285px !important; min-width:285px !important; height:76px !important");
    expect(staticHomeSource).toContain("readonlyBar.insertBefore(gameStart, button);");
    expect(staticHomeSource).toContain("#discord .widgetbot-game-start .home-game-start-art { display:block; width:auto !important; max-width:100% !important; height:76px !important; max-height:none !important; }");
  });

  it("removes the outer yellow Game Start treatment and makes shadow buttons press down on hover", () => {
    expect(staticHomeSource).toContain(".hero-game-start,\n  .closing-game-start");
    expect(staticHomeSource).toContain("background:transparent !important");
    expect(staticHomeSource).toContain("box-shadow:none !important");
    expect(staticHomeSource).toContain(".hero-game-start:hover,\n  .closing-game-start:hover { transform:translateY(4px) !important; filter:none !important; }");
    expect(staticHomeSource).toContain(".hero-discord:hover,\n  .closing-discord:hover { background:#5865f2 !important; box-shadow:0 0 0 #4049b8");
    expect(staticHomeSource).toContain("#discord .widgetbot-join:hover { background:#5865f2 !important; box-shadow:0 0 0 #4049b8");
  });

  it("centers matching Hero CTA widths and removes mobile Hero letterboxing", () => {
    expect(staticHomeSource).toContain(".hero-primary-actions { width:100% !important; justify-content:center !important; }");
    expect(staticHomeSource).toContain(".hero-game-start,\n  .hero-discord { width:285px !important; min-width:285px !important; flex:0 0 285px; }");
    expect(staticHomeSource).toContain("#home .hero-slide img { width:100% !important; height:100% !important; object-fit:cover !important; object-position:center !important; }");
    expect(staticHomeSource).toContain("#home .hero-game-start,\n    #home .hero-discord { width:calc((100vw - 34px) / 2) !important; min-width:0 !important; flex:0 1 calc((100vw - 34px) / 2) !important; }");
  });

  it("keeps a two-line Hero title, four mobile News cards, proportional imagery, and side-by-side Two Clicks CTAs", () => {
    expect(staticHomeSource).toContain("#home #hero-title { font-size:clamp(34px,5.25vw,72px) !important; line-height:.96 !important; }");
    expect(staticHomeSource).toContain("#home #hero-title span { display:block !important; white-space:nowrap !important; }");
    expect(staticHomeSource).toContain("#news .pinned-news-grid { display:grid !important; grid-template-columns:1fr !important; gap:10px !important; overflow:visible !important; }");
    expect(staticHomeSource).toContain("#news .pinned-news-card:nth-child(n+5) { display:none !important; }");
    expect(staticHomeSource).toContain("#news .pinned-news-card.mobile-fourth-news { display:block !important; }");
    expect(staticHomeSource).toContain('const newsGrid = document.querySelector("#news .pinned-news-grid");');
    expect(staticHomeSource).toContain('fourthCard.classList.add("mobile-fourth-news");');
    expect(staticHomeSource).toContain("#news .pinned-news-card > a { display:grid !important; grid-template-columns:42% 58% !important; min-height:132px !important; }");
    expect(staticHomeSource).toContain("#game-info .game-info-visual,\n    #media .media-video { width:100% !important; height:auto !important; min-height:0 !important; aspect-ratio:auto !important; overflow:visible !important; }");
    expect(staticHomeSource).toContain("#media .media-video { flex:none !important; }");
    expect(staticHomeSource).toContain("#game-info .game-info-visual img,\n    #media .media-video img { display:block !important; width:100% !important; height:auto !important; object-fit:contain !important; }");
    expect(staticHomeSource).toContain(".closing-content > div { display:flex !important; width:100% !important; flex-direction:row !important; flex-wrap:nowrap !important; align-items:center !important; justify-content:center !important; gap:10px !important; }");
    expect(staticHomeSource).toContain(".closing-game-start,\n    .closing-discord { width:calc((100% - 10px) / 2) !important; min-width:0 !important; flex:0 1 calc((100% - 10px) / 2) !important; margin:0 !important; }");
  });
});
