import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/AdminPage.tsx"), "utf8");
const routerSource = fs.readFileSync(path.resolve(process.cwd(), "server/routers.ts"), "utf8");
const schemaSource = fs.readFileSync(path.resolve(process.cwd(), "drizzle/schema.ts"), "utf8");

describe("admin coupon system UI", () => {
  it("includes registration, spreadsheet update, history, CSV, and mandatory coupon fields", () => {
    expect(source).toContain("신규 쿠폰 생성");
    expect(source).toContain("엑셀 업로드");
    expect(source).toContain("발급 히스토리");
    expect(source).toContain("CSV 내보내기");
    expect(source).toContain("게임 코드 (Game Code)");
    expect(source).toContain("Bonus rCoin");
    expect(source).not.toContain("쿠폰 난수 생성");
    expect(source).toContain("자동 생성됩니다.");
    expect(source).toContain("쿠폰 발급 수량");
    expect(source).toContain('disabled={Boolean(form.id) || form.couponType === "random"}');
    expect(source).not.toContain("공통 사용 제한");
    expect(source).toContain("Bonus rCoin을 포함한 전체 보상은 1개부터 최대 5개까지 등록할 수 있습니다.");
    expect(source).toContain("Bonus rCoin만 지급하려면 아이템을 추가하지 않아도 됩니다.");
    expect(source).toContain("const rewardCount = payload.rewardItems.length + (payload.bonusRcoin > 0 ? 1 : 0);");
    expect(source).not.toContain("보상 아이템은 ${maximum}종까지 등록할 수 있습니다.");
    expect(source).toContain('max-w-2xl space-y-5');
    expect(source).toContain('>1</span>이벤트명');
    expect(source).toContain('>2</span>쿠폰사용기간');
    expect(source).toContain('>3</span>게임 코드 (Game Code)');
    expect(source).toContain('>4</span>서버 코드');
    expect(source).toContain('>5</span>쿠폰 타입');
    expect(source).toContain('>6</span>쿠폰 코드');
    expect(source).toContain('>7</span>쿠폰 발급 수량');
    expect(source).toContain('>8</span>보상 아이템 설정');
    expect(source).toContain('space-y-2"><div><h3 className="flex items-center');
    expect(source).not.toContain("포털 확장을 위한 필드입니다.");
  });

  it("uses code-and-event upsert and provides system history on the server", () => {
    expect(routerSource).toContain("bulkUpsert");
    expect(routerSource).toContain("onDuplicateKeyUpdate");
    expect(routerSource).toContain("systemHistory");
    expect(routerSource).toContain("eventSummaries");
    expect(routerSource).toContain("eventDetail");
    expect(routerSource).toContain("createRandomBatch");
    expect(routerSource).toContain("batchSize");
    expect(routerSource).toContain("usageByCoupon");
    expect(source).toContain("쿠폰 목록");
    expect(source).toContain("개별 쿠폰 목록");
    expect(source).toContain("엑셀 다운로드");
    expect(source).toContain("미사용");
    expect(source).toContain('text-center">User ID</th>');
    expect(source).toContain('coupon-usage-detail-table');
    expect(source).toContain('>사용자 닉네임</th>');
    expect(source).toContain('item.status === "used" ? "사용" : "미사용"');
    expect(source).toContain("ToggleRight");
    expect(source).toContain("eventActiveMutation");
    expect(source).toContain("deleteEventsMutation");
    expect(source).toContain("exportEventCoupons");
    expect(source).toContain("<h3 className=\"font-semibold\">개별 쿠폰 현황</h3>");
    expect(routerSource).toContain("updateEventActive");
    expect(routerSource).toContain("deleteEvents");
    expect(routerSource).toContain("inArray(coupons.eventName, input.eventNames)");
    expect(source).toContain("10개씩");
    expect(source).toContain("100개씩");
    expect(schemaSource).toContain("couponCodeEventUnique");
    expect(schemaSource).toContain("issueQuantity");
    expect(routerSource).toContain("max(500000)");
  });

  it("uses icon-based edit and delete actions instead of summary checkboxes or detail view", () => {
    const summarySource = source.slice(source.indexOf('data-testid="coupon-summary-table"'), source.indexOf('data-testid="coupon-summary-table"') + 6000);
    expect(summarySource).toContain('text-center">수정</th><th className="px-3 py-3 text-center">삭제</th>');
    expect(summarySource).toContain("aria-label={`${item.eventName} 수정`");
    expect(summarySource).toContain("aria-label={`${item.eventName} 삭제`");
    expect(summarySource).toContain("onClick={() => editCoupon(item)}");
    expect(summarySource).not.toContain('type="checkbox"');
    expect(source).toContain('form.id ? "쿠폰 수정" : "쿠폰 등록"');
    expect(routerSource).toContain("id: sql<number>`MAX(${coupons.id})`");
  });

  it("replaces reward details in the event summary with used quantity and opens the coupon edit form", () => {
    const summarySource = source.slice(source.indexOf('data-testid="coupon-summary-table"'), source.indexOf('data-testid="coupon-summary-table"') + 5000);
    expect(summarySource).toContain(">이벤트명</th><th className=\"px-3 py-3 text-left\">쿠폰사용기간</th><th className=\"px-3 py-3 text-left\">상태</th><th className=\"px-3 py-3 text-left\">게임코드</th><th className=\"px-3 py-3 text-left\">서버코드</th><th className=\"px-3 py-3 text-left\">쿠폰타입</th><th className=\"px-3 py-3 text-left\">발급수량</th><th className=\"px-3 py-3 text-left\">사용수량</th>");
    expect(summarySource).toContain("statusText(item)");
    expect(summarySource).toContain("Number(item.usedCount ?? 0).toLocaleString()");
    expect(summarySource).toContain(">보상</th>");
    expect(routerSource).toContain("userId: users.id");
    expect(routerSource).toContain("userNickname: usage?.nickname");
    expect(routerSource).toContain('status: usage ? "used" : "unused"');
    expect(source).toContain(">쿠폰 사용일시</th>");
    expect(source).not.toContain('data-testid="coupon-usage-detail-table" className="w-full min-w-[1080px] text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-3 py-3 text-left">게임코드</th><th className="px-3 py-3 text-left">타입</th><th className="px-3 py-3 text-left">이벤트명</th><th className="px-3 py-3 text-left">쿠폰코드</th><th className="px-3 py-3 text-left">쿠폰사용기간</th>');
    expect(source).toContain('title={form.id ? "쿠폰 수정" : "신규 쿠폰 생성"}');
    expect(source).toContain('form.id ? "쿠폰 수정" : "쿠폰 등록"');
    expect(source).toContain("신규 쿠폰 (엑셀 업로드)");
    expect(source).toContain("대량 난수 쿠폰 생성 중");
    expect(source).toContain("예상 남은 시간");
    expect(source).toContain("createRandomInBatches");
    expect(source).toContain("total >= 100000 ? 500 : 250");
    expect(source).toContain("attempt < 3");
    expect(routerSource).toContain("batchSize: z.number().int().min(1).max(1000)");
    expect(routerSource).toContain("COUNT(DISTINCT ${coupons.eventName})");
    expect(routerSource).toContain("groupBy(coupons.eventName)");
    expect(source).toContain("개별 쿠폰 현황");
    expect(source).toContain('couponDetailEvent ? "쿠폰코드 검색" : "이벤트명 또는 쿠폰코드 검색"');
    expect(source).toContain("!couponDetailEvent && <Input type=\"date\"");
    expect(source).toContain('>보상</th><th className="px-3 py-3 text-center">수정</th>');
    expect(source).toContain("보상 보기");
    expect(source).toContain("쿠폰 보상");
    expect(routerSource).toContain('code: sql<string>`MAX(${coupons.code})`');
    expect(routerSource).toContain("code: existingCoupon.code");
    expect(routerSource).toContain("where(eq(coupons.eventName, existingCoupon.eventName))");
  });

  it("locks immutable coupon fields during edit and only permits issue quantity increases", () => {
    expect(source).toContain('disabled={Boolean(form.id)}');
    expect(source).toContain('쿠폰 발급 수량은 기존 수량보다 줄일 수 없습니다.');
    expect(routerSource).toContain("input.issueQuantity < currentIssueQuantity");
    expect(routerSource).toContain("additionalQuantity");
    expect(routerSource).toContain("existingCoupon.gameCode");
    expect(routerSource).toContain("existingCoupon.rewardItems");
  });
});
