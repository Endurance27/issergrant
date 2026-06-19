import { useState, useMemo } from "react";

type Dir = 'asc' | 'desc';

export function useSortable<T extends Record<string, unknown>>(data: T[], defaultKey?: keyof T) {
  const [key, setKey] = useState<keyof T | null>(defaultKey ?? null);
  const [dir, setDir] = useState<Dir>('asc');

  const toggle = (k: keyof T) => {
    if (key === k) setDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setKey(k); setDir('asc'); }
  };

  const sorted = useMemo(() => {
    if (!key) return data;
    return [...data].sort((a, b) => {
      const av = a[key], bv = b[key];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return dir === 'asc' ? cmp : -cmp;
    });
  }, [data, key, dir]);

  return { sorted, sortKey: key, dir, toggle };
}
