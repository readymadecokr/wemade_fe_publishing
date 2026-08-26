import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/AdminPage.tsx", import.meta.url), "utf8");

describe("coupon reward setting labels", () => {
  it("numbers Bonus rCoin first and labels item rows sequentially", () => {
    expect(source).toContain('>1</span>Bonus rCoin');
    expect(source).toContain('>{index + 2}</span>아이템 {index + 1}');
    expect(source).not.toContain('기본 아이템');
    expect(source).not.toContain('추가 아이템 ${index}');
  });
});
