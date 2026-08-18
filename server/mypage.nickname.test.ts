import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { users } from "../drizzle/schema";
import { getDb } from "./db";
import { appRouter } from "./routers";

describe("My Page nickname features", () => {
  it("treats the OAuth user's current nickname as available", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [user] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, 1))
      .limit(1);
    expect(user?.name).toBeTruthy();

    const caller = appRouter.createCaller({
      req: {} as never,
      res: {} as never,
      user: { id: 1 } as never,
    });

    await expect(caller.user.checkNickname({ name: user!.name! })).resolves.toEqual({
      isAvailable: true,
    });
  });

  it("reports another user's nickname as unavailable", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [anotherUser] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, 60001))
      .limit(1);
    expect(anotherUser?.name).toBeTruthy();

    const caller = appRouter.createCaller({
      req: {} as never,
      res: {} as never,
      user: { id: 1 } as never,
    });

    await expect(caller.user.checkNickname({ name: anotherUser!.name! })).resolves.toEqual({
      isAvailable: false,
    });
  });

  it("renders User ID and English nickname search feedback in My Page", () => {
    const source = readFileSync(
      resolve(process.cwd(), "client/src/pages/MyPage.tsx"),
      "utf8",
    );

    expect(source).toContain(">User ID<");
    expect(source).toContain("handleNicknameCheck");
    expect(source).toContain("This nickname is available.");
    expect(source).toContain("This nickname is already in use.");
    expect(source).toContain('nicknameCheckStatus !== "available"');
  });
});
