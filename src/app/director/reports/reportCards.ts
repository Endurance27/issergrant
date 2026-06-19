export interface DirectorReportCard {
  id: string;
  title: string;
  description: string;
  lastGenerated: string;
  format: string;
  metrics: { label: string; value: string }[];
}

export const directorReportCards: DirectorReportCard[] = [
  {
    id: "RPT-DIR-001",
    title: "Funding Performance Report",
    description:
      "Overview of funding call performance, application volume, and award conversion rates across all open and closed calls.",
    lastGenerated: "2025-06-01",
    format: "PDF",
    metrics: [
      { label: "Calls Published", value: "6" },
      { label: "Total Applications", value: "44" },
      { label: "Conversion Rate", value: "38%" },
    ],
  },
  {
    id: "RPT-DIR-002",
    title: "Proposal Statistics Report",
    description:
      "Breakdown of proposal submissions, approval and rejection rates, and turnaround times by department.",
    lastGenerated: "2025-06-05",
    format: "XLSX",
    metrics: [
      { label: "Total Proposals", value: "7" },
      { label: "Approved", value: "2" },
      { label: "Avg. Review Time", value: "9 days" },
    ],
  },
  {
    id: "RPT-DIR-003",
    title: "Budget Utilization Report",
    description:
      "Tracks budget allocation, disbursement progress, and remaining balances across all active awards.",
    lastGenerated: "2025-06-10",
    format: "PDF",
    metrics: [
      { label: "Total Awarded", value: "GHS 470,000" },
      { label: "Disbursed", value: "GHS 253,500" },
      { label: "Utilization", value: "54%" },
    ],
  },
  {
    id: "RPT-DIR-004",
    title: "Department Analysis Report",
    description:
      "Comparative analysis of research output, proposal volume, and funding secured across departments.",
    lastGenerated: "2025-06-12",
    format: "PDF",
    metrics: [
      { label: "Departments Tracked", value: "4" },
      { label: "Top Department", value: "Biomedical Eng." },
      { label: "Funding Spread", value: "Even" },
    ],
  },
];
