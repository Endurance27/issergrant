import { useNavigate, useLocation } from "react-router-dom";
import { AdminDashboardPage as AdminDashboardFeaturePage } from "../../../components/admin/pages/Dashboard";
import { UserManagementPage } from "../../../components/admin/pages/Users";
import { GrantCalls } from "../../components/pages/GrantCalls";
import { Proposals } from "../../components/pages/Proposals";
import { Awards } from "../../components/pages/Awards";
import { Milestones } from "../../components/pages/Milestones";
import { Financial } from "../../components/pages/Financial";
import { Reports } from "../../components/pages/Reports";
import { Notifications } from "../../components/pages/Notifications";
import { Analytics } from "../../components/pages/Analytics";
import { AuditLogs } from "../../components/pages/AuditLogs";
import { CalendarPage } from "../../components/pages/CalendarPage";
import { Settings } from "../../components/pages/Settings";
import { useAuthContext } from "../../context/AuthContext";
import type { NavState } from "../../App";

function useAdminNav() {
  const navigate = useNavigate();
  return (page: string, state?: NavState) =>
    navigate('/admin/' + page, state ? { state } : undefined);
}

export function AdminDashboardPage() {
  const nav = useAdminNav();
  return <AdminDashboardFeaturePage onNavigate={nav} />;
}

export function AdminGrantCallsPage() {
  const nav = useAdminNav();
  return <GrantCalls role="Admin" onNavigate={nav} />;
}

export function AdminProposalsPage() {
  const location = useLocation();
  const navState = (location.state as NavState | null) ?? null;
  return <Proposals role="Admin" navState={navState} />;
}

export function AdminAwardsPage() {
  const nav = useAdminNav();
  return <Awards role="Admin" onNavigate={nav} />;
}

export function AdminMilestonesPage() {
  return <Milestones role="Admin" />;
}

export function AdminFinancialPage() {
  return <Financial role="Admin" />;
}

export function AdminReportsPage() {
  return <Reports role="Admin" />;
}

export function AdminNotificationsPage() {
  return <Notifications />;
}

export function AdminAnalyticsPage() {
  return <Analytics />;
}

export function AdminUsersPage() {
  return <UserManagementPage />;
}

export function AdminAuditPage() {
  return <AuditLogs />;
}

export function AdminCalendarPage() {
  return <CalendarPage />;
}

export function AdminSettingsPage() {
  const { darkMode, toggleDark } = useAuthContext();
  return <Settings role="Admin" darkMode={darkMode} onToggleDark={toggleDark} />;
}
