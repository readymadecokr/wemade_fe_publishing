import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const homeStyles = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");
describe("direct React Home community panel", () => {
  it("allows official WidgetBot channel browsing while only the sign-in and composer area opens the invite", () => {
    expect(homeSource).toContain("https://e.widgetbot.io/channels/1506232850800709682/1515744472523346051");
    expect(homeSource).toContain('title="Ragnarok Universe official Discord channel browser"');
    expect(homeSource).toContain('loading="lazy"');
    expect(homeSource).toContain('className="react-home-widget__frame"');
    expect(homeSource).not.toContain("react-home-widget__bar");
    expect(homeSource).toContain('href="https://discord.com/invite/yVWJkWdkAU"');
    expect(homeSource).toContain('target="_blank"');
    expect(homeStyles).toContain("height: min(64vh,660px); min-height: 520px;");
    expect(homeStyles).toContain(".react-home-widget__invite-overlay { position: absolute;");
    expect(homeStyles).toContain("height: 66px;");
    expect(homeStyles).toContain(".react-home-discord { display: flex; align-items: center; padding: clamp(42px,5vh,64px) 0 clamp(28px,3.5vh,44px);");
    expect(homeStyles).toContain(".react-home-discord__shell { display: flex; width: calc(100% - 28px); min-height: 0; margin-inline: auto; flex: 0 1 auto; flex-direction: column; }");
    expect(homeSource).not.toContain("ragnarok-reference-frame");
  });
});
