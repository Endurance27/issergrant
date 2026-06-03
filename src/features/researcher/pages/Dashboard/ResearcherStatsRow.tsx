import { FileText, Award, DollarSign, Megaphone } from "lucide-react";
import { StatCard } from "../../../../app/components/ui/StatCard";
import { proposals, grantCalls, awards } from "../../../../app/data/mockData";

export function ResearcherStatsRow() {
  const myProposals = proposals.filter(p => p.researcherId === 2);
  const myAwards = awards.filter(a => a.researcher === 'Prof. James Okonkwo');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="My Proposals" value={myProposals.length} icon={<FileText size={20} />} iconColor="#1A3363" iconBg="#E5EBF5" />
      <StatCard label="Approved Grants" value={myAwards.length} icon={<Award size={20} />} iconColor="#10B981" iconBg="#ECFDF5" />
      <StatCard label="Total Awarded" value={`GHS ${(myAwards.reduce((s, a) => s + a.awardedAmount, 0) / 1000).toFixed(0)}k`} icon={<DollarSign size={20} />} iconColor="#F59E0B" iconBg="#FFFBEB" />
      <StatCard label="Open Calls" value={grantCalls.filter(g => g.status === 'Open').length} icon={<Megaphone size={20} />} iconColor="#8B5CF6" iconBg="#F5F3FF" subtitle="Apply now" />
    </div>
  );
}
