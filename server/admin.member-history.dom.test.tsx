// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { MemberHistoryControls, MemberTransactionTable } from "../client/src/pages/AdminPage";

const charge = {
  id: 2, type: "charge", gameCode: "ROU", createdAt: new Date("2026-08-12T00:00:00Z"),
  beforeRuCash: 100_000, beforeBonusCash: 1_000, ruCashDelta: 2_000, bonusCashDelta: 150,
  afterRuCash: 102_000, afterBonusCash: 1_150, pgName: "PayPal", priceUsd: "5.00", status: "completed",
};
const usage = {
  id: 1, type: "use", gameCode: "ROU", createdAt: new Date("2026-08-11T00:00:00Z"),
  beforeRuCash: 102_000, beforeBonusCash: 1_150, ruCashDelta: 1_000, bonusCashDelta: 150,
  afterRuCash: 101_000, afterBonusCash: 1_000, itemName: "Kafra Card", itemQty: 1, itemPriceRuc: 1_000, totalPriceRuc: 1_000, status: "completed",
};

describe("member detail transaction tables", () => {
afterEach(() => cleanup());

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "hasPointerCapture", { configurable: true, value: () => false });
  Object.defineProperty(HTMLElement.prototype, "setPointerCapture", { configurable: true, value: () => {} });
  Object.defineProperty(HTMLElement.prototype, "releasePointerCapture", { configurable: true, value: () => {} });
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: () => {} });
});

  it("renders Payment History columns for the purchase tab", () => {
    render(<MemberTransactionTable items={[charge]} tab="charge" loading={false} />);
    expect(screen.getByText("PG")).toBeTruthy();
    expect(screen.getByText("Price")).toBeTruthy();
    expect(screen.getByText("rCoin Charged")).toBeTruthy();
    expect(screen.getByText("PayPal")).toBeTruthy();
    expect(screen.getByText("2,000")).toBeTruthy();
  });

  it("renders Points/Item Usage columns for the usage tab", () => {
    render(<MemberTransactionTable items={[usage]} tab="use" loading={false} />);
    expect(screen.getByText("Item Name")).toBeTruthy();
    expect(screen.getByText("Qty")).toBeTruthy();
    expect(screen.getByText("Total Price")).toBeTruthy();
    expect(screen.getByText("Kafra Card")).toBeTruthy();
  });

  it("uses the requested purchase-style column order in the all-history table", () => {
    render(<MemberTransactionTable items={[charge, usage]} tab="all" loading={false} />);
    const headers = within(screen.getByTestId("member-transaction-table")).getAllByRole("columnheader").map(header => header.textContent);
    expect(headers).toEqual([
      "Game Code", "Time", "rCoin Before", "Bonus rCoin Before", "PG", "Price", "rCoin Charged", "Bonus rCoin Charged", "rCoin After", "Bonus rCoin After",
    ]);
    expect(screen.queryByText("Bonus Δ")).toBeNull();
    expect(screen.getByText("PayPal")).toBeTruthy();
    expect(screen.getByText("Kafra Card")).toBeTruthy();
  });

  it("switches tabs and submits the entered transaction search", async () => {
    const user = userEvent.setup();
    const submitSearch = vi.fn();
    function ControlsHarness() {
      const [tab, setTab] = React.useState<"all" | "charge" | "use">("all");
      const [search, setSearch] = React.useState("");
      const [startDate, setStartDate] = React.useState("");
      const [endDate, setEndDate] = React.useState("");
      const [pageSize, setPageSize] = React.useState(20);
      return <><MemberHistoryControls tab={tab} searchInput={search} startDate={startDate} endDate={endDate} pageSize={pageSize} onTabChange={setTab} onSearchInputChange={setSearch} onStartDateChange={setStartDate} onEndDateChange={setEndDate} onPageSizeChange={setPageSize} onSearch={() => submitSearch(search)} /><output data-testid="selected-tab">{tab}</output><output data-testid="filter-state">{startDate}|{endDate}|{pageSize}</output></>;
    }
    render(<ControlsHarness />);

    await user.click(screen.getByRole("tab", { name: "사용이력" }));
    expect(screen.getByTestId("selected-tab").textContent).toBe("use");
    await user.type(screen.getByRole("textbox", { name: "회원 거래 이력 검색" }), "PayPal");
    await user.click(screen.getByRole("button", { name: "검색" }));
    expect(submitSearch).toHaveBeenLastCalledWith("PayPal");
    await user.type(screen.getByLabelText("거래 이력 시작일"), "2026-08-10");
    expect(screen.getByTestId("filter-state").textContent).toContain("2026-08-10");
    expect(screen.getByRole("combobox", { name: "거래 이력 페이지 크기" }).textContent).toContain("20개씩");
    await user.click(screen.getByRole("combobox", { name: "거래 이력 페이지 크기" }));
    expect(await screen.findByRole("option", { name: "100개씩" })).toBeTruthy();
  });
});
