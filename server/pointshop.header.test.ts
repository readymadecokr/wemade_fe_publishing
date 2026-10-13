import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("Shop page top spacing", () => {
  it("uses the same reference-style service title banner as News beneath the shared Home header", () => {
    expect(source).not.toContain('bg-[linear-gradient(110deg,#314b66,#557494_55%,#314b66)]');
    expect(source).toContain('<h1 id="shop-detail-page-title">Shop</h1>');
    expect(source).not.toContain('<p className="text-[#e9dfc8]">Purchase rCoin</p>');
    expect(source).toContain('fantasy-content-guide shop-content-guide pt-6 pb-8 md:pt-8');
    expect(source).toContain('className="news-detail-page-banner shop-detail-page-banner"');
    expect(source).toContain('Purchase rCoin and continue your adventure.');
    expect(source).toContain('<Layout variant="homeChrome" showClosingCta={false}>');
    expect(source).toContain('className="fantasy-page-shell shop-detail-page-shell"');
  });

  it("removes only the shared service-page left inset from Shop content", () => {
    expect(source).toContain('fantasy-content-guide shop-content-guide pt-6 pb-8 md:pt-8');
    expect(styleSource).toContain('.shop-detail-page-shell .shop-content-guide {\n    padding-left: 0;\n  }');
  });
});
