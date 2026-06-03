import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  accent?: string;
}

export function PageHeader({ title, subtitle, action, accent = 'var(--primary)' }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 rounded-full mt-1 w-[4px]"
          style={{ height: subtitle ? 44 : 28, background: `linear-gradient(to bottom, ${accent}, transparent)` }}
        />
        <div>
          <h1 className="font-extrabold text-[22px] text-foreground leading-tight">{title}</h1>
          {subtitle && <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
}
