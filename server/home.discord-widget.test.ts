import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");

describe("Home Discord WidgetBot and social links", () => {
  it("places the WidgetBot Discord embed before the News section", () => {
    const widgetUrl = "https://e.widgetbot.io/channels/1506232850800709682/1515744472523346051";
    expect(homeSource).toContain(widgetUrl);
    expect(homeSource).toContain('title="Ragnarok Universe Discord community"');
    expect(homeSource).toContain('aria-label="Read-only Discord chat"');
    expect(homeSource).toContain('Join Official Discord');
    expect(homeSource).toContain('href="https://discord.gg/yVWJkWdkAU"');
    expect(homeSource).toContain('target="_blank"');
    expect(homeSource).toContain('rel="noopener noreferrer"');
    expect(homeSource).not.toContain('Read-only channel');
    expect(homeSource).toContain('tabIndex={-1}');
    expect(homeSource).toContain('h-[68px]');
    expect(homeSource).toContain('md:h-[72px]');
    expect(homeSource).toContain('items-start');
    expect(homeSource.indexOf(widgetUrl)).toBeLessThan(homeSource.indexOf('{/* NEWS SECTION - Unified layout */}'));
  });

  it("renders floating social links in Discord, Facebook, YouTube, and X order", () => {
    const discord = "https://discord.gg/yVWJkWdkAU";
    const facebook = "https://facebook.com/RagnarokUniverseEN";
    const youtube = "https://www.youtube.com/@RagnarokUniverse";
    const x = "https://x.com/RagUniOfficial";
    expect(layoutSource.indexOf(discord)).toBeLessThan(layoutSource.indexOf(facebook));
    expect(layoutSource.indexOf(facebook)).toBeLessThan(layoutSource.indexOf(youtube));
    expect(layoutSource.indexOf(youtube)).toBeLessThan(layoutSource.indexOf(x));
    expect(layoutSource).toContain('aria-label="Visit Ragnarok Universe on Facebook"');
    expect(layoutSource).toContain('aria-label="Visit Ragnarok Universe on X"');
  });
});
