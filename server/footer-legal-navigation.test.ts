import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const footerSource = readFileSync(new URL("../client/src/components/ServiceFooter.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../client/src/components/Layout.tsx", import.meta.url), "utf8");
const footerStyleSource = readFileSync(new URL("../client/src/pages/reference-home.css", import.meta.url), "utf8");

describe("service footer links and legal navigation", () => {
  it("restores the official partner URLs in the shared service footer", () => {
    expect(footerSource).toContain('href: "https://gravity.co.kr/"');
    expect(footerSource).toContain('href: "https://wemadeconnect.com/"');
    expect(footerSource).toContain('href: "https://www.gala.biz/ko"');
    expect(footerSource).toContain("PARTNER_LINKS.map");
    expect(footerSource).toContain('target="_blank"');
    expect(footerStyleSource).toContain(".react-home-footer__brands a:hover");
  });

  it("opens legal routes at the top without smooth-scroll carryover", () => {
    expect(footerSource).toContain('<Link href="/terms-of-service">Terms of Service</Link>');
    expect(footerSource).toContain('<Link href="/privacy-policy">Privacy Policy</Link>');
    expect(layoutSource).toContain('useLayoutEffect');
    expect(layoutSource).toContain('root.style.scrollBehavior = "auto"');
    expect(layoutSource).toContain('window.scrollTo({ top: 0, left: 0, behavior: "auto" })');
    expect(layoutSource).toContain('root.style.scrollBehavior = previousScrollBehavior');
  });
});
