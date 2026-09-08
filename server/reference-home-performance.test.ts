import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

const staticHomePath = "/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll.html";
const staticHomeSource = readFileSync(staticHomePath, "utf8");

describe("reference Home initial-load performance", () => {
  it("removes the large duplicated inline images while retaining only compressed first-screen assets", () => {
    expect(statSync(staticHomePath).size).toBeLessThan(1_000_000);
    expect(staticHomeSource).not.toContain("data:image/png;base64,");
    expect(staticHomeSource).toContain("data:image/webp;base64,");
  });

  it("defers below-fold images and the Discord WidgetBot request until their sections approach the viewport", () => {
    expect(staticHomeSource).toContain('loading="lazy" decoding="async"');
    expect(staticHomeSource).toContain('data-widgetbot-src="\' + WIDGETBOT_URL + \'"');
    expect(staticHomeSource).toContain('id="manus-widgetbot-deferred-load"');
    expect(staticHomeSource).toContain('rootMargin:"300px 0px"');
  });
});
