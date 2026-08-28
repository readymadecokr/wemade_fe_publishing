// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MembersSection } from "../client/src/pages/AdminPage";
import { filterMemberTransactionHistory } from "./memberHistory";
import { filterMemberCouponHistory } from "./memberCouponHistory";

const member = { id: 701, name: "History Member", openId: "history-member", loginMethod: "google", createdAt: new Date("2026-08-01T00:00:00Z"), lastSignedIn: new Date("2026-08-12T00:00:00Z"), status: "active", csCode: null };
const transactions = [
  { id: 3, type: "charge" as const, gameCode: "ROU", pgName: "PayPal", itemName: null, createdAt: new Date("2026-08-12T12:00:00Z"), beforeRuCash: 1000, beforeBonusCash: 0, ruCashDelta: 2000, bonusCashDelta: 150, afterRuCash: 3000, afterBonusCash: 150, priceUsd: "5.00", itemQty: 0, itemPriceRuc: 0, totalPriceRuc: 0, status: "completed" },
  { id: 2, type: "use" as const, gameCode: "ROU", pgName: null, itemName: "Kafra Card", createdAt: new Date("2026-08-11T12:00:00Z"), beforeRuCash: 3000, beforeBonusCash: 150, ruCashDelta: 1000, bonusCashDelta: 150, afterRuCash: 2000, afterBonusCash: 0, priceUsd: null, itemQty: 1, itemPriceRuc: 1000, totalPriceRuc: 1000, status: "completed" },
];
const couponUses = [{ id: 9, couponId: 22, userId: 701, usedAt: new Date("2026-08-10T12:00:00Z") }];
const coupons = [{ id: 22, code: "WELCOME", name: "Welcome rCoin", eventName: "WELCOME EVENT", gameCode: "ROU", couponType: "common" as const, benefitType: "point" as const, benefitValue: 500, bonusRcoin: 500, rewardItems: "[]", serverCodes: "1,2", validFrom: new Date("2026-08-01T00:00:00Z"), expiresAt: new Date("2026-08-31T23:59:00Z") }];

afterEach(() => cleanup());

describe("admin member detail transaction history integration", () => {
  it("changes tab data and filters search results through the member history API", async () => {
    const user = userEvent.setup();
    const transactionHistory = vi.fn(async (input: { type: "all" | "charge" | "use"; search: string; page: number; pageSize: number }) => {
      const rows = filterMemberTransactionHistory(transactions, input);
      return { items: rows.slice((input.page - 1) * input.pageSize, input.page * input.pageSize), total: rows.length };
    });
    const couponHistory = vi.fn(async (input: { search: string; page: number; pageSize: number; startDate?: string; endDate?: string }) => {
      const rows = filterMemberCouponHistory(couponUses, coupons, input);
      return { items: rows.slice((input.page - 1) * input.pageSize, input.page * input.pageSize), total: rows.length };
    });
    const adminClient = {
      admin: { listUsers: { query: vi.fn(async () => ({ data: [member], total: 1, totalPages: 1 })) } },
      memberAdmin: {
        restrictionHistory: { query: vi.fn(async () => []) },
        transactionHistory: { query: transactionHistory },
        couponHistory: { query: couponHistory },
        paymentSummary: { query: vi.fn(async () => ({ totalPaymentUsd: 5 })) },
        updateNickname: { mutate: vi.fn() },
        checkNickname: { query: vi.fn(async () => ({ isDuplicate: false })) },
        suspend: { mutate: vi.fn() },
      },
    } as any;
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={queryClient}><MembersSection adminClient={adminClient} /></QueryClientProvider>);

    await user.click(await screen.findByText("History Member"));
    await screen.findByText("회원 상세");
    expect(screen.getAllByText("$5.00").length).toBeGreaterThan(0);
    await screen.findByText("PayPal");
    expect(screen.getByText("Kafra Card")).toBeTruthy();
    expect(transactionHistory).toHaveBeenLastCalledWith(expect.objectContaining({ type: "all", search: "", pageSize: 20 }));

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

    await user.clear(search);
    await user.click(screen.getAllByRole("button", { name: "검색" }).at(-1)!);
    await user.click(screen.getByRole("tab", { name: "쿠폰 사용이력" }));
    await screen.findByText("쿠폰 코드");
    expect(screen.getByText("WELCOME")).toBeTruthy();
    expect(screen.getByText("WELCOME EVENT")).toBeTruthy();
    expect(screen.getByText("Bonus rCoin 500")).toBeTruthy();
    expect(screen.getByText("사용")).toBeTruthy();
    await waitFor(() => expect(couponHistory).toHaveBeenLastCalledWith(expect.objectContaining({ search: "" })));
  });
});
