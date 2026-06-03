import { FileText, Megaphone, Clock, Award } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { proposals, grantCalls, milestones, awards } from "../../data/mockData";

export function AssistantStatsRow() {
  const teamProposals = proposals.filter(p => p.status !== 'Draft');
  const openCalls = grantCalls.filter(g => g.status === 'Open');
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Team Proposals" value={teamProposals.length} icon={<FileText size={20} />} iconColor="#1A3363" iconBg="#E5EBF5" subtitle="All active submissions" />
      <StatCard label="Open Grant Calls" value={openCalls.length} icon={<Megaphone size={20} />} iconColor="#8B5CF6" iconBg="#F5F3FF" subtitle="Apply now" />
      <StatCard label="Pending Milestones" value={milestones.filter(m => m.status === 'Draft').length} icon={<Clock size={20} />} iconColor="#F59E0B" iconBg="#FFFBEB" subtitle="Awaiting submission" />
      <StatCard label="Approved Awards" value={awards.filter(a => a.status === 'Active').length} icon={<Award size={20} />} iconColor="#10B981" iconBg="#ECFDF5" />
    </div>
  );
}
