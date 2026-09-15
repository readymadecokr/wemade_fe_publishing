import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React Hero controls and community visibility", () => {
  it("renders minimal arrow and dot controls directly in the Hero", () => {
    expect(homeSource).toContain("react-home-hero__arrow--left");
    expect(homeSource).toContain("react-home-hero__arrow--right");
    expect(homeSource).toContain("react-home-hero__dots");
    expect(homeSource).toContain('<div className="react-home-hero__dots" aria-label="Hero banner position">');
    expect(homeSource).not.toContain('<div className="react-home-hero__controls" aria-label="Hero banners">\n          <button className="react-home-hero__arrow react-home-hero__arrow--left" type="button" aria-label="Previous banner" onClick={() => selectHero(-1)}><ChevronLeft /></button>\n          <div className="react-home-hero__dots">');
    expect(styleSource).toContain(".react-home-hero__arrow:hover");
  });

  it("uses actual official social links in the directly rendered footer", () => {
    expect(homeSource).toContain("https://facebook.com/RagnarokUniverseEN");
    expect(homeSource).toContain("https://x.com/RagUniOfficial");
  });
});
