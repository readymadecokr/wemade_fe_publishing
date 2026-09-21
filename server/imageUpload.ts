import sharp, { type Metadata } from "sharp";
import { storagePut } from "./storage";

export const NEWS_IMAGE_MAX_BYTES = 500 * 1024;
export const BANNER_IMAGE_MAX_BYTES = 1024 * 1024;
export const SCREENSHOT_IMAGE_MAX_BYTES = 3072 * 1024;
export const SCREENSHOT_THUMBNAIL_MAX_BYTES = 100 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type ParsedImage = {
  buffer: Buffer;
  contentType: "image/jpeg" | "image/png" | "image/webp";
  filename: string;
};

export function safeImageFilename(filename: string, fallback: string) {
  const normalized = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return normalized || fallback;
}

export function parseImageDataUrl(base64: string, filename: string, fallback: string): ParsedImage {
  const matches = base64.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!matches) throw new Error("Invalid base64 image data");
  const contentType = matches[1] as ParsedImage["contentType"];
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) throw new Error("JPG, PNG, WEBP 이미지 파일만 업로드할 수 있습니다.");

  const buffer = Buffer.from(matches[2], "base64");
  if (!buffer.length) throw new Error("이미지 파일이 비어 있습니다.");
  return { buffer, contentType, filename: safeImageFilename(filename, fallback) };
}

export async function verifyImageDimensions(buffer: Buffer, width: number, height: number) {
  let metadata: Metadata;
  try {
    metadata = await sharp(buffer, { failOn: "none" }).metadata();
  } catch {
    throw new Error("이미지 정보를 읽을 수 없습니다.");
  }
  if (metadata.width !== width || metadata.height !== height) {
    throw new Error(`이미지 크기는 ${width}×${height}px이어야 합니다.`);
  }
}

export async function createScreenshotThumbnail(buffer: Buffer) {
  const candidates = [
    { width: 1280, quality: 76 },
    { width: 1120, quality: 70 },
    { width: 960, quality: 64 },
    { width: 800, quality: 56 },
    { width: 640, quality: 48 },
    { width: 480, quality: 38 },
    { width: 384, quality: 28 },
  ];

  for (const candidate of candidates) {
    const thumbnail = await sharp(buffer, { failOn: "none" })
      .rotate()
      .resize({ width: candidate.width, height: candidate.width, fit: "inside", withoutEnlargement: true })
      .webp({ quality: candidate.quality, effort: 4 })
      .toBuffer();
    if (thumbnail.length <= SCREENSHOT_THUMBNAIL_MAX_BYTES) return thumbnail;
  }

  throw new Error("스크린샷 미리보기를 100KB 이하로 생성할 수 없습니다. 더 작은 원본 이미지를 등록하세요.");
}

export async function uploadScreenshotAssets(input: { base64: string; filename: string }) {
  const image = parseImageDataUrl(input.base64, input.filename, "screenshot.jpg");
  if (image.buffer.length > SCREENSHOT_IMAGE_MAX_BYTES) throw new Error("스크린샷 원본은 3,072KB를 초과할 수 없습니다.");

  const thumbnail = await createScreenshotThumbnail(image.buffer);
  const timestamp = Date.now();
  const basename = image.filename.replace(/\.[^.]+$/, "") || "screenshot";
  const [originalUpload, thumbnailUpload] = await Promise.all([
    storagePut(`screenshots/original/${timestamp}-${image.filename}`, image.buffer, image.contentType),
    storagePut(`screenshots/thumbnail/${timestamp}-${basename}.webp`, thumbnail, "image/webp"),
  ]);

  return {
    imageUrl: originalUpload.url,
    thumbnailUrl: thumbnailUpload.url,
    originalBytes: image.buffer.length,
    thumbnailBytes: thumbnail.length,
  };
}

export async function uploadNewsImage(input: { base64: string; filename: string }) {
  const image = parseImageDataUrl(input.base64, input.filename, "news.jpg");
  if (image.buffer.length > NEWS_IMAGE_MAX_BYTES) throw new Error("News 썸네일은 500KB를 초과할 수 없습니다.");
  const upload = await storagePut(`news/${Date.now()}-${image.filename}`, image.buffer, image.contentType);
  return { url: upload.url };
}

export async function uploadBannerImage(input: { base64: string; filename: string }) {
  const image = parseImageDataUrl(input.base64, input.filename, "banner.jpg");
  if (image.buffer.length >= BANNER_IMAGE_MAX_BYTES) throw new Error("메인배너 이미지는 1,024KB 미만이어야 합니다.");
  await verifyImageDimensions(image.buffer, 1900, 600);
  const upload = await storagePut(`banners/${Date.now()}-${image.filename}`, image.buffer, image.contentType);
  return { url: upload.url };
}

export async function uploadGameIconImage(input: { base64: string; filename: string }) {
  const image = parseImageDataUrl(input.base64, input.filename, "game-icon.jpg");
  if (image.buffer.length > NEWS_IMAGE_MAX_BYTES) throw new Error("게임 아이콘은 500KB를 초과할 수 없습니다.");
  const upload = await storagePut(`game-icons/${Date.now()}-${image.filename}`, image.buffer, image.contentType);
  return { url: upload.url };
}
