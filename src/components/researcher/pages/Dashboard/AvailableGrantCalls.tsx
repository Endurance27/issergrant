import { Badge } from "../../../../app/components/ui/Badge";
import { SectionCard } from "../../../admin/components/SectionCard";
import { grantCalls } from "../../../../app/data/mockData";
import { fmtCurrency } from "../../../../shared/utils/formatters";

export function AvailableGrantCalls() {
  return (
    <SectionCard title="Available Grant Calls" subtitle="Open opportunities">
      <div className="space-y-2">
        {grantCalls.filter(g => g.status === 'Open').slice(0, 4).map(g => (
          <div key={g.id} className="p-3 rounded-xl bg-muted border border-border hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-foreground">{g.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Deadline: {g.deadline} · {fmtCurrency(g.totalBudget)}</div>
              </div>
              <Badge status={g.status} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
