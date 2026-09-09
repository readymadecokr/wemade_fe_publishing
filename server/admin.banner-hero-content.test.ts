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

  it("enforces title and description byte and line limits in the API and admin form", () => {
    expect(routerSource).toContain("heroTextInput(40, 20)");
    expect(routerSource).toContain("heroTextInput(100, 50)");
    expect(adminSource).toContain("wrapHeroText(e.target.value, 20, 40)");
    expect(adminSource).toContain("wrapHeroText(e.target.value, 50, 100)");
    expect(adminSource).toContain("View More 연결 URL");
  });
});
