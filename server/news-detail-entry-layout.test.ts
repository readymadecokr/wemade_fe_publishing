import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const newsListSource = readFileSync(new URL("../client/src/pages/News.tsx", import.meta.url), "utf8");
const newsDetailSource = readFileSync(new URL("../client/src/pages/NewsDetail.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const pointShopSource = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");
const globalStyles = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");

describe("News detail entry and service-page title banners", () => {
  it("resets every service route to the page top and uses the shared Home header", () => {
    expect(layoutSource).toContain('window.scrollTo({ top: 0, left: 0, behavior: "auto" })');
    expect(layoutSource).toContain("}, [location]);");
    expect(newsDetailSource).toContain('<Layout variant="homeChrome">');
    expect(layoutSource).toContain('location.startsWith("/news") ? "news"');
  });

  it("uses the reference-style News banner on both the referenced list route and detail", () => {
    expect(newsListSource).toContain("Latest news, interviews, and community highlights");
    expect(newsDetailSource).toContain("Latest news, interviews, and community highlights");
    expect(pointShopSource).not.toContain('<p className="text-[#e9dfc8]">Purchase rCoin</p>');
    expect(newsListSource).toContain('className="news-detail-page-banner news-detail-page-banner--list"');
    expect(newsDetailSource).toContain('className="news-detail-page-banner news-detail-page-banner--detail"');
    expect(pointShopSource).toContain('className="news-detail-page-banner shop-detail-page-banner"');
    expect(appSource).toContain('<Redirect to="/#game-info" />');
    expect(newsListSource).toContain('fantasy-content-guide px-2 py-6');
    expect(newsDetailSource).toContain('fantasy-page-shell news-detail-surface pt-6 pb-8 md:pt-8');
    expect(newsDetailSource).toContain('className="fantasy-page-shell news-detail-surface"');
    expect(pointShopSource).toContain('fantasy-content-guide shop-content-guide pt-6 pb-8 md:pt-8');
  });

  it("removes the atlas image from all News and Shop service surfaces", () => {
    expect(layoutSource).toContain('location.startsWith("/news") || location === "/point-shop"');
    expect(layoutSource).toContain('fantasy-site-atlas--detail-plain');
    expect(layoutSource).toContain('fantasy-site-atlas--shop-surface');
    expect(globalStyles).toContain('.fantasy-site-atlas--detail-plain {');
    expect(globalStyles).toContain('background-image: none !important;');
    expect(globalStyles).toContain('.fantasy-site-atlas--detail-plain {\n    background: #fbf8f1 !important;');
    expect(globalStyles).toContain('.fantasy-site-atlas--detail-plain > main,\n  .fantasy-site-atlas--detail-plain .fantasy-page-shell {\n    background: #fbf8f1 !important;');
    expect(globalStyles).toContain('.fantasy-site-atlas--detail-plain > main,');
    expect(globalStyles).toContain('.fantasy-site-atlas--detail-plain .fantasy-page-shell::before');
    expect(globalStyles).toContain('.fantasy-site-atlas--shop-surface,');
    expect(globalStyles).toContain('background: #fbf8f1 !important;');
    expect(globalStyles).toContain('.fantasy-site-atlas--detail-plain .news-detail-surface {');
    expect(globalStyles).toContain('.fantasy-site-atlas--detail-plain .news-detail-surface .fantasy-card {');
  });

  it("removes the shared long left-side guide line from News and Shop content", () => {
    expect(globalStyles).toContain(".fantasy-content-guide {");
    expect(globalStyles).not.toContain(".fantasy-content-guide::before");
    expect(globalStyles).not.toContain("rgba(76,97,133,.38)");
  });
});
