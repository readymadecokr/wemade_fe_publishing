import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const globalStyles = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("public service surface unification", () => {
  it("uses the current Home Chrome by default for every public service route", () => {
    expect(layoutSource).toContain('variant = "homeChrome"');
    expect(layoutSource).toContain('<HomeHeader activeSection=');
    expect(layoutSource).toContain('home-chrome-content');
  });

  it("removes the retired atlas and decorative image layers from all service shells", () => {
    expect(globalStyles).toContain('.fantasy-site-atlas,\n  .fantasy-site-atlas > main,');
    expect(globalStyles).toContain('.fantasy-site-atlas .fantasy-page-shell,\n  .fantasy-site-atlas .fantasy-content-guide');
    expect(globalStyles).toContain('background: #fbf8f1 !important;');
    expect(globalStyles).toContain('background-image: none !important;');
    expect(globalStyles).toContain('.fantasy-site-atlas::before,\n  .fantasy-site-atlas .fantasy-page-shell::before,\n  .fantasy-site-atlas .fantasy-section-decorated::after');
  });
});
