import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("User ID 1 rCoin balance", () => {
  it("returns the restored rCoin and Bonus rCoin amounts for the OAuth user", async () => {
    const caller = appRouter.createCaller({
      req: {} as never,
      res: {} as never,
      user: { id: 1 } as never,
    });

    await expect(caller.shop.myBalance()).resolves.toEqual({
      ruCash: 1_000_000,
      bonusCash: 1_000_000,
    });
  });
});
