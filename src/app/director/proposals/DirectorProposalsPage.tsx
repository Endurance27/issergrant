import { useState, useMemo } from 'react'
import { Search, FileText, X } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { Pagination } from '../../components/ui/Pagination'
import { StatCard } from '../../components/ui/StatCard'
import { usePagination } from '../../../hooks/usePagination'
import { useAllSubmittedProposals } from '../../../hooks/useDirectorProposals'
import type { ProposalRecord } from '../../../types/proposal.types'

// ── Constants ─────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  'Macroeconomic Policy',
  'Trade and Development',
  'Public Finance',
  'Poverty and Inequality',
  'Labour Economics',
  'Education',
  'Health',
  'Gender Studies',
  'Governance',
  'Social Protection and Development Policy',
  'Survey Design and Implementation',
  'Statistical Analysis',
  'Data Management',
  'Research Methods and Data Visualization',
]

const STATUSES = ['All', 'Submitted', 'Under Review', 'Approved', 'Rejected']

const fmtCurrency = (n: number) =>
  `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 0 })}`

const fmtDate = (iso: string | boolean | undefined | null): string => {
  if (!iso || typeof iso === 'boolean') return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return String(iso)
  return d.toLocaleDateString('en-GH', { year: 'numeric', month: 'short', day: 'numeric' })
}

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
  )
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
  )
}

// ── Detail Modal ──────────────────────────────────────────────────────────────

