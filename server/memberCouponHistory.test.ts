import { describe, expect, it } from "vitest";
import { calculateCumulativePaymentUsd, filterMemberCouponHistory } from "./memberCouponHistory";

describe("member coupon history helpers", () => {
  const coupons = [
    { id: 1, code: "WELCOME", name: "Welcome rCoin", benefitType: "point" as const, benefitValue: 500 },
    { id: 2, code: "SWORD", name: "Sword Pack", benefitType: "product" as const, benefitValue: 44 },
  ];
  const uses = [
    { id: 1, couponId: 1, userId: 9, usedAt: new Date("2026-08-12T09:00:00Z") },
    { id: 2, couponId: 2, userId: 9, usedAt: new Date("2026-08-11T09:00:00Z") },
  ];

  it("searches coupon code or name and keeps usage time descending", () => {
    expect(filterMemberCouponHistory(uses, coupons, { search: "wel" }).map(item => item.couponCode)).toEqual(["WELCOME"]);
    expect(filterMemberCouponHistory(uses, coupons, { search: "", startDate: "2026-08-11", endDate: "2026-08-11" }).map(item => item.couponCode)).toEqual(["SWORD"]);
  });

  it("sums completed charge payments only", () => {
    expect(calculateCumulativePaymentUsd([
      { type: "charge", status: "completed", priceUsd: "10.50" },
      { type: "charge", status: "failed", priceUsd: "9.00" },
      { type: "use", status: "completed", priceUsd: "2.00" },
      { type: "charge", status: "completed", priceUsd: null },
    ])).toBe(10.5);
  });
});
