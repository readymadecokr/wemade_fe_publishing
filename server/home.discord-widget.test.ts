import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("Home Discord community presentation", () => {
  it("places the complete official Discord panel before the News panel", () => {
    expect(homeSource.indexOf('id="discord-community"')).toBeLessThan(homeSource.indexOf('id="news"'));
    expect(homeSource).toContain('const DISCORD_URL = "https://discord.gg/yVWJkWdkAU"');
    expect(homeSource).toContain("communityChannels");
    expect(homeSource).toContain("reference-community-join");
    expect(homeSource).toContain("selectedChannel");
  });

  it("uses the reference community card rather than the removed WidgetBot input workaround", () => {
    expect(homeSource).not.toContain("Read-only channel");
    expect(homeSource).not.toContain("e.widgetbot.io/channels");
    expect(styleSource).toContain(".reference-discord-panel");
  });
});
