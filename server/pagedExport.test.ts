import { describe, expect, it } from "vitest";
import { fetchAllPaged } from "../client/src/lib/pagedExport";

describe("fetchAllPaged", () => {
  it("collects every page and reports progress for a multi-page export", async () => {
    const pages = [[1, 2], [3, 4], [5]];
    const progress: string[] = [];

    const result = await fetchAllPaged(
      async (page) => ({ data: pages[page - 1], total: 5, totalPages: 3 }),
      (current, total) => progress.push(`${current}/${total}`),
    );

    expect(result).toEqual({ rows: [1, 2, 3, 4, 5], total: 5 });
    expect(progress).toEqual(["1/3", "2/3", "3/3"]);
  });

  it("stops before requesting later pages when the export exceeds the safety limit", async () => {
    const fetchPage = async () => ({ data: [1], total: 501, totalPages: 501 });

    await expect(fetchAllPaged(fetchPage, undefined, 500)).rejects.toThrow("500명을 초과");
  });
});
