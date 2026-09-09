import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const newsListSource = readFileSync(new URL("../client/src/pages/News.tsx", import.meta.url), "utf8");
const newsDetailSource = readFileSync(new URL("../client/src/pages/NewsDetail.tsx", import.meta.url), "utf8");
const gameInfoSource = readFileSync(new URL("../client/src/pages/GameInfo.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");

describe("News detail entry and service-page title banners", () => {
  it("resets each article navigation to the page top and uses the shared Home header", () => {
    expect(newsDetailSource).toContain('window.scrollTo({ top: 0, left: 0, behavior: "auto" })');
    expect(newsDetailSource).toContain("}, [newsId]);");
    expect(newsDetailSource).toContain('<Layout variant="homeChrome">');
    expect(layoutSource).toContain('location.startsWith("/news") ? "news"');
  });

  it("removes the separate News and Game Info title-introduction banners", () => {
    expect(newsListSource).not.toContain("Latest news, interviews, and community highlights");
    expect(newsDetailSource).not.toContain("Latest news, interviews, and community highlights");
    expect(gameInfoSource).not.toContain("Learn everything about Ragnarok Universe");
    expect(newsListSource).toContain('fantasy-content-guide px-2 py-6');
    expect(newsDetailSource).toContain('fantasy-page-shell pt-6 pb-8 md:pt-8');
    expect(gameInfoSource).toContain('fantasy-content-guide pt-6 pb-8 md:pt-8');
  });
});
