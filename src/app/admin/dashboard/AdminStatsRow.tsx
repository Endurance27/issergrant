import { FileText, Award, DollarSign, Megaphone } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { proposals, grantCalls, awards } from "../../data/mockData";
import { fmtCurrency } from "../../utils/formatters";

export function AdminStatsRow() {
  const activeAwards = awards.filter(a => a.status === 'Active');
  const totalDisbursed = awards.reduce((s, a) => s + a.disbursed, 0);
  const pendingProposals = proposals.filter(p => p.status === 'Under Review' || p.status === 'Submitted');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Active Grant Calls" value={grantCalls.filter(g => g.status === 'Open').length} icon={<Megaphone size={20} />} iconColor="#1A3363" iconBg="#E5EBF5" trend={{ value: '+2', up: true }} subtitle="2 closing this month" />
      <StatCard label="Total Proposals" value={proposals.length} icon={<FileText size={20} />} iconColor="#8B5CF6" iconBg="#F5F3FF" trend={{ value: '+5', up: true }} subtitle={`${pendingProposals.length} under review`} />
      <StatCard label="Active Awards" value={activeAwards.length} icon={<Award size={20} />} iconColor="#10B981" iconBg="#ECFDF5" trend={{ value: '+1', up: true }} subtitle={`${fmtCurrency(totalDisbursed)} disbursed`} />
      <StatCard label="Total Budget" value="GHS 2.92M" icon={<DollarSign size={20} />} iconColor="#F59E0B" iconBg="#FFFBEB" trend={{ value: '12%', up: true }} subtitle="Across all active calls" />
    </div>
  );
}
