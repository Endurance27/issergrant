import { SectionCard } from "../../admin/components/SectionCard";
import { proposals, awards } from "../../data/mockData";
import { fmtCurrency } from "../../utils/formatters";

interface DepartmentStat {
  department: string;
  proposalCount: number;
  approvedCount: number;
  requestedTotal: number;
  awardedTotal: number;
}

function buildDepartmentStats(): DepartmentStat[] {
  const byDept = new Map<string, DepartmentStat>();

  for (const p of proposals) {
    const entry =
      byDept.get(p.department) ??
      {
        department: p.department,
        proposalCount: 0,
        approvedCount: 0,
        requestedTotal: 0,
        awardedTotal: 0,
      };
    entry.proposalCount += 1;
    entry.requestedTotal += p.requestedAmount;
    if (p.status === "Approved") entry.approvedCount += 1;
    byDept.set(p.department, entry);
  }

  for (const a of awards) {
    const proposal = proposals.find((p) => p.id === a.proposalId);
    if (!proposal) continue;
    const entry = byDept.get(proposal.department);
    if (entry) entry.awardedTotal += a.awardedAmount;
  }

  return [...byDept.values()].sort((a, b) => b.awardedTotal - a.awardedTotal);
}

export function DepartmentStatsPanel() {
  const stats = buildDepartmentStats();
  const maxAwarded = Math.max(1, ...stats.map((s) => s.awardedTotal));

  return (
    <SectionCard
      title="Department Statistics"
      subtitle="Proposal volume and funding by department"
    >
      <div className="space-y-4" data-testid="department-stats">
        {stats.map((s) => (
          <div key={s.department}>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className="font-semibold text-[13px] text-foreground">
                  {s.department}
                </span>
                <span className="text-[11px] text-muted-foreground ml-2">
                  {s.proposalCount} proposal{s.proposalCount !== 1 ? "s" : ""} ·{" "}
                  {s.approvedCount} approved
                </span>
              </div>
              <span className="font-mono font-bold text-xs text-foreground">
                {fmtCurrency(s.awardedTotal)}
              </span>
            </div>
            <div className="rounded-full overflow-hidden bg-muted h-1.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(s.awardedTotal / maxAwarded) * 100}%`,
                  background: "linear-gradient(to right, var(--primary), #2D6EA8)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
