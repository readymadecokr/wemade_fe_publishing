import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const myPageSource = readFileSync(new URL("../client/src/pages/MyPage.tsx", import.meta.url), "utf8");
const pointShopSource = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");

describe("My Page history migration and Shop tab cleanup", () => {
  it("uses the Shop history APIs with 10-item pages and constrains the Time column", () => {
    expect(myPageSource).toContain('myChargeHistory.useQuery({ page, pageSize: 10 }');
    expect(myPageSource).toContain('myUseHistory.useQuery({ page, pageSize: 10 }');
    expect(myPageSource).toContain('w-[94px] px-1 py-2 text-center whitespace-pre-line break-words leading-4');
  });

  it("keeps only Top Up in the Shop navigation", () => {
    const menuStart = pointShopSource.indexOf('const menus: { key: typeof tab; label: string }[] = [');
    const menuEnd = pointShopSource.indexOf('];', menuStart);
    const menuSource = pointShopSource.slice(menuStart, menuEnd);

    expect(menuSource).toContain('label: "Top Up"');
    expect(menuSource).not.toContain("Purchase History");
    expect(menuSource).not.toContain("Usage History");
  });
});
