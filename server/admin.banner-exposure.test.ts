import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const adminPageSource = readFileSync(new URL("../client/src/pages/AdminPage.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");

describe("관리자 Main Banner 선택 노출 관리", () => {
  it("상단 노출 영역을 최대 10개로 분리하고 나머지를 미선택 영역으로 둔다", () => {
    expect(adminPageSource).toContain("const visibleBannerLimit = 10");
    expect(adminPageSource).toContain("const selectedBanners = allBanners.filter(b => b.isActive === 1).slice(0, visibleBannerLimit)");
    expect(adminPageSource).toContain("const unselectedBanners = [");
    expect(adminPageSource).toContain("선택된 노출 배너");
    expect(adminPageSource).toContain("미선택 배너");
  });

  it("체크박스와 위·아래 이동 제어로 노출 상태·순서를 저장한다", () => {
    expect(adminPageSource).toContain('type="checkbox"');
    expect(adminPageSource).toContain('moveCheckedBanners("show")');
    expect(adminPageSource).toContain('moveCheckedBanners("hide")');
    expect(adminPageSource).toContain("노출 배너는 최대 ${visibleBannerLimit}개까지 선택할 수 있습니다.");
    expect(adminPageSource).toContain("isActive: 1, sortOrder: index");
    expect(adminPageSource).toContain("isActive: 0, sortOrder: nextSelected.length + index");
  });

  it("메인 화면 공개 배너 API도 선택된 순서 기준 최대 10개만 반환한다", () => {
    expect(routerSource).toContain(".where(eq(banners.isActive, 1))");
    expect(routerSource).toContain(".orderBy(asc(banners.sortOrder), asc(banners.id))\n        .limit(10)");
  });
});
