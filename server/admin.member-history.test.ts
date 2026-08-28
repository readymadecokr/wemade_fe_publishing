import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routerSource = readFileSync(new URL("../server/routers.ts", import.meta.url), "utf8");
const adminSource = readFileSync(new URL("../client/src/pages/AdminPage.tsx", import.meta.url), "utf8");

describe("admin member transaction history", () => {
  it("provides user-scoped all, purchase, and usage history ordered by newest time", () => {
    const historyStart = routerSource.indexOf("transactionHistory: adminKeyProcedure");
    const historyEnd = routerSource.indexOf("updateNickname: adminKeyProcedure", historyStart);
    const historyApi = routerSource.slice(historyStart, historyEnd);

    expect(historyStart).toBeGreaterThan(-1);
    expect(historyApi).toContain('z.enum(["all", "charge", "use"])');
    expect(historyApi).toContain("ruCashTransactions.userId");
    expect(historyApi).toContain("filterMemberTransactionHistory(rows");
    expect(historyApi).toContain("filteredRows.slice(offset, offset + input.pageSize)");
  });

  it("renders tabs and a right-side history search that resets pagination", () => {
    const detailStart = adminSource.indexOf('title="회원 상세"');
    const detailEnd = adminSource.indexOf('className="mt-6 flex flex-wrap justify-start gap-2"', detailStart);
    const detailSource = adminSource.slice(detailStart, detailEnd);

    expect(adminSource).toContain('label: "전체"');
    expect(adminSource).toContain('label: "구매이력"');
    expect(adminSource).toContain('label: "사용이력"');
    expect(adminSource).toContain('aria-label="회원 거래 이력 검색"');
    expect(detailSource).toContain("<MemberHistoryControls");
    expect(detailSource).toContain("setMemberHistoryPage(1)");
    expect(detailSource).toContain("<MemberTransactionTable items={memberTransactionHistory?.items ?? []}");
  });
});
