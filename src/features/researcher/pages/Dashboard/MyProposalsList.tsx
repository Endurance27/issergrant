import { Badge } from "../../../../app/components/ui/Badge";
import { SectionCard, ViewAllBtn } from "../../../admin/components/SectionCard";
import { proposals } from "../../../../app/data/mockData";
import { fmtCurrency } from "../../../../shared/utils/formatters";

interface MyProposalsListProps {
  onNavigate: (p: string) => void;
}

export function MyProposalsList({ onNavigate }: MyProposalsListProps) {
  const myProposals = proposals.filter(p => p.researcherId === 2);
  return (
    <SectionCard title="My Proposals" action={<ViewAllBtn onClick={() => onNavigate('proposals')} />}>
      <div className="space-y-2">
        {myProposals.map(p => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-foreground truncate">{p.title}</div>
              <div className="text-[11px] text-muted-foreground">{p.grantCallTitle} · {fmtCurrency(p.requestedAmount)}</div>
            </div>
            <Badge status={p.status} size="sm" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
