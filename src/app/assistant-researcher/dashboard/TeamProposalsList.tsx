import { Badge } from "../../components/ui/Badge";
import { SectionCard, ViewAllBtn } from "../../admin/components/SectionCard";
import { proposals } from "../../data/mockData";

interface TeamProposalsListProps {
  onNavigate: (p: string) => void;
}

export function TeamProposalsList({ onNavigate }: TeamProposalsListProps) {
  const teamProposals = proposals.filter(p => p.status !== 'Draft');
  return (
    <SectionCard title="Team Proposals" subtitle="All active submissions" action={<ViewAllBtn onClick={() => onNavigate('proposals')} />}>
      <div className="space-y-2">
        {teamProposals.slice(0, 5).map(p => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.status === 'Approved' ? '#22C55E' : p.status === 'Rejected' ? '#EF4444' : '#F97316' }} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-foreground truncate">{p.title}</div>
              <div className="text-[11px] text-muted-foreground">{p.researcher}</div>
            </div>
            <Badge status={p.status} size="sm" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
