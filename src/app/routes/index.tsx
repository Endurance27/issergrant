import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../components/auth/LoginPage";
import { UnauthorizedPage } from "../components/auth/UnauthorizedPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "./admin/AdminLayout";
import { ResearcherLayout } from "./researcher/ResearcherLayout";
import { DirectorLayout } from "./director/DirectorLayout";
import { GuestLayout } from "./guest/GuestLayout";
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
  DirectorDashboardPage, DirectorGrantCallsPage, DirectorProposalsPage,
  DirectorAwardsPage, DirectorFinancialPage, DirectorReportsPage,
  DirectorAnalyticsPage, DirectorCalendarPage, DirectorNotificationsPage,
  DirectorSettingsPage, DirectorGuestsPage,
} from "./director/DirectorRoutes";
import {
  GuestDashboardPage, GuestFundingCallsPage, GuestProposalsPage,
  GuestNotificationsPage, GuestSettingsPage,
} from "./guest/GuestRoutes";
import {
  FinanceDashboardPage, FinanceAwardsPage, FinanceFinancialPage,
  FinanceReportsPage, FinanceAnalyticsPage, FinanceNotificationsPage,
  FinanceCalendarPage, FinanceSettingsPage,
} from "./finance/FinanceRoutes";
import { Guests } from "../researcher/guests/Guests";
import { CreateGuest } from "../researcher/guests/CreateGuest";
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
          <Route path="guests"        element={<Guests />} />
          <Route path="guests/create" element={<CreateGuest />} />
          <Route path="audit"         element={<AdminAuditPage />} />
          <Route path="calendar"      element={<AdminCalendarPage />} />
          <Route path="settings"      element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* Director — backend enum: "director" */}
      <Route element={<ProtectedRoute allowedRoles={["director"]} />}>
        <Route path="/director" element={<DirectorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<DirectorDashboardPage />} />
          <Route path="grant-calls"   element={<DirectorGrantCallsPage />} />
          <Route path="proposals"     element={<DirectorProposalsPage />} />
          <Route path="awards"        element={<DirectorAwardsPage />} />
          <Route path="financial"     element={<DirectorFinancialPage />} />
          <Route path="reports"       element={<DirectorReportsPage />} />
          <Route path="analytics"     element={<DirectorAnalyticsPage />} />
          <Route path="calendar"      element={<DirectorCalendarPage />} />
          <Route path="notifications" element={<DirectorNotificationsPage />} />
          <Route path="settings"      element={<DirectorSettingsPage />} />
          <Route path="guests"        element={<DirectorGuestsPage />} />
          <Route path="guests/create" element={<CreateGuest />} />
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
          <Route path="guests"        element={<Guests />} />
          <Route path="guests/create" element={<CreateGuest />} />
        </Route>
      </Route>

      {/* Guest — backend enum: "guest" */}
      <Route element={<ProtectedRoute allowedRoles={["guest"]} />}>
        <Route path="/guest" element={<GuestLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<GuestDashboardPage />} />
          <Route path="funding-calls" element={<GuestFundingCallsPage />} />
          <Route path="proposals"     element={<GuestProposalsPage />} />
          <Route path="notifications" element={<GuestNotificationsPage />} />
          <Route path="settings"      element={<GuestSettingsPage />} />
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
