import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/PointShop.tsx"), "utf8");

describe("Shop payment provider selection", () => {
  it("requires selecting Xsolla, MyCard, or GOC Pay before rendering packages", () => {
    expect(source).toContain('label: "Xsolla"');
    expect(source).toContain('label: "MyCard"');
    expect(source).toContain('label: "GOC Pay"');
    expect(source).toContain("function ShopProviderDialog");
    expect(source).toContain("showCloseButton={false}");
    expect(source).toContain("paymentProvider ? <ChargeTab");
  });

  it("uses the selected provider for the purchase dialog and removes the Top Up sidebar", () => {
    expect(source).toContain("defaultMethod={paymentProvider}");
    expect(source).toContain('setMethod(defaultMethod)');
    expect(source).not.toContain('<aside className="hidden w-44 shrink-0 md:flex md:flex-col">');
  });
});
