import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  trend?: { value: string; up: boolean };
  subtitle?: string;
}

export function StatCard({ label, value, icon, iconColor, iconBg, trend, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl p-5 bg-card border border-border relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-default">
      {/* Coloured accent cap */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: iconColor }} />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.06em] mb-2">
            {label}
          </div>
          <div className="font-black text-[28px] text-foreground leading-none">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-muted-foreground mt-1.5">{subtitle}</div>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.up
                ? <TrendingUp size={11} style={{ color: '#16A34A' }} />
                : <TrendingDown size={11} style={{ color: '#DC2626' }} />}
              <span className="font-bold text-[11px]" style={{ color: trend.up ? '#16A34A' : '#DC2626' }}>
                {trend.value}
              </span>
              <span className="text-[11px] text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>

        {/* Icon with glow + scale on hover */}
        <div
          className="flex items-center justify-center rounded-2xl flex-shrink-0 ml-4 group-hover:scale-110 transition-transform duration-200"
          style={{ width: 48, height: 48, background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
