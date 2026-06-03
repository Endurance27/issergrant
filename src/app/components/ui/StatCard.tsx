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
          <div className="font-bold text-[20px] text-foreground leading-none">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-muted-foreground mt-1.5">{subtitle}</div>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.up
                ? <TrendingUp size={11} className="text-green-600" />
                : <TrendingDown size={11} className="text-red-600" />}
              <span className={`font-bold text-[11px] ${trend.up ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}
              </span>
              <span className="text-[11px] text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>

        {/* Icon with glow + scale on hover */}
        <div
          className="flex items-center justify-center w-12 h-12 rounded-2xl flex-shrink-0 ml-4 group-hover:scale-110 transition-transform duration-200"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
