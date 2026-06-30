import { useState, useMemo } from "react";
import {
  Search,
  FileText,
  X,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { StatCard } from "../../components/ui/StatCard";
import { usePagination } from "../../../hooks/usePagination";
import { useAllSubmittedProposals } from "../../../hooks/useDirectorProposals";
import {
  useApproveProposal,
  useRejectProposal,
  useRequestRevision,
} from "../../../hooks/useProposalReview";
import { toDisplayStatus } from "../../utils/proposalStatus";
import type { ProposalRecord, ProposalReview } from "../../../types/proposal.types";

// ── Constants ─────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  "Macroeconomic Policy",
  "Trade and Development",
  "Public Finance",
  "Poverty and Inequality",
  "Labour Economics",
  "Education",
  "Health",
  "Gender Studies",
  "Governance",
  "Social Protection and Development Policy",
  "Survey Design and Implementation",
  "Statistical Analysis",
  "Data Management",
  "Research Methods and Data Visualization",
];

const STATUSES = ["All", "Submitted", "Under Review", "Approved", "Rejected", "Revised"];

const REVIEWABLE_STATUSES = new Set(["submitted", "under_review"]);

const fmtCurrency = (n: number) =>
  `GHS ${n.toLocaleString("en-GH", { minimumFractionDigits: 0 })}`;

