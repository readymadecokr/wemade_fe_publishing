import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");

describe("Home About action and footer presentation", () => {
  it("places the About View More action in the section header and removes Learn More", () => {
    expect(homeSource).toContain('<Link href="/game-info" className="shrink-0 pt-1">');
    expect(homeSource).toContain('About Ragnarok Universe');
    expect(homeSource).not.toContain('<p className="mt-1 text-sm text-[#786850] md:text-base">Discover the heart of Ragnarok</p>');
    expect(homeSource).not.toContain('Learn More');
    expect(homeSource).not.toContain('ArrowRight');
  });

  it("removes the dark mode control and applies the reference footer surface", () => {
    expect(layoutSource).not.toContain('Moon, Sun');
    expect(layoutSource).not.toContain('toggleTheme');
    expect(layoutSource).toContain('id="site-footer" className="fantasy-site-footer home-scroll-panel mt-auto w-full text-[#17120c]"');
  });
});
