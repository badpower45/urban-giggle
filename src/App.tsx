import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabaseService } from "./lib/supabase/client";
import { AppLayout } from "./components/layout/AppLayout";

// Pages
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { CasesPage } from "./pages/cases/CasesPage";
import { CaseFormPage } from "./pages/cases/CaseFormPage";
import { CaseDetailPage } from "./pages/cases/CaseDetailPage";
import { ClientsPage } from "./pages/clients/ClientsPage";
import { ClientDetailPage } from "./pages/clients/ClientDetailPage";
import { ClientFormPage } from "./pages/clients/ClientFormPage";
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
import { DocumentScannerPage } from "./pages/scanner/DocumentScannerPage";
import { ContractBuilderPage } from "./pages/contracts/ContractBuilderPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { LandingPage } from "./pages/landing/LandingPage";
import { SuperAdminDashboardPage } from "./pages/admin/SuperAdminDashboardPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { SuperAdminRoute } from "./components/admin/SuperAdminRoute";
import { ToastProvider } from "./components/common/Toast";
import { OfflineProvider } from "./lib/offline";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  useEffect(() => {
    if (supabaseService.isConfigured()) {
      supabaseService.syncSessionToStore();
      const sub = supabaseService.onAuthStateChange(() => {
        supabaseService.syncSessionToStore();
      });
      return () => {
        if (sub && typeof (sub as any).unsubscribe === 'function') {
          (sub as any).unsubscribe();
        }
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <OfflineProvider>
          <BrowserRouter>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/app" element={<Navigate to="/firm/dashboard" replace />} />

            {/* Public Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />

            {/* Super Admin Auth & Platform Control */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/super-admin/login" element={<AdminLoginPage />} />
            <Route
              path="/super-admin"
              element={
                <SuperAdminRoute>
                  <SuperAdminDashboardPage />
                </SuperAdminRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <SuperAdminRoute>
                  <SuperAdminDashboardPage />
                </SuperAdminRoute>
              }
            />

            {/* Protected Firm SaaS Application */}
            <Route path="/firm" element={<AppLayout />}>
            <Route index element={<Navigate to="/firm/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="cases" element={<CasesPage />} />
            <Route path="cases/new" element={<CaseFormPage />} />
            <Route path="cases/:id" element={<CaseDetailPage />} />
            <Route path="cases/:id/edit" element={<CaseFormPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/new" element={<ClientFormPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            <Route path="clients/:id/edit" element={<ClientFormPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="deadlines" element={<DeadlinesPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="police-reports" element={<PoliceReportsPage />} />
            <Route path="police-reports/new" element={<PoliceReportFormPage />} />
            <Route path="police-reports/:id" element={<PoliceReportDetailPage />} />
            <Route path="police-reports/:id/edit" element={<PoliceReportFormPage />} />
            <Route path="billing" element={<BillingReportPage />} />
            <Route path="scanner" element={<DocumentScannerPage />} />
            <Route path="contracts" element={<ContractBuilderPage />} />
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
      </OfflineProvider>
    </ToastProvider>
  </QueryClientProvider>
);
};
export default App;
