import { Award, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { Badge } from "../ui/Badge";
import { StatCard } from "../ui/StatCard";
import { PageHeader } from "../ui/PageHeader";
import { awards } from "../../data/mockData";
import type { Role } from "../../data/mockData";

const fmtCurrency = (n: number) => `GHS ${n.toLocaleString()}`;

interface AwardsProps { role: Role; }

export function Awards({ role: _role }: AwardsProps) {
  const totalAwarded = awards.reduce((s, a) => s + a.awardedAmount, 0);
  const totalDisbursed = awards.reduce((s, a) => s + a.disbursed, 0);

  return (
    <div>
      <PageHeader
        title="Awards & Funding"
        subtitle={`${awards.filter(a => a.status === 'Active').length} active awarded projects`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Awarded" value={fmtCurrency(totalAwarded)} icon={<Award size={20} />} iconColor="#1A3363" iconBg="#E5EBF5" />
        <StatCard label="Total Disbursed" value={fmtCurrency(totalDisbursed)} icon={<TrendingUp size={20} />} iconColor="#10B981" iconBg="#ECFDF5" />
        <StatCard label="Remaining" value={fmtCurrency(totalAwarded - totalDisbursed)} icon={<DollarSign size={20} />} iconColor="#F59E0B" iconBg="#FFFBEB" />
        <StatCard label="Active Projects" value={awards.filter(a => a.status === 'Active').length} icon={<Calendar size={20} />} iconColor="#8B5CF6" iconBg="#F5F3FF" />
      </div>

      <div className="space-y-4">
        {awards.map(award => {
          const pct = Math.round((award.disbursed / award.awardedAmount) * 100);
          const isActive = award.status === 'Active';
          return (
            <div key={award.id} className="rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              style={{ borderLeftWidth: 4, borderLeftColor: isActive ? '#22C55E' : '#94A3B8' }}>
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{award.id}</span>
                      <Badge status={award.status} size="sm" />
                    </div>
                    <h3 className="font-bold text-[15px] text-foreground mb-1">{award.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      PI: <span className="text-foreground font-semibold">{award.researcher}</span> &nbsp;·&nbsp; {award.startDate} → {award.endDate}
                    </p>
                  </div>
                  <div className="sm:text-right flex-shrink-0 bg-muted rounded-xl px-4 py-2">
                    <div className="font-mono font-black text-[18px] text-foreground">{fmtCurrency(award.awardedAmount)}</div>
                    <div className="text-[11px] text-muted-foreground">Total Award</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Disbursement Progress</span>
                    <span className="font-mono font-bold text-xs" style={{ color: pct >= 80 ? '#F59E0B' : '#10B981' }}>{pct}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden bg-muted" style={{ height: 8 }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: pct >= 100 ? 'linear-gradient(to right,#22C55E,#4ADE80)' : 'linear-gradient(to right,var(--primary),#2D6EA8)' }} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted-foreground">Disbursed: <span className="font-semibold" style={{ color: '#22C55E' }}>{fmtCurrency(award.disbursed)}</span></span>
                    <span className="text-[11px] text-muted-foreground">Remaining: <span className="font-semibold" style={{ color: '#F59E0B' }}>{fmtCurrency(award.remaining)}</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                  {[
                    { label: 'Personnel', pct: 45, color: 'var(--primary)' },
                    { label: 'Equipment', pct: 35, color: '#8B5CF6' },
                    { label: 'Operations', pct: 20, color: '#10B981' },
                  ].map(cat => (
                    <div key={cat.label} className="text-center p-3 rounded-xl bg-muted">
                      <div className="font-mono font-bold text-sm" style={{ color: cat.color }}>{cat.pct}%</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{cat.label}</div>
                      <div className="mt-2 rounded-full overflow-hidden bg-border" style={{ height: 3 }}>
                        <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: cat.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
