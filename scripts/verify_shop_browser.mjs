import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const baseUrl = "https://3000-iezfr4q5hkqcvaahdtcvp-201b4aa2.sg1.manus.computer/point-shop";
const browser = await chromium.launch({ headless: true });

async function inspectPage(viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const cardCount = await page.locator("[data-shop-product]").count();
  const initial = await page.evaluate(() => ({
    koreanCharacterCount: (document.body.innerText.match(/[가-힣]/g) ?? []).length,
    documentOverflow: document.documentElement.scrollWidth > window.innerWidth,
    cardBounds: Array.from(document.querySelectorAll("[data-shop-product]")).map(card => {
      const rect = card.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width };
    }),
  }));
  return { page, cardCount, initial };
}

const desktop = await inspectPage({ width: 1280, height: 900 });
await desktop.page.getByRole("button", { name: /1,000 rCoin/ }).click();
const dialog = desktop.page.getByRole("dialog");
await dialog.waitFor();
const initialPayDisabled = await dialog.getByRole("button", { name: "Pay $10.00" }).isDisabled();

await dialog.getByRole("button", { name: "$10.00", exact: true }).click();
await dialog.getByRole("button", { name: "$1.00", exact: true }).click();
const productChanged = await dialog.getByText("100 rCoin", { exact: true }).count() > 0;
await dialog.getByRole("button", { name: "More payment methods" }).click();
const extraMethodsVisible = await dialog.getByText("MyCard", { exact: true }).count() > 0;
await dialog.getByRole("checkbox", { name: /I am not a robot/i }).check();
const enabledAfterCaptcha = !(await dialog.getByRole("button", { name: "Pay $1.00" }).isDisabled());
await dialog.getByRole("button", { name: /close/i }).click();
await desktop.page.waitForTimeout(200);
const closeDataState = await desktop.page.getByRole("dialog").getAttribute("data-state").catch(() => null);
const closedByX = closeDataState === "closed" || !(await desktop.page.getByRole("dialog").isVisible().catch(() => false));

await desktop.page.locator('[data-shop-product="2"]').click();
const reopened = desktop.page.getByRole("dialog");
await reopened.waitFor();
const resetPayDisabled = await reopened.getByRole("button", { name: "Pay $5.00" }).isDisabled();
const resetExtraHidden = await reopened.getByText("MyCard", { exact: true }).count() === 0;
const popupOverflow = await reopened.evaluate(node => node.scrollWidth > node.clientWidth);

const mobile = await inspectPage({ width: 375, height: 812 });
const allMobileCardsInside = mobile.initial.cardBounds.every(card => card.left >= -1 && card.right <= 376);

const report = {
  desktop: { cardCount: desktop.cardCount, ...desktop.initial },
  popup: { initialPayDisabled, productChanged, extraMethodsVisible, enabledAfterCaptcha, closedByX, closeDataState, resetPayDisabled, resetExtraHidden, popupOverflow },
  mobile: { cardCount: mobile.cardCount, ...mobile.initial, allMobileCardsInside },
};

await writeFile("/home/ubuntu/ragnarok-universe/shop_browser_verify.json", JSON.stringify(report, null, 2));
await desktop.page.close();
await mobile.page.close();
await browser.close();
console.log(JSON.stringify(report));
