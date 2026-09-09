import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const homeStyles = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");
describe("direct React Home community panel", () => {
  it("uses the official WidgetBot lazily inside a direct React Discord section", () => {
    expect(homeSource).toContain("https://e.widgetbot.io/channels/1506232850800709682/1515744472523346051");
    expect(homeSource).toContain('title="Ragnarok Universe official Discord read-only messages"');
    expect(homeSource).toContain('loading="lazy"');
    expect(homeSource).toContain('className="react-home-widget__frame"');
    expect(homeSource).toContain("tabIndex={-1}");
    expect(homeSource).not.toContain("react-home-widget__bar");
    expect(homeSource).toContain('href="https://discord.com/invite/yVWJkWdkAU"');
    expect(homeSource).toContain('target="_blank"');
    expect(homeStyles).toContain("height: min(64vh,660px); min-height: 520px;");
    expect(homeStyles).toContain("pointer-events: none;");
    expect(homeStyles).toContain(".react-home-widget__link { display: block;");
    expect(homeStyles).toContain(".react-home-discord { display: flex; align-items: center; padding: clamp(42px,5vh,64px) 0 clamp(28px,3.5vh,44px);");
    expect(homeSource).not.toContain("ragnarok-reference-frame");
  });
});
