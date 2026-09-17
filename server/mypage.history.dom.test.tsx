// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  setLocation: vi.fn(),
  logoutSession: vi.fn().mockResolvedValue(undefined),
  setBalance: vi.fn(),
  invalidateBalance: vi.fn(),
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
    useUtils: () => ({ shop: { myBalance: { setData: mocks.setBalance, invalidate: mocks.invalidateBalance } } }),
    auth: { me: { useQuery: () => ({ data: { id: 1, name: "Ryan Kim", createdAt: new Date() } }) } },
    user: { withdraw: { useMutation: () => ({ mutate: vi.fn() }) } },
    shop: {
      myBalance: { useQuery: () => ({ data: { ruCash: 1_000_000, bonusCash: 1_000_000 } }) },
      myChargeHistory: { useQuery: ({ page }: { page: number }) => ({ data: { items: mocks.historyItems(page, "purchase"), total: 15 } }) },
      myUseHistory: { useQuery: ({ page }: { page: number }) => ({ data: { items: mocks.historyItems(page, "usage"), total: 15 } }) },
    },
    coupon: {
      myHistory: { useQuery: () => ({ data: { items: [{ id: 1, eventName: "Welcome Celebration", couponCode: "DEMO-0001-0001", characterName: "ValkyrieKnight", registeredAt: new Date("2026-08-20T00:00:00Z"), status: "Registered" }], total: 1 }, isLoading: false, refetch: vi.fn() }) },
      redeem: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}));

vi.mock("@/components/Layout", () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock("wouter", () => ({ Link: ({ children }: { children: React.ReactNode }) => <>{children}</>, useLocation: () => ["/my-page", mocks.setLocation] }));
vi.mock("sonner", () => ({ toast: mocks.toast }));
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ logout: mocks.logoutSession }) }));

import MyPage from "@/pages/MyPage";

describe("My Page history screens", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    localStorage.setItem("rou_logged_in", "true");
    localStorage.setItem("rou_nickname", "Ryan Kim");
    mocks.logoutSession.mockClear();
    mocks.setBalance.mockClear();
    mocks.invalidateBalance.mockClear();
    mocks.setLocation.mockClear();
  });

  it("shows title-free purchase and usage tables with 10-item pagination", async () => {
    const user = userEvent.setup();
    render(<MyPage />);
    expect(screen.getAllByText("Nickname").length).toBeGreaterThan(0);
    expect(screen.getAllByText("User ID").length).toBeGreaterThan(0);

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

  it("opens the simplified coupon registration screen with server, character, and confirmation controls", async () => {
    const user = userEvent.setup();
    render(<MyPage />);
    await user.click(screen.getByRole("button", { name: "Coupon" }));
    expect(screen.getByTestId("coupon-entry")).toBeTruthy();
    expect(screen.getAllByText("COUPON REGISTRATION")).toHaveLength(2);
    expect(screen.queryByRole("heading", { name: "Coupon" })).toBeNull();
    expect(screen.queryByText("Coupon Use History")).toBeNull();
    expect(screen.getByLabelText("Coupon history")).toBeTruthy();
    expect(screen.getByText("COUPON HISTORY")).toBeTruthy();
    expect(screen.getByText("Welcome Celebration")).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Coupon server" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Coupon character" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Coupon code" })).toBeTruthy();
    await user.selectOptions(screen.getByRole("combobox", { name: "Coupon server" }), "1");
    await user.selectOptions(screen.getByRole("combobox", { name: "Coupon character" }), "ValkyrieKnight");
    await user.type(screen.getByRole("textbox", { name: "Coupon code" }), "demo-0001-0001");
    await user.click(screen.getByRole("button", { name: "COUPON REGISTRATION" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeTruthy();
  });

  it("clears server-auth, local account data, and the header balance when logging out", async () => {
    const user = userEvent.setup();
    localStorage.setItem("rou_social_provider", "Google");
    localStorage.setItem("manus-runtime-user-info", JSON.stringify({ id: 1 }));
    render(<MyPage />);

    await user.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() => expect(mocks.logoutSession).toHaveBeenCalledTimes(1));
    expect(localStorage.getItem("rou_logged_in")).toBeNull();
    expect(localStorage.getItem("rou_nickname")).toBeNull();
    expect(localStorage.getItem("rou_social_provider")).toBeNull();
    expect(localStorage.getItem("manus-runtime-user-info")).toBeNull();
    expect(mocks.setBalance).toHaveBeenCalledWith(undefined, { ruCash: 0, bonusCash: 0 });
    expect(mocks.invalidateBalance).toHaveBeenCalledTimes(1);
    expect(mocks.setLocation).toHaveBeenCalledWith("/");
  });
});
