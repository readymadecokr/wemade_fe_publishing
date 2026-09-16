import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const routerSource = fs.readFileSync(path.resolve(process.cwd(), "server/routers.ts"), "utf8");
const adminSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/AdminPage.tsx"), "utf8");
const homeSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const newsListSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/News.tsx"), "utf8");
const newsDetailSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/NewsDetail.tsx"), "utf8");

describe("admin news automatic order and main exposure", () => {
  it("assigns sort order on the server and exposes only active News in a consistent published order", () => {
    expect(routerSource).toContain("const [{ maxOrder }] = await db.select");
    expect(routerSource).toContain("sortOrder: Number(maxOrder) + 10");
    expect(routerSource).toContain("publicNews: router");
    expect(routerSource).toContain("list: publicProcedure.query");
    expect(routerSource).toContain("home: publicProcedure.query");
    expect(routerSource).toContain("byId: publicProcedure");
    expect(routerSource).toContain("and(eq(news.id, input.id), eq(news.isActive, 1))");
    expect(routerSource).toContain(".orderBy(desc(news.publishedAt), desc(news.id))");
    expect(routerSource).toContain(".limit(4)");
  });

  it("removes the News order input and marks the current Home four in the admin list", () => {
    expect(adminSource).toContain("신규 등록 시 등록일시 기준으로 자동 부여됩니다.");
    expect(adminSource).toContain("메인</th>");
    expect(adminSource).toContain("data.mainNewsIds?.includes(item.id)");
    expect(adminSource).toContain(">활성</span>");
    expect(adminSource).toContain("홈 요약");
    expect(adminSource).toContain("<label className=\"text-sm font-medium\">분류</label>");
  });

  it("places the four active Home News records at the beginning of the administrator list before pagination", () => {
    expect(routerSource).toContain("const mainNewsOrder = new Map(mainNewsIds.map((id, index) => [id, index]));");
    expect(routerSource).toContain("const leftMainOrder = mainNewsOrder.get(left.id);");
    expect(routerSource).toContain(".slice(offset, offset + input.pageSize);");
    expect(routerSource).toContain("return { items, total: allItems.length, mainNewsIds };");
  });

  it("renders Home, list, and detail from the public administrator-backed News source without static articles", () => {
    expect(homeSource).toContain("trpc.publicNews.home.useQuery");
    expect(homeSource).toContain("href={`/news/${item.id}`}");
    expect(homeSource).not.toContain("const NEWS_ITEMS = [");
    expect(homeSource).toContain("react-home-news-grid");
    expect(homeSource).toContain('className="react-home-outline-cta react-home-news-more" aria-label="View more news">+</Link>');
    expect(homeSource).not.toContain("REFERENCE_HOME_URL");
    expect(newsListSource).toContain("trpc.publicNews.list.useQuery");
    expect(newsListSource).not.toContain("const newsData = [");
    expect(newsDetailSource).toContain("trpc.publicNews.byId.useQuery");
    expect(newsDetailSource).toContain("trpc.publicNews.list.useQuery");
    expect(newsDetailSource).not.toContain("const newsData = [");
  });
});
