import { Megaphone, FileText, CheckCircle2, XCircle, Award, Wallet, Send } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { grantCalls, proposals, awards } from "../../data/mockData";
import { fmtCurrency } from "../../utils/formatters";
import { useAllSubmittedProposals } from "../../../hooks/useDirectorProposals";

export function DirectorStatsRow() {
  const approved = proposals.filter((p) => p.status === "Approved").length;
  const rejected = proposals.filter((p) => p.status === "Rejected").length;
  const totalCommitted = grantCalls.reduce((s, g) => s + g.totalBudget, 0);
  const totalAwarded = awards.reduce((s, a) => s + a.awardedAmount, 0);
  const availableBudget = totalCommitted - totalAwarded;
  const { proposals: submittedProposals, loading: submittedLoading } = useAllSubmittedProposals();

  return (
    <div
      data-testid="director-stats-row"
      className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4"
    >
      <StatCard
        label="Submitted Proposals"
        value={submittedLoading ? '—' : submittedProposals.length}
        icon={<Send size={18} />}
        iconColor="#2563EB"
        iconBg="#EFF6FF"
        subtitle="All submitted"
      />
      <StatCard
        label="Funding Calls"
        value={grantCalls.length}
        icon={<Megaphone size={18} />}
        iconColor="#1A3363"
        iconBg="#E5EBF5"
        subtitle={`${grantCalls.filter((g) => g.status === "Open").length} open`}
      />
      <StatCard
        label="Total Proposals"
        value={proposals.length}
        icon={<FileText size={18} />}
        iconColor="#8B5CF6"
        iconBg="#F5F3FF"
        subtitle={`${proposals.filter((p) => p.status === "Under Review").length} under review`}
      />
      <StatCard
        label="Approved Proposals"
        value={approved}
        icon={<CheckCircle2 size={18} />}
        iconColor="#10B981"
        iconBg="#ECFDF5"
        subtitle={`${Math.round((approved / proposals.length) * 100)}% approval rate`}
      />
      <StatCard
        label="Rejected Proposals"
        value={rejected}
        icon={<XCircle size={18} />}
        iconColor="#EF4444"
        iconBg="#FEF2F2"
        subtitle={`${Math.round((rejected / proposals.length) * 100)}% of total`}
      />
      <StatCard
        label="Total Awards"
        value={awards.length}
        icon={<Award size={18} />}
        iconColor="#F59E0B"
        iconBg="#FFFBEB"
        subtitle={fmtCurrency(totalAwarded)}
      />
      <StatCard
        label="Available Budget"
        value={fmtCurrency(availableBudget)}
        icon={<Wallet size={18} />}
        iconColor="#2D6EA8"
        iconBg="#EAF0F6"
        subtitle="Across open funding calls"
      />
    </div>
  );
}
