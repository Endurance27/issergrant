import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { SectionCard, ViewAllBtn } from "../components/SectionCard";
import { milestones } from "../../data/mockData";

interface MilestoneActivityProps {
  onNavigate: (p: string) => void;
}

export function MilestoneActivity({ onNavigate }: MilestoneActivityProps) {
  return (
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
  );
}
