export type MemberTransactionHistoryRow = {
  type: "charge" | "use";
  gameCode: string;
  pgName: string | null;
  itemName: string | null;
  createdAt: Date | string;
};

export function filterMemberTransactionHistory<T extends MemberTransactionHistoryRow>(rows: T[], input: { type: "all" | "charge" | "use"; search: string }) {
  const keyword = input.search.trim().toLocaleLowerCase();
  return rows
    .filter(row => input.type === "all" || row.type === input.type)
    .filter(row => !keyword || [row.gameCode, row.pgName ?? "", row.itemName ?? ""].some(value => value.toLocaleLowerCase().includes(keyword)))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
