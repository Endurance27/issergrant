import { ArrowRight } from "lucide-react";

export function SectionCard({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
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

export function ViewAllBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-ghost flex items-center gap-1 text-[11px]">
      View all <ArrowRight size={11} />
    </button>
  );
}
