import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SectionCard } from "../../admin/components/SectionCard";
import { analyticsData } from "../../data/mockData";
import { fmtCurrency, TICK, TIP } from "../../utils/formatters";

export function DisbursementsChart() {
  return (
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
  );
}
