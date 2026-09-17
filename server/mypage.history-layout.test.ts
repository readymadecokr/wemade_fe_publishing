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

  it("uses the same title banner contract as the News page", () => {
    expect(myPage).toContain('className="news-detail-page-banner news-detail-page-banner--list" aria-labelledby="mypage-page-title"');
    expect(myPage).toContain('<h1 id="mypage-page-title">My Page</h1>');
    expect(myPage).toContain("Manage your profile, coupons, and rCoin activity.");
    expect(myPage).not.toContain('className="fantasy-section-title mb-8 flex items-center gap-3 text-3xl"');
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

  it("logs out through the shared server-auth flow before returning home", () => {
    expect(myPage).toContain('import { useAuth } from "@/_core/hooks/useAuth";');
    expect(myPage).toContain("const { logout: logoutSession } = useAuth();");
    expect(myPage).toContain("await logoutSession();");
    expect(myPage).toContain('trpcUtils.shop.myBalance.setData(undefined, { ruCash: 0, bonusCash: 0 });');
    expect(myPage).toContain('localStorage.removeItem("manus-runtime-user-info");');
    expect(myPage).toContain('setLocation("/");');
  });
});
