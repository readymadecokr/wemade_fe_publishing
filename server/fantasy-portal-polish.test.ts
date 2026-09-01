import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("service background visual restoration", () => {
  it("keeps all home news cards at a consistent content height", () => {
    expect(homeSource).toContain('flex h-full flex-col overflow-hidden');
    expect(homeSource).toContain('min-h-[84px] flex-1 flex-col');
    expect(homeSource).toContain('min-h-[2.5rem]');
    expect(homeSource).toContain('mt-auto text-[11px]');
  });

  it("restores the decorative background image only through the shared service layout", () => {
    expect(styleSource).toContain('ragnarok-fantasy-continuous-atlas_fb2301c6.png');
    expect(styleSource).toContain('.fantasy-site-atlas');
    expect(styleSource).toContain('background-color: #f3ead5');
    expect(styleSource).toContain('background: rgba(255,253,247,.9)');
    expect(styleSource).toContain('.fantasy-site-atlas::before');
    expect(layoutSource).toContain('fantasy-site-atlas');
    expect(layoutSource).toContain('border-t border-[#e7e1d5] bg-white text-[#17120c]');
    expect(styleSource).toContain('ragnarok-fantasy-section-ornament_f3f3bf5d.png');
    expect(homeSource).not.toContain('fantasy-section-decorated');
  });

  it("keeps the logged-in Logout control legible against the translucent service header", () => {
    expect(layoutSource).toContain('border-[#e6c972] bg-[#fffaf0]');
    expect(layoutSource).toContain('text-[#263b5b]');
    expect(layoutSource).toContain('>\n                Logout\n');
  });

  it("keeps the portal header translucent and the sign-in call to action distinguishable", () => {
    expect(layoutSource).toContain('border-b border-[#c8d8e7]/30 bg-[#1c3147]/72 text-white');
    expect(layoutSource).toContain('portal-nav');
    expect(layoutSource).toContain('hover:bg-[#6188c5]');
  });

  it("keeps a solid white footer and mobile social control placement without misplaced ornaments", () => {
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

  it("keeps footer content readable on a solid white surface", () => {
    expect(layoutSource).toContain('border-t border-[#e7e1d5] bg-white text-[#17120c]');
    expect(layoutSource).toContain('font-medium text-[#17120c]');
  });
});
