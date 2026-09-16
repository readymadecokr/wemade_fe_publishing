import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routerSource = readFileSync(new URL("../server/routers.ts", import.meta.url), "utf8");

describe("publicScreenshots", () => {
  it("returns only selected screenshots in administrator-defined order", () => {
    const publicScreenshotsBlock = routerSource.slice(routerSource.indexOf("publicScreenshots: router"), routerSource.indexOf("// 공개 배너 목록"));
    expect(publicScreenshotsBlock).toContain("where(eq(screenshots.isActive, 1))");
    expect(publicScreenshotsBlock).toContain("orderBy(asc(screenshots.sortOrder), asc(screenshots.id))");
  });
});
