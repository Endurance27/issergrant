import { PageHeader } from "../../../../app/components/ui/PageHeader";
import { AdminStatsRow } from "./AdminStatsRow";
import { ApplicationsChart } from "./ApplicationsChart";
import { FundingPieChart } from "./FundingPieChart";
import { PendingReviewList } from "./PendingReviewList";
import { MilestoneActivity } from "./MilestoneActivity";

interface AdminDashboardPageProps {
  onNavigate: (p: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  return (
    <div>
      <PageHeader
        title="System Overview"
        subtitle={new Date().toLocaleDateString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      />
      <div className="space-y-6">
        <AdminStatsRow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ApplicationsChart />
          <FundingPieChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PendingReviewList onNavigate={onNavigate} />
          <MilestoneActivity onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
