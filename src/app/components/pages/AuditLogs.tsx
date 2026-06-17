import { useState, useMemo } from "react";
import {
  Search,
  Shield,
  Download,
  ChevronUp,
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  ListChecks,
  Percent,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { StatCard } from "../ui/StatCard";
import { ScrollTable } from "../ui/ScrollTable";
import { PageHeader } from "../ui/PageHeader";
import { Pagination } from "../ui/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { useAuditLogs } from "../../../hooks/useAuditLogs";
import { useAuditMetrics } from "../../../hooks/useAuditMetrics";
import type { AuditLog } from "../../../types/auditLog.types";

const MODULE_COLORS: Record<string, string> = {
  Proposals: "#1A3363",
  Financial: "#10B981",
  Milestones: "#8B5CF6",
  "Grant Calls": "#F59E0B",
  "User Management": "#EF4444",
  Auth: "#64748B",
  Reports: "#06B6D4",
  Settings: "#F97316",
};

const ACTION_ICONS: Record<string, string> = {
  Approved: "✓",
  Rejected: "✗",
  Created: "+",
  Deleted: "−",
  Submitted: "↑",
  Updated: "✎",
};

const getActionIcon = (action: string) => {
  for (const [key, icon] of Object.entries(ACTION_ICONS)) {
    if (action.includes(key)) return icon;
  }
  return "·";
};

// Backend role enum → display label, for the Badge component
const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  director: "Director",
  finance_officer: "Finance Officer",
  researcher_pi: "Researcher (PI)",
  researcher_co_pi: "Researcher (Co-PI)",
};

