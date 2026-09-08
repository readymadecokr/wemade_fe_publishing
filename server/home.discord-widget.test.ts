import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
describe("direct React Home community panel", () => {
  it("uses the official WidgetBot lazily inside a direct React Discord section", () => {
    expect(homeSource).toContain("https://e.widgetbot.io/channels/1506232850800709682/1515744472523346051");
    expect(homeSource).toContain('title="Ragnarok Universe official Discord"');
    expect(homeSource).toContain('loading="lazy"');
    expect(homeSource).toContain("react-home-widget__bar");
    expect(homeSource).not.toContain("ragnarok-reference-frame");
  });
});
