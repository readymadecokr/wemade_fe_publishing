import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React Home news and game information", () => {
  it("renders the authored News and Game Info content directly in React", () => {
    [/LATEST FROM MIDGARD/, /CLASSIC ADVENTURE/, /A NEW WAY TO PLAY/, /RUNE-MIDGARTS LIBRARY/].forEach((content) => {
      expect(homeSource).toMatch(content);
    });
    expect(homeSource).toContain("const NEWS_ITEMS = [");
    expect(homeSource).toContain('className="react-home-outline-cta react-home-news-more" aria-label="View more news">+</Link>');
    expect(homeSource).toContain('react-home-news-card--mobile-extra');
  });

  it("keeps responsive News and Game Info layout rules without an iframe", () => {
    expect(styleSource).toContain(".react-home-news-grid { display: grid; grid-template-columns: repeat(3,1fr);");
    expect(styleSource).toContain(".react-home-news-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; }");
    expect(styleSource).toContain(".react-home-news-card--mobile-extra { display: block; }");
    expect(styleSource).toContain(".react-home-game-info__grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); align-items: center; gap: clamp(26px,3.2vw,48px);");
    expect(homeSource).not.toContain("REFERENCE_HOME_URL");
  });
});
