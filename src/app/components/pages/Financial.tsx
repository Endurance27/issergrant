import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "../ui/Badge";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useToast } from "../ui/Toast";
import { ScrollTable } from "../ui/ScrollTable";
import { PageHeader } from "../ui/PageHeader";
import { Pagination } from "../ui/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { useSortable } from "../../../hooks/useSortable";
import { useAppContext } from "../../context/AppContext";
import { currentUsers, analyticsData } from "../../data/mockData";
import { supabase } from "../../../lib/supabase";
import type { Role } from "../../data/mockData";
import { TICK, TIP } from "../../utils/formatters";
import { Account_Type } from "@/gql/schema-types";

const fmtCurrency = (n: number) => `GHS ${n.toLocaleString()}`;

interface FinancialProps {
  role: Account_Type;
}

export function Financial({ role }: FinancialProps) {
  const {
    awards,
    transactions,
    updateTransaction,
    addNotification,
    addAuditLog,
  } = useAppContext();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    type: "approve" | "reject";
  } | null>(null);

  useEffect(() => {
    // Sync transactions from Supabase on mount
    const syncTransactions = async () => {
      await supabase.from("transactions").select("*");
      // Transactions managed via AppContext; Supabase is written to on each action
    };
    syncTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.projectTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const { sorted, sortKey, dir, toggle } = useSortable(
    filtered as unknown as Record<string, unknown>[],
  );
  const { paginated, page, totalPages, setPage } = usePagination(
    sorted as unknown as typeof filtered,
    10,
  );

  const { toast } = useToast();
  const approve = (id: string) => {
    updateTransaction(id, { status: "Paid" });
    supabase
      .from("transactions")
      .update({ status: "Paid" })
      .eq("id", id)
      .then(() => {});
    const tx = transactions.find((t) => t.id === id);
    if (tx) {
      addNotification({
        title: "Payment Processed",
        message: `Disbursement of ${fmtCurrency(tx.amount)} for "${tx.projectTitle}" has been approved.`,
        time: "Just now",
        type: "payment",
      });
    }
    toast("Disbursement approved");
  };
  const reject = (id: string) => {
    updateTransaction(id, { status: "Rejected" });
    supabase
      .from("transactions")
      .update({ status: "Rejected" })
      .eq("id", id)
      .then(() => {});

    toast("Disbursement rejected", "error");
  };

  const totalAwarded = awards.reduce((s, a) => s + a.awardedAmount, 0);
  const totalDisbursed = awards.reduce((s, a) => s + a.disbursed, 0);
  const pendingAmt = transactions
    .filter((t) => t.status === "Pending")
    .reduce((s, t) => s + t.amount, 0);

  const typeIcon = (type: string) => {
    if (type === "Disbursement")
      return <TrendingUp size={14} className="text-primary" />;
    if (type === "Expense")
      return <DollarSign size={14} className="text-amber-500" />;
    return <AlertCircle size={14} className="text-emerald-500" />;
  };

  return (
    <div>
      <PageHeader
        title="Financial Management"
        subtitle="Review budgets, disbursements, and payment schedules"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Awarded",
            value: fmtCurrency(totalAwarded),
            color: "var(--primary)",
            bg: "var(--secondary)",
            icon: <DollarSign size={18} />,
          },
          {
            label: "Disbursed",
            value: fmtCurrency(totalDisbursed),
            color: "#10B981",
            bg: "#ECFDF5",
            icon: <TrendingUp size={18} />,
          },
          {
            label: "Pending Approval",
            value: fmtCurrency(pendingAmt),
            color: "#F59E0B",
            bg: "#FFFBEB",
            icon: <Clock size={18} />,
          },
          {
            label: "Remaining",
            value: fmtCurrency(totalAwarded - totalDisbursed),
            color: "#8B5CF6",
            bg: "#F5F3FF",
            icon: <AlertCircle size={18} />,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl p-4 bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-[0.05em]">
                {item.label}
              </span>
              <div
                className="flex items-center justify-center w-[30px] h-[30px] rounded-lg"
                style={{ background: item.bg, color: item.color }}
              >
                {item.icon}
              </div>
            </div>
            <div className="font-mono font-semibold text-sm text-foreground">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-5 mb-6 bg-card border border-border"
        data-testid="monthly-expenditure-chart"
      >
        <h3 className="font-bold text-sm text-foreground mb-1">
          Monthly Expenditures
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Funds disbursed per month in 2025
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={analyticsData.monthlyDisbursements}>
            <defs>
              <linearGradient id="financeArea" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.25}
                />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={TICK}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `GHS ${v / 1000}k`}
              tick={TICK}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v: number) => fmtCurrency(v)}
              contentStyle={TIP}
            />
            <Area
              type="monotone"
              dataKey="amount"
              name="Disbursed"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#financeArea)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl p-5 mb-6 bg-card border border-border">
        <h3 className="font-bold text-sm text-foreground mb-4">
          Project Funding Overview
        </h3>
        <div className="space-y-4">
          {awards.map((award) => {
            const pct = Math.round(
              (award.disbursed / award.awardedAmount) * 100,
            );
            return (
              <div key={award.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-semibold text-[13px] text-foreground">
                      {award.title}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {award.researcher}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="font-mono text-xs text-muted-foreground">
                      {fmtCurrency(award.disbursed)} /{" "}
                      {fmtCurrency(award.awardedAmount)}
                    </span>
                    <span
                      className={`font-mono font-bold text-xs ${pct >= 80 ? "text-amber-500" : "text-primary"}`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="rounded-full overflow-hidden bg-muted h-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background:
                        pct >= 100 ? "#22C55E"
                        : pct >= 80 ? "#F59E0B"
                        : "linear-gradient(to right, var(--primary), #2D6EA8)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <h3 className="font-bold text-base text-foreground flex-1">
            Transaction History
          </h3>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-card border border-border flex-1 max-w-[260px]">
            <Search size={14} className="text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="bg-transparent outline-none flex-1 text-xs text-foreground"
            />
          </div>
          <div className="flex gap-2">
            {(["All", "Paid", "Pending", "Rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${statusFilter === f ? "border-primary bg-primary text-white font-semibold shadow-sm" : "border-border bg-card text-muted-foreground font-medium hover:bg-muted"}`}
              >
                {f}
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
                  {[
                    "ID",
                    "Type",
                    "Project",
                    "Description",
                    "Requested By",
                    "Date",
                    "Amount",
                    "Status",
                    role === "finance_officer" ? "Action" : "",
                  ]
                    .filter(Boolean)
                    .map((h) => (
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
                {paginated.map((t) => (
                  <tr
                    key={t.id}
                    className="bg-card hover:bg-muted transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {t.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {typeIcon(t.type)}
                        <span className="text-xs text-foreground whitespace-nowrap">
                          {t.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <span className="text-xs text-muted-foreground truncate block">
                        {t.projectTitle}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <span className="text-xs text-foreground truncate block">
                        {t.description}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {t.requestedBy}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {t.date}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-[13px] text-foreground whitespace-nowrap">
                        {fmtCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={t.status} size="sm" />
                    </td>
                    {role === "finance_officer" && (
                      <td className="px-4 py-3">
                        {t.status === "Pending" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() =>
                                setConfirmAction({ id: t.id, type: "approve" })
                              }
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500 text-white text-[11px] font-semibold whitespace-nowrap hover:opacity-90 transition-opacity"
                            >
                              <CheckCircle2 size={11} /> Approve
                            </button>
                            <button
                              onClick={() =>
                                setConfirmAction({ id: t.id, type: "reject" })
                              }
                              className="btn-destructive flex items-center gap-1 px-2 py-1 text-[11px] whitespace-nowrap"
                            >
                              <XCircle size={11} /> Reject
                            </button>
                          </div>
                        )}
                        {t.status !== "Pending" && (
                          <span className="text-[11px] text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
          <Pagination
            page={page}
            totalPages={totalPages}
            total={filtered.length}
            pageSize={10}
            onPage={setPage}
          />
        </div>

        {/* Mobile card list */}
        <div className="md:hidden space-y-3">
          {paginated.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-card border border-border p-4 space-y-2.5"
            >
              {/* Top row: type icon + type text + badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {typeIcon(t.type)}
                  <span className="text-xs text-foreground font-semibold">
                    {t.type}
                  </span>
                </div>
                <Badge status={t.status} size="sm" />
              </div>
              {/* Amount */}
              <div className="font-mono font-semibold text-sm text-foreground">
                {fmtCurrency(t.amount)}
              </div>
              {/* Project + description */}
              <div>
                <div className="text-[13px] font-semibold text-foreground truncate">
                  {t.projectTitle}
                </div>
                <div className="text-xs text-muted-foreground truncate mt-0.5">
                  {t.description}
                </div>
              </div>
              {/* Bottom row: date + requestedBy + actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {t.date}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {t.requestedBy}
                  </span>
                </div>
                {role === "finance_officer" && t.status === "Pending" && (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() =>
                        setConfirmAction({ id: t.id, type: "approve" })
                      }
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500 text-white text-[11px] font-semibold hover:opacity-90 transition-opacity"
                    >
                      <CheckCircle2 size={11} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        setConfirmAction({ id: t.id, type: "reject" })
                      }
                      className="btn-destructive flex items-center gap-1 px-2 py-1 text-[11px]"
                    >
                      <XCircle size={11} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={filtered.length}
            pageSize={10}
            onPage={setPage}
          />
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        title={
          confirmAction?.type === "approve" ?
            "Approve Disbursement"
          : "Reject Disbursement"
        }
        message={
          confirmAction?.type === "approve" ?
            "This will mark the transaction as Paid and release the funds. This action cannot be undone."
          : "This will reject the disbursement request. The researcher will be notified."
        }
        confirmLabel={confirmAction?.type === "approve" ? "Approve" : "Reject"}
        confirmColor={confirmAction?.type === "approve" ? "#22C55E" : "#EF4444"}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.type === "approve") approve(confirmAction.id);
          else reject(confirmAction.id);
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