function ProposalDetailModal({
  proposal,
  onClose,
}: {
  proposal: ProposalRecord | null
  onClose: () => void
}) {
  return (
    <Modal open={!!proposal} onClose={onClose} title="Proposal Details" width={680}>
      {proposal && (
        <div className="space-y-5 max-h-[78vh] overflow-y-auto pr-1">
          {/* Title + Status */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-extrabold text-[17px] text-foreground leading-snug flex-1">
              {proposal.title}
            </h2>
            <Badge status={proposal.status} />
          </div>

          {/* Abstract */}
          <div className="p-4 rounded-xl bg-muted border-l-4 border-primary">
            <div className="font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.05em] mb-2">
              Abstract
            </div>
            <p className="text-[13px] text-foreground leading-relaxed whitespace-pre-wrap">
              {proposal.abstract}
            </p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Funding Call', value: proposal.fundingCallTitle || '—' },
              {
                label: 'Requested Amount',
                value: fmtCurrency(proposal.requestedAmount),
              },
              { label: 'Department', value: proposal.department },
              { label: 'Last Updated', value: fmtDate(proposal.updatedAt) },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-muted">
                <div className="text-[11px] text-muted-foreground mb-0.5">{item.label}</div>
                <div className="font-bold text-[13px] text-foreground">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Principal Investigator */}
          <div>
            <div className="font-bold text-[13px] text-foreground mb-2">
              Principal Investigator
            </div>
            <div className="p-3 rounded-xl bg-muted grid grid-cols-3 gap-2">
              <div>
                <div className="text-[11px] text-muted-foreground">Name</div>
                <div className="font-semibold text-[13px] text-foreground">
                  {proposal.principalInvestigator.name}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Email</div>
                <div className="font-semibold text-[13px] text-foreground truncate">
                  {proposal.principalInvestigator.email}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Department</div>
                <div className="font-semibold text-[13px] text-foreground">
                  {proposal.principalInvestigator.department}
                </div>
              </div>
            </div>
          </div>

          {/* Co-PI */}
          {proposal.coPrincipalInvestigator && (
            <div>
              <div className="font-bold text-[13px] text-foreground mb-2">
                Co-Principal Investigator
              </div>
              <div className="p-3 rounded-xl bg-muted grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[11px] text-muted-foreground">Name</div>
                  <div className="font-semibold text-[13px] text-foreground">
                    {proposal.coPrincipalInvestigator.name}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">Email</div>
                  <div className="font-semibold text-[13px] text-foreground truncate">
                    {proposal.coPrincipalInvestigator.email}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">Department</div>
                  <div className="font-semibold text-[13px] text-foreground">
                    {proposal.coPrincipalInvestigator.department}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collaborators */}
          {proposal.collaborators && proposal.collaborators.length > 0 && (
            <div>
              <div className="font-bold text-[13px] text-foreground mb-2">
                Collaborators ({proposal.collaborators.length})
              </div>
              <div className="space-y-2">
                {proposal.collaborators.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-muted flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-[13px] text-foreground">
                        {c.guest.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{c.guest.email}</div>
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
        </div>
      )}
    </Modal>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function DirectorProposalsPage() {
  const { proposals, loading, error } = useAllSubmittedProposals()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [deptFilter, setDeptFilter] = useState('All')
  const [selected, setSelected] = useState<ProposalRecord | null>(null)

  // Client-side filtering
  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.principalInvestigator?.name?.toLowerCase().includes(q) ||
        (p.fundingCallTitle ?? '').toLowerCase().includes(q)
      const matchStatus = statusFilter === 'All' || p.status === statusFilter
      const matchDept = deptFilter === 'All' || p.department === deptFilter
      return matchSearch && matchStatus && matchDept
    })
  }, [proposals, search, statusFilter, deptFilter])

  const { paginated, page, totalPages, setPage } = usePagination(filtered, 10)

  // Stats
  const totalCount = proposals.length
  const submittedCount = proposals.filter((p) => p.status === 'Submitted').length
  const underReviewCount = proposals.filter((p) => p.status === 'Under Review').length
  const approvedCount = proposals.filter((p) => p.status === 'Approved').length

  return (
    <div>
      <PageHeader
        title="Submitted Proposals"
        subtitle="Global research activity — read only"
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total"
          value={loading ? '—' : totalCount}
          icon={<FileText size={18} />}
          iconColor="#1A3363"
          iconBg="#E5EBF5"
          subtitle="All proposals"
        />
        <StatCard
          label="Submitted"
          value={loading ? '—' : submittedCount}
          icon={<FileText size={18} />}
          iconColor="#2563EB"
          iconBg="#EFF6FF"
          subtitle="Awaiting review"
        />
        <StatCard
          label="Under Review"
          value={loading ? '—' : underReviewCount}
          icon={<FileText size={18} />}
          iconColor="#C2410C"
          iconBg="#FFF7ED"
          subtitle="Being evaluated"
        />
        <StatCard
          label="Approved"
          value={loading ? '—' : approvedCount}
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
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by title, PI name, or funding call..."
            className="bg-transparent outline-none flex-1 text-[13px] text-foreground"
          />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1) }} className="text-muted-foreground hover:text-foreground">
              <X size={13} />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="rounded-xl px-3 py-2 bg-card border border-border text-[13px] text-foreground outline-none cursor-pointer"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
          ))}
        </select>

        <select
          value={deptFilter}
          onChange={(e) => { setDeptFilter(e.target.value); setPage(1) }}
          className="rounded-xl px-3 py-2 bg-card border border-border text-[13px] text-foreground outline-none cursor-pointer max-w-[220px]"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
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
                {['Title / Funding Call', 'Status', 'Principal Investigator', 'Amount', 'Updated', ''].map((h) => (
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
                  <tr key={p.id} className="bg-card hover:bg-muted transition-colors">
                    <td className="px-4 py-3 max-w-[260px]">
                      <div className="font-semibold text-[13px] text-foreground truncate">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {p.fundingCallTitle || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={p.status} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[13px] text-foreground whitespace-nowrap">
                        {p.principalInvestigator?.name ?? '—'}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {p.principalInvestigator?.department ?? ''}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-xs text-foreground whitespace-nowrap">
                        {fmtCurrency(p.requestedAmount)}
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
                        View Details
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
              <FileText size={24} className="opacity-40 text-muted-foreground" />
            </div>
            <div className="font-bold text-sm text-foreground">No proposals found</div>
            <div className="text-xs text-muted-foreground mt-1">
              {search ? `No results for "${search}"` : 'Try changing your filters'}
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
              <FileText size={24} className="opacity-40 text-muted-foreground" />
            </div>
            <div className="font-bold text-sm text-foreground">No proposals found</div>
            <div className="text-xs text-muted-foreground mt-1">
              {search ? `No results for "${search}"` : 'Try changing your filters'}
            </div>
          </div>
        : paginated.map((p) => (
            <div key={p.id} className="rounded-2xl bg-card border border-border p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground truncate flex-1">
                  {p.fundingCallTitle || '—'}
                </span>
                <Badge status={p.status} size="sm" />
              </div>
              <div className="font-bold text-[13px] text-foreground leading-snug">{p.title}</div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground">
                  {p.principalInvestigator?.name ?? '—'}
                </span>
                <span className="font-mono font-semibold text-xs text-foreground">
                  {fmtCurrency(p.requestedAmount)}
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
                  View Details
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

      {/* Detail modal */}
      <ProposalDetailModal proposal={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
