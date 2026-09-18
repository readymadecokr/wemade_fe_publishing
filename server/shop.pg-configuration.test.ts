import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const adminSource = readFileSync(new URL("../client/src/pages/AdminPage.tsx", import.meta.url), "utf8");
const shopSource = readFileSync(new URL("../client/src/pages/PointShop.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const schemaSource = readFileSync(new URL("../drizzle/schema.ts", import.meta.url), "utf8");

describe("Shop PG and currency configuration", () => {
  it("removes the legacy in-app product menu and permission", () => {
    expect(adminSource).not.toContain('{ key: "products", label: "인앱상품", icon: Coins }');
    expect(adminSource).not.toContain('{ key: "products", label: "인앱상품" }');
    expect(adminSource).not.toContain('{activeMenu === "products" && <ProductsSection');
  });

  it("places MyCard first in the Shop product registration PG selector", () => {
    const providerSection = adminSource.slice(adminSource.indexOf("const SHOP_PAYMENT_PROVIDERS"), adminSource.indexOf("type ShopPaymentProvider"));
    expect(providerSection.indexOf('id: "mycard"')).toBeLessThan(providerSection.indexOf('id: "xsolla"'));
    expect(providerSection.indexOf('id: "xsolla"')).toBeLessThan(providerSection.indexOf('id: "goc"'));
    expect(adminSource).toContain('aria-label="PG사 선택"');
    expect(adminSource).toContain('MyCard는 TWD, Xsolla와 GOC Pay는 USD로 등록됩니다.');
  });

  it("stores provider-specific currencies and filters public products by PG", () => {
    expect(schemaSource).toContain('paymentProvider: varchar("paymentProvider", { length: 32 }).default("xsolla").notNull()');
    expect(schemaSource).toContain('currency: varchar("currency", { length: 10 }).default("USD").notNull()');
    expect(routerSource).toContain('const currencyForShopProvider = (provider: z.infer<typeof shopPaymentProviderInput>) => provider === "mycard" ? "TWD" : "USD";');
    expect(routerSource).toContain('eq(ruCashProducts.paymentProvider, paymentProvider)');
  });

  it("shows the selected PG currency in the service Shop", () => {
    const providerSection = shopSource.slice(shopSource.indexOf("const shopEntryProviders"), shopSource.indexOf("type ShopEntryProvider"));
    expect(providerSection.indexOf('id: "mycard"')).toBeLessThan(providerSection.indexOf('id: "xsolla"'));
    expect(providerSection.indexOf('id: "xsolla"')).toBeLessThan(providerSection.indexOf('id: "goc"'));
    expect(shopSource).toContain('trpc.shop.listProducts.useQuery({ paymentProvider })');
    expect(shopSource).toContain('All prices are shown in {provider.currency}.');
    expect(shopSource).toContain('function formatPrice');
  });
});
