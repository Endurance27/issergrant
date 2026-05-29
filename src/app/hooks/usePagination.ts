import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(data: T[], pageSize = 8) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [data.length, totalPages, page]);

  const paginated = useMemo(
    () => data.slice((page - 1) * pageSize, page * pageSize),
    [data, page, pageSize]
  );

  return { paginated, page, totalPages, setPage };
}
