import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SectionCard } from "../components/SectionCard";
import { analyticsData } from "../../data/mockData";
import { TICK, TIP } from "../../utils/formatters";

export function ApplicationsChart() {
  return (
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
  );
}
