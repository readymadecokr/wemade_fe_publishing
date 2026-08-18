import { describe, expect, it } from "vitest";
import { filterMemberTransactionHistory } from "./memberHistory";

const rows = [
  { type: "use" as const, gameCode: "ROU", pgName: null, itemName: "Kafra Card", createdAt: new Date("2026-08-10T12:00:00Z") },
  { type: "charge" as const, gameCode: "ROU", pgName: "PayPal", itemName: null, createdAt: new Date("2026-08-12T12:00:00Z") },
  { type: "charge" as const, gameCode: "ABC", pgName: "PayerMax", itemName: null, createdAt: new Date("2026-08-11T12:00:00Z") },
];

describe("member transaction history filtering", () => {
  it("combines purchase and usage records in newest-first order", () => {
    const result = filterMemberTransactionHistory(rows, { type: "all", search: "" });
    expect(result.map(row => `${row.type}:${row.gameCode}`)).toEqual(["charge:ROU", "charge:ABC", "use:ROU"]);
  });

  it("filters the relevant tab and searches PG, item name, and game code", () => {
    expect(filterMemberTransactionHistory(rows, { type: "charge", search: "paypal" }).map(row => row.pgName)).toEqual(["PayPal"]);
    expect(filterMemberTransactionHistory(rows, { type: "use", search: "kafra" }).map(row => row.itemName)).toEqual(["Kafra Card"]);
    expect(filterMemberTransactionHistory(rows, { type: "all", search: "abc" }).map(row => row.gameCode)).toEqual(["ABC"]);
  });
});
