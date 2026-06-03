import { FileText, Award, DollarSign, Megaphone, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
import { StatCard } from "../ui/StatCard";
import { Badge } from "../ui/Badge";
import { PageHeader } from "../ui/PageHeader";
import { proposals, grantCalls, awards, transactions, analyticsData, milestones } from "../../data/mockData";
import type { Role } from "../../data/mockData";

const fmtCurrency = (n: number) => `GHS ${n.toLocaleString()}`;

const TICK = { fontSize: 11, fill: 'var(--muted-foreground)' };
const TIP = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 };

function SectionCard({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-border bg-gradient-to-r from-muted/40 to-transparent">
        <div>
          <h3 className="font-bold text-sm text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ViewAllBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-ghost flex items-center gap-1 text-[11px]">
      View all <ArrowRight size={11} />
    </button>
  );
}

interface DashboardProps {
  role: Role;
  onNavigate: (page: string) => void;
}

function AdminDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const activeAwards = awards.filter(a => a.status === 'Active');
  const totalDisbursed = awards.reduce((s, a) => s + a.disbursed, 0);
  const pendingProposals = proposals.filter(p => p.status === 'Under Review' || p.status === 'Submitted');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Grant Calls" value={grantCalls.filter(g => g.status === 'Open').length} icon={<Megaphone size={20} />} iconColor="#1A3363" iconBg="#E5EBF5" trend={{ value: '+2', up: true }} subtitle="2 closing this month" />
        <StatCard label="Total Proposals" value={proposals.length} icon={<FileText size={20} />} iconColor="#8B5CF6" iconBg="#F5F3FF" trend={{ value: '+5', up: true }} subtitle={`${pendingProposals.length} under review`} />
        <StatCard label="Active Awards" value={activeAwards.length} icon={<Award size={20} />} iconColor="#10B981" iconBg="#ECFDF5" trend={{ value: '+1', up: true }} subtitle={`${fmtCurrency(totalDisbursed)} disbursed`} />
        <StatCard label="Total Budget" value="GHS 2.92M" icon={<DollarSign size={20} />} iconColor="#F59E0B" iconBg="#FFFBEB" trend={{ value: '12%', up: true }} subtitle="Across all active calls" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="Applications Overview"
          subtitle="Monthly grant applications — 2025"
          action={<span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-secondary text-primary">2025</span>}
        >
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analyticsData.monthlyApplications} barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
                <YAxis tick={TICK} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TIP} />
                <Bar dataKey="applications" name="Total" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" name="Rejected" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Funding by Category" subtitle="Awarded amounts">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={analyticsData.fundingByCategory} cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={3} dataKey="value">
                {analyticsData.fundingByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={TIP} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {analyticsData.fundingByCategory.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full inline-block w-2 h-2 flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-[11px] text-foreground">{item.name}</span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">GHS {(item.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Pending Review" action={<ViewAllBtn onClick={() => onNavigate('proposals')} />}>
          <div className="space-y-2">
            {proposals.filter(p => p.status === 'Under Review' || p.status === 'Submitted').slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.status === 'Under Review' ? '#F97316' : 'var(--primary)' }} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-foreground truncate">{p.title}</div>
                  <div className="text-[11px] text-muted-foreground">{p.researcher} · {fmtCurrency(p.requestedAmount)}</div>
                </div>
                <Badge status={p.status} size="sm" />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Milestone Activity" action={<ViewAllBtn onClick={() => onNavigate('milestones')} />}>
          <div className="space-y-2">
            {milestones.slice(0, 4).map(m => {
              const statusColor = m.status === 'Approved' ? '#22C55E' : m.status === 'Under Review' ? '#F59E0B' : '#94A3B8';
              return (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0" style={{ background: statusColor + '20', color: statusColor }}>
                    {m.status === 'Approved' ? <CheckCircle2 size={14} /> : m.status === 'Rejected' ? <XCircle size={14} /> : <Clock size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-foreground truncate">{m.title}</div>
                    <div className="text-[11px] text-muted-foreground">Due: {m.dueDate}</div>
                  </div>
                  <Badge status={m.status} size="sm" />
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function ResearcherDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const myProposals = proposals.filter(p => p.researcherId === 2);
  const myAwards = awards.filter(a => a.researcher === 'Prof. James Okonkwo');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Proposals" value={myProposals.length} icon={<FileText size={20} />} iconColor="#1A3363" iconBg="#E5EBF5" />
        <StatCard label="Approved Grants" value={myAwards.length} icon={<Award size={20} />} iconColor="#10B981" iconBg="#ECFDF5" />
        <StatCard label="Total Awarded" value={`GHS ${(myAwards.reduce((s, a) => s + a.awardedAmount, 0) / 1000).toFixed(0)}k`} icon={<DollarSign size={20} />} iconColor="#F59E0B" iconBg="#FFFBEB" />
        <StatCard label="Open Calls" value={grantCalls.filter(g => g.status === 'Open').length} icon={<Megaphone size={20} />} iconColor="#8B5CF6" iconBg="#F5F3FF" subtitle="Apply now" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="My Proposals" action={<ViewAllBtn onClick={() => onNavigate('proposals')} />}>
          <div className="space-y-2">
            {myProposals.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-foreground truncate">{p.title}</div>
                  <div className="text-[11px] text-muted-foreground">{p.grantCallTitle} · {fmtCurrency(p.requestedAmount)}</div>
                </div>
                <Badge status={p.status} size="sm" />
              </div>
            ))}
          </div>
        </SectionCard>

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
      </div>

      <SectionCard title="Upcoming Milestones" action={<ViewAllBtn onClick={() => onNavigate('milestones')} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestones.filter(m => m.researcher === 'Prof. James Okonkwo').map(m => (
            <div key={m.id} className="p-3 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <Badge status={m.status} size="sm" />
                <span className="font-mono text-[10px] text-muted-foreground">{m.dueDate}</span>
              </div>
              <div className="font-semibold text-xs text-foreground">{m.title}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{m.projectTitle}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function FinanceDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const totalAwarded = awards.reduce((s, a) => s + a.awardedAmount, 0);
  const totalDisbursed = awards.reduce((s, a) => s + a.disbursed, 0);
  const pending = transactions.filter(t => t.status === 'Pending');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Awarded" value={`GHS ${(totalAwarded / 1000).toFixed(0)}k`} icon={<Award size={20} />} iconColor="#1A3363" iconBg="#E5EBF5" />
        <StatCard label="Total Disbursed" value={`GHS ${(totalDisbursed / 1000).toFixed(0)}k`} icon={<TrendingUp size={20} />} iconColor="#10B981" iconBg="#ECFDF5" trend={{ value: '18%', up: true }} />
        <StatCard label="Remaining Funds" value={`GHS ${((totalAwarded - totalDisbursed) / 1000).toFixed(0)}k`} icon={<DollarSign size={20} />} iconColor="#F59E0B" iconBg="#FFFBEB" />
        <StatCard label="Pending Requests" value={pending.length} icon={<AlertCircle size={20} />} iconColor="#EF4444" iconBg="#FEF2F2" subtitle="Awaiting approval" />
      </div>

      <SectionCard title="Monthly Disbursements (2025)" subtitle="Total funds released per month">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={analyticsData.monthlyDisbursements}>
            <defs>
              <linearGradient id="finance-blue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `GHS ${v / 1000}k`} tick={TICK} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={TIP} />
            <Area type="monotone" dataKey="amount" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#finance-blue)" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Pending Disbursement Requests" action={<ViewAllBtn onClick={() => onNavigate('financial')} />}>
        <div className="space-y-2">
          {pending.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-foreground">{t.description}</div>
                <div className="text-[11px] text-muted-foreground">{t.projectTitle} · Requested by {t.requestedBy}</div>
              </div>
              <span className="font-mono font-semibold text-[13px] text-foreground whitespace-nowrap">{fmtCurrency(t.amount)}</span>
              <div className="flex gap-2">
                <button onClick={() => onNavigate('financial')} className="px-3 py-1 rounded-lg bg-green-500 text-white text-[11px] font-semibold transition-opacity hover:opacity-90">Approve</button>
                <button onClick={() => onNavigate('financial')} className="btn-secondary px-3 py-1 text-[11px]">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function AssistantDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const teamProposals = proposals.filter(p => p.status !== 'Draft');
  const openCalls = grantCalls.filter(g => g.status === 'Open');
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Team Proposals" value={teamProposals.length} icon={<FileText size={20} />} iconColor="#1A3363" iconBg="#E5EBF5" subtitle="All active submissions" />
        <StatCard label="Open Grant Calls" value={openCalls.length} icon={<Megaphone size={20} />} iconColor="#8B5CF6" iconBg="#F5F3FF" subtitle="Apply now" />
        <StatCard label="Pending Milestones" value={milestones.filter(m => m.status === 'Draft').length} icon={<Clock size={20} />} iconColor="#F59E0B" iconBg="#FFFBEB" subtitle="Awaiting submission" />
        <StatCard label="Approved Awards" value={awards.filter(a => a.status === 'Active').length} icon={<Award size={20} />} iconColor="#10B981" iconBg="#ECFDF5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Team Proposals" subtitle="All active submissions" action={<ViewAllBtn onClick={() => onNavigate('proposals')} />}>
          <div className="space-y-2">
            {teamProposals.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.status === 'Approved' ? '#22C55E' : p.status === 'Rejected' ? '#EF4444' : '#F97316' }} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-foreground truncate">{p.title}</div>
                  <div className="text-[11px] text-muted-foreground">{p.researcher}</div>
                </div>
                <Badge status={p.status} size="sm" />
              </div>
            ))}
          </div>
        </SectionCard>

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
      </div>

      <SectionCard title="Upcoming Milestones" action={<ViewAllBtn onClick={() => onNavigate('milestones')} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestones.filter(m => m.status === 'Draft' || m.status === 'Submitted').slice(0, 6).map(m => (
            <div key={m.id} className="p-3 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <Badge status={m.status} size="sm" />
                <span className="font-mono text-[10px] text-muted-foreground">{m.dueDate}</span>
              </div>
              <div className="font-semibold text-xs text-foreground">{m.title}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{m.researcher}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function Dashboard({ role, onNavigate }: DashboardProps) {
  const pageTitle = {
    'Admin': 'System Overview',
    'Researcher': 'My Research Hub',
    'Assistant Researcher': 'Team Workspace',
    'Finance Officer': 'Financial Overview',
  }[role];

  return (
    <div>
      <PageHeader
        title={pageTitle}
        subtitle={new Date().toLocaleDateString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      />
      {role === 'Admin' && <AdminDashboard onNavigate={onNavigate} />}
      {role === 'Researcher' && <ResearcherDashboard onNavigate={onNavigate} />}
      {role === 'Finance Officer' && <FinanceDashboard onNavigate={onNavigate} />}
      {role === 'Assistant Researcher' && <AssistantDashboard onNavigate={onNavigate} />}
    </div>
  );
}
