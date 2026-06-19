import { GuestDashboard } from '../../guest/dashboard/GuestDashboard'
import { GuestFundingCalls } from '../../guest/studies/GuestFundingCalls'
import { GuestProposals } from '../../guest/studies/GuestProposals'
import { Notifications } from '../../components/pages/Notifications'
import { Settings } from '../../components/pages/Settings'
import { useAuthContext } from '../../context/AuthContext'

export function GuestDashboardPage() { return <GuestDashboard /> }
export function GuestFundingCallsPage() { return <GuestFundingCalls /> }
export function GuestProposalsPage() { return <GuestProposals /> }
export function GuestNotificationsPage() { return <Notifications /> }
export function GuestSettingsPage() {
  const { darkMode, toggleDark } = useAuthContext()
  return <Settings role="Guest" darkMode={darkMode} onToggleDark={toggleDark} />
}
