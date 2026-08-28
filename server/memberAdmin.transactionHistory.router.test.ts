import { describe, expect, it, vi } from "vitest";

const { mockGetDb } = vi.hoisted(() => ({ mockGetDb: vi.fn() }));

vi.mock("./db", () => ({ getDb: mockGetDb }));

import { appRouter } from "./routers";

const rows = [
  { id: 1, userId: 77, type: "use", gameCode: "ROU", pgName: null, itemName: "Kafra Card", createdAt: new Date("2026-08-10T12:00:00Z") },
  { id: 2, userId: 77, type: "charge", gameCode: "ROU", pgName: "PayPal", itemName: null, createdAt: new Date("2026-08-12T12:00:00Z") },
  { id: 3, userId: 77, type: "charge", gameCode: "ABC", pgName: "PayerMax", itemName: null, createdAt: new Date("2026-08-11T12:00:00Z") },
];

function mockDbWithRows(data: typeof rows) {
  return {
    select: () => ({ from: () => ({ where: () => Promise.resolve(data) }) }),
  };
}

function createAdminCaller() {
  return appRouter.createCaller({ req: { headers: { "x-admin-key": "cyanima:0000" } }, res: {}, user: null } as any);
}

describe("memberAdmin.transactionHistory router", () => {
  it("returns the all-history response in newest-first order", async () => {
    mockGetDb.mockResolvedValue(mockDbWithRows(rows));
    const result = await createAdminCaller().memberAdmin.transactionHistory({ userId: 77, type: "all", search: "", page: 1, pageSize: 10 });

    expect(result.items.map(item => item.id)).toEqual([2, 3, 1]);
    expect(result.total).toBe(3);
  });

  it("filters the actual procedure response by tab and search fields", async () => {
    mockGetDb.mockResolvedValue(mockDbWithRows(rows));
    const pgResult = await createAdminCaller().memberAdmin.transactionHistory({ userId: 77, type: "charge", search: "paypal", page: 1, pageSize: 10 });
    const itemResult = await createAdminCaller().memberAdmin.transactionHistory({ userId: 77, type: "use", search: "kafra", page: 1, pageSize: 10 });
    const gameResult = await createAdminCaller().memberAdmin.transactionHistory({ userId: 77, type: "all", search: "abc", page: 1, pageSize: 10 });

    expect(pgResult.items.map(item => item.pgName)).toEqual(["PayPal"]);
    expect(itemResult.items.map(item => item.itemName)).toEqual(["Kafra Card"]);
    expect(gameResult.items.map(item => item.gameCode)).toEqual(["ABC"]);
  });

  it("filters the procedure response by the inclusive selected date range", async () => {
    mockGetDb.mockResolvedValue(mockDbWithRows(rows));
    const result = await createAdminCaller().memberAdmin.transactionHistory({ userId: 77, type: "all", search: "", startDate: "2026-08-11", endDate: "2026-08-11", page: 1, pageSize: 20 });

    expect(result.items.map(item => item.id)).toEqual([3]);
    expect(result.total).toBe(1);
  });
});
