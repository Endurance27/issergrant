import { SectionCard, ViewAllBtn } from "../../../admin/components/SectionCard";
import { grantCalls } from "../../../../app/data/mockData";
import { fmtCurrency } from "../../../../shared/utils/formatters";

interface OpenGrantCallsListProps {
  onNavigate: (p: string) => void;
}

export function OpenGrantCallsList({ onNavigate }: OpenGrantCallsListProps) {
  const openCalls = grantCalls.filter(g => g.status === 'Open');
  return (
    <SectionCard title="Open Grant Calls" subtitle="Available for application" action={<ViewAllBtn onClick={() => onNavigate('grant-calls')} />}>
      <div className="space-y-2">
        {openCalls.slice(0, 4).map(g => (
          <div key={g.id} className="p-3 rounded-xl bg-muted border border-border hover:border-primary/30 transition-colors">
            <div className="font-semibold text-xs text-foreground">{g.title}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Deadline: {g.deadline} · {fmtCurrency(g.totalBudget)}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
