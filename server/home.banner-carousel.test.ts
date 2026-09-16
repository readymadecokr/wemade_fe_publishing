import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("../server/routers.ts", import.meta.url), "utf8");
describe("direct React Home banner", () => {
  it("uses all public admin banners for state-driven Hero controls rather than loading the supplied document", () => {
    expect(homeSource).toContain('const [heroIndex, setHeroIndex] = useState(0)');
    expect(homeSource).toContain("trpc.banner.list.useQuery");
    expect(homeSource).toContain("const heroBanners = managedBanners?.length ? managedBanners : DEFAULT_HERO_BANNERS");
    expect(homeSource).toContain("const currentHero = heroBanners[heroIndex % heroBanners.length]");
    expect(homeSource).toContain("const selectHero =");
    expect(homeSource).toContain("heroBanners.map");
    expect(homeSource).toContain("Previous banner");
    expect(homeSource).toContain("Next banner");
    expect(homeSource).toContain("react-home-hero__controls");
    expect(homeSource).toContain("heroCategory");
    expect(homeSource).toContain("heroTitleLines");
    expect(homeSource).toContain('? [requestedHeroTitle]');
    expect(homeSource).toContain("heroDescription");
    expect(homeSource).toContain("heroActionUrl");
    expect(homeSource).toContain("VIEW MORE");
    expect(homeSource).toContain('className="react-home-white-cta__play"');
    expect(readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8")).toContain('min-height: max(500px, calc(100svh - var(--react-home-header-height)))');
    expect(homeSource).not.toContain("REFERENCE_HOME_URL");
  });

  it("returns every active admin banner to the public Hero without a fixed cap", () => {
    expect(routerSource).toContain("where(eq(banners.isActive, 1))");
    expect(routerSource).toContain("orderBy(asc(banners.sortOrder), asc(banners.id));");
    expect(routerSource).not.toContain(".orderBy(asc(banners.sortOrder), asc(banners.id))\n        .limit(10)");
  });
});
