import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../client/src/pages/AdminPage.tsx", import.meta.url), "utf8");

describe("coupon Excel upload template", () => {
  it("provides five separately named Reward Item columns matching the upload template", () => {
    for (const index of [1, 2, 3, 4, 5]) {
      expect(source).toContain(`"Reward Items ${index}"`);
    }
  });

  it("reads five separate reward columns while supporting legacy combined Reward Items", () => {
    expect(source).toContain("const separateRewards = [1, 2, 3, 4, 5]");
    expect(source).toContain("const legacyRewards = String(readCell(row, \"Reward Items\", \"보상\")");
  });
});
