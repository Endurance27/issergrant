import { PageHeader } from "../../components/ui/PageHeader";
import { ResearcherStatsRow } from "./ResearcherStatsRow";
import { MyProposalsList } from "./MyProposalsList";
import { CoPiProjectsList } from "./CoPiProjectsList";
import { AvailableGrantCalls } from "./AvailableGrantCalls";
import { UpcomingMilestones } from "./UpcomingMilestones";

interface ResearcherDashboardPageProps {
  onNavigate: (p: string) => void;
}

export function ResearcherDashboardPage({ onNavigate }: ResearcherDashboardPageProps) {
  return (
    <div>
      <PageHeader
        title="My Research Hub"
        subtitle={new Date().toLocaleDateString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      />
      <div className="space-y-6">
        <ResearcherStatsRow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MyProposalsList onNavigate={onNavigate} />
          <CoPiProjectsList onNavigate={onNavigate} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AvailableGrantCalls />
          <UpcomingMilestones onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
