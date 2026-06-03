import { Badge } from "../../components/ui/Badge";
import { SectionCard, ViewAllBtn } from "../../admin/components/SectionCard";
import { milestones } from "../../data/mockData";

interface UpcomingMilestonesProps {
  onNavigate: (p: string) => void;
}

export function UpcomingMilestones({ onNavigate }: UpcomingMilestonesProps) {
  return (
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
  );
}
