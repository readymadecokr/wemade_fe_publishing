export type MemberTransactionHistoryRow = {
  type: "charge" | "use";
  gameCode: string;
  pgName: string | null;
  itemName: string | null;
  createdAt: Date | string;
};

export function filterMemberTransactionHistory<T extends MemberTransactionHistoryRow>(rows: T[], input: { type: "all" | "charge" | "use"; search: string; startDate?: string; endDate?: string }) {
  const keyword = input.search.trim().toLocaleLowerCase();
  const startTime = input.startDate ? new Date(`${input.startDate}T00:00:00`).getTime() : Number.NEGATIVE_INFINITY;
  const endTime = input.endDate ? new Date(`${input.endDate}T23:59:59.999`).getTime() : Number.POSITIVE_INFINITY;
  return rows
    .filter(row => input.type === "all" || row.type === input.type)
    .filter(row => !keyword || [row.gameCode, row.pgName ?? "", row.itemName ?? ""].some(value => value.toLocaleLowerCase().includes(keyword)))
    .filter(row => {
      const createdAt = new Date(row.createdAt).getTime();
      return createdAt >= startTime && createdAt <= endTime;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
