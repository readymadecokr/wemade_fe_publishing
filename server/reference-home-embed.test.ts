import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const serviceFooterSource = readFileSync(new URL("../client/src/components/ServiceFooter.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("direct React Home rendering", () => {
  it("does not load the entire user-supplied Home document through an iframe", () => {
    expect(homeSource).not.toContain("REFERENCE_HOME_URL");
    expect(homeSource).not.toContain("ragnarok-reference-frame");
    expect(homeSource).not.toContain("reference-home-embed__frame");
    expect(styleSource).not.toContain("reference-home-embed");
  });

  it("renders the visible Home sections in the application document", () => {
    ["home", "discord", "news", "game-info", "media"].forEach((sectionId) => {
      expect(homeSource).toContain(`id="${sectionId}"`);
    });
    expect(homeSource).toContain('<ServiceFooter snapPanel />');
    expect(serviceFooterSource).toContain('className="react-home-footer"');
  });
});
