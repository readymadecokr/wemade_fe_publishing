import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("service background visual restoration", () => {
  it("keeps all home news cards at a consistent content height", () => {
    expect(homeSource).toContain("flex h-full flex-col overflow-hidden");
    expect(homeSource).toContain("min-h-[84px] flex-1 flex-col");
    expect(homeSource).toContain("min-h-[2.5rem]");
    expect(homeSource).toContain("mt-auto text-[11px]");
  });

  it("restores the decorative background through the shared service layout", () => {
    expect(styleSource).toContain("ragnarok-fantasy-continuous-atlas_fb2301c6.png");
    expect(styleSource).toContain(".fantasy-site-atlas");
    expect(styleSource).toContain("background-color: #f3ead5");
    expect(styleSource).toContain("background: rgba(255,253,247,.9)");
    expect(styleSource).toContain(".fantasy-site-atlas::before");
    expect(layoutSource).toContain("fantasy-site-atlas");
    expect(layoutSource).toContain("fantasy-site-footer home-scroll-panel mt-auto w-full text-[#17120c]");
    expect(styleSource).toContain("ragnarok-fantasy-section-ornament_f3f3bf5d.png");
    expect(homeSource).not.toContain("fantasy-section-decorated");
  });

  it("keeps the logged-in Logout control legible against the translucent service header", () => {
    expect(layoutSource).toContain("border-[#e6c972] bg-[#fffaf0]");
    expect(layoutSource).toContain("text-[#263b5b]");
    expect(layoutSource).toContain(">Logout</Button>");
  });

  it("keeps the portal header and sign-in call to action distinguishable", () => {
    expect(layoutSource).toContain("fixed inset-x-0 top-0 z-40");
    expect(layoutSource).toContain("border-b border-[#c8d8e7]/30 bg-[#1c3147]/92 text-white");
    expect(layoutSource).toContain("portal-nav");
    expect(layoutSource).toContain("hover:bg-[#6188c5]");
  });

  it("keeps the Media scroll panel and floating social placement without misplaced ornaments", () => {
    expect(layoutSource).not.toContain("ragnarok-fantasy-footer-atlas_e83c8727.png");
    expect(styleSource).not.toContain(".fantasy-view-more::before");
    expect(styleSource).toContain(".floating-social-box");
    expect(homeSource).toContain('section id="media" className="home-scroll-panel pb-12 pt-12 md:pb-16 md:pt-16"');
  });

  it("matches the reference menu's gold underline, active surface, hover lift, and click feedback", () => {
    expect(styleSource).toContain("header .portal-nav > a");
    expect(styleSource).toContain("font-weight: 800");
    expect(styleSource).toContain("portal-nav-link--active");
    expect(styleSource).toContain("background: rgba(255,255,255,.045)");
    expect(styleSource).toContain("color: #ffe4a3 !important");
    expect(styleSource).toContain("transform: translateY(-2px)");
    expect(styleSource).toContain("transform: translateY(0) scale(.97)");
    expect(styleSource).toContain("width: calc(100% - 1.3rem)");
    expect(layoutSource).toContain('className={`portal-nav-link ${location === "/" ? "portal-nav-link--active" : ""}`}');
    expect(layoutSource).toContain("COMMUNITY <ExternalLink");
    expect(layoutSource).toContain(">My Page</Link>");
  });

  it("keeps footer content readable on the reference gradient surface", () => {
    expect(layoutSource).toContain("fantasy-site-footer home-scroll-panel mt-auto w-full text-[#17120c]");
    expect(styleSource).toContain("background: linear-gradient(180deg, rgba(211,198,172,.72), rgba(199,182,151,.82))");
    expect(styleSource).toContain("border-top: 1px solid rgba(112,92,54,.28)");
    expect(layoutSource).toContain("font-medium text-[#17120c]");
  });
});