const fmtDate = (iso: string | boolean | undefined | null): string => {
  if (!iso || typeof iso === "boolean") return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-GH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fmtDateTime = (iso: string | undefined | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="bg-card border-b border-border animate-pulse">
      {[220, 120, 160, 100, 100].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 rounded bg-muted" style={{ width: w }} />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="h-7 w-20 rounded-lg bg-muted" />
      </td>
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-card border border-border p-4 space-y-2.5 animate-pulse">
      <div className="flex justify-between">
        <div className="h-2.5 w-24 rounded bg-muted" />
        <div className="h-5 w-20 rounded-full bg-muted" />
      </div>
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-3 w-1/2 rounded bg-muted" />
      <div className="flex justify-between">
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-3 w-1/4 rounded bg-muted" />
      </div>
    </div>
  );
}

// ── Review badge helpers ───────────────────────────────────────────────────────

const DECISION_CONFIG = {
  approved: {
    color: "#22C55E",
    label: "Approved",
    icon: <CheckCircle2 size={13} className="text-green-500" />,
    bg: "#22C55E18",
  },
  rejected: {
    color: "#EF4444",
    label: "Rejected",
    icon: <XCircle size={13} className="text-red-500" />,
    bg: "#EF444418",
  },
  revised: {
    color: "#A855F7",
    label: "Revision Requested",
    icon: <RotateCcw size={13} className="text-purple-500" />,
    bg: "#A855F718",
  },
} as const;

// ── Existing Reviews list ─────────────────────────────────────────────────────

function ReviewsList({ reviews }: { reviews: ProposalReview[] }) {
  if (reviews.length === 0) return null;
  return (
    <div>
      <div className="font-bold text-[13px] text-foreground mb-2">
        Director Reviews ({reviews.length})
      </div>
      <div className="space-y-3">
        {reviews.map((r) => {
          const cfg = DECISION_CONFIG[r.decision] ?? DECISION_CONFIG.approved;
          return (
            <div key={r.id} className="flex gap-3">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 mt-0.5"
                style={{ background: cfg.bg }}
              >
                {cfg.icon}
              </div>
              <div className="flex-1 p-3 rounded-xl bg-muted">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                  <span className="font-bold text-xs" style={{ color: cfg.color }}>
                    {cfg.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">
                      {r.director.name}
                    </span>
                    <Clock size={11} className="text-muted-foreground" />
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {fmtDateTime(r.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-foreground leading-relaxed">{r.comment}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Inline review form ────────────────────────────────────────────────────────

type ReviewAction = "approve" | "reject" | "revision";

const ACTION_CONFIG: Record<
  ReviewAction,
  { label: string; btnLabel: string; placeholder: string; color: string; commentLabel: string }
> = {
  approve: {
    label: "Approve Proposal",
    btnLabel: "Approve",
    placeholder: "Add approval notes…",
    color: "#22C55E",
    commentLabel: "Approval Notes",
  },
  reject: {
    label: "Reject Proposal",
    btnLabel: "Reject",
    placeholder: "Provide a reason for rejection…",
    color: "#EF4444",
    commentLabel: "Rejection Reason",
  },
  revision: {
    label: "Request Revision",
    btnLabel: "Request Revision",
    placeholder: "Describe what needs to be revised…",
    color: "#A855F7",
    commentLabel: "Revision Instructions",
  },
};

// ── Detail + Review Modal ─────────────────────────────────────────────────────

function ProposalDetailModal({
  proposal,
  onClose,
  onReviewSuccess,
}: {
  proposal: ProposalRecord | null;
  onClose: () => void;
  onReviewSuccess: (updated: ProposalRecord) => void;
}) {
  const [reviewAction, setReviewAction] = useState<ReviewAction | null>(null);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");

  const { approveProposal, loading: approveLoading } = useApproveProposal();
  const { rejectProposal, loading: rejectLoading } = useRejectProposal();
  const { requestRevision, loading: revisionLoading } = useRequestRevision();

  const submitting = approveLoading || rejectLoading || revisionLoading;

  const canReview = proposal != null && REVIEWABLE_STATUSES.has(proposal.status);

  const handleClose = () => {
    setReviewAction(null);
    setComment("");
    setCommentError("");
    onClose();
  };

  const handleSubmitReview = async () => {
    if (!proposal || !reviewAction) return;
    if (!comment.trim()) {
      setCommentError("A comment is required.");
      return;
    }

    let result = null;
    if (reviewAction === "approve") {
      result = await approveProposal({ id: proposal.id, comment: comment.trim() });
    } else if (reviewAction === "reject") {
      result = await rejectProposal({ id: proposal.id, reason: comment.trim() });
    } else {
      result = await requestRevision({ id: proposal.id, comment: comment.trim() });
    }

    if (result?.success && result.proposal) {
      onReviewSuccess(result.proposal as ProposalRecord);
      handleClose();
    } else if (result && !result.success) {
      setCommentError(result.message ?? "Review failed.");
    }
  };

  const startReview = (action: ReviewAction) => {
    setReviewAction(action);
    setComment("");
    setCommentError("");
  };

  return (
    <Modal
      open={!!proposal}
      onClose={handleClose}
      title={reviewAction ? ACTION_CONFIG[reviewAction].label : "Proposal Details"}
      width={680}
    >
      {proposal && (
        <div className="space-y-5 max-h-[78vh] overflow-y-auto pr-1">
          {/* Title + Status */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-extrabold text-[17px] text-foreground leading-snug flex-1">
              {proposal.title}
            </h2>
            <Badge status={toDisplayStatus(proposal.status)} />
          </div>

          {/* Abstract */}
          {!reviewAction && (
            <div className="p-4 rounded-xl bg-muted border-l-4 border-primary">
              <div className="font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.05em] mb-2">
                Abstract
              </div>
              <p className="text-[13px] text-foreground leading-relaxed whitespace-pre-wrap">
                {proposal.abstract}
              </p>
            </div>
          )}

          {/* Meta grid */}
          {!reviewAction && (
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Funding Call",
                  value: proposal.fundingCall?.theme || "—",
                },
                {
                  label: "Requested Amount",
                  value: fmtCurrency(proposal.requestedAmount ?? 0.0),
                },
                { label: "Submitted At", value: fmtDateTime(proposal.submittedAt) },
                { label: "Last Updated", value: fmtDate(proposal.updatedAt) },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-muted">
                  <div className="text-[11px] text-muted-foreground mb-0.5">
                    {item.label}
                  </div>
                  <div className="font-bold text-[13px] text-foreground">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Principal Investigator */}
          {!reviewAction && (
            <div>
              <div className="font-bold text-[13px] text-foreground mb-2">
                Principal Investigator
              </div>
              <div className="p-3 rounded-xl bg-muted grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[11px] text-muted-foreground">Name</div>
                  <div className="font-semibold text-[13px] text-foreground">
                    {proposal.user?.name ?? "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">Email</div>
                  <div className="font-semibold text-[13px] text-foreground truncate">
                    {proposal.user?.email ?? "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">Department</div>
                  <div className="font-semibold text-[13px] text-foreground">
                    {proposal.user?.department ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Co-PIs */}
          {!reviewAction && proposal.coPIs && proposal.coPIs.length > 0 && (
            <div>
              <div className="font-bold text-[13px] text-foreground mb-2">
                Co-Principal Investigators ({proposal.coPIs.length})
              </div>
              <div className="space-y-2">
                {proposal.coPIs.map((coPi) => (
                  <div
                    key={coPi.id}
                    className="p-3 rounded-xl bg-muted grid grid-cols-3 gap-2"
                  >
                    <div>
                      <div className="text-[11px] text-muted-foreground">Name</div>
                      <div className="font-semibold text-[13px] text-foreground">
                        {coPi.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground">Email</div>
                      <div className="font-semibold text-[13px] text-foreground truncate">
                        {coPi.email}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground">
                        Department
                      </div>
                      <div className="font-semibold text-[13px] text-foreground">
                        {coPi.department}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collaborators */}
          {!reviewAction &&
            proposal.collaborators &&
            proposal.collaborators.length > 0 && (
              <div>
                <div className="font-bold text-[13px] text-foreground mb-2">
                  Collaborators ({proposal.collaborators.length})
                </div>
                <div className="space-y-2">
                  {proposal.collaborators.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-muted flex items-center gap-3"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-[13px] text-foreground">
                          {c.guest.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {c.guest.email}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-muted-foreground">Role</div>
                        <div className="text-[12px] text-foreground font-medium">
                          {c.roleDescription}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Existing reviews */}
          {!reviewAction && (proposal.reviews?.length ?? 0) > 0 && (
            <ReviewsList reviews={proposal.reviews!} />
          )}

          {/* ── Review action form ─────────────────────────────────────────── */}

          {reviewAction ? (
            <div className="space-y-4">
              {/* Error from mutations */}
              <div className="p-3 rounded-xl bg-muted border-l-4 border-primary">
                <div className="text-[11px] text-muted-foreground mb-0.5">
                  Proposal
                </div>
                <div className="font-semibold text-[13px] text-foreground">
                  {proposal.title}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-xs text-foreground mb-1.5">
                  {ACTION_CONFIG[reviewAction].commentLabel}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setCommentError("");
                  }}
                  placeholder={ACTION_CONFIG[reviewAction].placeholder}
                  className="w-full px-3 py-2 rounded-xl outline-none resize-none bg-muted text-[13px] text-foreground"
                  style={{
                    border: `1px solid ${commentError ? "#EF4444" : "var(--border)"}`,
                  }}
                />
                {commentError && (
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-red-500">
                    <AlertCircle size={11} />
                    {commentError}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setReviewAction(null);
                    setComment("");
                    setCommentError("");
                  }}
                  disabled={submitting}
                  className="btn-secondary flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-white font-bold text-[13px] hover:opacity-90 disabled:opacity-60"
                  style={{ background: ACTION_CONFIG[reviewAction].color }}
                >
                  {submitting ?
                    "Submitting…"
                  : ACTION_CONFIG[reviewAction].btnLabel}
                </button>
              </div>
            </div>
          ) : (
            canReview && (
              <div className="pt-2 border-t border-border">
                <div className="text-[11px] text-muted-foreground mb-3 font-semibold uppercase tracking-wide">
                  Director Actions
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => startReview("approve")}
                    className="flex-1 py-2.5 rounded-xl bg-green-500 text-white font-bold text-[13px] hover:opacity-90 transition-opacity"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => startReview("revision")}
                    className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-[13px] hover:opacity-90 transition-opacity"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={() => startReview("reject")}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-[13px] hover:opacity-90 transition-opacity"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </Modal>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function DirectorProposalsPage() {
  const { proposals, loading, error, refetch } = useAllSubmittedProposals();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [selected, setSelected] = useState<ProposalRecord | null>(null);

  // Client-side filtering
  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        (p.title ?? "").toLowerCase().includes(q) ||
        p.user?.name?.toLowerCase().includes(q) ||
        (p.fundingCall?.theme ?? "").toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "All" || toDisplayStatus(p.status) === statusFilter;
      const matchDept =
        deptFilter === "All" || p.user?.department === deptFilter;
      return matchSearch && matchStatus && matchDept;
    });
  }, [proposals, search, statusFilter, deptFilter]);

  const { paginated, page, totalPages, setPage } = usePagination(filtered, 10);

  // Stats
  const totalCount = proposals.length;
  const submittedCount = proposals.filter(
    (p) => toDisplayStatus(p.status) === "Submitted",
  ).length;
  const underReviewCount = proposals.filter(
    (p) => toDisplayStatus(p.status) === "Under Review",
  ).length;
  const approvedCount = proposals.filter(
    (p) => toDisplayStatus(p.status) === "Approved",
  ).length;

  const handleReviewSuccess = (updated: ProposalRecord) => {
    // Update the selected proposal in-place; the refetch triggered by the
    // mutation's refetchQueries will sync the rest of the list.
    setSelected(updated);
    refetch();
  };

  return (
    <div>
      <PageHeader
        title="Proposals"
        subtitle="Review and manage submitted proposals"
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total"
          value={loading ? "—" : totalCount}
          icon={<FileText size={18} />}
          iconColor="#1A3363"
          iconBg="#E5EBF5"
          subtitle="All proposals"
        />
        <StatCard
          label="Submitted"
          value={loading ? "—" : submittedCount}
          icon={<FileText size={18} />}
          iconColor="#2563EB"
          iconBg="#EFF6FF"
          subtitle="Awaiting review"
        />
        <StatCard
          label="Under Review"
          value={loading ? "—" : underReviewCount}
          icon={<FileText size={18} />}
          iconColor="#C2410C"
          iconBg="#FFF7ED"
          subtitle="Being evaluated"
        />
        <StatCard
          label="Approved"
          value={loading ? "—" : approvedCount}
          icon={<FileText size={18} />}
          iconColor="#15803D"
          iconBg="#F0FDF4"
          subtitle="Funded proposals"
        />
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 bg-card border border-border focus-within:border-primary/50 transition-colors">
          <Search size={15} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, PI name, or funding call…"
            className="bg-transparent outline-none flex-1 text-[13px] text-foreground"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl px-3 py-2 bg-card border border-border text-[13px] text-foreground outline-none cursor-pointer"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Statuses" : s}
            </option>
          ))}
        </select>

        <select
          value={deptFilter}
          onChange={(e) => {
            setDeptFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl px-3 py-2 bg-card border border-border text-[13px] text-foreground outline-none cursor-pointer max-w-[220px]"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-4 text-sm text-red-700">
          Failed to load proposals: {error.message}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                {[
                  "Title / Funding Call",
                  "Status",
                  "Principal Investigator",
                  "Amount",
                  "Updated",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-[0.05em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ?
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : paginated.map((p) => (
                  <tr
                    key={p.id}
                    className="bg-card hover:bg-muted transition-colors"
                  >
                    <td className="px-4 py-3 max-w-[260px]">
                      <div className="font-semibold text-[13px] text-foreground truncate">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {p.fundingCall?.theme || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Badge status={toDisplayStatus(p.status)} size="sm" />
                        {(p.reviews?.length ?? 0) > 0 && (
                          <span
                            className="text-[10px] font-mono text-muted-foreground"
                            title={`${p.reviews!.length} review(s)`}
                          >
                            ×{p.reviews!.length}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[13px] text-foreground whitespace-nowrap">
                        {p.user?.name ?? "—"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {p.user?.department ?? ""}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-xs text-foreground whitespace-nowrap">
                        {fmtCurrency(p.requestedAmount ?? 0.0)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {fmtDate(p.updatedAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-primary border border-primary/30 hover:bg-primary/5 transition-colors whitespace-nowrap"
                      >
                        {REVIEWABLE_STATUSES.has(p.status) ? "Review" : "View Details"}
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!loading && paginated.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText
                size={24}
                className="opacity-40 text-muted-foreground"
              />
            </div>
            <div className="font-bold text-sm text-foreground">
              No proposals found
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {search ?
                `No results for "${search}"`
              : "Try changing your filters"}
            </div>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          pageSize={10}
          onPage={setPage}
        />
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading ?
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        : paginated.length === 0 ?
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText
                size={24}
                className="opacity-40 text-muted-foreground"
              />
            </div>
            <div className="font-bold text-sm text-foreground">
              No proposals found
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {search ?
                `No results for "${search}"`
              : "Try changing your filters"}
            </div>
          </div>
        : paginated.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-card border border-border p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground truncate flex-1">
                  {p.fundingCall?.theme || "—"}
                </span>
                <Badge status={toDisplayStatus(p.status)} size="sm" />
              </div>
              <div className="font-bold text-[13px] text-foreground leading-snug">
                {p.title}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground">
                  {p.user?.name ?? "—"}
                </span>
                <span className="font-mono font-semibold text-xs text-foreground">
                  {fmtCurrency(p.requestedAmount ?? 0.0)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {fmtDate(p.updatedAt)}
                </span>
                <button
                  onClick={() => setSelected(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  {REVIEWABLE_STATUSES.has(p.status) ? "Review" : "View Details"}
                </button>
              </div>
            </div>
          ))
        }
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          pageSize={10}
          onPage={setPage}
        />
      </div>

      {/* Detail + Review modal */}
      <ProposalDetailModal
        proposal={selected}
        onClose={() => setSelected(null)}
        onReviewSuccess={handleReviewSuccess}
      />
    </div>
  );
}
