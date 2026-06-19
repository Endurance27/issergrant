import { useNavigate, useLocation } from "react-router-dom";
import { AdminDashboardPage as AdminDashboardFeaturePage } from "../../admin/dashboard";
import { GrantCalls } from "../../components/pages/GrantCalls";
import { Proposals } from "../../components/pages/Proposals";
import { Awards } from "../../components/pages/Awards";
import { Financial } from "../../components/pages/Financial";
import { Reports } from "../../components/pages/Reports";
import { Analytics } from "../../components/pages/Analytics";
import { Notifications } from "../../components/pages/Notifications";
import { CalendarPage } from "../../components/pages/CalendarPage";
import { Settings } from "../../components/pages/Settings";
import { useAuthContext } from "../../context/AuthContext";
import { Guests } from "../../researcher/guests/Guests";
import type { NavState } from "../../App";

function useDirectorNav() {
  const navigate = useNavigate();
  return (page: string, state?: NavState) =>
    navigate('/director/' + page, state ? { state } : undefined);
}

export function DirectorDashboardPage() {
  const nav = useDirectorNav();
  return <AdminDashboardFeaturePage onNavigate={nav} />;
}

export function DirectorGrantCallsPage() {
  const nav = useDirectorNav();
  return <GrantCalls role="Director" onNavigate={nav} />;
}

export function DirectorProposalsPage() {
  const location = useLocation();
  const navState = (location.state as NavState | null) ?? null;
  return <Proposals role="Director" navState={navState} />;
}

export function DirectorAwardsPage() {
  const nav = useDirectorNav();
  return <Awards role="Director" onNavigate={nav} />;
}

export function DirectorFinancialPage() {
  return <Financial role="Director" />;
}

export function DirectorReportsPage() {
  return <Reports role="Director" />;
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

export function DirectorSettingsPage() {
  const { darkMode, toggleDark } = useAuthContext();
  return <Settings role="Director" darkMode={darkMode} onToggleDark={toggleDark} />;
}

export function DirectorGuestsPage() {
  return <Guests />;
}
