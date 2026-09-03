import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("service home fixed navigation and scroll presentation", () => {
  it("keeps the account and game navigation fixed at the top", () => {
    expect(layoutSource).toContain("fixed inset-x-0 top-0 z-40");
    expect(layoutSource).toContain('pt-[136px] sm:pt-[106px]');
    expect(layoutSource).toContain('order-3 grid w-full grid-cols-6');
    expect(layoutSource).toContain("Two-tier Global Navigation");
  });

  it("moves one full-screen home section per desktop wheel gesture and provides a mobile snap fallback", () => {
    expect(homeSource).toContain('const sectionIds = ["game-start", "discord-community", "news", "game-info", "media", "site-footer"]');
    expect(homeSource).toContain('window.addEventListener("wheel", handleSectionWheel, { passive: false })');
    expect(homeSource).toContain('window.setTimeout(() => { wheelLocked = false; }, 760)');
    expect(homeSource).toContain('document.querySelector("header")?.getBoundingClientRect().height ?? 106');
    expect(homeSource).toContain('scrollIntoView({ behavior: "smooth", block: "start" })');
    expect(styleSource).toContain('scroll-snap-type: y mandatory');
    expect(styleSource).toContain('scroll-snap-stop: always');
    expect(styleSource).toContain('height: calc(100svh - var(--service-header-offset))');
    expect(styleSource).toContain('min-height: calc(100svh - var(--service-header-offset))');
    expect(styleSource).toContain('--service-header-offset: 136px');
    expect(homeSource).toContain('data-allow-native-scroll');
    expect(homeSource).toContain('absolute bottom-5 left-1/2 z-30 -translate-x-1/2 sm:bottom-7');
    expect(styleSource).toContain('.home-hero-panel .game-start-btn-wrap');
  });

  it("adds a banner information link and four official footer social links", () => {
    expect(homeSource).toContain("Explore More");
    expect(homeSource).toContain("heroEyebrow");
    expect(layoutSource).toContain('aria-label="Official social links"');
    expect(layoutSource).toContain('footer-social-link bg-[#5865f2]');
    expect(layoutSource).toContain('footer-social-link bg-[#1877f2]');
    expect(layoutSource).toContain('footer-social-link bg-[#e62429]');
    expect(layoutSource).toContain('footer-social-link bg-[#171717]');
    expect(layoutSource).toContain('mb-8 flex justify-end');
    expect(layoutSource).toContain('Discord_icon_230fdb89_6026051e.png');
  });
});
