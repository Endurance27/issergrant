import { Badge } from "../../components/ui/Badge";
import { SectionCard, ViewAllBtn } from "../components/SectionCard";
import { proposals } from "../../data/mockData";
import { fmtCurrency } from "../../utils/formatters";

interface PendingReviewListProps {
  onNavigate: (p: string) => void;
}

export function PendingReviewList({ onNavigate }: PendingReviewListProps) {
  return (
    <SectionCard title="Pending Review" action={<ViewAllBtn onClick={() => onNavigate('proposals')} />}>
      <div className="space-y-2">
        {proposals.filter(p => p.status === 'Under Review' || p.status === 'Submitted').slice(0, 4).map(p => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.status === 'Under Review' ? '#F97316' : 'var(--primary)' }} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-foreground truncate">{p.title}</div>
              <div className="text-[11px] text-muted-foreground">{p.researcher} · {fmtCurrency(p.requestedAmount)}</div>
            </div>
            <Badge status={p.status} size="sm" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
