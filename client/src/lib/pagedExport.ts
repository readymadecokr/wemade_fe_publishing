export type PagedResult<T> = {
  data: T[];
  total: number;
  totalPages: number;
};

export async function fetchAllPaged<T>(
  fetchPage: (page: number) => Promise<PagedResult<T>>,
  onProgress?: (current: number, total: number) => void,
  maxRows = Number.POSITIVE_INFINITY,
): Promise<{ rows: T[]; total: number }> {
  const firstPage = await fetchPage(1);
  if (firstPage.total > maxRows) {
    throw new Error(`선택한 기간의 회원이 ${maxRows.toLocaleString()}명을 초과합니다. 서버 안정성을 위해 기간을 더 좁혀 주세요.`);
  }
  const rows = [...firstPage.data];
  onProgress?.(1, firstPage.totalPages);

  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    const nextPage = await fetchPage(page);
    rows.push(...nextPage.data);
    onProgress?.(page, firstPage.totalPages);
  }

  return { rows, total: firstPage.total };
}
