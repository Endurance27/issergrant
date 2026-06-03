import { PageHeader } from "../../../../app/components/ui/PageHeader";
import { FinanceStatsRow } from "./FinanceStatsRow";
import { DisbursementsChart } from "./DisbursementsChart";
import { PendingRequestsList } from "./PendingRequestsList";

interface FinanceDashboardPageProps {
  onNavigate: (p: string) => void;
}

export function FinanceDashboardPage({ onNavigate }: FinanceDashboardPageProps) {
  return (
    <div>
      <PageHeader
        title="Financial Overview"
        subtitle={new Date().toLocaleDateString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      />
      <div className="space-y-6">
        <FinanceStatsRow />
        <DisbursementsChart />
        <PendingRequestsList onNavigate={onNavigate} />
      </div>
    </div>
  );
}
