import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { LoginPage } from "../components/auth/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "./admin/AdminLayout";
import { ResearcherLayout } from "./researcher/ResearcherLayout";
import { AssistantLayout } from "./assistant/AssistantLayout";
import { FinanceLayout } from "./finance/FinanceLayout";
import {
  AdminDashboardPage, AdminGrantCallsPage, AdminProposalsPage,
  AdminAwardsPage, AdminMilestonesPage, AdminFinancialPage,
  AdminReportsPage, AdminNotificationsPage, AdminAnalyticsPage,
  AdminUsersPage, AdminAuditPage, AdminCalendarPage, AdminSettingsPage,
} from "./admin/AdminRoutes";
import {
  ResearcherDashboardPage, ResearcherGrantCallsPage, ResearcherProposalsPage,
  ResearcherMilestonesPage, ResearcherAwardsPage, ResearcherReportsPage,
  ResearcherNotificationsPage, ResearcherCalendarPage, ResearcherSettingsPage,
} from "./researcher/ResearcherRoutes";
import {
  AssistantDashboardPage, AssistantGrantCallsPage, AssistantProposalsPage,
  AssistantMilestonesPage, AssistantReportsPage, AssistantNotificationsPage,
  AssistantCalendarPage, AssistantSettingsPage,
} from "./assistant/AssistantRoutes";
import {
  FinanceDashboardPage, FinanceAwardsPage, FinanceFinancialPage,
  FinanceReportsPage, FinanceAnalyticsPage, FinanceNotificationsPage,
  FinanceCalendarPage, FinanceSettingsPage,
} from "./finance/FinanceRoutes";
import { useAuthContext, roleToBasePath } from "../context/AuthContext";
import type { Role } from "../data/mockData";

function RootRedirect() {
  const { loggedIn, currentRole } = useAuthContext();
  if (!loggedIn) return <Navigate to="/login" replace />;
  return <Navigate to={roleToBasePath(currentRole) + '/dashboard'} replace />;
}

// Redirects to the correct dashboard immediately after login
function LoginRoute() {
  const { loggedIn, currentRole, handleLogin } = useAuthContext();
  const navigate = useNavigate();

  const onLogin = useCallback((role: Role) => {
    handleLogin(role);
    navigate(roleToBasePath(role) + '/dashboard', { replace: true });
  }, [handleLogin, navigate]);

  if (loggedIn) {
    return <Navigate to={roleToBasePath(currentRole) + '/dashboard'} replace />;
  }

  return <LoginPage onLogin={onLogin} />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginRoute />} />

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRole="Admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="grant-calls" element={<AdminGrantCallsPage />} />
          <Route path="proposals" element={<AdminProposalsPage />} />
          <Route path="awards" element={<AdminAwardsPage />} />
          <Route path="milestones" element={<AdminMilestonesPage />} />
          <Route path="financial" element={<AdminFinancialPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="audit" element={<AdminAuditPage />} />
          <Route path="calendar" element={<AdminCalendarPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* Researcher routes */}
      <Route element={<ProtectedRoute allowedRole="Researcher" />}>
        <Route path="/researcher" element={<ResearcherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ResearcherDashboardPage />} />
          <Route path="grant-calls" element={<ResearcherGrantCallsPage />} />
          <Route path="proposals" element={<ResearcherProposalsPage />} />
          <Route path="awards" element={<ResearcherAwardsPage />} />
          <Route path="milestones" element={<ResearcherMilestonesPage />} />
          <Route path="reports" element={<ResearcherReportsPage />} />
          <Route path="notifications" element={<ResearcherNotificationsPage />} />
          <Route path="calendar" element={<ResearcherCalendarPage />} />
          <Route path="settings" element={<ResearcherSettingsPage />} />
        </Route>
      </Route>

      {/* Assistant Researcher routes */}
      <Route element={<ProtectedRoute allowedRole="Assistant Researcher" />}>
        <Route path="/assistant" element={<AssistantLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AssistantDashboardPage />} />
          <Route path="grant-calls" element={<AssistantGrantCallsPage />} />
          <Route path="proposals" element={<AssistantProposalsPage />} />
          <Route path="milestones" element={<AssistantMilestonesPage />} />
          <Route path="reports" element={<AssistantReportsPage />} />
          <Route path="notifications" element={<AssistantNotificationsPage />} />
          <Route path="calendar" element={<AssistantCalendarPage />} />
          <Route path="settings" element={<AssistantSettingsPage />} />
        </Route>
      </Route>

      {/* Finance Officer routes */}
      <Route element={<ProtectedRoute allowedRole="Finance Officer" />}>
        <Route path="/finance" element={<FinanceLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<FinanceDashboardPage />} />
          <Route path="awards" element={<FinanceAwardsPage />} />
          <Route path="financial" element={<FinanceFinancialPage />} />
          <Route path="reports" element={<FinanceReportsPage />} />
          <Route path="analytics" element={<FinanceAnalyticsPage />} />
          <Route path="notifications" element={<FinanceNotificationsPage />} />
          <Route path="calendar" element={<FinanceCalendarPage />} />
          <Route path="settings" element={<FinanceSettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
