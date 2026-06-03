import { Award, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { awards, transactions } from "../../data/mockData";

export function FinanceStatsRow() {
  const totalAwarded = awards.reduce((s, a) => s + a.awardedAmount, 0);
  const totalDisbursed = awards.reduce((s, a) => s + a.disbursed, 0);
  const pending = transactions.filter(t => t.status === 'Pending');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Awarded" value={`GHS ${(totalAwarded / 1000).toFixed(0)}k`} icon={<Award size={20} />} iconColor="#1A3363" iconBg="#E5EBF5" />
      <StatCard label="Total Disbursed" value={`GHS ${(totalDisbursed / 1000).toFixed(0)}k`} icon={<TrendingUp size={20} />} iconColor="#10B981" iconBg="#ECFDF5" trend={{ value: '18%', up: true }} />
      <StatCard label="Remaining Funds" value={`GHS ${((totalAwarded - totalDisbursed) / 1000).toFixed(0)}k`} icon={<DollarSign size={20} />} iconColor="#F59E0B" iconBg="#FFFBEB" />
      <StatCard label="Pending Requests" value={pending.length} icon={<AlertCircle size={20} />} iconColor="#EF4444" iconBg="#FEF2F2" subtitle="Awaiting approval" />
    </div>
  );
}
