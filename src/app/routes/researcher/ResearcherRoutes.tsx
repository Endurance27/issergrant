import { useNavigate, useLocation } from "react-router-dom";
import { ResearcherDashboardPage as ResearcherDashboardFeaturePage } from "../../researcher/dashboard";
import { DraftsPage } from "../../researcher/drafts/DraftsPage";
import { GrantCalls } from "../../components/pages/GrantCalls";
import { Proposals } from "../../components/pages/Proposals";
import { Milestones } from "../../components/pages/Milestones";
import { Awards } from "../../components/pages/Awards";
import { Reports } from "../../components/pages/Reports";
import { Notifications } from "../../components/pages/Notifications";
import { CalendarPage } from "../../components/pages/CalendarPage";
import { Settings } from "../../components/pages/Settings";
import { useAuthContext } from "../../context/AuthContext";
import { UserManagement } from "../../components/pages/UserManagement";
import { CoPiProjects } from "../../researcher/co-pi-projects/CoPiProjects";
import type { NavState } from "../../App";

function useResearcherNav() {
  const navigate = useNavigate();
  return (page: string, state?: NavState) =>
    navigate('/researcher/' + page, state ? { state } : undefined);
}

export function ResearcherDashboardPage() {
  const nav = useResearcherNav();
  return <ResearcherDashboardFeaturePage onNavigate={nav} />;
}

export function ResearcherGrantCallsPage() {
  const nav = useResearcherNav();
  return <GrantCalls role="Researcher" onNavigate={nav} />;
}

export function ResearcherProposalsPage() {
  const location = useLocation();
  const navState = (location.state as NavState | null) ?? null;
  return <Proposals role="researcher" navState={navState} />;
}

export function ResearcherMilestonesPage() {
  return <Milestones role="Researcher" />;
}

export function ResearcherAwardsPage() {
  const nav = useResearcherNav();
  return <Awards role="Researcher" onNavigate={nav} />;
}

export function ResearcherReportsPage() {
  return <Reports role="Researcher" />;
}

export function ResearcherNotificationsPage() {
  return <Notifications />;
}

export function ResearcherCalendarPage() {
  return <CalendarPage />;
}

export function ResearcherSettingsPage() {
  const { darkMode, toggleDark } = useAuthContext();
  return <Settings role="Researcher" darkMode={darkMode} onToggleDark={toggleDark} />;
}

export function ResearcherTeamMembersPage() {
  return <UserManagement role="Researcher" />;
}

export function ResearcherDraftsPage() {
  return <DraftsPage />;
}

export function ResearcherCoPiProjectsPage() {
  return <CoPiProjects />;
}
