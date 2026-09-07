import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("user-supplied final HTML Home", () => {
  it("uses the original final reference HTML without a React restyle layer", () => {
    expect(homeSource).toContain('const REFERENCE_HOME_URL = "/manus-storage/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll_6a93287c.html"');
    expect(homeSource).toContain("src={REFERENCE_HOME_URL}");
    expect(homeSource).toContain('title="Ragnarok Universe homepage"');
    expect(homeSource).not.toContain("reference-hero-panel");
    expect(homeSource).not.toContain("reference-community-card");
  });

  it("renders the original page edge-to-edge without shell framing", () => {
    expect(styleSource).toContain("height: 100svh");
    expect(styleSource).toContain("width: 100%");
    expect(styleSource).toContain("height: 100%");
    expect(styleSource).toContain("border: 0");
  });
});
