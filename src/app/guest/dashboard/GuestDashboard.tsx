import { useAuthStore } from '../../../store/auth.store'
import { FileText, Award, Bell } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'

export function GuestDashboard() {
  const user = useAuthStore((s) => s.user)

  return (
    <div>
      <PageHeader
        title="Welcome back"
        subtitle={`Logged in as ${user?.name ?? 'Guest'} · Guest Collaborator`}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-card border border-border p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)10' }}>
            <FileText size={20} className="text-primary" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground">—</div>
            <div className="text-xs text-muted-foreground mt-0.5">Assigned Funding Calls</div>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-50">
            <Award size={20} className="text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground">—</div>
            <div className="text-xs text-muted-foreground mt-0.5">Assigned Proposals</div>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-green-50">
            <Bell size={20} className="text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground">—</div>
            <div className="text-xs text-muted-foreground mt-0.5">Recent Notifications</div>
          </div>
        </div>
      </div>

      {/* Recent notifications placeholder */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <h3 className="font-bold text-sm text-foreground mb-4">Recent Notifications</h3>
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Bell size={28} className="mb-2 opacity-30" />
          <p className="text-sm">No notifications yet</p>
        </div>
      </div>
    </div>
  )
}
