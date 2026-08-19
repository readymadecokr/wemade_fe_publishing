import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

describe("public dark-neon accessibility baseline", () => {
  it("keeps a visible shared focus outline and mobile-visible primary navigation", () => {
    const css = readSource("client/src/index.css");
    const layout = readSource("client/src/components/Layout.tsx");

    expect(css).toContain("@apply border-border outline-ring/50");
    expect(layout).toContain("order-3 flex basis-full");
    expect(layout).not.toContain("Menu,");
    expect(layout).not.toContain("isMobileMenuOpen");
  });

  it("keeps a semantic heading for the redesigned public routes", () => {
    const pages = [
      "client/src/pages/Home.tsx",
      "client/src/pages/GameInfo.tsx",
      "client/src/pages/PointShop.tsx",
      "client/src/pages/MyPage.tsx",
      "client/src/pages/News.tsx",
      "client/src/pages/Notice.tsx",
      "client/src/pages/Login.tsx",
      "client/src/pages/TermsOfService.tsx",
      "client/src/pages/PrivacyPolicy.tsx",
      "client/src/pages/CookiePolicy.tsx",
    ];

    for (const page of pages) {
      expect(readSource(page), page).toMatch(/<h[1-2][\s>]/);
    }
  });
});
