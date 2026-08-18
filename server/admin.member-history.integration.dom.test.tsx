// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MembersSection } from "../client/src/pages/AdminPage";
import { filterMemberTransactionHistory } from "./memberHistory";

const member = { id: 701, name: "History Member", openId: "history-member", loginMethod: "google", createdAt: new Date("2026-08-01T00:00:00Z"), lastSignedIn: new Date("2026-08-12T00:00:00Z"), status: "active", csCode: null };
const transactions = [
  { id: 3, type: "charge" as const, gameCode: "ROU", pgName: "PayPal", itemName: null, createdAt: new Date("2026-08-12T12:00:00Z"), beforeRuCash: 1000, beforeBonusCash: 0, ruCashDelta: 2000, bonusCashDelta: 150, afterRuCash: 3000, afterBonusCash: 150, priceUsd: "5.00", itemQty: 0, itemPriceRuc: 0, totalPriceRuc: 0, status: "completed" },
  { id: 2, type: "use" as const, gameCode: "ROU", pgName: null, itemName: "Kafra Card", createdAt: new Date("2026-08-11T12:00:00Z"), beforeRuCash: 3000, beforeBonusCash: 150, ruCashDelta: 1000, bonusCashDelta: 150, afterRuCash: 2000, afterBonusCash: 0, priceUsd: null, itemQty: 1, itemPriceRuc: 1000, totalPriceRuc: 1000, status: "completed" },
];

afterEach(() => cleanup());

describe("admin member detail transaction history integration", () => {
  it("changes tab data and filters search results through the member history API", async () => {
    const user = userEvent.setup();
    const transactionHistory = vi.fn(async (input: { type: "all" | "charge" | "use"; search: string; page: number; pageSize: number }) => {
      const rows = filterMemberTransactionHistory(transactions, input);
      return { items: rows.slice((input.page - 1) * input.pageSize, input.page * input.pageSize), total: rows.length };
    });
    const adminClient = {
      admin: { listUsers: { query: vi.fn(async () => ({ data: [member], total: 1, totalPages: 1 })) } },
      memberAdmin: {
        restrictionHistory: { query: vi.fn(async () => []) },
        transactionHistory: { query: transactionHistory },
        updateNickname: { mutate: vi.fn() },
        checkNickname: { query: vi.fn(async () => ({ isDuplicate: false })) },
        suspend: { mutate: vi.fn() },
      },
    } as any;
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={queryClient}><MembersSection adminClient={adminClient} /></QueryClientProvider>);

    await user.click(await screen.findByText("History Member"));
    await screen.findByText("회원 상세");
    await screen.findByText("PayPal");
    expect(screen.getByText("Kafra Card")).toBeTruthy();
    expect(transactionHistory).toHaveBeenLastCalledWith(expect.objectContaining({ type: "all", search: "" }));

    await user.click(screen.getByRole("tab", { name: "사용이력" }));
    await screen.findByText("Item Name");
    expect(screen.getByText("Kafra Card")).toBeTruthy();
    await waitFor(() => expect(transactionHistory).toHaveBeenLastCalledWith(expect.objectContaining({ type: "use" })));

    await user.click(screen.getByRole("tab", { name: "전체" }));
    const search = screen.getByRole("textbox", { name: "회원 거래 이력 검색" });
    await user.type(search, "PayPal");
    await user.click(screen.getAllByRole("button", { name: "검색" }).at(-1)!);
    await screen.findByText("PayPal");
    await waitFor(() => expect(transactionHistory).toHaveBeenLastCalledWith(expect.objectContaining({ type: "all", search: "PayPal" })));
    expect(screen.queryByText("Kafra Card")).toBeNull();
  });
});
