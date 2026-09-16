import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const loginSource = readFileSync(new URL("../client/src/pages/Login.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("Verify & Accept checkbox visibility", () => {
  it("keeps every consent checkbox available in social and guest registration flows", () => {
    expect(loginSource).toContain('id="selectAll"');
    expect(loginSource).toContain('id="guestSelectAll"');
    expect(loginSource).toContain('id="isCalifornia"');
    expect(loginSource).toContain('id="isCaliforniaGuest"');
    expect(loginSource).toContain('<Layout showClosingCta={step !== "register_social" && step !== "register_guest"}>');
  });

  it("uses a visible unchecked border and a distinct selected state on the light service card", () => {
    expect(styleSource).toContain('.login-contrast-surface [role="checkbox"]');
    expect(styleSource).toContain('border: 2px solid #5b6876 !important;');
    expect(styleSource).toContain('[role="checkbox"][data-state="checked"]');
    expect(styleSource).toContain('background: #2f66d5 !important;');
  });
});
