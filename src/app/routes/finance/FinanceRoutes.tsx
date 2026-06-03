import { useNavigate } from "react-router-dom";
import { FinanceDashboardPage as FinanceDashboardFeaturePage } from "../../../features/finance/pages/Dashboard";
import { Awards } from "../../components/pages/Awards";
import { Financial } from "../../components/pages/Financial";
import { Reports } from "../../components/pages/Reports";
import { Analytics } from "../../components/pages/Analytics";
import { Notifications } from "../../components/pages/Notifications";
import { CalendarPage } from "../../components/pages/CalendarPage";
import { Settings } from "../../components/pages/Settings";
import { useAuthContext } from "../../context/AuthContext";
import type { NavState } from "../../App";

function useFinanceNav() {
  const navigate = useNavigate();
  return (page: string, state?: NavState) =>
    navigate('/finance/' + page, state ? { state } : undefined);
}

export function FinanceDashboardPage() {
  const nav = useFinanceNav();
  return <FinanceDashboardFeaturePage onNavigate={nav} />;
}

export function FinanceAwardsPage() {
  const nav = useFinanceNav();
  return <Awards role="Finance Officer" onNavigate={nav} />;
}

export function FinanceFinancialPage() {
  return <Financial role="Finance Officer" />;
}

export function FinanceReportsPage() {
  return <Reports role="Finance Officer" />;
}

export function FinanceAnalyticsPage() {
  return <Analytics />;
}

export function FinanceNotificationsPage() {
  return <Notifications />;
}

export function FinanceCalendarPage() {
  return <CalendarPage />;
}

export function FinanceSettingsPage() {
  const { darkMode, toggleDark } = useAuthContext();
  return <Settings role="Finance Officer" darkMode={darkMode} onToggleDark={toggleDark} />;
}
