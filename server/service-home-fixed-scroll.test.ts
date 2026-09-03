import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("final reference home navigation and scroll presentation", () => {
  it("uses the six requested top-level full-screen panel anchors", () => {
    ["game-start", "discord-community", "news", "game-info", "media", "site-footer"].forEach((section) => {
      expect(homeSource + layoutSource).toContain(`id="${section}"`);
    });
    expect(styleSource).toContain("height: calc(100svh - var(--reference-header))");
    expect(styleSource).toContain("scroll-snap-align: start");
    expect(styleSource).toContain("scroll-snap-stop: always");
  });

  it("moves exactly one section for a desktop wheel gesture while retaining native internal scroll", () => {
    expect(homeSource).toContain("window.addEventListener(\"wheel\", onWheel, { passive: false })");
    expect(homeSource).toContain("iframe, [data-allow-native-scroll], [role=dialog]");
    expect(homeSource).toContain("const next = Math.max(0, Math.min(sections.length - 1, activeIndex + direction))");
    expect(homeSource).toContain('scrollIntoView({ behavior: "smooth", block: "start" })');
    expect(homeSource).toContain("window.innerWidth <= 900");
  });

  it("keeps the fixed account and game navigation separate from the reference Home panels", () => {
    expect(layoutSource).toContain("Two-tier Global Navigation");
    expect(layoutSource).toContain("fixed inset-x-0 top-0 z-40");
    expect(layoutSource).toContain('className="flex-1 w-full pt-[136px] sm:pt-[106px]"');
    expect(layoutSource).toContain('href="/#game-start"');
  });
});
