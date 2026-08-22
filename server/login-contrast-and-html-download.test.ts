import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

describe("login contrast and downloadable HTML deliverables", () => {
  it("uses the high-contrast login surface and readable consent controls", () => {
    const login = readFileSync(resolve(projectRoot, "client/src/pages/Login.tsx"), "utf8");
    const css = readFileSync(resolve(projectRoot, "client/src/index.css"), "utf8");
    expect(login).toContain("login-contrast-surface");
    expect(css).toContain(".login-contrast-surface");
    expect(css).toContain(".login-consent-panel");
    expect(css).toContain('[class~="bg-white/5"]');
  });

  it("ships separate standalone HTML files for admin and service UI review", () => {
    const admin = readFileSync(resolve(projectRoot, "client/public/downloads/ragnarok-universe-admin.html"), "utf8");
    const service = readFileSync(resolve(projectRoot, "client/public/downloads/ragnarok-universe-service.html"), "utf8");
    expect(admin).toContain("쿠폰 관리");
    expect(admin).toContain("신규 쿠폰 생성");
    expect(service).toContain("Coupon Use History");
    expect(service).toContain("Redeem Coupon");
  });
});
