import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const staticHomeSource = readFileSync("/home/ubuntu/webdev-static-assets/ragnarok-universe-fullpage-responsive-260831_FINAL-fullpanel-scroll.html", "utf8");

describe("reference Home WidgetBot restoration", () => {
  it("uses the restored read-only WidgetBot Discord community document", () => {
    expect(homeSource).toContain("FINAL-fullpanel-scroll_6a93287c.html");
    expect(staticHomeSource).toContain("https://e.widgetbot.io/channels/1506232850800709682/1515744472523346051");
    expect(staticHomeSource).toContain("widgetbot-readonly-bar");
    expect(staticHomeSource).toContain("Join Official Discord");
  });

  it("shows the floating social links when the Discord section enters the viewport", () => {
    expect(staticHomeSource).toContain("const show = rect.top <= window.innerHeight * .65");
    expect(staticHomeSource).toContain('floating.classList.toggle("hero-hidden", !show)');
  });
});
