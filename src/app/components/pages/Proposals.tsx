import { useState, useMemo, useEffect } from "react";
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
  Trash2,
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
import { supabase } from "../../../lib/supabase";
import type {
  Role,
  Proposal,
  StatusBadge,
  Award as AwardType,
} from "../../data/mockData";
import type { NavState } from "../../App";
import { Account_Type } from "@/gql/schema-types";
import type { ProposalPI, ProposalRecord } from "../../../types/proposal.types";
import { useAuthStore } from "../../../store/auth.store";
import { useProposalsByResearcher } from "../../../hooks/useProposalsByResearcher";
import { toDisplayStatus } from "../../utils/proposalStatus";
import { fmtDateTime } from "../../utils/formatters";

const fmtCurrency = (n: number = 0) => `GHS ${n.toLocaleString() || "0.00"}`;

function toLocalProposal(p: ProposalRecord): ProposalWithHistory {
  return {
    id: p.id,
    title: p.title,
    researcher: p.user?.name ?? "",
    researcherId: 0,
    grantCallId: p.fundingCall?.id ?? "",
    grantCallTitle: p.fundingCall?.theme ?? "",
    submitted: p.submittedAt ?? "",
    status: toDisplayStatus(p.status),
    requestedAmount: p.requestedAmount,
    department: p.user?.department ?? "",
    abstract: p.abstract,
    coPIs: p.coPIs,
    source: "graphql",
    raw: p,
  };
}

interface ReviewEntry {
  action: "Approved" | "Rejected" | "Revised";
  comment: string;
  reviewer: string;
  date: string;
}

type ProposalWithHistory = Proposal & {
  reviewHistory?: ReviewEntry[];
  /** Zero or more Co-Principal Investigators (only populated for proposals created via the real backend). */
  coPIs?: ProposalPI[];
  /** Marks rows backed by a real GraphQL record — only these can be edited. */
  source?: "graphql";
  /** The full backend record, kept around so the edit form has everything it needs. */
  raw?: ProposalRecord;
};

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

