import { useState, useMemo } from "react";
import { CreateProposalForm } from "../proposals/CreateProposalForm";
import { EditProposalForm } from "../proposals/EditProposalForm";
import {
  Search,
  Plus,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  RotateCcw,
  MessageSquare,
  Clock,
  Award,
  ChevronUp,
  ChevronDown,
  Pencil,
  Users,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { useToast } from "../ui/Toast";
import { ScrollTable } from "../ui/ScrollTable";
import { PageHeader } from "../ui/PageHeader";
import { Pagination } from "../ui/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { useSortable } from "../../../hooks/useSortable";
import { useAppContext } from "../../context/AppContext";
import type { Award as AwardType } from "../../data/mockData";
import type { NavState } from "../../App";
import { Account_Type } from "@/gql/schema-types";
import type { ProposalRecord } from "../../../types/proposal.types";
import { useAuthStore } from "../../../store/auth.store";
import { useProposalsByResearcher } from "../../../hooks/useProposalsByResearcher";
import { useAllSubmittedProposals } from "../../../hooks/useDirectorProposals";
import {
  useApproveProposal,
  useRejectProposal,
  useRequestRevision,
} from "../../../hooks/useProposalReview";
import { toDisplayStatus } from "../../utils/proposalStatus";
import { fmtDateTime } from "../../utils/formatters";

const fmtCurrency = (n: number = 0) => `GHS ${n.toLocaleString() || "0.00"}`;

interface ProposalsProps {
  role: Account_Type;
  navState?: NavState | null;
}

const TH = ({
  label,
  sortKey,
  active,
  dir,
  onToggle,
}: {
  label: string;
  sortKey?: string;
  active?: boolean;
  dir?: "asc" | "desc";
  onToggle?: () => void;
}) => (
  <th
    onClick={onToggle}
    className={`text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-[0.05em] select-none ${onToggle ? "cursor-pointer hover:text-foreground" : ""}`}
  >
    <span className="flex items-center gap-1">
      {label}
      {onToggle &&
        (active ?
          dir === "asc" ?
            <ChevronUp size={11} />
          : <ChevronDown size={11} />
        : <ChevronUp size={11} className="opacity-20" />)}
    </span>
  </th>
);

const REVIEW_COLORS = {
  Approved: "#22C55E",
  Rejected: "#EF4444",
  Revised: "#A855F7",
} as const;

const REVIEW_LABELS = {
  Approved: "Approve Proposal",
  Rejected: "Reject Proposal",
  Revised: "Request Revision",
} as const;

export function Proposals({ role, navState }: ProposalsProps) {
  const { addAward, addNotification } = useAppContext();

  const isResearcher = role === "researcher";
  const currentUser = useAuthStore((s) => s.user);

  // ── Data hooks ─────────────────────────────────────────────────────────────
  const {
    proposals: researcherProposals,
    loading: researcherLoading,
    error: researcherError,
    refetch: refetchResearcher,
  } = useProposalsByResearcher(isResearcher ? (currentUser?.UserId ?? "") : "");

  const {
    proposals: allProposals,
    loading: adminLoading,
    error: adminError,
  } = useAllSubmittedProposals();

  // Admin review mutations (always called to satisfy rules-of-hooks)
  const { approveProposal, loading: approveLoading } = useApproveProposal();
  const { rejectProposal, loading: rejectLoading } = useRejectProposal();
  const { requestRevision, loading: revisionLoading } = useRequestRevision();
  const reviewSubmitting = approveLoading || rejectLoading || revisionLoading;

  const proposals = isResearcher ? researcherProposals : allProposals;
  const loading = isResearcher ? researcherLoading : adminLoading;
  const error = isResearcher ? researcherError : adminError;

  // ── UI state ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<ProposalRecord | null>(null);
  const [showNew, setShowNew] = useState(navState?.grantCallId ? true : false);
  const [editingProposal, setEditingProposal] = useState<ProposalRecord | null>(null);

  const [reviewAction, setReviewAction] = useState<{
    proposal: ProposalRecord;
    type: "Approved" | "Rejected" | "Revised";
  } | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [commentError, setCommentError] = useState("");

  const [showAwardModal, setShowAwardModal] = useState<ProposalRecord | null>(null);
  const [awardAmount, setAwardAmount] = useState("");
  const [awardStart, setAwardStart] = useState("");
  const [awardEnd, setAwardEnd] = useState("");

  const { toast } = useToast();

  // ── Filtering & sorting ────────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      proposals.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          (p.title ?? "").toLowerCase().includes(q) ||
          (p.user?.name ?? "").toLowerCase().includes(q);
        const matchStatus =
          statusFilter === "All" || toDisplayStatus(p.status) === statusFilter;
        return matchSearch && matchStatus;
      }),
    [proposals, search, statusFilter],
  );

  const { sorted, dir, toggle } = useSortable(
    filtered as unknown as Record<string, unknown>[],
    "submittedAt" as any,
  );
  const { paginated, page, totalPages, setPage } = usePagination(
    sorted as unknown as ProposalRecord[],
    8,
  );

  const statuses = [
    "All",
    "Draft",
    "Submitted",
    "Under Review",
    "Approved",
    "Rejected",
    "Revised",
  ];

  // ── Admin review ───────────────────────────────────────────────────────────
  const openReview = (
    proposal: ProposalRecord,
    type: "Approved" | "Rejected" | "Revised",
  ) => {
    setReviewAction({ proposal, type });
    setReviewComment("");
    setCommentError("");
  };

  const submitReview = async () => {
    if (!reviewComment.trim()) {
      setCommentError("A comment is required.");
      return;
    }
    if (!reviewAction) return;

    let result = null;
    const id = reviewAction.proposal.id;

    if (reviewAction.type === "Approved") {
      result = await approveProposal({ id, comment: reviewComment.trim() });
    } else if (reviewAction.type === "Rejected") {
      result = await rejectProposal({ id, reason: reviewComment.trim() });
    } else {
      result = await requestRevision({ id, comment: reviewComment.trim() });
    }

    if (result?.success) {
      addNotification({
        title: `Proposal ${reviewAction.type}`,
        message:
          reviewAction.type === "Approved" ?
            `Proposal "${reviewAction.proposal.title}" has been approved.`
          : reviewAction.type === "Rejected" ?
            `Proposal "${reviewAction.proposal.title}" was rejected.`
          : `Revision requested for "${reviewAction.proposal.title}".`,
        time: "Just now",
        type: reviewAction.type === "Approved" ? "approval" : "rejection",
      });
      toast(`Proposal ${reviewAction.type.toLowerCase()}`);
      setReviewAction(null);
      setReviewComment("");
      setSelected(null);
    } else if (result) {
      setCommentError(result.message ?? "Review failed.");
    }
  };

  // ── Award creation ─────────────────────────────────────────────────────────
  const createAward = () => {
    if (!showAwardModal || !awardAmount || !awardStart || !awardEnd) {
      toast("Fill in all award fields", "error");
      return;
    }
    const amt = Number(awardAmount);
    const award: AwardType = {
      id: `AW-${Date.now()}`,
      proposalId: showAwardModal.id,
      title: showAwardModal.title ?? "",
      researcher: showAwardModal.user?.name ?? "",
      awardedAmount: amt,
      awardDate: new Date().toISOString().slice(0, 10),
      startDate: awardStart,
      endDate: awardEnd,
      status: "Active",
      disbursed: 0,
      remaining: amt,
    };
    addAward(award);
    addNotification({
      title: "Award Created",
      message: `Award for "${showAwardModal.title}" created (${fmtCurrency(amt)}).`,
      time: "Just now",
      type: "approval",
    });
    toast("Award created successfully");
    setShowAwardModal(null);
    setAwardAmount("");
    setAwardStart("");
    setAwardEnd("");
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      <PageHeader
        title="Proposals"
        subtitle={`${proposals.filter((p) => toDisplayStatus(p.status) === "Under Review").length} proposals pending review`}
        action={
          isResearcher ?
            <button
              onClick={() => setShowNew(true)}
              data-testid="new-proposal-button"
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} /> New Proposal
            </button>
          : undefined
        }
      />

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-5 text-sm text-red-700">
          Failed to load proposals: {error.message}
        </div>
      )}

      {/* Stats bar */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: "Total", count: proposals.length, color: "var(--primary)" },
          {
            label: "Under Review",
            count: proposals.filter(
              (p) => toDisplayStatus(p.status) === "Under Review",
            ).length,
            color: "#F97316",
          },
          {
            label: "Approved",
            count: proposals.filter(
              (p) => toDisplayStatus(p.status) === "Approved",
            ).length,
            color: "#22C55E",
          },
          {
            label: "Rejected",
            count: proposals.filter(
              (p) => toDisplayStatus(p.status) === "Rejected",
            ).length,
            color: "#EF4444",
          },
          {
            label: "Revised",
            count: proposals.filter(
              (p) => toDisplayStatus(p.status) === "Revised",
            ).length,
            color: "#A855F7",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border"
          >
            <span
              className="rounded-full inline-block w-2 h-2"
              style={{ background: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span className="font-mono font-bold text-[13px] text-foreground">
              {loading ? "—" : item.count}
            </span>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 bg-card border border-border focus-within:border-primary/50 transition-colors">
          <Search size={15} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search proposals..."
            className="bg-transparent outline-none flex-1 text-[13px] text-foreground"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-xl transition-all text-xs border whitespace-nowrap ${statusFilter === s ? "border-primary bg-primary text-white font-semibold shadow-sm" : "border-border bg-card text-muted-foreground font-medium hover:bg-muted"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl overflow-hidden border border-border">
        <ScrollTable>
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                <TH
                  label="ID"
                  sortKey="id"
                  active={false}
                  dir={dir}
                  onToggle={() => toggle("id")}
                />
                <TH
                  label="Title"
                  sortKey="title"
                  active={false}
                  dir={dir}
                  onToggle={() => toggle("title")}
                />
                <TH label="Researcher" />
                <TH label="Grant Call" />
                <TH
                  label="Amount"
                  sortKey="requestedAmount"
                  active={false}
                  dir={dir}
                  onToggle={() => toggle("requestedAmount")}
                />
                <TH
                  label="Submitted At"
                  sortKey="submittedAt"
                  active={false}
                  dir={dir}
                  onToggle={() => toggle("submittedAt")}
                />
                <TH label="Status" />
                <TH label="" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((p) => (
                <tr
                  key={p.id}
                  className="bg-card hover:bg-muted transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {p.id}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <div className="font-semibold text-[13px] text-foreground truncate">
                      {p.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {p.user?.department ?? ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-foreground">
                      {p.user?.name ?? "—"}
                    </span>
                    {(p.coPIs?.length ?? 0) > 0 && (
                      <div
                        className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground"
                        data-testid="proposal-row-copis"
                      >
                        <Users size={10} />
                        <span className="truncate max-w-[140px]">
                          {p.coPIs!.map((c) => c.name).join(", ")}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[160px]">
                    <span className="text-xs text-muted-foreground truncate block">
                      {p.fundingCall?.theme ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-xs text-foreground whitespace-nowrap">
                      {fmtCurrency(p.requestedAmount ?? 0)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {fmtDateTime(p.submittedAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Badge status={toDisplayStatus(p.status)} size="sm" />
                      {(p.reviews?.length ?? 0) > 0 && (
                        <span title={`${p.reviews!.length} review(s)`}>
                          <MessageSquare size={12} className="text-muted-foreground" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelected(p)}
                        className="flex items-center justify-center rounded-md p-1.5 transition-colors text-muted-foreground hover:bg-muted"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      {isResearcher &&
                        (p.status === "under_review" ||
                          p.status === "draft" ||
                          p.status === "revised") && (
                          <button
                            onClick={() => setEditingProposal(p)}
                            className="flex items-center justify-center rounded-md p-1.5 transition-colors text-muted-foreground hover:bg-muted hover:text-primary"
                            title="Edit proposal"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                      {role === "admin" &&
                        (p.status === "submitted" ||
                          p.status === "under_review" ||
                          p.status === "revised") && (
                          <>
                            <button
                              onClick={() => openReview(p, "Approved")}
                              className="flex items-center justify-center rounded-md p-1.5 transition-colors text-green-500"
                              title="Approve"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                            <button
                              onClick={() => openReview(p, "Revised")}
                              className="flex items-center justify-center rounded-md p-1.5 transition-colors text-purple-500"
                              title="Request revision"
                            >
                              <RotateCcw size={14} />
                            </button>
                            <button
                              onClick={() => openReview(p, "Rejected")}
                              className="flex items-center justify-center rounded-md p-1.5 transition-colors text-red-500"
                              title="Reject"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                      {role === "admin" && p.status === "approved" && (
                        <button
                          onClick={() => setShowAwardModal(p)}
                          className="flex items-center justify-center rounded-md p-1.5 transition-colors text-yellow-600 hover:bg-yellow-50"
                          title="Create Award"
                        >
                          <Award size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollTable>

        {paginated.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText size={24} className="opacity-40 text-muted-foreground" />
            </div>
            <div className="font-bold text-sm text-foreground">
              No proposals found
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {search ? `No results for "${search}"` : "Try changing your filters"}
            </div>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          pageSize={8}
          onPage={setPage}
        />
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 ?
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText size={24} className="opacity-40 text-muted-foreground" />
            </div>
            <div className="font-bold text-sm text-foreground">
              No proposals found
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {search ? `No results for "${search}"` : "Try changing your filters"}
            </div>
          </div>
        : paginated.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-card border border-border p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  {p.id}
                </span>
                <div className="flex items-center gap-1.5">
                  {(p.reviews?.length ?? 0) > 0 && (
                    <MessageSquare size={12} className="text-muted-foreground" />
                  )}
                  <Badge status={toDisplayStatus(p.status)} size="sm" />
                </div>
              </div>
              <div>
                <div className="font-bold text-[13px] text-foreground leading-snug">
                  {p.title}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {p.user?.department ?? ""}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground">
                  {p.user?.name ?? "—"}
                </span>
                <span className="font-mono font-semibold text-xs text-foreground">
                  {fmtCurrency(p.requestedAmount ?? 0)}
                </span>
              </div>
              {(p.coPIs?.length ?? 0) > 0 && (
                <div
                  className="flex items-center gap-1 text-[11px] text-muted-foreground"
                  data-testid="proposal-row-copis"
                >
                  <Users size={11} />
                  {p.coPIs!.map((c) => c.name).join(", ")}
                </div>
              )}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {fmtDateTime(p.submittedAt)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelected(p)}
                    className="flex items-center justify-center rounded-md p-1.5 transition-colors text-muted-foreground hover:bg-muted"
                    title="View details"
                  >
                    <Eye size={14} />
                  </button>
                  {isResearcher &&
                    (p.status === "under_review" ||
                      p.status === "draft" ||
                      p.status === "revised") && (
                      <button
                        onClick={() => setEditingProposal(p)}
                        className="flex items-center justify-center rounded-md p-1.5 transition-colors text-muted-foreground hover:bg-muted hover:text-primary"
                        title="Edit proposal"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                  {role === "admin" &&
                    (p.status === "submitted" ||
                      p.status === "under_review" ||
                      p.status === "revised") && (
                      <>
                        <button
                          onClick={() => openReview(p, "Approved")}
                          className="flex items-center justify-center rounded-md p-1.5 transition-colors text-green-500"
                          title="Approve"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <button
                          onClick={() => openReview(p, "Revised")}
                          className="flex items-center justify-center rounded-md p-1.5 transition-colors text-purple-500"
                          title="Request revision"
                        >
                          <RotateCcw size={14} />
                        </button>
                        <button
                          onClick={() => openReview(p, "Rejected")}
                          className="flex items-center justify-center rounded-md p-1.5 transition-colors text-red-500"
                          title="Reject"
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                  {role === "admin" && p.status === "approved" && (
                    <button
                      onClick={() => setShowAwardModal(p)}
                      className="flex items-center justify-center rounded-md p-1.5 transition-colors text-yellow-600 hover:bg-yellow-50"
                      title="Create Award"
                    >
                      <Award size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        }
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          pageSize={8}
          onPage={setPage}
        />
      </div>

      {/* View details modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Proposal Details"
        width={640}
      >
        {selected && (
          <div className="space-y-4 max-h-[78vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">
                {selected.id}
              </span>
              <Badge status={toDisplayStatus(selected.status)} />
            </div>
            <h2 className="font-extrabold text-[17px] text-foreground leading-snug">
              {selected.title}
            </h2>
            <div className="p-4 rounded-xl bg-muted border-l-4 border-primary">
              <div className="font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.05em] mb-2">
                Abstract
              </div>
              <p className="text-[13px] text-foreground leading-relaxed">
                {selected.abstract}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Principal Investigator",
                  value: selected.user?.name ?? "—",
                },
                {
                  label: "Department",
                  value: selected.user?.department ?? "—",
                },
                {
                  label: "Grant Call",
                  value: selected.fundingCall?.theme ?? "—",
                },
                {
                  label: "Requested Amount",
                  value: fmtCurrency(selected.requestedAmount),
                },
                {
                  label: "Submitted At",
                  value: fmtDateTime(selected.submittedAt),
                },
                { label: "Status", value: toDisplayStatus(selected.status) },
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
            <div data-testid="proposal-details-copis">
              <div className="text-[11px] text-muted-foreground mb-2">
                Co-Principal Investigators
              </div>
              {(selected.coPIs?.length ?? 0) > 0 ?
                <div className="flex flex-wrap gap-2">
                  {selected.coPIs!.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-primary text-[12px] font-medium"
                    >
                      <Users size={11} /> {c.name}
                    </span>
                  ))}
                </div>
              : <p className="text-[12px] text-muted-foreground">None</p>}
            </div>

            {/* Director reviews */}
            {(selected.reviews?.length ?? 0) > 0 && (
              <div>
                <div className="font-bold text-[13px] text-foreground mb-2">
                  Director Reviews ({selected.reviews!.length})
                </div>
                <div className="space-y-3">
                  {selected.reviews!.map((r) => {
                    const colors: Record<string, string> = {
                      approved: "#22C55E",
                      rejected: "#EF4444",
                      revised: "#A855F7",
                    };
                    const labels: Record<string, string> = {
                      approved: "Approved",
                      rejected: "Rejected",
                      revised: "Revision Requested",
                    };
                    const color = colors[r.decision] ?? "#6B7280";
                    return (
                      <div key={r.id} className="flex gap-3">
                        <div
                          className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 mt-0.5"
                          style={{ background: color + "18" }}
                        >
                          {r.decision === "approved" ?
                            <CheckCircle2 size={13} className="text-green-500" />
                          : r.decision === "rejected" ?
                            <XCircle size={13} className="text-red-500" />
                          : <RotateCcw size={13} className="text-purple-500" />}
                        </div>
                        <div className="flex-1 p-3 rounded-xl bg-muted">
                          <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                            <span className="font-bold text-xs" style={{ color }}>
                              {labels[r.decision] ?? r.decision}
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
                          <p className="text-xs text-foreground leading-relaxed">
                            {r.comment}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Admin review action buttons */}
            {role === "admin" &&
              (selected.status === "submitted" ||
                selected.status === "under_review" ||
                selected.status === "revised") && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      openReview(selected, "Approved");
                      setSelected(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-green-500 text-white font-bold text-[13px] hover:opacity-90"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      openReview(selected, "Revised");
                      setSelected(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-[13px] hover:opacity-90"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={() => {
                      openReview(selected, "Rejected");
                      setSelected(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-[13px] hover:opacity-90"
                  >
                    Reject
                  </button>
                </div>
              )}

            {role === "admin" && selected.status === "approved" && (
              <button
                onClick={() => {
                  setShowAwardModal(selected);
                  setSelected(null);
                }}
                className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
              >
                <Award size={15} /> Create Award from This Proposal
              </button>
            )}

            {isResearcher &&
              (selected.status === "under_review" ||
                selected.status === "draft" ||
                selected.status === "revised") && (
                <button
                  onClick={() => {
                    setEditingProposal(selected);
                    setSelected(null);
                  }}
                  className="w-full py-2.5 rounded-xl border border-border font-semibold text-[13px] text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <Pencil size={14} /> Edit Proposal
                </button>
              )}
          </div>
        )}
      </Modal>

      {/* Review action dialog */}
      {reviewAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setReviewAction(null)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative rounded-2xl shadow-2xl w-full max-w-md bg-card border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ background: REVIEW_COLORS[reviewAction.type] + "18" }}
                >
                  {reviewAction.type === "Approved" ?
                    <CheckCircle2 size={20} className="text-green-500" />
                  : reviewAction.type === "Rejected" ?
                    <XCircle size={20} className="text-red-500" />
                  : <RotateCcw size={20} className="text-purple-500" />}
                </div>
                <div>
                  <div className="font-bold text-[15px] text-foreground">
                    {REVIEW_LABELS[reviewAction.type]}
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-[280px]">
                    {reviewAction.proposal.title}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-semibold text-xs text-foreground mb-1.5">
                  Review Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => {
                    setReviewComment(e.target.value);
                    setCommentError("");
                  }}
                  placeholder={
                    reviewAction.type === "Revised" ?
                      "Describe what needs to be revised..."
                    : reviewAction.type === "Rejected" ?
                      "Provide reason for rejection..."
                    : "Add approval notes..."
                  }
                  className="w-full px-3 py-2 rounded-xl outline-none resize-none bg-muted text-[13px] text-foreground"
                  style={{
                    border: `1px solid ${commentError ? "#EF4444" : "var(--border)"}`,
                  }}
                />
                {commentError && (
                  <div className="text-[11px] text-red-500 mt-1">{commentError}</div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setReviewAction(null)}
                  disabled={reviewSubmitting}
                  className="btn-secondary flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={reviewSubmitting}
                  className="flex-1 py-2.5 rounded-xl text-white font-bold text-[13px] hover:opacity-90 disabled:opacity-60"
                  style={{ background: REVIEW_COLORS[reviewAction.type] }}
                >
                  {reviewSubmitting ?
                    "Submitting…"
                  : REVIEW_LABELS[reviewAction.type]}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Award modal */}
      <Modal
        open={!!showAwardModal}
        onClose={() => setShowAwardModal(null)}
        title="Create Award"
        width={520}
      >
        {showAwardModal && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-secondary border-l-4 border-primary">
              <div className="text-[11px] text-muted-foreground mb-0.5">Proposal</div>
              <div className="font-bold text-[13px] text-foreground">
                {showAwardModal.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {showAwardModal.user?.name ?? "—"}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Award Amount (GHS)
              </label>
              <input
                type="number"
                value={awardAmount}
                onChange={(e) => setAwardAmount(e.target.value)}
                placeholder={String(showAwardModal.requestedAmount)}
                className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={awardStart}
                  onChange={(e) => setAwardStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={awardEnd}
                  onChange={(e) => setAwardEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAwardModal(null)}
                className="btn-secondary flex-1 py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={createAward}
                className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2"
              >
                <Award size={15} /> Create Award
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* New proposal modal */}
      <Modal
        open={showNew}
        onClose={() => setShowNew(false)}
        title="Submit New Proposal"
        width={620}
      >
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          <CreateProposalForm
            defaultFundingCallId={navState?.grantCallId ?? ""}
            onSuccess={() => {
              setShowNew(false);
              refetchResearcher();
            }}
            onCancel={() => setShowNew(false)}
          />
        </div>
      </Modal>

      {/* Edit proposal modal */}
      <Modal
        open={!!editingProposal}
        onClose={() => setEditingProposal(null)}
        title="Edit Proposal"
        width={620}
      >
        {editingProposal && (
          <div className="max-h-[75vh] overflow-y-auto pr-1">
            <EditProposalForm
              proposal={editingProposal}
              onSuccess={() => {
                setEditingProposal(null);
                refetchResearcher();
              }}
              onCancel={() => setEditingProposal(null)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
