import { eq, inArray } from "drizzle-orm";
import { news } from "../../drizzle/schema";
import { getDb } from "../db";
import { legacyServiceNews } from "../data/legacyServiceNews";

function parseKstDate(value: string): Date {
  const [datePart, timePart, period] = value.split(" ");
  const [month, day, year] = datePart.split("/").map(Number);
  const [rawHour, minute, second = 0] = timePart.split(":").map(Number);
  const hour = period === "PM" && rawHour !== 12 ? rawHour + 12 : period === "AM" && rawHour === 12 ? 0 : rawHour;
  return new Date(Date.UTC(year, month - 1, day, hour - 9, minute, second));
}

function defaultSummary(content: string): string {
  const firstParagraph = content.split(/\n\s*\n/)[0]?.trim() ?? "";
  return firstParagraph.length <= 220 ? firstParagraph : `${firstParagraph.slice(0, 217).trimEnd()}...`;
}

async function migrate() {
  const db = await getDb();
  if (!db) throw new Error("Database connection is unavailable.");

  const existingSeeds = await db
    .select({ id: news.id })
    .from(news)
    .where(inArray(news.title, legacyServiceNews.map(item => item.title)));

  if (existingSeeds.length > 0) {
    throw new Error(`Migration aborted: ${existingSeeds.length} legacy service News title(s) already exist. No changes were made.`);
  }

  await db.transaction(async tx => {
    // 현재 활성 관리자 기사는 삭제하지 않고 복구 가능한 비공개 상태로 보존합니다.
    await tx.update(news).set({ isActive: 0 }).where(eq(news.isActive, 1));

    for (const item of legacyServiceNews) {
      await tx.insert(news).values({
        title: item.title,
        category: item.category,
        summary: item.summary ?? defaultSummary(item.content),
        content: item.content,
        imageUrl: item.imageUrl,
        isActive: 1,
        sortOrder: item.sourceId * 10,
        publishedAt: parseKstDate(item.publishedAt),
      });
    }
  });

  console.log(`Migrated ${legacyServiceNews.length} service News article(s) and archived previous active administrator News.`);
}

migrate().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

