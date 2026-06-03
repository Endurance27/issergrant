import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { SectionCard } from "../components/SectionCard";
import { analyticsData } from "../../data/mockData";
import { fmtCurrency, TIP } from "../../utils/formatters";

export function FundingPieChart() {
  return (
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
  );
}
