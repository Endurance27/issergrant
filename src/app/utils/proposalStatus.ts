import type { StatusBadge } from "../data/mockData";

// Backend ProposalStatus is UPPER_SNAKE_CASE — map it onto the display
// labels the rest of the app (and the Badge component) already use.
const STATUS_DISPLAY: Record<string, StatusBadge> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  FUNDED: "Approved",
  ARCHIVED: "Closed" as StatusBadge,
};

export function toDisplayStatus(status: string): StatusBadge {
  return STATUS_DISPLAY[status] ?? (status as StatusBadge);
}