function displayRole(role?: string | null): string {
  if (!role) return "—";
  return ROLE_LABEL[role] ?? role;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AuditLogs() {
  const { logs, totalCount, loading, error, refetch } = useAuditLogs();
  const { metrics } = useAuditMetrics();
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const modules = useMemo(
    () => ["All", ...Array.from(new Set(logs.map((l) => l.module)))],
    [logs],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const base = logs.filter((l: AuditLog) => {
      const matchSearch =
        !q ||
        l.action.toLowerCase().includes(q) ||
        (l.user?.name ?? "").toLowerCase().includes(q) ||
        (l.details ?? "").toLowerCase().includes(q) ||
        l.module.toLowerCase().includes(q);
      const matchModule = moduleFilter === "All" || l.module === moduleFilter;
      return matchSearch && matchModule;
    });
    return sortDir === "desc" ? [...base] : [...base].reverse();
  }, [logs, search, moduleFilter, sortDir]);

  const { paginated, page, totalPages, setPage } = usePagination(filtered, 12);

  const handleExport = () => {
    const rows = [
      ["Timestamp", "Action", "User", "Role", "Module", "IP", "Details"],
      ...filtered.map((l) => [
        l.createdAt,
        l.action,
        l.user?.name ?? "Unknown",
        displayRole(l.user?.role),
        l.module,
        l.ipAddress ?? "",
        l.details ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (loading && logs.length === 0) {
    return (
      <div data-testid="audit-logs-loading">
        <PageHeader title="Audit Logs" subtitle="Loading audit trail…" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-card border border-border h-24 animate-pulse"
            />
          ))}
        </div>
        <div className="rounded-2xl overflow-hidden border border-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-12 border-b border-border bg-card animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div data-testid="audit-logs-error">
        <PageHeader title="Audit Logs" subtitle="Failed to load audit trail" />
        <div className="mt-8 flex flex-col items-center justify-center py-20 rounded-2xl border border-red-200 bg-red-50">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
            <ShieldAlert size={22} className="text-red-400" />
          </div>
          <div className="font-bold text-sm text-red-700">
            Unable to fetch audit logs
          </div>
          <div className="text-xs text-red-500 mt-1 mb-4">{error.message}</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: "#1A3363" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="audit-logs-page">
      <PageHeader
        title="Audit Logs"
        subtitle={`${totalCount} total events recorded`}
        action={
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={15} /> Export CSV
          </button>
        }
      />

      {/* Audit metrics summary */}
      {metrics && (
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          data-testid="audit-metrics"
        >
          <StatCard
            label="Total Audits"
            value={metrics.totalAudits}
            icon={<ListChecks size={18} />}
            iconColor="#1A3363"
            iconBg="#E5EBF5"
          />
          <StatCard
            label="Compliance Rate"
            value={`${Math.round(metrics.complianceRate)}%`}
            icon={<Percent size={18} />}
            iconColor="#10B981"
            iconBg="#ECFDF5"
          />
          <StatCard
            label="Issues Found"
            value={metrics.issuesFound}
            icon={<ShieldAlert size={18} />}
            iconColor="#F59E0B"
            iconBg="#FFFBEB"
          />
          <StatCard
            label="Open Findings"
            value={metrics.openFindings}
            icon={<ShieldCheck size={18} />}
            iconColor="#EF4444"
            iconBg="#FEF2F2"
          />
        </div>
      )}

      {/* Module summary cards — scrollable on mobile */}
      <div
        className="flex gap-3 mb-5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" as const }}
      >
        <button
          onClick={() => setModuleFilter("All")}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${moduleFilter === "All" ? "border-primary bg-primary text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}
        >
          All ({logs.length})
        </button>
        {modules
          .filter((m) => m !== "All")
          .map((m) => {
            const count = logs.filter((l) => l.module === m).length;
            const color = MODULE_COLORS[m] || "#94A3B8";
            const isActive = moduleFilter === m;
            return (
              <button
                key={m}
                onClick={() => {
                  setModuleFilter(m);
                  setPage(1);
                }}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all hover:-translate-y-0.5 hover:shadow-sm"
                style={{
                  background: isActive ? color + "15" : "var(--card)",
                  borderColor: isActive ? color : "var(--border)",
                  color: isActive ? color : "var(--muted-foreground)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                {m}
                <span className="font-mono font-bold ml-0.5" style={{ color }}>
                  {count}
                </span>
              </button>
            );
          })}
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 flex-1 bg-card border border-border focus-within:border-primary/50 transition-colors">
          <Search size={15} className="text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search actions, users, modules, or details..."
            className="bg-transparent outline-none flex-1 text-[13px] text-foreground"
          />
        </div>
        <button
          onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-[13px] text-muted-foreground font-medium hover:bg-muted transition-colors whitespace-nowrap"
        >
          {sortDir === "desc" ?
            <ChevronDown size={14} />
          : <ChevronUp size={14} />}
          {sortDir === "desc" ? "Newest first" : "Oldest first"}
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl overflow-hidden border border-border">
        <ScrollTable>
          <table className="w-full" data-testid="audit-logs-table">
            <thead>
              <tr className="bg-muted border-b border-border">
                {[
                  "Timestamp",
                  "Action",
                  "User",
                  "Role",
                  "Module",
                  "IP Address",
                  "Details",
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
              {paginated.map((log) => {
                const color = MODULE_COLORS[log.module] || "#94A3B8";
                return (
                  <tr
                    key={log.id}
                    data-testid="audit-log-row"
                    className="bg-card hover:bg-muted transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {formatTimestamp(log.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex items-center justify-center w-[22px] h-[22px] rounded-full flex-shrink-0 font-bold text-[10px]"
                          style={{ background: color + "20", color }}
                        >
                          {getActionIcon(log.action)}
                        </div>
                        <span className="font-semibold text-xs text-foreground">
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-medium text-foreground">
                        {log.user?.name ?? "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={displayRole(log.user?.role)} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-lg text-[11px] font-semibold whitespace-nowrap"
                        style={{ background: color + "15", color }}
                      >
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {log.ipAddress ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <span className="text-xs text-muted-foreground truncate block">
                        {log.details ?? "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScrollTable>

        {paginated.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-14"
            data-testid="audit-logs-empty"
          >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Shield size={24} className="text-muted-foreground opacity-40" />
            </div>
            <div className="font-bold text-sm text-foreground">
              {logs.length === 0 ? "No audit events yet" : "No matching log entries"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {logs.length === 0
                ? "Activity will appear here as it happens"
                : "Try adjusting your search or filter"}
            </div>
          </div>
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          pageSize={12}
          onPage={setPage}
        />
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {paginated.map((log) => {
          const color = MODULE_COLORS[log.module] || "#94A3B8";
          return (
            <div
              key={log.id}
              data-testid="audit-log-row"
              className="rounded-2xl bg-card border border-border p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 font-bold text-[10px]"
                    style={{ background: color + "20", color }}
                  >
                    {getActionIcon(log.action)}
                  </div>
                  <span className="font-bold text-[13px] text-foreground">
                    {log.action}
                  </span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold flex-shrink-0"
                  style={{ background: color + "15", color }}
                >
                  {log.module}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-muted-foreground">User</div>
                  <div className="text-xs font-semibold text-foreground">
                    {log.user?.name ?? "Unknown"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Role</div>
                  <Badge status={displayRole(log.user?.role)} size="sm" />
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground">
                {log.details ?? "—"}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formatTimestamp(log.createdAt)}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {log.ipAddress ?? "—"}
                </span>
              </div>
            </div>
          );
        })}
        {paginated.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-14 rounded-2xl border border-dashed border-border"
            data-testid="audit-logs-empty"
          >
            <Shield
              size={28}
              className="text-muted-foreground opacity-30 mb-3"
            />
            <div className="font-bold text-sm text-foreground">
              {logs.length === 0 ? "No audit events yet" : "No log entries"}
            </div>
          </div>
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          pageSize={12}
          onPage={setPage}
        />
      </div>
    </div>
  );
}
