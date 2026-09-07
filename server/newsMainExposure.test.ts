import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const routerSource = fs.readFileSync(path.resolve(process.cwd(), "server/routers.ts"), "utf8");
const adminSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/AdminPage.tsx"), "utf8");
const homeSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("admin news automatic order and main exposure", () => {
  it("assigns sort order only on the server and serves six latest active news items", () => {
    expect(routerSource).toContain("const [{ maxOrder }] = await db.select");
    expect(routerSource).toContain("sortOrder: Number(maxOrder) + 10");
    expect(routerSource).toContain("publicNews: router");
    expect(routerSource).toContain(".orderBy(desc(news.publishedAt), desc(news.id))");
    expect(routerSource).toContain(".limit(6)");
  });

  it("removes the News order input and marks the current main six in the admin list", () => {
    expect(adminSource).toContain("신규 등록 시 등록일시 기준으로 자동 부여됩니다.");
    expect(adminSource).toContain("메인</th>");
    expect(adminSource).toContain("data.mainNewsIds?.includes(item.id)");
    expect(adminSource).toContain(">활성</span>");
  });

  it("uses the user-supplied final document as the Home News presentation source", () => {
    expect(homeSource).toContain("ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll_6a93287c.html");
    expect(homeSource).not.toContain("trpc.publicNews.list.useQuery");
  });
});
