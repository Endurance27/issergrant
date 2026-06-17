import { PageHeader } from "../../components/ui/PageHeader";
import { DirectorStatsRow } from "./DirectorStatsRow";
import { RecentProposalsTable } from "./RecentProposalsTable";
import { FundingDistributionChart } from "./FundingDistributionChart";
import { DepartmentStatsPanel } from "./DepartmentStatsPanel";

interface DirectorDashboardPageProps {
  onNavigate: (page: string) => void;
}

export function DirectorDashboardPage({ onNavigate }: DirectorDashboardPageProps) {
  return (
    <div data-testid="director-dashboard">
      <PageHeader
        title="Director Overview"
        subtitle={new Date().toLocaleDateString("en-GH", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      />
      <div className="space-y-6">
        <DirectorStatsRow />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentProposalsTable onNavigate={onNavigate} />
          </div>
          <FundingDistributionChart />
        </div>
        <DepartmentStatsPanel />
      </div>
    </div>
  );
}
