import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  BANNER_IMAGE_MAX_BYTES,
  NEWS_IMAGE_MAX_BYTES,
  SCREENSHOT_IMAGE_MAX_BYTES,
  SCREENSHOT_THUMBNAIL_MAX_BYTES,
  createScreenshotThumbnail,
  verifyImageDimensions,
} from "./imageUpload";

const adminSource = readFileSync(new URL("../client/src/pages/AdminPage.tsx", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const schemaSource = readFileSync(new URL("../drizzle/schema.ts", import.meta.url), "utf8");

describe("administrator image upload and screenshot previews", () => {
  it("applies the requested News, banner, and screenshot size rules", () => {
    expect(NEWS_IMAGE_MAX_BYTES).toBe(500 * 1024);
    expect(BANNER_IMAGE_MAX_BYTES).toBe(1024 * 1024);
    expect(SCREENSHOT_IMAGE_MAX_BYTES).toBe(3072 * 1024);
    expect(SCREENSHOT_THUMBNAIL_MAX_BYTES).toBe(100 * 1024);
    expect(adminSource).toContain("1900×600px | 1,024KB 미만");
    expect(adminSource).toContain("News 썸네일은 500KB 이하 이미지를 선택해주세요.");
    expect(adminSource).toContain("스크린샷 원본은 3,072KB 이하로 등록하세요.");
    expect(routerSource).toContain("uploadNewsImage");
    expect(routerSource).toContain("uploadScreenshotAssets");
  });

  it("requires exact 1900×600px main banner dimensions", async () => {
    const exact = await sharp({ create: { width: 1900, height: 600, channels: 3, background: "#263d62" } }).jpeg().toBuffer();
    const incorrect = await sharp({ create: { width: 1000, height: 600, channels: 3, background: "#263d62" } }).jpeg().toBuffer();
    await expect(verifyImageDimensions(exact, 1900, 600)).resolves.toBeUndefined();
    await expect(verifyImageDimensions(incorrect, 1900, 600)).rejects.toThrow("1900×600px");
  });

  it("creates a WebP gallery thumbnail within 100KB", async () => {
    const original = await sharp({ create: { width: 1920, height: 1080, channels: 3, background: "#4d72a6" } }).jpeg({ quality: 95 }).toBuffer();
    const thumbnail = await createScreenshotThumbnail(original);
    const metadata = await sharp(thumbnail).metadata();
    expect(thumbnail.length).toBeLessThanOrEqual(SCREENSHOT_THUMBNAIL_MAX_BYTES);
    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBeLessThanOrEqual(1280);
  });

  it("persists thumbnails and keeps the original for fullscreen viewing", () => {
    expect(schemaSource).toContain('thumbnailUrl: text("thumbnailUrl")');
    expect(homeSource).toContain("thumbnail: screenshot.thumbnailUrl || screenshot.imageUrl");
    expect(homeSource).toContain('<img src={screenshot.thumbnail}');
    expect(homeSource).toContain('<img src={mediaScreenshots[selectedScreenshot].image}');
    expect(adminSource).toContain("원본 최대 3,072KB · 홈 미리보기 자동 100KB 이하");
  });
});
