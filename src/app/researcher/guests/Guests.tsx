import { useState } from 'react'
import { Search, Plus, Eye, UserPlus, Users, ShieldAlert } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { useAuthStore } from '../../../store/auth.store'
import { useNavigate } from 'react-router-dom'
import { useGuests, type Guest } from '../../../hooks/useGuests'
import { useFundingCalls } from '../../../hooks/useFundingCall'
import { AssignGuestToFundingCallModal } from './AssignGuestToFundingCall'

function displayStatus(status: string): string {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function Guests() {
  const currentUser = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Guest | null>(null)
  const [assignTarget, setAssignTarget] = useState<Guest | null>(null)

  const { guests, loading, error, refetch, isOrgWide } = useGuests()
  const { fundingCalls } = useFundingCalls()

  const basePath =
    currentUser?.role === 'admin' ? '/admin'
    : currentUser?.role === 'director' ? '/director'
    : '/researcher'

  const filtered = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.department.toLowerCase().includes(search.toLowerCase())
  )

  if (loading && guests.length === 0) {
    return (
      <div data-testid="guests-loading">
        <PageHeader title="Guest Collaborators" subtitle="Loading guests…" />
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
      <div data-testid="guests-error">
        <PageHeader title="Guest Collaborators" subtitle="Failed to load guests" />
        <div className="mt-8 flex flex-col items-center justify-center py-20 rounded-2xl border border-red-200 bg-red-50">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
            <ShieldAlert size={22} className="text-red-400" />
          </div>
          <div className="font-bold text-sm text-red-700">Unable to fetch guests</div>
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
    <div data-testid="guests-page">
      <PageHeader
        title="Guest Collaborators"
        subtitle={isOrgWide ? 'All guests across the system' : 'Guests assigned to you'}
        action={
          <button
            onClick={() => navigate(`${basePath}/guests/create`)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Add Guest
          </button>
        }
      />

      <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-5 bg-card border border-border focus-within:border-primary/50 transition-colors">
        <Search size={15} className="text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guests..." className="bg-transparent outline-none flex-1 text-[13px] text-foreground" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border text-muted-foreground" data-testid="guests-empty">
          <Users size={28} className="mb-3 opacity-40" />
          <div className="font-semibold text-sm">{guests.length === 0 ? 'No guests yet' : 'No matching guests'}</div>
          <div className="text-xs mt-1">
            {guests.length === 0 ? 'Add a guest collaborator to get started' : 'Try a different search'}
          </div>
          {guests.length === 0 && (
            <button onClick={() => navigate(`${basePath}/guests/create`)} className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[13px] font-semibold" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>
              <UserPlus size={14} /> Add First Guest
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <table className="w-full" data-testid="guests-table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Department</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => (
                <tr key={g.id} data-testid="guest-row" className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/30'}`}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[13px] text-foreground">{g.name}</div>
                    <div className="text-[11px] text-muted-foreground md:hidden">{g.email}</div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground hidden md:table-cell">{g.email}</td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground hidden lg:table-cell">{g.department}</td>
                  <td className="px-4 py-3"><Badge status={displayStatus(g.status)} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setSelected(g)} title="View details" className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                      <button onClick={() => setAssignTarget(g)} title="Assign to funding call" className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"><UserPlus size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Guest details modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Guest Details" width={480}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[15px] text-foreground">{selected.name}</span>
              <Badge status={displayStatus(selected.status)} size="sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Email', value: selected.email },
                { label: 'Department', value: selected.department },
                { label: 'Staff / Guest ID', value: selected.staffId || '—' },
                { label: 'Phone', value: selected.phoneContact || '—' },
                { label: 'Added', value: selected.createdAt?.slice(0, 10) ?? '—' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-muted">
                  <div className="text-[11px] text-muted-foreground mb-0.5">{item.label}</div>
                  <div className="font-bold text-[13px] text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setAssignTarget(selected); setSelected(null) }}
              className="w-full py-2.5 rounded-xl text-white font-semibold text-[13px] flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}
            >
              <UserPlus size={14} /> Assign to Funding Call
            </button>
          </div>
        )}
      </Modal>

      {/* Assign-to-funding-call modal */}
      <AssignGuestToFundingCallModal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        guests={assignTarget ? [{ id: assignTarget.id, name: assignTarget.name }] : guests.map(g => ({ id: g.id, name: g.name }))}
        fundingCalls={fundingCalls.map(fc => ({ id: fc.id, theme: fc.theme }))}
        preselectedGuestId={assignTarget?.id}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
