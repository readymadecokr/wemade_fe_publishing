export type CouponRewardItem = { itemId: string; quantity: number };
export type CouponSystemInput = {
  couponType: "common" | "random";
  code: string;
  eventName: string;
  validFrom?: Date | null;
  expiresAt?: Date | null;
  bonusRcoin: number;
  rewardItems: CouponRewardItem[];
  randomGenerated?: number;
  issueQuantity?: number;
};

export const RANDOM_COUPON_PATTERN = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export function generateRandomCouponCode(random: () => number = Math.random) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 3 }, () => Array.from({ length: 4 }, () => alphabet[Math.floor(random() * alphabet.length)]).join("")).join("-");
}

export function validateCouponSystemInput(input: CouponSystemInput) {
  const eventBytes = Buffer.byteLength(input.eventName.trim(), "utf8");
  if (!input.eventName.trim() || eventBytes > 20) return "이벤트명은 영문 기준 최대 20byte로 입력하세요.";
  if (input.couponType === "random" && !input.code.trim()) return "난수 쿠폰 생성에 사용할 코드가 없습니다.";
  if (input.couponType === "common" && !input.code.trim()) return "쿠폰 코드를 입력하세요.";
  if (!RANDOM_COUPON_PATTERN.test(input.code)) return "쿠폰 코드는 NNNN-NNNN-NNNN 형식의 대문자·숫자 코드로 입력하세요.";
  if (input.couponType === "random" && (!input.randomGenerated || !RANDOM_COUPON_PATTERN.test(input.code))) return "난수 쿠폰은 자동 생성된 NNNN-NNNN-NNNN 코드만 사용할 수 있습니다.";
  if (!Number.isInteger(input.issueQuantity ?? 1) || (input.issueQuantity ?? 1) < 1 || (input.issueQuantity ?? 1) > 500000) return "쿠폰 발급 수량은 1부터 최대 500,000까지 입력하세요.";
  if (input.validFrom && input.expiresAt && input.validFrom > input.expiresAt) return "유효기간 종료는 시작일 이후여야 합니다.";
  const rewardCount = input.rewardItems.length + (input.bonusRcoin > 0 ? 1 : 0);
  if (rewardCount < 1 || rewardCount > 5) return "보상은 Bonus rCoin을 포함해 1개부터 최대 5개까지 등록할 수 있습니다.";
  if (input.rewardItems.some(item => !item.itemId.trim() || !Number.isInteger(item.quantity) || item.quantity <= 0)) return "보상 ItemID와 수량을 확인하세요.";
  return null;
}

function toCouponDate(value: Date | string | null) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
    ? `${value.replace(" ", "T")}Z`
    : value;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getCouponStatus(input: { isActive: number; validFrom: Date | string | null; expiresAt: Date | string | null; usedCount: number; maxUses: number; couponType: "common" | "random" }, now = new Date()) {
  const validFrom = toCouponDate(input.validFrom);
  const expiresAt = toCouponDate(input.expiresAt);
  if (validFrom && validFrom > now) return "scheduled" as const;
  if (expiresAt && expiresAt < now) return "expired" as const;
  return "active" as const;
}
