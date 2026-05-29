import { useEffect, useRef } from "react";
import { Search, FileText, Megaphone, Award, Users, X } from "lucide-react";
import { proposals, grantCalls, awards, users } from "../../data/mockData";
import { Badge } from "./Badge";

const fmtCurrency = (n: number) => `GHS ${n.toLocaleString()}`;

interface SearchOverlayProps {
  query: string;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

interface Result {
  type: 'proposal' | 'grant' | 'award' | 'user';
  id: string | number;
  title: string;
  subtitle: string;
  status?: string;
  page: string;
}

const icons = {
  proposal: <FileText size={15} />,
  grant: <Megaphone size={15} />,
  award: <Award size={15} />,
  user: <Users size={15} />,
};

const typeColors = {
  proposal: 'var(--primary)',
  grant: '#F97316',
  award: '#22C55E',
  user: '#B79A64',
};

const typeLabels = {
  proposal: 'Proposal',
  grant: 'Grant Call',
  award: 'Award',
  user: 'User',
};

export function SearchOverlay({ query, onClose, onNavigate }: SearchOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const q = query.toLowerCase().trim();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!q) return null;

  const results: Result[] = [
    ...proposals
      .filter(p => p.title.toLowerCase().includes(q) || p.researcher.toLowerCase().includes(q) || p.department.toLowerCase().includes(q))
      .slice(0, 4)
      .map(p => ({ type: 'proposal' as const, id: p.id, title: p.title, subtitle: `${p.researcher} · ${p.department}`, status: p.status, page: 'proposals' })),
    ...grantCalls
      .filter(g => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q))
      .slice(0, 3)
      .map(g => ({ type: 'grant' as const, id: g.id, title: g.title, subtitle: `${g.category} · Deadline ${g.deadline}`, status: g.status, page: 'grant-calls' })),
    ...awards
      .filter(a => a.title.toLowerCase().includes(q) || a.researcher.toLowerCase().includes(q))
      .slice(0, 3)
      .map(a => ({ type: 'award' as const, id: a.id, title: a.title, subtitle: `${a.researcher} · ${fmtCurrency(a.awardedAmount)}`, status: a.status, page: 'awards' })),
    ...users
      .filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q))
      .slice(0, 3)
      .map(u => ({ type: 'user' as const, id: u.id, title: u.name, subtitle: `${u.role} · ${u.department}`, status: u.status, page: 'users' })),
  ];

  const grouped = ['proposal', 'grant', 'award', 'user'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
      <div
        ref={ref}
        className="relative w-full max-w-lg rounded-xl shadow-2xl overflow-hidden bg-card border border-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-foreground flex-1">
            Results for <strong>"{query}"</strong>
          </span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 460, scrollbarWidth: 'none' }}>
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Search size={28} className="text-muted-foreground opacity-30 mb-2.5" />
              <div className="font-bold text-sm text-foreground">No results found</div>
              <div className="text-[13px] text-muted-foreground mt-1">Try a different search term</div>
            </div>
          ) : (
            grouped.map(type => {
              const group = results.filter(r => r.type === type);
              if (!group.length) return null;
              return (
                <div key={type}>
                  <div className="px-4 py-2 border-b border-border bg-muted">
                    <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-[0.06em]">
                      {typeLabels[type]}s
                    </span>
                  </div>
                  {group.map(result => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => { onNavigate(result.page); onClose(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border hover:bg-muted"
                    >
                      <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: typeColors[result.type] + '15', color: typeColors[result.type] }}>
                        {icons[result.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] text-foreground truncate">{result.title}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{result.subtitle}</div>
                      </div>
                      {result.status && <Badge status={result.status} size="sm" />}
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-border bg-muted">
          <span className="text-[11px] text-muted-foreground">
            {results.length} result{results.length !== 1 ? 's' : ''} · Press <kbd className="bg-border px-1.5 py-0.5 rounded font-mono text-[10px]">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
