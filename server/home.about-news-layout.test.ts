import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("Home news and game information layout", () => {
  it("limits the main news presentation to the three newest live items", () => {
    expect(homeSource).toContain("dbNews.slice(0, 3).map");
    expect(homeSource).toContain("reference-news-grid");
    expect(homeSource).toContain("reference-news-card");
    expect(styleSource).toContain("grid-template-columns:repeat(3,minmax(0,1fr))");
  });

  it("replaces the former About title treatment with the reference game-information panel", () => {
    expect(homeSource).toContain("ABOUT RAGNAROK UNIVERSE");
    expect(homeSource).toContain("Classic adventure.");
    expect(homeSource).toContain("HTML5 MMORPG");
    expect(homeSource).toContain("Explore Game Info");
    expect(homeSource).not.toContain("Discover the heart of Ragnarok");
    expect(homeSource).not.toContain("Learn More");
  });
});
