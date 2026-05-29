import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted">
      <span className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{from}–{to}</span> of <span className="font-semibold text-foreground">{total}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | '…')[]>((acc, p, i, arr) => {
            if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('…');
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) => p === '…' ? (
            <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-[11px] text-muted-foreground">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-all ${page === p ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-card'}`}
            >
              {p}
            </button>
          ))
        }
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
