import { Navigate, useNavigate } from "react-router-dom";
import { Reports } from "../../components/pages/Reports";
import { Analytics } from "../../components/pages/Analytics";
import { Notifications } from "../../components/pages/Notifications";
import { CalendarPage } from "../../components/pages/CalendarPage";

function DirectorDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-extrabold text-2xl text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString("en-GH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <p className="text-muted-foreground text-sm">
        Welcome to the Director dashboard. Use the sidebar to navigate.
      </p>
    </div>
  );
}

export function DirectorDashboard() {
  return <DirectorDashboardPage />;
}

export function DirectorReportsPage() {
  return <Reports role="Admin" />;
}

export function DirectorAnalyticsPage() {
  return <Analytics />;
}

export function DirectorNotificationsPage() {
  return <Notifications />;
}

export function DirectorCalendarPage() {
  return <CalendarPage />;
}
