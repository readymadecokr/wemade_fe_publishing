import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");

describe("direct React read-only WidgetBot treatment", () => {
  it("uses a lazy official Discord embed without a separate join action", () => {
    expect(homeSource).toContain("https://e.widgetbot.io/channels/1506232850800709682/1515744472523346051");
    expect(homeSource).toContain('loading="lazy"');
    expect(homeSource).toContain('className="react-home-widget__frame"');
    expect(homeSource).toContain("tabIndex={-1}");
    expect(homeSource).not.toContain("react-home-widget__bar");
  });

  it("does not use the old static-document WidgetBot mutation code", () => {
    expect(homeSource).not.toContain("applyCtaArtwork");
    expect(homeSource).not.toContain("ctaArtworkObserver");
  });
});
