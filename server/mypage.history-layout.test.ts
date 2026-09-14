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

  it("removes the Shop sidebar and provides an inline payment-provider selector", () => {
    expect(pointShop).not.toContain(">Top Up<");
    expect(pointShop).toContain('id="shop-payment-provider"');
    expect(pointShop).toContain('useState<ShopEntryProvider>("xsolla")');
    expect(pointShop).not.toContain('"charge-history"');
    expect(pointShop).not.toContain('"use-history"');
  });

  it("removes the closing Two Clicks to Midgard CTA from both My Page states", () => {
    expect(myPage.match(/<Layout showClosingCta=\{false\}>/g)).toHaveLength(2);
  });

  it("keeps Coupon registration and restores the history list without a visible history title", () => {
    expect(myPage).toContain("COUPON REGISTRATION");
    expect(myPage).not.toContain("MY PAGE · COUPON USE");
    expect(myPage).not.toContain("Coupon Use History");
    expect(myPage).toContain("coupon.myHistory.useQuery({ page: historyPage, pageSize: 20 }");
    expect(myPage).toContain('aria-label="Coupon history"');
    expect(myPage).toContain("COUPON HISTORY");
    expect(myPage).toContain('className="mt-6 flex justify-center"');
  });
});
