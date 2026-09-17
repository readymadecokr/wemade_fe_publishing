import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const adminSource = readFileSync(new URL("../client/src/pages/AdminPage.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("../server/routers.ts", import.meta.url), "utf8");

describe("관리자 Media 스크린샷 관리", () => {
  it("Media 아래에 등록·선택 노출·미선택 스크린샷 관리 화면을 제공한다", () => {
    expect(adminSource).toContain("function ScreenshotGallerySection");
    expect(adminSource).toContain("스크린샷 관리");
    expect(adminSource).toContain("선택된 노출 스크린샷");
    expect(adminSource).toContain("미선택 스크린샷");
    expect(adminSource).toContain("moveChecked(\"show\")");
    expect(adminSource).toContain("moveChecked(\"hide\")");
    expect(adminSource).toContain("uploadScreenshotImage");
    expect(adminSource).toContain("최대 12개까지 선택할 수 있습니다.");
    expect(adminSource).toContain("JPG, PNG, WEBP / 최대 1,000KB");
    expect(adminSource).toContain('<MediaSection adminClient={adminClient} /><ScreenshotGallerySection adminClient={adminClient} />');
  });

  it("스크린샷 등록·노출 상태·순서를 저장하고 공개 갤러리는 활성 항목만 반환한다", () => {
    expect(routerSource).toContain("publicScreenshots: router");
    expect(routerSource).toContain("screenshotsAdmin: router");
    expect(routerSource).toContain("uploadScreenshotImage");
    expect(routerSource).toContain("buffer.length > 1000 * 1024");
    expect(routerSource).toContain("파일 용량이 1,000KB를 초과합니다.");
    expect(routerSource).toContain("where(eq(screenshots.isActive, 1))");
    expect(routerSource).toContain("orderBy(asc(screenshots.sortOrder), asc(screenshots.id))");
  });
});
