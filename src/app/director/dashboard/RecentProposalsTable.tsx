import { Badge } from "../../components/ui/Badge";
import { SectionCard, ViewAllBtn } from "../../admin/components/SectionCard";
import { proposals } from "../../data/mockData";
import { fmtCurrency } from "../../utils/formatters";

interface RecentProposalsTableProps {
  onNavigate: (page: string) => void;
}

export function RecentProposalsTable({ onNavigate }: RecentProposalsTableProps) {
  const recent = [...proposals]
    .sort((a, b) => new Date(b.submitted).getTime() - new Date(a.submitted).getTime())
    .slice(0, 5);

  return (
    <SectionCard
      title="Recent Proposals"
      subtitle="Latest submissions across all departments"
      action={<ViewAllBtn onClick={() => onNavigate("proposals")} />}
    >
      {recent.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          No proposals submitted yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="recent-proposals-table">
            <thead>
              <tr className="border-b border-border">
                {["Title", "PI", "Department", "Amount", "Status", "Submitted"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.05em] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recent.map((p) => (
                <tr key={p.id} className="hover:bg-muted transition-colors">
                  <td className="px-2 py-2.5 max-w-[200px]">
                    <span className="font-semibold text-[12px] text-foreground truncate block">
                      {p.title}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 whitespace-nowrap">
                    <span className="text-[12px] text-foreground">{p.researcher}</span>
                  </td>
                  <td className="px-2 py-2.5 whitespace-nowrap">
                    <span className="text-[11px] text-muted-foreground">
                      {p.department}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 whitespace-nowrap">
                    <span className="font-mono font-semibold text-[12px] text-foreground">
                      {fmtCurrency(p.requestedAmount)}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <Badge status={p.status} size="sm" />
                  </td>
                  <td className="px-2 py-2.5 whitespace-nowrap">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {p.submitted}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
