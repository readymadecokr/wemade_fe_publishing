import { describe, expect, it } from "vitest";
import { calculateCumulativePaymentUsd, filterMemberCouponHistory } from "./memberCouponHistory";

describe("member coupon history helpers", () => {
  const coupons = [
    { id: 1, code: "WELCOME", name: "Welcome rCoin", eventName: "WELCOME EVENT", gameCode: "ROU", couponType: "common" as const, benefitType: "point" as const, benefitValue: 500, bonusRcoin: 500, rewardItems: "[]", serverCodes: "1,2", validFrom: new Date("2026-08-01T00:00:00Z"), expiresAt: new Date("2026-08-31T23:59:00Z") },
    { id: 2, code: "SWORD", name: "Sword Pack", eventName: "SWORD EVENT", gameCode: "ROU", couponType: "random" as const, benefitType: "product" as const, benefitValue: 44, bonusRcoin: 0, rewardItems: '[{"itemId":"44","quantity":1}]', serverCodes: null, validFrom: null, expiresAt: null },
  ];
  const uses = [
    { id: 1, couponId: 1, userId: 9, usedAt: new Date("2026-08-12T09:00:00Z") },
    { id: 2, couponId: 2, userId: 9, usedAt: new Date("2026-08-11T09:00:00Z") },
  ];

  it("searches coupon code, event name or name and returns coupon-management details", () => {
    expect(filterMemberCouponHistory(uses, coupons, { search: "wel" }).map(item => item.couponCode)).toEqual(["WELCOME"]);
    expect(filterMemberCouponHistory(uses, coupons, { search: "sword event" }).map(item => item.couponCode)).toEqual(["SWORD"]);
    expect(filterMemberCouponHistory(uses, coupons, { search: "", startDate: "2026-08-11", endDate: "2026-08-11" }).map(item => item.couponCode)).toEqual(["SWORD"]);
    expect(filterMemberCouponHistory(uses, coupons, { search: "wel" })[0]).toMatchObject({ eventName: "WELCOME EVENT", gameCode: "ROU", couponType: "common", bonusRcoin: 500, status: "used" });
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
