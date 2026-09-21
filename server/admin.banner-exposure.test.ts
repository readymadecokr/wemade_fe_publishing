import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const adminPageSource = readFileSync(new URL("../client/src/pages/AdminPage.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");

describe("관리자 Main Banner 선택 노출 관리", () => {
  it("활성 배너 전체를 상단 노출 영역으로 두고 비활성 배너를 미선택 영역으로 분리한다", () => {
    expect(adminPageSource).toContain("const selectedBanners = allBanners.filter(b => b.isActive === 1);");
    expect(adminPageSource).toContain("const unselectedBanners = allBanners.filter(b => b.isActive !== 1);");
    expect(adminPageSource).not.toContain("visibleBannerLimit");
    expect(adminPageSource).toContain("선택된 노출 배너");
    expect(adminPageSource).toContain("미선택 배너");
  });

  it("체크박스와 위·아래 이동 제어로 노출 상태·순서를 저장한다", () => {
    expect(adminPageSource).toContain('type="checkbox"');
    expect(adminPageSource).toContain('moveCheckedBanners("show")');
    expect(adminPageSource).toContain('moveCheckedBanners("hide")');
    expect(adminPageSource).not.toContain("노출 배너는 최대");
    expect(adminPageSource).toContain("isActive: 1, sortOrder: index");
    expect(adminPageSource).toContain("isActive: 0, sortOrder: nextSelected.length + index");
  });

  it("메인 화면 공개 배너 API가 활성 배너 전체를 선택된 순서로 반환한다", () => {
    expect(routerSource).toContain(".where(eq(banners.isActive, 1))");
    expect(routerSource).toContain(".orderBy(asc(banners.sortOrder), asc(banners.id));");
    expect(routerSource).not.toContain(".limit(10)");
  });

  it("메인배너 등록 안내와 미리보기를 1900×600px, 1,024KB 미만 기준으로 제공한다", () => {
    expect(adminPageSource).toContain("필수: 1900×600px | 1,024KB 미만");
    expect(adminPageSource).toContain('if (file.size >= 1024 * 1024) { toast.error("메인배너 이미지는 1,024KB 미만이어야 합니다."); return; }');
    expect(adminPageSource).toContain("dimensions.width !== 1900 || dimensions.height !== 600");
    expect(routerSource).toContain("uploadMainBannerImage");
    expect(adminPageSource).toContain('aspectRatio: "1900/600"');
  });
});
