import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../components/auth/LoginPage";
import { UnauthorizedPage } from "../components/auth/UnauthorizedPage";
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
  ResearcherTeamMembersPage,
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
import { useAuthStore } from "../../store/auth.store";
import { ROLE_BASE_PATH } from "../../types/user.types";

// ── Root redirect — reads Zustand, no Context ─────────────────────────────────
function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userRole = useAuthStore((s) => s.user?.role ?? null);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const basePath = userRole ? (ROLE_BASE_PATH[userRole] ?? '/login') : '/login';
  return <Navigate to={`${basePath}/dashboard`} replace />;
}

// ── Login route — if already authenticated, skip to dashboard ────────────────
function LoginRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userRole = useAuthStore((s) => s.user?.role ?? null);

  if (isAuthenticated) {
    const basePath = userRole ? (ROLE_BASE_PATH[userRole] ?? '/login') : '/login';
    return <Navigate to={`${basePath}/dashboard`} replace />;
  }

  // LoginPage is now self-contained — no onLogin prop needed
  return <LoginPage />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Route tree
// ─────────────────────────────────────────────────────────────────────────────

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Admin — backend enum: "admin" */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<AdminDashboardPage />} />
          <Route path="grant-calls"   element={<AdminGrantCallsPage />} />
          <Route path="proposals"     element={<AdminProposalsPage />} />
          <Route path="awards"        element={<AdminAwardsPage />} />
          <Route path="milestones"    element={<AdminMilestonesPage />} />
          <Route path="financial"     element={<AdminFinancialPage />} />
          <Route path="reports"       element={<AdminReportsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="analytics"     element={<AdminAnalyticsPage />} />
          <Route path="users"         element={<AdminUsersPage />} />
          <Route path="audit"         element={<AdminAuditPage />} />
          <Route path="calendar"      element={<AdminCalendarPage />} />
          <Route path="settings"      element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* Researcher — backend enum: "researcher" */}
      <Route element={<ProtectedRoute allowedRoles={["researcher"]} />}>
        <Route path="/researcher" element={<ResearcherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<ResearcherDashboardPage />} />
          <Route path="grant-calls"   element={<ResearcherGrantCallsPage />} />
          <Route path="proposals"     element={<ResearcherProposalsPage />} />
          <Route path="awards"        element={<ResearcherAwardsPage />} />
          <Route path="milestones"    element={<ResearcherMilestonesPage />} />
          <Route path="reports"       element={<ResearcherReportsPage />} />
          <Route path="notifications" element={<ResearcherNotificationsPage />} />
          <Route path="calendar"      element={<ResearcherCalendarPage />} />
          <Route path="settings"      element={<ResearcherSettingsPage />} />
          <Route path="users"         element={<ResearcherTeamMembersPage />} />
        </Route>
      </Route>

      {/* Assistant Researcher — backend enum: "assistant_researcher" */}
      <Route element={<ProtectedRoute allowedRoles={["assistant_researcher"]} />}>
        <Route path="/assistant" element={<AssistantLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<AssistantDashboardPage />} />
          <Route path="grant-calls"   element={<AssistantGrantCallsPage />} />
          <Route path="proposals"     element={<AssistantProposalsPage />} />
          <Route path="milestones"    element={<AssistantMilestonesPage />} />
          <Route path="reports"       element={<AssistantReportsPage />} />
          <Route path="notifications" element={<AssistantNotificationsPage />} />
          <Route path="calendar"      element={<AssistantCalendarPage />} />
          <Route path="settings"      element={<AssistantSettingsPage />} />
        </Route>
      </Route>

      {/* Finance Officer — backend enum: "finance_officer" */}
      <Route element={<ProtectedRoute allowedRoles={["finance_officer"]} />}>
        <Route path="/finance" element={<FinanceLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<FinanceDashboardPage />} />
          <Route path="awards"        element={<FinanceAwardsPage />} />
          <Route path="financial"     element={<FinanceFinancialPage />} />
          <Route path="reports"       element={<FinanceReportsPage />} />
          <Route path="analytics"     element={<FinanceAnalyticsPage />} />
          <Route path="notifications" element={<FinanceNotificationsPage />} />
          <Route path="calendar"      element={<FinanceCalendarPage />} />
          <Route path="settings"      element={<FinanceSettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
