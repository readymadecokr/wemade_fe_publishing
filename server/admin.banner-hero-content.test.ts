import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const schemaSource = readFileSync(new URL("../drizzle/schema.ts", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const adminSource = readFileSync(new URL("../client/src/pages/AdminPage.tsx", import.meta.url), "utf8");

describe("admin banner Hero content", () => {
  it("stores Hero category, title, and description with four allowed categories", () => {
    expect(schemaSource).toContain('heroCategory: mysqlEnum("heroCategory", ["EVENT", "PROMO", "UPDATE", "NOTE"])');
    expect(schemaSource).toContain('heroTitle: varchar("heroTitle"');
    expect(schemaSource).toContain('heroDescription: varchar("heroDescription"');
  });

  it("enforces title and description byte and line limits while preserving only direct Enter line breaks", () => {
    expect(routerSource).toContain("heroTextInput(40, 20)");
    expect(routerSource).toContain("heroTextInput(100, 100)");
    expect(adminSource).toContain("limitHeroText(e.target.value, 20, 40)");
    expect(adminSource).toContain("limitHeroText(e.target.value, 100, 100)");
    expect(adminSource).toContain("/ 100 byte · 최대 2줄");
    expect(adminSource).not.toContain("자동으로 다음 줄로 이동합니다.");
    expect(adminSource).toContain("View More 연결 URL");
  });

  it("offers a form-driven Hero preview before saving the banner", () => {
    expect(adminSource).toContain('setFormPreview({ ...form })');
    expect(adminSource).toContain("Hero 미리보기");
    expect(adminSource).toContain('style={{ aspectRatio: "1000/600" }}');
    expect(adminSource).toContain("whitespace-pre-line");
  });
});
