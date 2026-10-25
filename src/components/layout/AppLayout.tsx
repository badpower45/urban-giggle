import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Gavel,
  Calendar,
  Clock,
  CheckSquare,
  ShieldAlert,
  CircleDollarSign,
  Settings,
  CreditCard,
  FileText,
  User,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Logo } from "../common/Logo";
import { OfflineBanner } from "../offline/OfflineBanner";

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const mobileNavDrawerItems = [
    { name: "لوحة التحكم", to: "/firm/dashboard", icon: LayoutDashboard },
    { name: "القضايا", to: "/firm/cases", icon: Briefcase },
    { name: "دليل الموكلين", to: "/firm/clients", icon: Users },
    { name: "محاضر الشرطة", to: "/firm/police-reports", icon: ShieldAlert },
    { name: "منشئ العقود الذكية", to: "/firm/contracts", icon: FileText },
    { name: "التقويم", to: "/firm/calendar", icon: Calendar },
    { name: "رول الجلسات", to: "/firm/sessions", icon: Gavel },
    { name: "المواعيد والمدد", to: "/firm/deadlines", icon: Clock },
    { name: "إدارة المهام", to: "/firm/tasks", icon: CheckSquare },
    { name: "التقرير المالي", to: "/firm/billing", icon: CircleDollarSign },
    { name: "إعدادات المكتب", to: "/firm/settings", icon: Settings },
    { name: "الاشتراك", to: "/firm/settings/subscription", icon: CreditCard },
    { name: "سجل التدقيق", to: "/firm/settings/audit-log", icon: FileText },
    { name: "الملف الشخصي", to: "/profile", icon: User },
  ];

  // Authentic 5 bottom tabs on mobile from production Siyaq
  const mobileBottomTabs = [
    { to: "/firm/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { to: "/firm/clients", label: "الموكلين", icon: Users },
    { to: "/firm/cases", label: "القضايا", icon: Briefcase },
    { to: "/firm/sessions", label: "الجلسات", icon: Gavel },
    { to: "/firm/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral text-primary" dir="rtl">
      {/* Sidebar Desktop */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative z-50 flex flex-col w-72 max-w-full bg-white h-full p-4 shadow-xl border-e border-border">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <Logo iconSize={32} showText={true} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-tertiary hover:bg-neutral hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-1 custom-scrollbar">
              {mobileNavDrawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white shadow-sm font-semibold"
                        : "text-primary hover:bg-neutral"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <OfflineBanner />
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-6 custom-scrollbar">
          <Outlet />
        </main>

        {/* Authentic Mobile Bottom Navigation */}
        <nav className="md:hidden flex border-t border-border bg-white shrink-0 fixed bottom-0 left-0 right-0 z-40 shadow-xs">
          {mobileBottomTabs.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.to === "/firm/dashboard"
                ? location.pathname === "/firm/dashboard" || location.pathname === "/firm"
                : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex-1 py-2 flex flex-col items-center justify-center gap-0.5 text-center text-[10px] transition-colors",
                  isActive ? "text-primary font-bold" : "text-tertiary hover:text-primary"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-tertiary")} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
