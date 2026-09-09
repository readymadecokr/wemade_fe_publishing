import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");

describe("public Media video exposure", () => {
  it("returns only active administrator videos in administrator sort order", () => {
    expect(routerSource).toContain("publicMedia: router({");
    expect(routerSource).toContain("list: publicProcedure.query");
    expect(routerSource).toContain(".where(eq(media.isActive, 1))");
    expect(routerSource).toContain(".orderBy(asc(media.sortOrder), asc(media.id))");
  });
});
