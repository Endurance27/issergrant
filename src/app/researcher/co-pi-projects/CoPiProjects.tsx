import { useState } from 'react'
import { Search, Users, ShieldAlert, Eye } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { useCoPrincipalInvestigatorProjects } from '../../../hooks/useCoPrincipalInvestigatorProjects'
import { toDisplayStatus } from '../../utils/proposalStatus'
import { fmtCurrency, fmtDateTime } from '../../utils/formatters'
import type { ProposalRecord } from '../../../types/proposal.types'

export function CoPiProjects() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ProposalRecord | null>(null)

  const { proposals, loading, error, refetch } = useCoPrincipalInvestigatorProjects()

  const filtered = proposals.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.user.name.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading && proposals.length === 0) {
    return (
      <div data-testid="copi-projects-loading">
        <PageHeader title="Co-PI Projects" subtitle="Loading projects…" />
        <div className="rounded-2xl overflow-hidden border border-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 border-b border-border bg-card animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div data-testid="copi-projects-error">
        <PageHeader title="Co-PI Projects" subtitle="Failed to load projects" />
        <div className="mt-8 flex flex-col items-center justify-center py-20 rounded-2xl border border-red-200 bg-red-50">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
            <ShieldAlert size={22} className="text-red-400" />
          </div>
          <div className="font-bold text-sm text-red-700">Unable to fetch projects</div>
          <div className="text-xs text-red-500 mt-1 mb-4">{error.message}</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: '#1A3363' }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div data-testid="copi-projects-page">
      <PageHeader
        title="Co-PI Projects"
        subtitle="Proposals where you are listed as a Co-Principal Investigator"
      />

      <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-5 bg-card border border-border focus-within:border-primary/50 transition-colors">
        <Search size={15} className="text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="bg-transparent outline-none flex-1 text-[13px] text-foreground"
        />
      </div>

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border text-muted-foreground"
          data-testid="copi-projects-empty"
        >
          <Users size={28} className="mb-3 opacity-40" />
          <div className="font-semibold text-sm">
            {proposals.length === 0 ? 'No Co-PI projects yet' : 'No matching projects'}
          </div>
          <div className="text-xs mt-1">
            {proposals.length === 0
              ? "You haven't been added as a Co-PI on any proposal"
              : 'Try a different search'}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <table className="w-full" data-testid="copi-projects-table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Principal Investigator</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Funding Call</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} data-testid="copi-project-row" className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/30'}`}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[13px] text-foreground">{p.title}</div>
                    <div className="text-[11px] text-muted-foreground md:hidden">{p.user.name}</div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground hidden md:table-cell">{p.user.name}</td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground hidden lg:table-cell">{p.fundingCall?.theme ?? '—'}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-[13px] text-foreground whitespace-nowrap">{fmtCurrency(p.requestedAmount)}</td>
                  <td className="px-4 py-3"><Badge status={toDisplayStatus(p.status)} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button onClick={() => setSelected(p)} title="View details" className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Project Details" width={560}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[15px] text-foreground">{selected.title}</span>
              <Badge status={toDisplayStatus(selected.status)} size="sm" />
            </div>
            <p className="text-[13px] text-foreground leading-relaxed">{selected.abstract}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Principal Investigator', value: selected.user.name },
                { label: 'Funding Call', value: selected.fundingCall?.theme ?? '—' },
                { label: 'Requested Amount', value: fmtCurrency(selected.requestedAmount) },
                { label: 'Submitted At', value: fmtDateTime(selected.submittedAt) },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-muted">
                  <div className="text-[11px] text-muted-foreground mb-0.5">{item.label}</div>
                  <div className="font-bold text-[13px] text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
