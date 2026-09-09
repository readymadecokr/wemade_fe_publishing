import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const newsSource = readFileSync(new URL("../client/src/pages/News.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const layoutStyles = readFileSync(new URL("../client/src/components/news-layout.css", import.meta.url), "utf8");

describe("News Home-style chrome", () => {
  it("uses the Home chrome variant only for the News route", () => {
    expect(newsSource).toContain('<Layout variant="homeChrome">');
    expect(layoutSource).toContain('variant?: "default" | "homeChrome"');
    expect(layoutSource).toContain('variant === "homeChrome"');
  });

  it("renders Home-aligned header actions and closing footer", () => {
    expect(layoutSource).toContain("news-home-header");
    expect(layoutSource).toContain("news-home-quick-actions");
    expect(layoutSource).toContain("news-home-closing");
    expect(layoutSource).toContain("news-home-footer__bar");
    expect(layoutSource).toContain("TWO CLICKS TO");
    expect(layoutStyles).toContain(".news-home-content { padding-top: 104px; }");
    expect(layoutStyles).toContain(".news-home-content { padding-top: 132px; }");
    expect(layoutStyles).toContain(".news-home-footer__bar { padding: 34px 0 28px; background: #263545;");
  });
});
