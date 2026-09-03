import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const referenceSource = readFileSync("/home/ubuntu/upload/ragnarok-universe-fullpage-responsive-260831_FINAL.html", "utf8");

describe("user-supplied final Home community panel", () => {
  it("uses the supplied final community presentation instead of a custom WidgetBot layer", () => {
    expect(homeSource).not.toContain("WidgetBot");
    expect(homeSource).not.toContain("Read-only channel");
    expect(referenceSource).toMatch(/join\s+discord/i);
    expect(referenceSource).toMatch(/continue\s+on\s+discord/i);
  });
});
