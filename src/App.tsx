import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "./components/layout/AppLayout";

// Pages
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { CasesPage } from "./pages/cases/CasesPage";
import { CaseFormPage } from "./pages/cases/CaseFormPage";
import { CaseDetailPage } from "./pages/cases/CaseDetailPage";
import { ClientsPage } from "./pages/clients/ClientsPage";
import { ClientDetailPage } from "./pages/clients/ClientDetailPage";
import { SessionsPage } from "./pages/sessions/SessionsPage";
import { CalendarPage } from "./pages/calendar/CalendarPage";
import { DeadlinesPage } from "./pages/deadlines/DeadlinesPage";
import { TasksPage } from "./pages/tasks/TasksPage";
import { PoliceReportsPage } from "./pages/police-reports/PoliceReportsPage";
import { PoliceReportFormPage } from "./pages/police-reports/PoliceReportFormPage";
import { PoliceReportDetailPage } from "./pages/police-reports/PoliceReportDetailPage";
import { BillingReportPage } from "./pages/billing/BillingReportPage";
import { FirmSettingsPage } from "./pages/settings/FirmSettingsPage";
import { SubscriptionPage } from "./pages/settings/SubscriptionPage";
import { FirmAuditLogPage } from "./pages/settings/FirmAuditLogPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { LandingPage } from "./pages/landing/LandingPage";
import { ToastProvider } from "./components/common/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/app" element={<Navigate to="/firm/dashboard" replace />} />

            {/* Public Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Navigate to="/firm/dashboard" replace />} />

            {/* Protected Firm SaaS Application */}
            <Route path="/firm" element={<AppLayout />}>
            <Route index element={<Navigate to="/firm/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="cases" element={<CasesPage />} />
            <Route path="cases/new" element={<CaseFormPage />} />
            <Route path="cases/:id" element={<CaseDetailPage />} />
            <Route path="cases/:id/edit" element={<CaseFormPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="deadlines" element={<DeadlinesPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="police-reports" element={<PoliceReportsPage />} />
            <Route path="police-reports/new" element={<PoliceReportFormPage />} />
            <Route path="police-reports/:id" element={<PoliceReportDetailPage />} />
            <Route path="billing" element={<BillingReportPage />} />
            <Route path="settings" element={<FirmSettingsPage />} />
            <Route path="settings/subscription" element={<SubscriptionPage />} />
            <Route path="settings/audit-log" element={<FirmAuditLogPage />} />
          </Route>

          {/* Profile Route */}
          <Route path="/profile" element={<AppLayout />}>
            <Route index element={<ProfilePage />} />
          </Route>

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </QueryClientProvider>
);
};
export default App;
