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
    expect(source).toContain('disabled={form.couponType === "random"}');
    expect(source).not.toContain("공통 사용 제한");
    expect(source).toContain("Bonus rCoin을 포함한 전체 보상은 1개부터 최대 5개까지 등록할 수 있습니다.");
    expect(source).toContain("Bonus rCoin만 지급하려면 아이템을 추가하지 않아도 됩니다.");
    expect(source).toContain("const rewardCount = payload.rewardItems.length + (payload.bonusRcoin > 0 ? 1 : 0);");
    expect(source).not.toContain("보상 아이템은 ${maximum}종까지 등록할 수 있습니다.");
    expect(source).toContain('max-w-2xl space-y-5');
    expect(source).toContain('>1</span>이벤트명');
    expect(source).toContain('>2</span>유효기간 시작');
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
    expect(source).toContain("이벤트별 쿠폰 목록");
    expect(source).toContain("개별 쿠폰 목록");
    expect(source).toContain("10개씩");
    expect(source).toContain("100개씩");
    expect(schemaSource).toContain("couponCodeEventUnique");
    expect(schemaSource).toContain("issueQuantity");
    expect(routerSource).toContain("max(500000)");
  });
});
