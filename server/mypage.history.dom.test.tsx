// @vitest-environment jsdom
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  setLocation: vi.fn(),
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
  historyItems: (page: number, kind: "purchase" | "usage") => Array.from({ length: page === 1 ? 10 : 5 }, (_, index) => ({
    id: `${kind}-${page}-${index}`,
    gameCode: "ROU",
    createdAt: new Date(`2026-08-${String(12 - index).padStart(2, "0")}T00:00:00Z`),
    beforeRuCash: 100_000,
    beforeBonusCash: 1_000,
    afterRuCash: 102_000,
    afterBonusCash: 1_150,
    pgName: "PayPal",
    priceUsd: 5,
    ruCashDelta: 2_000,
    bonusCashDelta: 150,
    itemName: "Kafra Card",
    itemQty: 1,
    itemPriceRuc: 1_000,
    totalPriceRuc: 1_000,
  })),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: { me: { useQuery: () => ({ data: { id: 1, name: "Ryan Kim", createdAt: new Date() } }) } },
    user: { withdraw: { useMutation: () => ({ mutate: vi.fn() }) } },
    shop: {
      myBalance: { useQuery: () => ({ data: { ruCash: 1_000_000, bonusCash: 1_000_000 } }) },
      myChargeHistory: { useQuery: ({ page }: { page: number }) => ({ data: { items: mocks.historyItems(page, "purchase"), total: 15 } }) },
      myUseHistory: { useQuery: ({ page }: { page: number }) => ({ data: { items: mocks.historyItems(page, "usage"), total: 15 } }) },
    },
  },
}));

vi.mock("@/components/Layout", () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock("wouter", () => ({ Link: ({ children }: { children: React.ReactNode }) => <>{children}</>, useLocation: () => ["/my-page", mocks.setLocation] }));
vi.mock("sonner", () => ({ toast: mocks.toast }));

import MyPage from "@/pages/MyPage";

describe("My Page history screens", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("rou_logged_in", "true");
    localStorage.setItem("rou_nickname", "Ryan Kim");
  });

  it("shows title-free purchase and usage tables with 10-item pagination", async () => {
    const user = userEvent.setup();
    render(<MyPage />);

    await user.click(screen.getByRole("button", { name: "Payment History" }));
    expect(screen.queryByRole("heading", { name: "Purchase History" })).toBeNull();
    expect(screen.getByTestId("history-layout").className).toContain("space-y-3");
    expect(screen.getByTestId("history-table")).toBeTruthy();
    expect(screen.getAllByText("ROU")).toHaveLength(10);
    expect(screen.getByText("2026-08-12", { exact: true }).parentElement?.textContent).toContain("00:00");
    expect(screen.getAllByText("1,000,000").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "2" }));
    await waitFor(() => expect(screen.getAllByText("ROU")).toHaveLength(5));

    await user.click(screen.getByRole("button", { name: "Points/Item Usage" }));
    expect(screen.queryByRole("heading", { name: "Usage History" })).toBeNull();
    expect(screen.getAllByText("Kafra Card")).toHaveLength(10);
  });
});
