import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("fantasy portal visual polish", () => {
  it("keeps all home news cards at a consistent content height", () => {
    expect(homeSource).toContain('flex h-full flex-col overflow-hidden');
    expect(homeSource).toContain('min-h-[84px] flex-1 flex-col');
    expect(homeSource).toContain('min-h-[2.5rem]');
    expect(homeSource).toContain('mt-auto text-[11px]');
  });

  it("uses one continuous fantasy atlas with visible map detail for portal decoration", () => {
    expect(styleSource).toContain('ragnarok-fantasy-continuous-atlas_fb2301c6.png');
    expect(styleSource).toContain('.fantasy-site-atlas');
    expect(styleSource).toContain('radial-gradient(ellipse 68% 66% at 50% 51%');
    expect(styleSource).toContain('background-size: cover, cover');
    expect(styleSource).toContain('.fantasy-site-atlas::before');
    expect(styleSource).toContain('background-position: center center, center 42%');
    expect(layoutSource).toContain('fantasy-site-atlas');
    expect(layoutSource).toContain('bg-transparent text-[#17120c]');
    expect(styleSource).toContain('ragnarok-fantasy-section-ornament_f3f3bf5d.png');
    expect(homeSource).not.toContain('fantasy-section-decorated');
  });

  it("keeps the logged-in Logout control legible against the dark header", () => {
    expect(layoutSource).toContain('bg-[#fffaf0]');
    expect(layoutSource).toContain('text-[#263b5b]');
    expect(layoutSource).toContain('>\n                Logout\n');
  });

  it("keeps the portal header translucent and the sign-in call to action distinguishable", () => {
    expect(layoutSource).toContain('bg-[#1c3147]/72');
    expect(layoutSource).toContain('backdrop-blur-xl');
    expect(layoutSource).toContain('portal-nav');
    expect(layoutSource).toContain('hover:border-[#fff0bd]');
  });

  it("keeps the footer transparent over the shared atlas and mobile social control placement without misplaced ornaments", () => {
    expect(layoutSource).not.toContain('ragnarok-fantasy-footer-atlas_e83c8727.png');
    expect(styleSource).not.toContain('.fantasy-view-more::before');
    expect(styleSource).toContain('.floating-social-box');
    expect(homeSource).toContain('className="mb-0"');
  });

  it("keeps portal navigation equally bold with a gold hover effect and My Page copy", () => {
    expect(styleSource).toContain('header .portal-nav > a');
    expect(styleSource).toContain('font-weight: 800');
    expect(styleSource).toContain('color: #fff1b4 !important');
    expect(layoutSource).toContain('>\n                  My Page\n');
  });

  it("keeps footer content black and readable over the shared atlas", () => {
    expect(layoutSource).toContain('bg-transparent text-[#17120c]');
    expect(layoutSource).toContain('font-medium text-[#17120c]');
  });

  it("fills the Game Start to News transition with dedicated fantasy scenery", () => {
    expect(homeSource).toContain('className="game-start-transition"');
    expect(styleSource).toContain('ragnarok-game-start-transition-ornament_34c68161.png');
    expect(styleSource).toContain('.game-start-transition');
    expect(styleSource).toContain('height: clamp(92px, 24vw, 126px)');
  });
});
