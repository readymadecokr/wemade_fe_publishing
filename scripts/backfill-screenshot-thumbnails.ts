import { eq, isNull } from "drizzle-orm";
import { getDb } from "../server/db";
import { createScreenshotThumbnail } from "../server/imageUpload";
import { storageGetSignedUrl, storagePut } from "../server/storage";
import { screenshots } from "../drizzle/schema";

function storageKeyFromUrl(url: string) {
  const marker = "/manus-storage/";
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) throw new Error(`Unsupported screenshot storage URL: ${url}`);
  return url.slice(markerIndex + marker.length);
}

async function backfillScreenshotThumbnails() {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const rows = await db.select().from(screenshots).where(isNull(screenshots.thumbnailUrl));
  let completed = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      const key = storageKeyFromUrl(row.imageUrl);
      const signedUrl = await storageGetSignedUrl(key);
      const response = await fetch(signedUrl);
      if (!response.ok) throw new Error(`Original download failed (${response.status})`);

      const original = Buffer.from(await response.arrayBuffer());
      const thumbnail = await createScreenshotThumbnail(original);
      const { url } = await storagePut(`screenshots/thumbnail/backfill-${row.id}.webp`, thumbnail, "image/webp");
      await db.update(screenshots).set({ thumbnailUrl: url }).where(eq(screenshots.id, row.id));
      completed += 1;
      console.log(`Thumbnail created for screenshot ${row.id}: ${thumbnail.length} bytes`);
    } catch (error) {
      failed += 1;
      console.error(`Thumbnail creation failed for screenshot ${row.id}:`, error);
    }
  }

  console.log(`Screenshot thumbnail backfill complete: ${completed} succeeded, ${failed} failed.`);
  if (failed) process.exitCode = 1;
  else process.exit(0);
}

backfillScreenshotThumbnails().catch((error) => {
  console.error("Screenshot thumbnail backfill failed:", error);
  process.exitCode = 1;
});
