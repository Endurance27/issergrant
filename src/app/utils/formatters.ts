export const fmtCurrency = (n: number) => `GHS ${n.toLocaleString()}`;

/** Formats an ISO date-time string as e.g. "12 Jul 2026, 09:30 AM". */
export const fmtDateTime = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const TICK = { fontSize: 11, fill: 'var(--muted-foreground)' };
export const TIP = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 };
