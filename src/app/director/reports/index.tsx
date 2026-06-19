import { PageHeader } from "../../components/ui/PageHeader";
import { Reports } from "../../components/pages/Reports";
import { DirectorReportCards } from "./DirectorReportCards";

export function DirectorReportsPage() {
  return (
    <div data-testid="director-reports">
      <PageHeader
        title="Organizational Reports"
        subtitle="Funding performance, proposal statistics, and budget utilization"
      />
      <DirectorReportCards />
      <div className="mt-8">
        <h2 className="font-bold text-base text-foreground mb-4">
          Project Reports
        </h2>
        <Reports role="Director" />
      </div>
    </div>
  );
}
