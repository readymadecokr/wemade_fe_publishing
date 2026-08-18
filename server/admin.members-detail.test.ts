import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/AdminPage.tsx", import.meta.url), "utf8");

describe("admin member detail page", () => {
  it("renders a selected member as an in-page detail view rather than a modal", () => {
    expect(source).toContain("if (selectedUser && !suspendForm) {");
    expect(source).toContain('title="회원 상세"');
    expect(source).toContain("회원 목록");
    expect(source).toContain("onClick={() => setSelectedUser(u)}");
  });

  it("left-aligns detail actions in Save, Back, Restrict order", () => {
    const footerStart = source.indexOf('className="mt-6 flex flex-wrap justify-start gap-2"');
    const footerEnd = source.indexOf("</div>", footerStart + 1);
    const footer = source.slice(footerStart, footerEnd + 6);

    expect(footerStart).toBeGreaterThan(-1);
    expect(footer.indexOf('"저장"')).toBeLessThan(footer.indexOf(">이전<"));
    expect(footer.indexOf(">이전<")).toBeLessThan(footer.indexOf(">이용 제한<"));
  });
});
