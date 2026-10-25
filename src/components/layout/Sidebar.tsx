import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ShieldAlert,
  Calendar,
  Gavel,
  Clock,
  CheckSquare,
  CircleDollarSign,
  Settings,
  CreditCard,
  FileText,
  User,
  ChevronLeft,
  ChevronDown,
  MessageCircle,
  LogOut,
  Bell,
  Languages,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../lib/api/store";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const { user, firm, logout } = useAuthStore();
  const [settingsOpen, setSettingsOpen] = useState(true);

  const navGroups = [
    {
      id: "cases_clients",
      label: "القضايا والموكلين",
      items: [
        { to: "/firm/dashboard", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
        { to: "/firm/cases", label: "القضايا", icon: Briefcase },
        { to: "/firm/clients", label: "الموكلين", icon: Users },
        { to: "/firm/police-reports", label: "محاضر الشرطة", icon: ShieldAlert },
        { to: "/firm/contracts", label: "منشئ العقود الذكية", icon: FileText, badge: "جديد" },
        { to: "/firm/scanner", label: "الماسح الذكي", icon: Sparkles, badge: "Beta" },
      ],
    },
    {
      id: "appointments",
      label: "المواعيد والجلسات",
      items: [
        { to: "/firm/calendar", label: "التقويم", icon: Calendar },
        { to: "/firm/sessions", label: "الجلسات", icon: Gavel },
        { to: "/firm/deadlines", label: "المواعيد والمدد", icon: Clock },
      ],
    },
    {
      id: "management",
      label: "الإدارة",
      items: [
        { to: "/firm/tasks", label: "إدارة المهام", icon: CheckSquare },
        { to: "/firm/billing", label: "التقرير المالي", icon: CircleDollarSign },
      ],
    },
    {
      id: "settings",
      label: "الإعدادات",
      isCollapsible: true,
      items: [
        { to: "/firm/settings", label: "إعدادات المكتب", icon: Settings, end: true },
        { to: "/firm/settings/subscription", label: "الاشتراك", icon: CreditCard },
        { to: "/firm/settings/audit-log", label: "سجل التدقيق", icon: FileText },
        { to: "/profile", label: "الملف الشخصي", icon: User },
        { to: "/super-admin", label: "الإدارة العليا (Admin)", icon: ShieldCheck, badge: "Master" },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-white border-e border-border shrink-0 shadow-sm transition-all duration-300 ease-in-out select-none z-30",
        collapsed ? "w-[60px]" : "w-64"
      )}
    >
      {/* Brand Header (h-[65px]) */}
      <div
        className={cn(
          "flex items-center border-b border-border shrink-0 h-[65px]",
          collapsed ? "justify-center px-0" : "gap-3 px-4"
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shrink-0 shadow-sm bg-neutral border border-border">
          <img
            src="/logo.webp"
            alt="logo"
            className="h-full w-full object-contain p-0.5"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-headline text-primary text-sm font-bold truncate leading-tight">
              {firm?.name || "سياق للمحاماة"}
            </p>
            <p className="text-tertiary text-[11px] truncate">نظام إدارة مكاتب المحاماة</p>
          </div>
        )}

        {onToggleCollapse && !collapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-tertiary hover:bg-neutral hover:text-primary transition-colors shrink-0"
            title="طي القائمة"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {onToggleCollapse && collapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-tertiary hover:bg-neutral hover:text-primary transition-colors shrink-0 mt-1"
            title="توسيع القائمة"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-1 px-2.5 custom-scrollbar">
        {navGroups.map((group) => {
          const isSettings = group.id === "settings";
          const isExpanded = !isSettings || settingsOpen;

          return (
            <div key={group.id} className="mb-2">
              {/* Group Header */}
              {!collapsed && (
                isSettings ? (
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className="flex w-full items-center justify-between text-tertiary hover:text-primary text-[9px] font-semibold uppercase tracking-widest px-3 py-1.5 select-none cursor-pointer"
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        settingsOpen ? "rotate-0" : "-rotate-90"
                      )}
                    />
                  </button>
                ) : (
                  <p className="text-tertiary text-[9px] font-semibold uppercase tracking-widest px-3 py-1.5 select-none">
                    {group.label}
                  </p>
                )
              )}

              {collapsed && <div className="h-px bg-border mx-1 my-2" />}

              {/* Group Items */}
              {isExpanded && (
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          end={item.end}
                          title={collapsed ? item.label : undefined}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group",
                              collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2",
                              isActive
                                ? "bg-primary text-white shadow-sm font-semibold"
                                : "text-primary hover:bg-neutral"
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <Icon
                                className={cn(
                                  "w-4 h-4 shrink-0 transition-colors",
                                  isActive ? "text-white" : "text-primary"
                                )}
                              />
                              {!collapsed && (
                                <div className="flex items-center justify-between flex-1 truncate">
                                  <span className="truncate">{item.label}</span>
                                  {'badge' in item && item.badge && (
                                    <span className={cn(
                                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full border shadow-xs transition-colors",
                                      isActive
                                        ? "bg-white/20 text-white border-white/30"
                                        : "bg-primary/10 text-primary border-primary/20"
                                    )}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer User Section */}
      <div className={cn("border-t border-border py-3", collapsed ? "px-1.5" : "px-3")}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold overflow-hidden shadow-xs">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
              ) : (
                user?.full_name?.charAt(0).toUpperCase() || "م"
              )}
            </div>
            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              className="p-1.5 rounded-lg text-tertiary hover:text-destructive hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* User Profile Card */}
            <div className="flex items-center gap-2.5 p-1 rounded-xl bg-neutral/80 border border-border/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold overflow-hidden shadow-xs">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                ) : (
                  user?.full_name?.charAt(0).toUpperCase() || "م"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-primary text-xs font-semibold truncate leading-tight">
                  {user?.full_name || "المستشار القانوني"}
                </p>
                <p className="text-tertiary text-[10px] truncate">
                  {user?.role === "owner" ? "مالك المكتب" : "محامي ممارس"}
                </p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  title="الإشعارات"
                  className="p-1 text-tertiary hover:text-primary hover:bg-white rounded-md transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Technical Support Link */}
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs text-primary hover:bg-green-50 hover:text-green-600 transition-all duration-150 group"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0 text-primary group-hover:text-green-600 transition-colors" />
              <span>الدعم الفني (واتساب)</span>
            </a>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs text-primary hover:bg-red-50 hover:text-destructive transition-all duration-150 group"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0 text-primary group-hover:text-destructive transition-colors" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
