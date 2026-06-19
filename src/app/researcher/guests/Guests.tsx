import { useState } from 'react'
import { Search, Plus, Eye, UserPlus, Users } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { useAuthStore } from '../../../store/auth.store'
import { useNavigate } from 'react-router-dom'

interface GuestRecord {
  id: string; name: string; email: string; department: string
  status: string; assignedFundingCalls: string[]
}

// Placeholder data — replace with Apollo query in production
const MOCK_GUESTS: GuestRecord[] = []

export function Guests() {
  const currentUser = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'director'
  const basePath = currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'director' ? '/director' : '/researcher'

  const filtered = MOCK_GUESTS.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.department.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Guest Collaborators"
        subtitle={isAdmin ? 'All guests across the system' : 'Guests assigned to you'}
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
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border text-muted-foreground">
          <Users size={28} className="mb-3 opacity-40" />
          <div className="font-semibold text-sm">No guests yet</div>
          <div className="text-xs mt-1">Add a guest collaborator to get started</div>
          <button onClick={() => navigate(`${basePath}/guests/create`)} className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[13px] font-semibold" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>
            <UserPlus size={14} /> Add First Guest
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Department</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Assigned Calls</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => (
                <tr key={g.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/30'}`}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[13px] text-foreground">{g.name}</div>
                    <div className="text-[11px] text-muted-foreground md:hidden">{g.email}</div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground hidden md:table-cell">{g.email}</td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground hidden lg:table-cell">{g.department}</td>
                  <td className="px-4 py-3"><Badge status={g.status} size="sm" /></td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground hidden lg:table-cell">{g.assignedFundingCalls.length}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"><UserPlus size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
