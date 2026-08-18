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
});
