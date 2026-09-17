import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const serviceFooterSource = readFileSync(new URL("../client/src/components/ServiceFooter.tsx", import.meta.url), "utf8");

describe("direct React Home source integrity", () => {
  it("renders the supplied design as direct React sections rather than loading the supplied document", () => {
    expect(homeSource).toContain('className="react-home"');
    expect(homeSource).toContain('id="home"');
    expect(homeSource).toContain('id="discord"');
    expect(homeSource).toContain('id="news"');
    expect(homeSource).toContain('id="game-info"');
    expect(homeSource).toContain('id="media"');
    expect(homeSource).not.toContain("REFERENCE_HOME_URL");
    expect(homeSource).not.toContain("ragnarok-reference-frame");
  });

  it("keeps the lightweight Hero controls and floating community destinations", () => {
    expect(homeSource).toContain("selectHero");
    expect(homeSource).toContain('aria-label="Previous banner"');
    expect(homeSource).toContain('aria-label="Next banner"');
    expect(homeSource).toContain('<ServiceFooter snapPanel />');
    expect(serviceFooterSource).toContain("https://facebook.com/RagnarokUniverseEN");
    expect(serviceFooterSource).toContain("https://x.com/RagUniOfficial");
  });
});
