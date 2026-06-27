import { useMemo, useState } from 'react'
import { Search, FileEdit, FileText, Edit3, Eye } from 'lucide-react'
import { useMyDraftProposals } from '../../../hooks/useDraftProposals'
import { CreateProposalForm } from '../../components/proposals/CreateProposalForm'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { Pagination } from '../../components/ui/Pagination'
import { usePagination } from '../../../hooks/usePagination'
import { toDisplayStatus } from '../../utils/proposalStatus'
import type { ProposalRecord } from '../../../types/proposal.types'

const PAGE_SIZE = 8

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Draft:        { bg: 'bg-gray-100', text: 'text-gray-600' },
  Submitted:    { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Under Review': { bg: 'bg-amber-100', text: 'text-amber-700' },
  Approved:     { bg: 'bg-green-100', text: 'text-green-700' },
  Rejected:     { bg: 'bg-red-100', text: 'text-red-700' },
}

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${c.bg} ${c.text}`}>
      {status}
    </span>
  )
}

// ── Progress indicator ────────────────────────────────────────────────────────

function MiniProgress({ proposal }: { proposal: ProposalRecord }) {
  const filled = [
    proposal.fundingCall?.id,
    proposal.title,
    proposal.abstract,
    proposal.requestedAmount,
  ].filter(v => v !== undefined && v !== null && v !== '' && v !== 0).length
  const pct = Math.round((filled / 4) * 100)
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--primary), #2D6EA8)' }}
        />
      </div>
      <span className="text-[11px] text-muted-foreground">{pct}%</span>
    </div>
  )
}

// ── Relative time ─────────────────────────────────────────────────────────────

function relativeTime(iso?: string): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

// ── DraftsPage ────────────────────────────────────────────────────────────────

export function DraftsPage() {
  const { drafts: allDrafts, loading, error, refetch } = useMyDraftProposals()
  const [search, setSearch] = useState('')
  const [editingProposal, setEditingProposal] = useState<ProposalRecord | null>(null)

  const drafts: ProposalRecord[] = useMemo(() => {
    if (!search.trim()) return allDrafts
    const q = search.toLowerCase()
    return allDrafts.filter(
      p =>
        (p.title ?? '').toLowerCase().includes(q) ||
        (p.fundingCall?.theme ?? '').toLowerCase().includes(q),
    )
  }, [allDrafts, search])

  const { paginated, page, totalPages, setPage } = usePagination(
    drafts as unknown as Record<string, unknown>[],
    PAGE_SIZE,
  )

  return (
    <div>
      <PageHeader
        title="Draft Proposals"
        subtitle={`${allDrafts.length} draft${allDrafts.length === 1 ? '' : 's'} in progress`}
        action={
          <button
            onClick={() => setEditingProposal({} as ProposalRecord)}
            className="btn-primary flex items-center gap-2 text-[13px]"
          >
            <FileEdit size={15} /> New Draft
          </button>
        }
      />

      {/* Search */}
      <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-5 bg-card border border-border focus-within:border-primary/50 transition-colors max-w-sm">
        <Search size={15} className="text-muted-foreground" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search by title or funding call…"
          className="bg-transparent outline-none flex-1 text-[13px] text-foreground"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading drafts…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center justify-center py-20 text-red-500 text-sm">
          Failed to load drafts. <button onClick={() => refetch()} className="ml-2 underline">Retry</button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && drafts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <FileText size={24} className="opacity-40 text-muted-foreground" />
          </div>
          <div className="font-bold text-sm text-foreground">No draft proposals</div>
          <div className="text-xs text-muted-foreground mt-1">
            {search ? `No results for "${search}"` : 'Start a new draft to save your work in progress.'}
          </div>
        </div>
      )}

      {/* Desktop table */}
      {!loading && !error && drafts.length > 0 && (
        <>
          <div className="hidden md:block rounded-2xl overflow-hidden border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.05em]">Title</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.05em]">Funding Call</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.05em]">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.05em]">Progress</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.05em]">Last Updated</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(paginated as unknown as ProposalRecord[]).map(p => (
                  <tr key={p.id} className="bg-card hover:bg-muted transition-colors">
                    <td className="px-4 py-3 max-w-[220px]">
                      <div className="font-semibold text-[13px] text-foreground truncate">
                        {p.title || <span className="italic text-muted-foreground">Untitled Draft</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <span className="text-xs text-muted-foreground truncate block">
                        {p.fundingCall?.theme || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={toDisplayStatus(p.status)} />
                    </td>
                    <td className="px-4 py-3">
                      <MiniProgress proposal={p} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-muted-foreground">{relativeTime(p.updatedAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {toDisplayStatus(p.status) === 'Draft' ? (
                          <button
                            onClick={() => setEditingProposal(p)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
                          >
                            <Edit3 size={12} /> Continue Editing
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingProposal(p)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-muted-foreground border border-border hover:bg-muted transition-colors"
                          >
                            <Eye size={12} /> View Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              page={page}
              totalPages={totalPages}
              total={drafts.length}
              pageSize={PAGE_SIZE}
              onPage={setPage}
            />
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {(paginated as unknown as ProposalRecord[]).map(p => (
              <div key={p.id} className="rounded-2xl bg-card border border-border p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={toDisplayStatus(p.status)} />
                  <span className="text-[11px] text-muted-foreground">{relativeTime(p.updatedAt)}</span>
                </div>
                <div>
                  <div className="font-bold text-[13px] text-foreground leading-snug">
                    {p.title || <span className="italic text-muted-foreground">Untitled Draft</span>}
                  </div>
                  {p.fundingCall?.theme && (
                    <div className="text-[11px] text-muted-foreground mt-0.5">{p.fundingCall.theme}</div>
                  )}
                </div>
                <MiniProgress proposal={p} />
                <div className="pt-1 border-t border-border">
                  {toDisplayStatus(p.status) === 'Draft' ? (
                    <button
                      onClick={() => setEditingProposal(p)}
                      className="flex items-center gap-1.5 text-[12px] font-semibold text-primary"
                    >
                      <Edit3 size={12} /> Continue Editing
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingProposal(p)}
                      className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground"
                    >
                      <Eye size={12} /> View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
            <Pagination
              page={page}
              totalPages={totalPages}
              total={drafts.length}
              pageSize={PAGE_SIZE}
              onPage={setPage}
            />
          </div>
        </>
      )}

      {/* Edit / Create modal */}
      <Modal
        open={editingProposal !== null}
        onClose={() => setEditingProposal(null)}
        title={editingProposal?.id ? 'Edit Draft Proposal' : 'New Draft Proposal'}
        width={640}
      >
        <CreateProposalForm
          existingProposal={editingProposal?.id ? editingProposal : undefined}
          onSuccess={(saved) => {
            setEditingProposal(null)
            refetch()
            return saved
          }}
          onCancel={() => setEditingProposal(null)}
        />
      </Modal>
    </div>
  )
}
