import type { StatusBadge } from "../data/mockData";

// Backend ProposalStatus enum values are lowercase snake_case (e.g.
// "under_review") — map them onto the display labels the rest of the app
// (and the Badge component) already use.
const STATUS_DISPLAY: Record<string, StatusBadge> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  funded: "Approved",
  archived: "Closed" as StatusBadge,
};

export function toDisplayStatus(status: string): StatusBadge {
  return STATUS_DISPLAY[status] ?? (status as StatusBadge);
}
