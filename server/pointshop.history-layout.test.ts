import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Shop history table layout", () => {
  it("wraps long rCoin headers and prevents horizontal table overflow", () => {
    const source = readFileSync(
      resolve(process.cwd(), "client/src/pages/PointShop.tsx"),
      "utf8",
    );

    expect(source).toContain('"Bonus rCoin\\nCharged"');
    expect(source).toContain('"rCoin\\nAfter"');
    expect(source).toContain('className="overflow-hidden rounded-xl border border-slate-200"');
    expect(source).toContain('className="w-full table-fixed text-xs border-collapse"');
    expect(source).toContain("whitespace-pre-line leading-tight");
  });
});
