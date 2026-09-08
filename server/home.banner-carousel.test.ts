import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
describe("direct React Home banner", () => {
  it("uses state-driven Hero controls rather than loading the supplied document", () => {
    expect(homeSource).toContain('const [heroIndex, setHeroIndex] = useState(0)');
    expect(homeSource).toContain("const selectHero =");
    expect(homeSource).toContain("[0, 1, 2].map");
    expect(homeSource).toContain("Previous banner");
    expect(homeSource).toContain("Next banner");
    expect(homeSource).not.toContain("REFERENCE_HOME_URL");
  });
});
