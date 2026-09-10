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

  it("uses a concise NEWS identifier and removes retired page introduction banners", () => {
    expect(newsListSource).not.toContain("Latest news, interviews, and community highlights");
    expect(newsDetailSource).not.toContain("Latest news, interviews, and community highlights");
    expect(pointShopSource).not.toContain('<p className="text-[#e9dfc8]">Purchase rCoin</p>');
    expect(newsListSource).toContain('className="news-page-marker"');
    expect(newsDetailSource).toContain('className="news-page-marker"');
    expect(appSource).toContain('<Redirect to="/#game-info" />');
    expect(newsListSource).toContain('fantasy-content-guide px-2 py-6');
    expect(newsDetailSource).toContain('fantasy-page-shell pt-6 pb-8 md:pt-8');
    expect(pointShopSource).toContain('fantasy-content-guide pt-6 pb-8 md:pt-8');
  });

  it("removes the shared long left-side guide line from News and Shop content", () => {
    expect(globalStyles).toContain(".fantasy-content-guide {");
    expect(globalStyles).not.toContain(".fantasy-content-guide::before");
    expect(globalStyles).not.toContain("rgba(76,97,133,.38)");
  });
});
