import { PageHeader } from "../../components/ui/PageHeader";
import { AssistantStatsRow } from "./AssistantStatsRow";
import { TeamProposalsList } from "./TeamProposalsList";
import { OpenGrantCallsList } from "./OpenGrantCallsList";
import { UpcomingMilestones } from "./UpcomingMilestones";

interface AssistantDashboardPageProps {
  onNavigate: (p: string) => void;
}

export function AssistantDashboardPage({ onNavigate }: AssistantDashboardPageProps) {
  return (
    <div>
      <PageHeader
        title="Team Workspace"
        subtitle={new Date().toLocaleDateString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      />
      <div className="space-y-6">
        <AssistantStatsRow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TeamProposalsList onNavigate={onNavigate} />
          <OpenGrantCallsList onNavigate={onNavigate} />
        </div>
        <UpcomingMilestones onNavigate={onNavigate} />
      </div>
    </div>
  );
}
