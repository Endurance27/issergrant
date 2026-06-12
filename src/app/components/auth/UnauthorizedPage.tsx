import { useNavigate } from 'react-router-dom'
import { ShieldX, LogOut, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '../../../store/auth.store'
import { ROLE_BASE_PATH } from '../../../types/user.types'
import { supabase } from '../../../lib/supabase'

export function UnauthorizedPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const userRole = user?.role ?? null

  const handleGoToDashboard = () => {
    if (userRole) {
      const basePath = ROLE_BASE_PATH[userRole] ?? '/login'
      navigate(`${basePath}/dashboard`, { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center">
            <ShieldX size={36} className="text-red-500" />
          </div>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground text-[14px] mt-2 leading-relaxed">
            You don't have permission to view this page.{' '}
            {user
              ? `Your account role is "${user.role.replace(/_/g, ' ')}" and does not have access to this section.`
              : 'Please log in to continue.'}
          </p>
        </div>

        {/* Debug info — remove before production */}
        {import.meta.env.DEV && user && (
          <div className="text-left p-4 rounded-xl bg-muted border border-border text-[12px] font-mono space-y-1">
            <p className="text-muted-foreground font-semibold mb-2">DEV — auth state</p>
            <p><span className="text-primary">user.id</span>: {user.id}</p>
            <p><span className="text-primary">user.role</span>: {user.role}</p>
            <p><span className="text-primary">user.email</span>: {user.email}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {user ? (
            <button
              onClick={handleGoToDashboard}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-[14px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}
            >
              <ArrowLeft size={16} />
              Go to My Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-[14px] shadow-sm hover:shadow-md transition-all"
              style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}
            >
              Back to Login
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border font-semibold text-[14px] text-muted-foreground hover:bg-muted transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
