import { useNavigate, useLocation } from "react-router-dom";
import { Dashboard } from "../../components/pages/Dashboard";
import { GrantCalls } from "../../components/pages/GrantCalls";
import { Proposals } from "../../components/pages/Proposals";
import { Milestones } from "../../components/pages/Milestones";
import { Reports } from "../../components/pages/Reports";
import { Notifications } from "../../components/pages/Notifications";
import { CalendarPage } from "../../components/pages/CalendarPage";
import { Settings } from "../../components/pages/Settings";
import { useAuthContext } from "../../context/AuthContext";
import type { NavState } from "../../App";

function useAssistantNav() {
  const navigate = useNavigate();
  return (page: string, state?: NavState) =>
    navigate('/assistant/' + page, state ? { state } : undefined);
}

export function AssistantDashboardPage() {
  const nav = useAssistantNav();
  return <Dashboard role="Assistant Researcher" onNavigate={nav} />;
}

export function AssistantGrantCallsPage() {
  const nav = useAssistantNav();
  return <GrantCalls role="Assistant Researcher" onNavigate={nav} />;
}

export function AssistantProposalsPage() {
  const location = useLocation();
  const navState = (location.state as NavState | null) ?? null;
  return <Proposals role="Assistant Researcher" navState={navState} />;
}

export function AssistantMilestonesPage() {
  return <Milestones role="Assistant Researcher" />;
}

export function AssistantReportsPage() {
  return <Reports role="Assistant Researcher" />;
}

export function AssistantNotificationsPage() {
  return <Notifications />;
}

export function AssistantCalendarPage() {
  return <CalendarPage />;
}

export function AssistantSettingsPage() {
  const { darkMode, toggleDark } = useAuthContext();
  return <Settings role="Assistant Researcher" darkMode={darkMode} onToggleDark={toggleDark} />;
}
