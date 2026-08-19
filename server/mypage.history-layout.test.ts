import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const myPage = readFileSync(new URL("../client/src/pages/MyPage.tsx", import.meta.url), "utf8");
const pointShop = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");

describe("My Page history layout", () => {
  it("uses 10-item history pages without a Purchase or Usage section heading", () => {
    const historyStart = myPage.indexOf("function MyPageHistory");
    const historyEnd = myPage.indexOf("export default function MyPage");
    const historySource = myPage.slice(historyStart, historyEnd);

    expect(historySource).toContain("myChargeHistory.useQuery({ page, pageSize: 10 }");
    expect(historySource).toContain("myUseHistory.useQuery({ page, pageSize: 10 }");
    expect(historySource).toContain('className="space-y-3"');
    expect(historySource).not.toMatch(/<h[1-6][^>]*>\{?isPurchase \? \"Purchase History\"/);
  });

  it("keeps only the Top Up action in the Shop sidebar", () => {
    expect(pointShop).toContain(">TOP UP<");
    expect(pointShop).not.toContain("PURCHASE HISTORY");
    expect(pointShop).not.toContain("USAGE HISTORY");
    expect(pointShop).not.toContain('setLocation("/mypage")');
    expect(pointShop).not.toContain('"charge-history"');
    expect(pointShop).not.toContain('"use-history"');
  });
});
