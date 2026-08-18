// @vitest-environment jsdom
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  checkNickname: vi.fn(),
  updateNickname: vi.fn(),
  invalidateMe: vi.fn(),
  logout: vi.fn(),
  setLocation: vi.fn(),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  historyItems: (page: number, kind: "purchase" | "usage") => Array.from({ length: page === 1 ? 10 : 5 }, (_, index) => ({
    id: `${kind}-${page}-${index + 1}`,
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
    auth: {
      me: {
        useQuery: () => ({ data: { id: 1, name: "Ryan Kim", createdAt: new Date() } }),
      },
    },
    user: {
      profile: {
        useQuery: () => ({
          data: {
            id: 1,
            name: "Ryan Kim",
            csCode: "90000000001",
            loginMethod: "google",
            createdAt: new Date("2026-06-22T06:38:00Z"),
            lastSignedIn: new Date("2026-08-18T06:05:00Z"),
            status: "active",
          },
        }),
      },
      updateNickname: {
        useMutation: () => ({ mutateAsync: mocks.updateNickname }),
      },
      withdraw: {
        useMutation: () => ({ mutateAsync: vi.fn() }),
      },
    },
    shop: {
      myBalance: {
        useQuery: () => ({ data: { ruCash: 1_000_000, bonusCash: 1_000_000 } }),
      },
      myChargeHistory: {
        useQuery: ({ page }: { page: number }) => ({ data: { items: mocks.historyItems(page, "purchase"), total: 15 } }),
      },
      myUseHistory: {
        useQuery: ({ page }: { page: number }) => ({ data: { items: mocks.historyItems(page, "usage"), total: 15 } }),
      },
    },
    useUtils: () => ({
      user: { checkNickname: { fetch: mocks.checkNickname } },
      auth: { me: { invalidate: mocks.invalidateMe } },
    }),
  },
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: true, logout: mocks.logout }),
}));

vi.mock("@/components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
  useLocation: () => ["/my-page", mocks.setLocation],
}));

vi.mock("sonner", () => ({ toast: mocks.toast }));

import MyPage from "@/pages/MyPage";

describe("My Page nickname search DOM flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mocks.checkNickname.mockImplementation(async ({ name }: { name: string }) => ({
      isAvailable: name !== "Taken Nickname",
    }));
  });

  it("renders User ID and controls Save from Search availability results", async () => {
    const user = userEvent.setup();
    render(<MyPage />);

    expect((await screen.findAllByText("Ryan Kim")).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("User ID").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("CS Code").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByRole("columnheader").slice(0, 7).map((heading) => heading.textContent)).toEqual([
      "User ID",
      "Nickname",
      "Provider",
      "Registration Date",
      "Last Activity",
      "Status",
      "CS Code",
    ]);

    await user.click(screen.getByRole("button", { name: /change nickname/i }));
    const input = screen.getByPlaceholderText("Enter new nickname");
    const search = screen.getByRole("button", { name: "Search" });
    const save = screen.getByRole("button", { name: "Save" });

    expect(save.hasAttribute("disabled")).toBe(true);
    await user.clear(input);
    await user.type(input, "Available Nickname");
    await user.click(search);
    expect(await screen.findByText("This nickname is available.")).toBeTruthy();
    await waitFor(() => expect(save.hasAttribute("disabled")).toBe(false));

    await user.clear(input);
    await user.type(input, "Taken Nickname");
    expect(save.hasAttribute("disabled")).toBe(true);
    await user.click(search);
    expect(await screen.findByText("This nickname is already in use.")).toBeTruthy();
    expect(save.hasAttribute("disabled")).toBe(true);
  });

  it("shows paginated purchase and usage histories with wrapped Time values", async () => {
    const user = userEvent.setup();
    render(<MyPage />);

    await user.click(screen.getAllByRole("button", { name: "Payment History" }).at(-1)!);
    expect(await screen.findByRole("heading", { name: "Purchase History" })).toBeTruthy();
    expect(screen.getAllByText("ROU")).toHaveLength(10);
    expect(screen.getByText("2026-08-12", { exact: false }).textContent).toContain("00:00");

    await user.click(screen.getByRole("button", { name: "2" }));
    await waitFor(() => expect(screen.getAllByText("ROU")).toHaveLength(5));

    await user.click(screen.getAllByRole("button", { name: "Points/Item Usage" }).at(-1)!);
    expect(await screen.findByRole("heading", { name: "Usage History" })).toBeTruthy();
    expect(screen.getAllByText("Kafra Card")).toHaveLength(10);
  });
});
