import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
import { analyticsData, proposals, grantCalls, awards } from "../../data/mockData";
import { Download, FileText, CheckCircle2, BarChart3, DollarSign } from "lucide-react";
import { PageHeader } from "../ui/PageHeader";
import { StatCard } from "../ui/StatCard";
import { useToast } from "../ui/Toast";

const fmtCurrency = (n: number) => `GHS ${n.toLocaleString()}`;

const TICK = { fontSize: 11, fill: 'var(--muted-foreground)' };
const TIP = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 };

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="px-5 pt-5 pb-3 border-b border-border bg-gradient-to-r from-muted/40 to-transparent">
        <h3 className="font-bold text-sm text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Analytics() {
  const { toast } = useToast();
  const { approvalRate, totalFunding, byStatus } = useMemo(() => {
    const byStatus = proposals.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const approvalRate = Math.round(((byStatus['Approved'] || 0) / proposals.length) * 100);
    const totalFunding = awards.reduce((s, a) => s + a.awardedAmount, 0);
    return { approvalRate, totalFunding, byStatus };
  }, []);

  return (
    <div>
      <PageHeader
        title="Analytics & Reports"
        subtitle="System-wide performance and funding insights"
        action={
          <button onClick={() => toast('Exporting analytics report...', 'info')} className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-[13px] bg-card border border-border hover:bg-muted transition-colors">
            <Download size={15} /> Export Report
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Proposals" value={proposals.length} icon={<FileText size={20} />} iconColor="#1A3363" iconBg="#E5EBF5" subtitle={`${byStatus['Approved'] || 0} approved`} />
        <StatCard label="Approval Rate" value={`${approvalRate}%`} icon={<CheckCircle2 size={20} />} iconColor="#22C55E" iconBg="#ECFDF5" subtitle="Of all submitted proposals" />
        <StatCard label="Active Grant Calls" value={grantCalls.filter(g => g.status === 'Open').length} icon={<BarChart3 size={20} />} iconColor="#8B5CF6" iconBg="#F5F3FF" subtitle={`${grantCalls.length} total calls`} />
        <StatCard label="Total Funding" value={`GHS ${(totalFunding / 1000).toFixed(0)}k`} icon={<DollarSign size={20} />} iconColor="#F59E0B" iconBg="#FFFBEB" subtitle={`Across ${awards.length} projects`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Application Trends" subtitle="Applications received, approved, and rejected per month">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analyticsData.monthlyApplications} barSize={18} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
                <YAxis tick={TICK} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TIP} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="applications" name="Applications" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" name="Rejected" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Funding Distribution" subtitle="By research category">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={analyticsData.fundingByCategory} cx="50%" cy="50%" outerRadius={70} paddingAngle={2} dataKey="value">
                {analyticsData.fundingByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={TIP} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {analyticsData.fundingByCategory.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full inline-block flex-shrink-0" style={{ width: 8, height: 8, background: item.color }} />
                  <span className="text-[11px] text-foreground">{item.name}</span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">GHS {(item.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Monthly Disbursements" subtitle="Funds released per month in 2025">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={analyticsData.monthlyDisbursements}>
              <defs>
                <linearGradient id="areablue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `GHS ${v / 1000}k`} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={TIP} />
              <Area type="monotone" dataKey="amount" name="Disbursed" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#areablue)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Proposal Status Breakdown">
          <div className="space-y-3">
            {[
              { label: 'Approved',     count: byStatus['Approved'] || 0,     color: '#22C55E' },
              { label: 'Under Review', count: byStatus['Under Review'] || 0, color: '#F97316' },
              { label: 'Submitted',    count: byStatus['Submitted'] || 0,    color: 'var(--chart-1)' },
              { label: 'Draft',        count: byStatus['Draft'] || 0,        color: '#94A3B8' },
              { label: 'Rejected',     count: byStatus['Rejected'] || 0,     color: '#EF4444' },
            ].map(item => {
              const pct = Math.round((item.count / proposals.length) * 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: item.color }} />
                      <span className="text-[13px] text-foreground font-semibold">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{item.count}</span>
                      <span className="font-mono text-[11px] font-bold" style={{ color: item.color }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="rounded-full overflow-hidden bg-muted" style={{ height: 6 }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: item.color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Overall approval rate</span>
            <span className="font-mono font-semibold text-sm" style={{ color: '#22C55E' }}>{approvalRate}%</span>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
