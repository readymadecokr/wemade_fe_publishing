import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const adminPageSource = readFileSync(new URL("../client/src/pages/AdminPage.tsx", import.meta.url), "utf8");

describe("Admin member list and detail page structure", () => {
  it("uses the requested member column order", () => {
    const headerOrder = ["User ID", "Nickname", "Provider", "Registration Date", "Last Activity", "상태", "CS Code", "처리"];
    const positions = headerOrder.map((header) => adminPageSource.indexOf(`<th className="text-left p-2">${header}</th>`));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("swaps the member list for an in-page detail view instead of opening the detail dialog", () => {
    expect(adminPageSource).toContain("{!selectedUser && (");
    expect(adminPageSource).toContain('title="회원 상세"');
    expect(adminPageSource).toContain("회원 목록");
    expect(adminPageSource).not.toContain("<Dialog open={!!selectedUser && !suspendForm}");
  });

  it("left-aligns the member-detail actions in Save, Back, Restrict order", () => {
    const footerStart = adminPageSource.indexOf('className="mt-6 flex flex-wrap justify-start gap-2"');
    const footerEnd = adminPageSource.indexOf("{/* 현재 회원 제재 팝업 미리보기 */}", footerStart);
    const footerSource = adminPageSource.slice(footerStart, footerEnd);

    expect(footerStart).toBeGreaterThanOrEqual(0);
    expect(footerSource.indexOf('"저장"')).toBeLessThan(footerSource.indexOf("이전"));
    expect(footerSource.indexOf("이전")).toBeLessThan(footerSource.indexOf("이용 제한"));
  });
});
