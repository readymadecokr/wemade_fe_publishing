import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getDb: vi.fn(),
}));

vi.mock("./db", () => ({ getDb: mocks.getDb }));

import { authenticateAdminCredentials, encodeAdminPassword } from "./adminCredentials";

function mockAdminRow(row: Record<string, unknown> | null) {
  mocks.getDb.mockResolvedValue({
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve(row ? [row] : []),
        }),
      }),
    }),
  });
}

describe("administrator credential authentication", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores the admin password with the shared encoding", () => {
    expect(encodeAdminPassword("admin")).toBe("YWRtaW4=");
  });

  it("authenticates an active database administrator with admin/admin", async () => {
    mockAdminRow({ id: 3001, username: "admin", passwordHash: encodeAdminPassword("admin"), isActive: 1 });
    await expect(authenticateAdminCredentials("admin", "admin")).resolves.toEqual({ id: 3001, username: "admin" });
  });

  it("rejects incorrect passwords and inactive accounts", async () => {
    mockAdminRow({ id: 3001, username: "admin", passwordHash: encodeAdminPassword("admin"), isActive: 1 });
    await expect(authenticateAdminCredentials("admin", "wrong")).resolves.toBeNull();
    mockAdminRow({ id: 3001, username: "admin", passwordHash: encodeAdminPassword("admin"), isActive: 0 });
    await expect(authenticateAdminCredentials("admin", "admin")).resolves.toBeNull();
  });
});
