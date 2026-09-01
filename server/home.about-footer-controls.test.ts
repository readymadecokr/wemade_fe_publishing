import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");

describe("Home About action and footer presentation", () => {
  it("places the About View More action in the section header and removes Learn More", () => {
    expect(homeSource).toContain('<Link href="/game-info" className="shrink-0 pt-1">');
    expect(homeSource).toContain('About Ragnarok Universe');
    expect(homeSource).not.toContain('Learn More');
    expect(homeSource).not.toContain('ArrowRight');
  });

  it("removes the dark mode control and separates the footer with a solid white background", () => {
    expect(layoutSource).not.toContain('Moon, Sun');
    expect(layoutSource).not.toContain('toggleTheme');
    expect(layoutSource).toContain('className="mt-auto w-full border-t border-[#e7e1d5] bg-white text-[#17120c]"');
  });
});
