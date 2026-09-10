import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const newsSource = readFileSync(new URL("../client/src/pages/News.tsx", import.meta.url), "utf8");
const newsDetailSource = readFileSync(new URL("../client/src/pages/NewsDetail.tsx", import.meta.url), "utf8");
const pointShopSource = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const homeHeaderSource = readFileSync(new URL("../client/src/components/HomeHeader.tsx", import.meta.url), "utf8");
const layoutStyles = readFileSync(new URL("../client/src/components/news-layout.css", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");

describe("News Home-style chrome", () => {
  it("uses the Home chrome variant for News and Point Shop", () => {
    expect(newsSource).toContain('<Layout variant="homeChrome" showClosingCta={false}>');
    expect(newsDetailSource).toContain('<Layout variant="homeChrome" showClosingCta={false}>');
    expect(pointShopSource).toContain('<Layout variant="homeChrome">');
    expect(layoutSource).toContain('showClosingCta?: boolean;');
    expect(layoutSource).toContain('variant === "homeChrome"');
  });

  it("reuses the exact Home header component and its measured height", () => {
    expect(layoutSource).toContain("<HomeHeader activeSection=");
    expect(homeHeaderSource).toContain('className="reference-home-live-header fixed inset-x-0 top-0 z-50 w-full text-white"');
    expect(homeHeaderSource).toContain("reference-header-main-row");
    expect(homeHeaderSource).toContain('document.documentElement.style.setProperty("--react-home-header-height"');
    expect(layoutStyles).toContain(".home-chrome-content { padding-top: var(--react-home-header-height, 104px); }");
  });

  it("removes the closing CTA from News while keeping the footer bar", () => {
    expect(newsSource).toContain('<Layout variant="homeChrome" showClosingCta={false}>');
    expect(newsDetailSource).toContain('<Layout variant="homeChrome" showClosingCta={false}>');
    expect(layoutSource).toContain('{showClosingCta && <section className="news-home-closing"');
    expect(layoutSource).toContain("news-home-closing");
    expect(layoutSource).toContain("news-home-footer__bar");
    expect(layoutSource).toContain("TWO CLICKS TO");
    expect(layoutStyles).toContain(".news-home-footer__bar { padding: 34px 0 28px; background: #263545;");
  });

  it("marks the current shared-header route as active", () => {
    expect(layoutSource).toContain('location.startsWith("/news") ? "news"');
    expect(layoutSource).toContain('location === "/point-shop" ? "shop"');
    expect(homeHeaderSource).toContain('pathFor(sectionId)');
    expect(appSource).toContain('<Redirect to="/#game-info" />');
  });

  it("renders a clear NEWS identifier above the News list and article detail", () => {
    expect(newsSource).toContain('className="news-page-marker"');
    expect(newsDetailSource).toContain('className="news-page-marker"');
    expect(layoutStyles).toContain('.news-page-marker {');
  });
});
