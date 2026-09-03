import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("Home action and closing presentation", () => {
  it("uses the reference Hero actions instead of the former About View More control", () => {
    expect(homeSource).toContain("EXPLORE THE BETA");
    expect(homeSource).toContain("reference-game-start");
    expect(homeSource).toContain("reference-discord-cta");
    expect(homeSource).toContain("Game Start");
    expect(homeSource).not.toContain("View More");
  });

  it("retains the closing story footer without the dark-mode control", () => {
    expect(layoutSource).toContain('id="site-footer"');
    expect(layoutSource).toContain("Your story begins here");
    expect(layoutSource).toContain("Two Clicks to Midgard");
    expect(layoutSource).not.toContain("Moon, Sun");
    expect(layoutSource).not.toContain("toggleTheme");
    expect(styleSource).toContain(".reference-hero-cta-rail");
  });
});
