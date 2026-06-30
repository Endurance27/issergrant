import { useNavigate } from "react-router-dom";
import { DirectorDashboardPage as DirectorDashboardFeaturePage } from "../../director/dashboard";
import { DirectorReportsPage as DirectorReportsFeaturePage } from "../../director/reports";
import { DirectorProposalsPage as DirectorProposalsPageComponent } from "../../director/proposals/DirectorProposalsPage";
import { GrantCalls } from "../../components/pages/GrantCalls";
import { Awards } from "../../components/pages/Awards";
import { Financial } from "../../components/pages/Financial";
import { Analytics } from "../../components/pages/Analytics";
import { Notifications } from "../../components/pages/Notifications";
import { CalendarPage } from "../../components/pages/CalendarPage";
import { Settings } from "../../components/pages/Settings";
import { UserManagement } from "../../components/pages/UserManagement";
import { AuditLogs } from "../../components/pages/AuditLogs";
import { useAuthContext } from "../../context/AuthContext";
import { Guests } from "../../researcher/guests/Guests";
import type { NavState } from "../../App";

function useDirectorNav() {
  const navigate = useNavigate();
  return (page: string, state?: NavState) =>
    navigate("/director/" + page, state ? { state } : undefined);
}

export function DirectorDashboardPage() {
  const nav = useDirectorNav();
  return <DirectorDashboardFeaturePage onNavigate={nav} />;
}

export function DirectorDashboard() {
  const nav = useDirectorNav();
  return <DirectorDashboardFeaturePage onNavigate={nav} />;
}

export function DirectorGrantCallsPage() {
  const nav = useDirectorNav();
  return <GrantCalls role="director" onNavigate={nav} />;
}

export function DirectorProposalsPage() {
  return <DirectorProposalsPageComponent />;
}

export function DirectorAwardsPage() {
  const nav = useDirectorNav();
  return <Awards role="director" onNavigate={nav} />;
}

export function DirectorFinancialPage() {
  return <Financial role="director" />;
}

export function DirectorReportsPage() {
  return <DirectorReportsFeaturePage />;
}

export function DirectorAnalyticsPage() {
  return <Analytics />;
}

export function DirectorCalendarPage() {
  return <CalendarPage />;
}

export function DirectorNotificationsPage() {
  return <Notifications />;
}

export function DirectorUsersPage() {
  return <UserManagement role="Director" />;
}

export function DirectorAuditPage() {
  return <AuditLogs />;
}

export function DirectorSettingsPage() {
  const { darkMode, toggleDark } = useAuthContext();
  return (
    <Settings role="Director" darkMode={darkMode} onToggleDark={toggleDark} />
  );
}

export function DirectorGuestsPage() {
  return <Guests />;
}