export function Proposals({ role, navState }: ProposalsProps) {
  const { addAward, addNotification, addAuditLog } = useAppContext();
  const [proposals, setProposals] = useState<ProposalWithHistory[]>([]);

  const isResearcher = role === "researcher";
  const currentUser = useAuthStore((s) => s.user);
  const { proposals: myProposals } = useProposalsByResearcher(
    isResearcher ? (currentUser?.UserId ?? "") : "",
  );

  // Researchers see their own proposals, looked up by their userId — kept in
  // sync with the GraphQL backend rather than the (legacy) Supabase table below.
  useEffect(() => {
    if (isResearcher) {
      setProposals(myProposals.map(toLocalProposal));
    }
  }, [isResearcher, myProposals]);

  useEffect(() => {
    if (isResearcher) return;
    // Fetch proposals from Supabase
    const fetchProposals = async () => {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .order("submitted", { ascending: false });
      if (!error && data && data.length > 0) {
        setProposals(data as ProposalWithHistory[]);
      }
    };
    fetchProposals();
  }, [isResearcher]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<ProposalWithHistory | null>(null);
  const [showNew, setShowNew] = useState(navState?.grantCallId ? true : false);
  const [editingProposal, setEditingProposal] =
    useState<ProposalWithHistory | null>(null);

  const [reviewAction, setReviewAction] = useState<{
    proposal: ProposalWithHistory;
    type: "Approved" | "Rejected" | "Revised";
  } | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [showAwardModal, setShowAwardModal] =
    useState<ProposalWithHistory | null>(null);
  const [awardAmount, setAwardAmount] = useState("");
  const [awardStart, setAwardStart] = useState("");
  const [awardEnd, setAwardEnd] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const myId = role === "Researcher" ? 2 : null;
  const visibleProposals =
    myId ? proposals.filter((p) => p.researcherId === myId) : proposals;

  const filtered = useMemo(
    () =>
      visibleProposals.filter((p) => {
        const matchSearch =
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.researcher.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || p.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [visibleProposals, search, statusFilter],
  );

  const { sorted, sortKey, dir, toggle } = useSortable(
    filtered as unknown as Record<string, unknown>[],
    "submitted" as any,
  );
  const { paginated, page, totalPages, setPage } = usePagination(
    sorted as unknown as ProposalWithHistory[],
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
  const actionColors = {
    Approved: "#22C55E",
    Rejected: "#EF4444",
    Revised: "#A855F7",
  };
  const actionLabels = {
    Approved: "Approve Proposal",
    Rejected: "Reject Proposal",
    Revised: "Request Revision",
  };

  const openReview = (
    proposal: ProposalWithHistory,
    type: "Approved" | "Rejected" | "Revised",
  ) => {
    setReviewAction({ proposal, type });
    setReviewComment("");
    setCommentError("");
  };

  const submitReview = () => {
    if (!reviewComment.trim()) {
      setCommentError("A comment is required.");
      return;
    }
    if (!reviewAction) return;
    const statusMap: Record<string, StatusBadge> = {
      Approved: "Approved",
      Rejected: "Rejected",
      Revised: "Revised",
    };
    const entry: ReviewEntry = {
      action: reviewAction.type,
      comment: reviewComment.trim(),
      reviewer: role,
      date: new Date().toISOString().slice(0, 10),
    };
    const updated = proposals.map((p) =>
      p.id === reviewAction.proposal.id ?
        {
          ...p,
          status: statusMap[reviewAction.type],
          reviewHistory: [...(p.reviewHistory || []), entry],
        }
      : p,
    );
    setProposals(updated);
    if (selected?.id === reviewAction.proposal.id) {
      setSelected((prev) =>
        prev ?
          {
            ...prev,
            status: statusMap[reviewAction.type],
            reviewHistory: [...(prev.reviewHistory || []), entry],
          }
        : prev,
      );
    }
    // Persist status update to Supabase
    supabase
      .from("proposals")
      .update({ status: statusMap[reviewAction.type] })
      .eq("id", reviewAction.proposal.id)
      .then(() => {});
    // Auto-notification
    const notifMsg =
      reviewAction.type === "Approved" ?
        `Your proposal "${reviewAction.proposal.title}" has been approved!`
      : reviewAction.type === "Rejected" ?
        `Your proposal "${reviewAction.proposal.title}" was not approved.`
      : `Revision requested for "${reviewAction.proposal.title}".`;
    addNotification({
      title: `Proposal ${reviewAction.type}`,
      message: notifMsg,
      time: "Just now",
      type: reviewAction.type === "Approved" ? "approval" : "rejection",
    });

    toast(`Proposal ${reviewAction.type.toLowerCase()}`);
    setReviewAction(null);
    setReviewComment("");
  };

  const handleBulkApprove = () => {
    setProposals((p) =>
      p.map((q) =>
        (
          selectedIds.has(q.id) &&
          (q.status === "Under Review" || q.status === "Submitted")
        ) ?
          { ...q, status: "Approved" }
        : q,
      ),
    );
    toast(`${selectedIds.size} proposals approved`);
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    setProposals((p) =>
      p.map((q) =>
        (
          selectedIds.has(q.id) &&
          (q.status === "Under Review" || q.status === "Submitted")
        ) ?
          { ...q, status: "Rejected" }
        : q,
      ),
    );
    toast(`${selectedIds.size} proposals rejected`, "warning");
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const createAward = () => {
    if (!showAwardModal || !awardAmount || !awardStart || !awardEnd) {
      toast("Fill in all award fields", "error");
      return;
    }
    const amt = Number(awardAmount);
    const award: AwardType = {
      id: `AW-${Date.now()}`,
      proposalId: showAwardModal.id,
      title: showAwardModal.title,
      researcher: showAwardModal.researcher,
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
      message: `Award for "${showAwardModal.title}" has been created (${fmtCurrency(amt ?? 0)}).`,
      time: "Just now",
      type: "approval",
    });

    toast("Award created successfully");
    setShowAwardModal(null);
    setAwardAmount("");
    setAwardStart("");
    setAwardEnd("");
  };

  return (
    <div>
      <PageHeader
        title="Proposals"
        subtitle={`${proposals.filter((p) => p.status === "Under Review").length} proposals pending review`}
        action={
          role === "researcher" ?
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

      {/* Stats bar */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: "Total", count: proposals.length, color: "var(--primary)" },
          {
            label: "Under Review",
            count: proposals.filter((p) => p.status === "Under Review").length,
            color: "#F97316",
          },
          {
            label: "Approved",
            count: proposals.filter((p) => p.status === "Approved").length,
            color: "#22C55E",
          },
          {
            label: "Rejected",
            count: proposals.filter((p) => p.status === "Rejected").length,
            color: "#EF4444",
          },
          {
            label: "Revised",
            count: proposals.filter((p) => p.status === "Revised").length,
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
              {item.count}
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

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-secondary border border-primary/20 animate-in slide-in-from-top-2 duration-200">
          <span className="text-sm font-semibold text-primary">
            {selectedIds.size} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleBulkApprove}
              className="px-3 py-1.5 rounded-xl bg-green-500 text-white text-xs font-semibold hover:opacity-90"
            >
              Approve All
            </button>
            <button
              onClick={handleBulkReject}
              className="btn-destructive text-xs px-3 py-1.5"
            >
              Reject All
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <Trash2 size={11} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl overflow-hidden border border-border">
        <ScrollTable>
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                {role === "admin" && (
                  <th className="px-4 py-3 w-8">
                    <input
                      type="checkbox"
                      className="rounded"
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked ?
                            new Set(paginated.map((p) => p.id))
                          : new Set(),
                        )
                      }
                      checked={
                        selectedIds.size === paginated.length &&
                        paginated.length > 0
                      }
                    />
                  </th>
                )}
                <TH
                  label="ID"
                  sortKey="id"
                  active={sortKey === "id"}
                  dir={dir}
                  onToggle={() => toggle("id")}
                />
                <TH
                  label="Title"
                  sortKey="title"
                  active={sortKey === "title"}
                  dir={dir}
                  onToggle={() => toggle("title")}
                />
                <TH
                  label="Researcher"
                  sortKey="researcher"
                  active={sortKey === "researcher"}
                  dir={dir}
                  onToggle={() => toggle("researcher")}
                />
                <TH label="Grant Call" />
                <TH
                  label="Amount"
                  sortKey="requestedAmount"
                  active={sortKey === "requestedAmount"}
                  dir={dir}
                  onToggle={() => toggle("requestedAmount")}
                />
                <TH
                  label="Submitted At"
                  sortKey="submitted"
                  active={sortKey === "submitted"}
                  dir={dir}
                  onToggle={() => toggle("submitted")}
                />
                <TH
                  label="Status"
                  sortKey="status"
                  active={sortKey === "status"}
                  dir={dir}
                  onToggle={() => toggle("status")}
                />
                <TH label="" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((p) => (
                <tr
                  key={p.id}
                  className="bg-card hover:bg-muted transition-colors"
                >
                  {role === "admin" && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
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
                      {p.department}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-foreground">
                      {p.researcher}
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
                      {p.grantCallTitle}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-xs text-foreground whitespace-nowrap">
                      {fmtCurrency(p.requestedAmount ?? 0.0)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {p.source === "graphql" ?
                        fmtDateTime(p.submitted)
                      : p.submitted}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Badge status={p.status} size="sm" />
                      {(p.reviewHistory?.length ?? 0) > 0 && (
                        <MessageSquare
                          size={12}
                          className="text-muted-foreground"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {role === "Researcher" && p.status === "Draft" ?
                        <button
                          onClick={() => setSelected(p)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
                          title="Continue editing"
                        >
                          <Eye size={12} /> Continue Editing
                        </button>
                      : <button
                          onClick={() => setSelected(p)}
                          className="flex items-center justify-center rounded-md p-1.5 transition-colors text-muted-foreground hover:bg-muted"
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                      }
                      {role === "admin" &&
                        (p.status === "Under Review" ||
                          p.status === "Revised") && (
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
                      {role === "admin" && p.status === "Approved" && (
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
          pageSize={8}
          onPage={setPage}
        />
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 ?
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
              {/* Top row: ID + status */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  {p.id}
                </span>
                <div className="flex items-center gap-1.5">
                  {(p.reviewHistory?.length ?? 0) > 0 && (
                    <MessageSquare
                      size={12}
                      className="text-muted-foreground"
                    />
                  )}
                  <Badge status={p.status} size="sm" />
                </div>
              </div>
              {/* Title + department */}
              <div>
                <div className="font-bold text-[13px] text-foreground leading-snug">
                  {p.title}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {p.department}
                </div>
              </div>
              {/* Researcher + amount */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground">{p.researcher}</span>
                <span className="font-mono font-semibold text-xs text-foreground">
                  {fmtCurrency(p.requestedAmount ?? 0.0)}
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
              {/* Date + actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {p.source === "graphql" ?
                    fmtDateTime(p.submitted)
                  : p.submitted}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelected(p)}
                    className="flex items-center justify-center rounded-md p-1.5 transition-colors text-muted-foreground hover:bg-muted"
                    title="View details"
                  >
                    <Eye size={14} />
                  </button>
                  {p.source === "graphql" &&
                    (p.status === "Under Review" ||
                      p.status === "Draft" ||
                      p.status === "Revised") && (
                      <button
                        onClick={() => setEditingProposal(p)}
                        className="flex items-center justify-center rounded-md p-1.5 transition-colors text-muted-foreground hover:bg-muted hover:text-primary"
                        title="Edit proposal"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                  {role === "admin" &&
                    (p.status === "Under Review" || p.status === "Revised") && (
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
                  {role === "admin" && p.status === "Approved" && (
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">
                {selected.id}
              </span>
              <Badge status={selected.status} />
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
                { label: "Principal Investigator", value: selected.researcher },
                { label: "Department", value: selected.department },
                { label: "Grant Call", value: selected.grantCallTitle },
                {
                  label: "Requested Amount",
                  value: fmtCurrency(selected.requestedAmount),
                },
                {
                  label: "Submitted At",
                  value:
                    selected.source === "graphql" ?
                      fmtDateTime(selected.submitted)
                    : selected.submitted,
                },
                { label: "Status", value: selected.status },
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
            {(selected.reviewHistory?.length ?? 0) > 0 && (
              <div>
                <div className="font-bold text-[13px] text-foreground mb-2">
                  Review History
                </div>
                <div className="space-y-3">
                  {selected.reviewHistory!.map((entry, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div
                        className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 mt-0.5"
                        style={{
                          background:
                            (actionColors as any)[entry.action] + "18",
                        }}
                      >
                        {entry.action === "Approved" ?
                          <CheckCircle2 size={13} className="text-green-500" />
                        : entry.action === "Rejected" ?
                          <XCircle size={13} className="text-red-500" />
                        : <RotateCcw size={13} className="text-purple-500" />}
                      </div>
                      <div className="flex-1 p-3 rounded-xl bg-muted">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="font-bold text-xs"
                            style={{
                              color: (actionColors as any)[entry.action],
                            }}
                          >
                            {entry.action}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-muted-foreground">
                              {entry.reviewer}
                            </span>
                            <Clock
                              size={11}
                              className="text-muted-foreground"
                            />
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {entry.date}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">
                          {entry.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {role === "admin" &&
              (selected.status === "Under Review" ||
                selected.status === "Revised") && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      openReview(selected, "Approved");
                      setSelected(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-green-500 text-white font-bold text-[13px] hover:opacity-90 transition-opacity"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      openReview(selected, "Revised");
                      setSelected(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-[13px] hover:opacity-90 transition-opacity"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={() => {
                      openReview(selected, "Rejected");
                      setSelected(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-[13px] hover:opacity-90 transition-opacity"
                  >
                    Reject
                  </button>
                </div>
              )}
            {role === "admin" && selected.status === "Approved" && (
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
            {selected.source === "graphql" &&
              (selected.status === "Under Review" ||
                selected.status === "Draft" ||
                selected.status === "Revised") && (
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
                  style={{ background: actionColors[reviewAction.type] + "18" }}
                >
                  {reviewAction.type === "Approved" ?
                    <CheckCircle2 size={20} className="text-green-500" />
                  : reviewAction.type === "Rejected" ?
                    <XCircle size={20} className="text-red-500" />
                  : <RotateCcw size={20} className="text-purple-500" />}
                </div>
                <div>
                  <div className="font-bold text-[15px] text-foreground">
                    {actionLabels[reviewAction.type]}
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
                  <div className="text-[11px] text-red-500 mt-1">
                    {commentError}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setReviewAction(null)}
                  className="btn-secondary flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  className="flex-1 py-2.5 rounded-xl text-white font-bold text-[13px] hover:opacity-90"
                  style={{
                    background: actionColors[reviewAction.type] as string,
                  }}
                >
                  {actionLabels[reviewAction.type]}
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
              <div className="text-[11px] text-muted-foreground mb-0.5">
                Proposal
              </div>
              <div className="font-bold text-[13px] text-foreground">
                {showAwardModal.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {showAwardModal.researcher}
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

      {/* New proposal modal — GraphQL-backed for Researchers / Assistant Researchers */}
      <Modal
        open={showNew}
        onClose={() => setShowNew(false)}
        title="Submit New Proposal"
        width={620}
      >
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          <CreateProposalForm
            defaultFundingCallId={navState?.grantCallId ?? ""}
            onSuccess={(created) => {
              // Merge the returned record into the local proposals list
              setProposals((prev) => [toLocalProposal(created), ...prev]);
              setShowNew(false);
            }}
            onCancel={() => setShowNew(false)}
          />
        </div>
      </Modal>

      {/* Edit proposal modal — only available for proposals backed by a real record */}
      <Modal
        open={!!editingProposal}
        onClose={() => setEditingProposal(null)}
        title="Edit Proposal"
        width={620}
      >
        {editingProposal?.raw && (
          <div className="max-h-[75vh] overflow-y-auto pr-1">
            <EditProposalForm
              proposal={editingProposal.raw}
              onSuccess={(updated) => {
                setProposals((prev) =>
                  prev.map((p) =>
                    p.id === updated.id ?
                      {
                        ...p,
                        title: updated.title,
                        abstract: updated.abstract,
                        department: updated.user?.department ?? "",
                        requestedAmount: updated.requestedAmount,
                        coPIs: updated.coPIs,
                        raw: updated,
                      }
                    : p,
                  ),
                );
                setEditingProposal(null);
              }}
              onCancel={() => setEditingProposal(null)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
