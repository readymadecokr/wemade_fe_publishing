import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const baseUrl = "https://3000-iezfr4q5hkqcvaahdtcvp-201b4aa2.sg1.manus.computer";
const browser = await chromium.launch({ headless: true });

async function measure(path) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
  const result = await page.locator("h1").evaluate(h1 => {
    const container = h1.parentElement;
    const header = container?.parentElement;
    const h1Rect = h1.getBoundingClientRect();
    const headerRect = header?.getBoundingClientRect();
    return {
      title: h1.textContent?.trim(),
      h1Left: h1Rect.left,
      h1Top: h1Rect.top,
      headerHeight: headerRect?.height,
      h1Class: h1.className,
      subtitleClass: h1.nextElementSibling?.className,
    };
  });
  await page.close();
  return result;
}

const gameInfo = await measure("/game-info");
const shop = await measure("/point-shop");
const report = {
  gameInfo,
  shop,
  aligned: {
    sameTitleStart: gameInfo.h1Left === shop.h1Left,
    sameHeaderHeight: gameInfo.headerHeight === shop.headerHeight,
    sameTitleClass: gameInfo.h1Class === shop.h1Class,
  },
};

await writeFile("/home/ubuntu/ragnarok-universe/category_header_verify.json", JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report));
