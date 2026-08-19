// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PurchaseDialog } from "../client/src/pages/PointShop";

afterEach(() => cleanup());

describe("latest Shop purchase dialog", () => {
  const products = [
    { id: 1, sortOrder: 1, ruCashAmount: 100, bonusCashAmount: 0, priceUsd: "1.00" },
    { id: 2, sortOrder: 2, ruCashAmount: 1000, bonusCashAmount: 50, priceUsd: "10.00" },
  ];

  it("renders English package controls and enables payment only after the robot check", async () => {
    const user = userEvent.setup();
    render(<PurchaseDialog products={products} productId={2} open onOpenChange={vi.fn()} onSelectProduct={vi.fn()} />);

    expect(screen.getByText("Purchase rCoin")).toBeTruthy();
    expect(screen.getByText("1,000 rCoin")).toBeTruthy();
    expect(screen.getByText("+50 Bonus")).toBeTruthy();
    const pay = screen.getByRole("button", { name: "Pay $10.00" });
    expect((pay as HTMLButtonElement).disabled).toBe(true);

    await user.click(screen.getByRole("checkbox", { name: /I am not a robot/i }));
    expect((pay as HTMLButtonElement).disabled).toBe(false);
    await user.click(screen.getByRole("button", { name: "More payment methods" }));
    expect(screen.getByText("MyCard")).toBeTruthy();
  });

  it("closes through the X control and resets payment state after reopening", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [open, setOpen] = React.useState(true);
      const [productId, setProductId] = React.useState(2);
      return <>
        <button type="button" onClick={() => setOpen(true)}>Reopen dialog</button>
        <PurchaseDialog products={products} productId={productId} open={open} onOpenChange={setOpen} onSelectProduct={setProductId} />
      </>;
    }
    render(<Harness />);

    await user.click(screen.getByRole("checkbox", { name: /I am not a robot/i }));
    await user.click(screen.getByRole("button", { name: "More payment methods" }));
    expect(screen.getByText("MyCard")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByText("Purchase rCoin")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Reopen dialog" }));
    expect((screen.getByRole("button", { name: "Pay $10.00" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.queryByText("MyCard")).toBeNull();
  });
});
