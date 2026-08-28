export type CouponUsageRow = {
  id: number;
  couponId: number;
  userId: number;
  usedAt: Date | string;
};

export type CouponRow = {
  id: number;
  code: string;
  name: string;
  eventName?: string;
  gameCode?: string;
  couponType?: "common" | "random";
  benefitType: "point" | "product";
  benefitValue: number;
  bonusRcoin?: number;
  rewardItems?: string | null;
  serverCodes?: string | null;
  validFrom?: Date | string | null;
  expiresAt?: Date | string | null;
};

export type ChargePaymentRow = {
  type: "charge" | "use";
  status: "completed" | "failed" | "pending";
  priceUsd: string | number | null;
};

export function filterMemberCouponHistory(uses: CouponUsageRow[], coupons: CouponRow[], input: { search: string; startDate?: string; endDate?: string }) {
  const couponById = new Map(coupons.map(coupon => [coupon.id, coupon]));
  const keyword = input.search.trim().toLocaleLowerCase();
  const startTime = input.startDate ? new Date(`${input.startDate}T00:00:00`).getTime() : Number.NEGATIVE_INFINITY;
  const endTime = input.endDate ? new Date(`${input.endDate}T23:59:59.999`).getTime() : Number.POSITIVE_INFINITY;

  return uses
    .map(usage => ({ ...usage, coupon: couponById.get(usage.couponId) }))
    .filter((item): item is typeof item & { coupon: CouponRow } => Boolean(item.coupon))
    .filter(item => !keyword || [item.coupon.code, item.coupon.name, item.coupon.eventName ?? "", item.coupon.gameCode ?? ""].some(value => value.toLocaleLowerCase().includes(keyword)))
    .filter(item => {
      const usedAt = new Date(item.usedAt).getTime();
      return usedAt >= startTime && usedAt <= endTime;
    })
    .sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime())
    .map(item => ({
      id: item.id,
      couponCode: item.coupon.code,
      couponName: item.coupon.name,
      eventName: item.coupon.eventName ?? item.coupon.name,
      gameCode: item.coupon.gameCode ?? "ROU",
      couponType: item.coupon.couponType ?? "common",
      benefitType: item.coupon.benefitType,
      benefitValue: item.coupon.benefitValue,
      bonusRcoin: item.coupon.bonusRcoin ?? 0,
      rewardItems: item.coupon.rewardItems ?? "[]",
      serverCodes: item.coupon.serverCodes ?? null,
      validFrom: item.coupon.validFrom ?? null,
      expiresAt: item.coupon.expiresAt ?? null,
      status: "used",
      usedAt: item.usedAt,
    }));
}

export function calculateCumulativePaymentUsd(rows: ChargePaymentRow[]) {
  return rows.reduce((total, row) => row.type === "charge" && row.status === "completed" ? total + Number(row.priceUsd ?? 0) : total, 0);
}
