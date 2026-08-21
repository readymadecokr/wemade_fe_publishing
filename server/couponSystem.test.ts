import { describe, expect, it } from "vitest";
import { generateRandomCouponCode, getCouponStatus, RANDOM_COUPON_PATTERN, validateCouponSystemInput } from "./couponSystem";

const reward = [{ itemId: "501039", quantity: 1 }];

describe("coupon system rules", () => {
  it("generates the mandatory NNNN-NNNN-NNNN random coupon format", () => {
    const code = generateRandomCouponCode(() => 0);
    expect(code).toBe("AAAA-AAAA-AAAA");
    expect(RANDOM_COUPON_PATTERN.test(code)).toBe(true);
  });

  it("requires generated random codes and honors the reward-item limit", () => {
    const base = { couponType: "random" as const, code: "ABCD-EFGH-2345", eventName: "ROU TEST", bonusRcoin: 0, rewardItems: reward, randomGenerated: 1 };
    expect(validateCouponSystemInput(base)).toBeNull();
    expect(validateCouponSystemInput({ ...base, randomGenerated: 0 })).toContain("자동 생성");
    expect(validateCouponSystemInput({ ...base, bonusRcoin: 100, rewardItems: [...reward, { itemId: "2", quantity: 1 }, { itemId: "3", quantity: 1 }, { itemId: "4", quantity: 1 }, { itemId: "5", quantity: 1 }] })).toContain("4종");
  });

  it("calculates inactive, scheduled, expired, used, and active states safely", () => {
    const now = new Date("2026-08-21T00:00:00Z");
    const base = { isActive: 1, validFrom: null, expiresAt: null, usedCount: 0, maxUses: 1, couponType: "random" as const };
    expect(getCouponStatus({ ...base, isActive: 0 }, now)).toBe("inactive");
    expect(getCouponStatus({ ...base, validFrom: new Date("2026-08-22T00:00:00Z") }, now)).toBe("scheduled");
    expect(getCouponStatus({ ...base, expiresAt: new Date("2026-08-20T00:00:00Z") }, now)).toBe("expired");
    expect(getCouponStatus({ ...base, usedCount: 1 }, now)).toBe("used");
    expect(getCouponStatus(base, now)).toBe("active");
  });
});
