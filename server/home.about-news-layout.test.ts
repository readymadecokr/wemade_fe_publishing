import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");

describe("Home About and News layout", () => {
  it("removes the duplicate About heading above the introduction", () => {
    expect(homeSource).not.toContain(
      '<h3 className="font-serif text-3xl font-bold text-[#302419] mb-3">Discover the Heart of Ragnarok Universe</h3>',
    );
    expect(homeSource).toContain(
      '<h2 className="fantasy-section-title flex items-center gap-3 text-3xl md:text-4xl">',
    );
  });

  it("limits the Home News grid to the three most recent items", () => {
    expect(homeSource).toContain("newsData.slice(0, 3).map");
    expect(homeSource).toContain("Home shows the three most recent News items");
  });
});
