import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/AdminPage.tsx"), "utf8");
const routerSource = fs.readFileSync(path.resolve(process.cwd(), "server/routers.ts"), "utf8");
const schemaSource = fs.readFileSync(path.resolve(process.cwd(), "drizzle/schema.ts"), "utf8");

describe("admin coupon system UI", () => {
  it("includes registration, spreadsheet update, history, CSV, and mandatory coupon fields", () => {
    expect(source).toContain("신규 쿠폰 등록");
    expect(source).toContain("엑셀 업로드");
    expect(source).toContain("발급 히스토리");
    expect(source).toContain("CSV 내보내기");
    expect(source).toContain("게임 코드 (Game Code)");
    expect(source).toContain("Bonus rCoin");
    expect(source).toContain("쿠폰 난수 생성");
  });

  it("uses code-and-event upsert and provides system history on the server", () => {
    expect(routerSource).toContain("bulkUpsert");
    expect(routerSource).toContain("onDuplicateKeyUpdate");
    expect(routerSource).toContain("systemHistory");
    expect(schemaSource).toContain("couponCodeEventUnique");
  });
});
