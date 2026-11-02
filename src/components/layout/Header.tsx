import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  Search,
  Building2,
  LogOut,
  User as UserIcon,
  Settings,
  PlusCircle,
  Briefcase,
  UserPlus,
  AlertTriangle,
  LifeBuoy,
  ShieldCheck,
  CheckSquare,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { appStore } from "../../lib/api/store";
import { supabaseService } from "../../lib/supabase/client";
import { openBaseeraTour } from "../common/OnboardingTour";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

import { GlobalSearchDialog } from "../common/GlobalSearchDialog";
import { SubmitComplaintModal } from "../common/SubmitComplaintModal";
import { Globe } from "lucide-react";

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const [storeState, setStoreState] = useState(appStore.getState());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<"all" | "tasks" | "deadlines" | "sessions">("all");

  useEffect(() => {
    return appStore.subscribe(() => {
      setStoreState(appStore.getState());
    });
  }, []);

  const { user, firm, deadlines = [], sessions = [], tasks = [] } = storeState;

  // Tasks assigned to current user
  const myAssignedTasks = (tasks || []).filter(
    (t) =>
      (t.assigned_to === user.id ||
        t.assigned_to_name === user.full_name ||
        t.assigned_to_name?.includes(user.full_name?.split(" ")[0] || "")) &&
      t.status !== "completed"
  );

  // Critical deadlines
  const urgentDeadlines = (deadlines || []).filter(
    (d) => d.urgency === "critical" || d.urgency === "high"
  );

  // Today / upcoming sessions
  const upcomingSessions = (sessions || []).slice(0, 4);

  // Total notification count
  const urgentCount = urgentDeadlines.length + myAssignedTasks.length;

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-white/95 px-3 sm:px-6 backdrop-blur-md shadow-2xs">
        {/* Right Side: Mobile Menu, Firm Badge & Cloud Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="القائمة"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-border">
            <Building2 className="w-4 h-4 text-secondary shrink-0" />
            <span className="text-xs font-semibold text-primary truncate max-w-[180px] lg:max-w-[280px]">
              {firm.name}
            </span>
          </div>

          {/* Cloud Database Live Badge */}
          <Link
            to="/firm/settings"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all hover:opacity-90"
            title="حالة الاتصال بقاعدة البيانات"
          >
            {supabaseService.isConfigured() ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>سحابة متصلة</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-800 bg-amber-50 border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>وضع محلي</span>
              </span>
            )}
          </Link>

          <Link
            to="/"
            className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            title="الانتقال إلى الموقع التعريفي"
          >
            <Globe className="w-3.5 h-3.5 text-secondary" />
            <span>الموقع التعريفي</span>
          </Link>

          <button
            type="button"
            onClick={() => openBaseeraTour()}
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 px-2.5 py-1.5 rounded-lg transition-all shadow-xs"
            title="بدء الجولة التفاعلية للتعرف على النظام"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>جولة في النظام</span>
          </button>
        </div>

        {/* Center Search Input (Triggers Global Command Palette) */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between h-9 px-3 text-xs rounded-xl border border-border bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 text-muted-foreground transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span>بحث سريع في القضايا، الموكلين، والرول...</span>
            </span>
            <kbd className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-white border border-border rounded text-slate-500 shadow-2xs">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Left Side: Actions, Notifications, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 h-9 w-9 rounded-lg"
            aria-label="بحث"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Quick Add Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-1.5 text-xs font-medium rounded-lg h-9">
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">إضافة جديدة</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>إجراءات سريعة</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/firm/cases/new")}>
                <Briefcase className="w-4 h-4 ml-2 text-primary" />
                قضية جديدة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/firm/clients/new")}>
                <UserPlus className="w-4 h-4 ml-2 text-primary" />
                موكل جديد
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/firm/police-reports/new")}>
                <ShieldCheck className="w-4 h-4 ml-2 text-rose-600" />
                محضر شرطة جديد
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/firm/sessions")}>
                <Building2 className="w-4 h-4 ml-2 text-amber-600" />
                تسجيل جلسة محكمة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/firm/deadlines")}>
                <AlertTriangle className="w-4 h-4 ml-2 text-indigo-600" />
                حساب ميعاد قانوني
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/firm/scanner")}>
                <Search className="w-4 h-4 ml-2 text-secondary" />
                مسح مستند ضوئي ذكي
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openBaseeraTour()}>
                <Sparkles className="w-4 h-4 ml-2 text-amber-500" />
                جولة تعريفية بالنظام
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        {/* Notifications Popover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-slate-600 hover:bg-slate-100 hover:text-foreground transition-colors"
              title="مركز الإشعارات والتنبيهات"
            >
              <Bell className="h-4 w-4" />
              {urgentCount > 0 && (
                <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow animate-pulse">
                  {urgentCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-84 sm:w-96 p-2 shadow-xl border-border">
            <div className="flex items-center justify-between pb-2 border-b border-border px-2">
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-secondary" />
                <span className="font-bold text-xs text-primary">مركز التنبيهات والإشعارات</span>
              </div>
              <span className="text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full border border-red-200">
                {urgentCount} إشعار يتطلب المتابعة
              </span>
            </div>

            {/* Notification Filter Chips */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg my-1.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setNotifTab("all")}
                className={`flex-1 py-1 rounded transition-all text-center ${
                  notifTab === "all" ? "bg-white text-primary shadow-xs" : "text-slate-600 hover:text-primary"
                }`}
              >
                الكل ({myAssignedTasks.length + urgentDeadlines.length + upcomingSessions.length})
              </button>
              <button
                type="button"
                onClick={() => setNotifTab("tasks")}
                className={`flex-1 py-1 rounded transition-all text-center flex items-center justify-center gap-1 ${
                  notifTab === "tasks" ? "bg-white text-primary shadow-xs" : "text-slate-600 hover:text-primary"
                }`}
              >
                <span>تكليفاتي</span>
                {myAssignedTasks.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setNotifTab("deadlines")}
                className={`flex-1 py-1 rounded transition-all text-center ${
                  notifTab === "deadlines" ? "bg-white text-primary shadow-xs" : "text-slate-600 hover:text-primary"
                }`}
              >
                الطعون ({urgentDeadlines.length})
              </button>
              <button
                type="button"
                onClick={() => setNotifTab("sessions")}
                className={`flex-1 py-1 rounded transition-all text-center ${
                  notifTab === "sessions" ? "bg-white text-primary shadow-xs" : "text-slate-600 hover:text-primary"
                }`}
              >
                الجلسات ({upcomingSessions.length})
              </button>
            </div>

            {/* Notification Items List */}
            <div className="py-1 divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {/* Tasks Notifications */}
              {(notifTab === "all" || notifTab === "tasks") && myAssignedTasks.length > 0 && (
                <div className="space-y-1 py-1">
                  {myAssignedTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => navigate("/firm/tasks")}
                      className="p-2 hover:bg-blue-50/70 rounded-lg text-xs cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="inline-flex items-center gap-1 font-bold text-blue-900 text-[11px]">
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span>مهمة موجهة لك</span>
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          {t.priority === "urgent" ? "عاجلة ⚡" : t.priority === "high" ? "عالية" : "مطلوبة"}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-snug">{t.title}</p>
                      {t.case_title && (
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">القضية: {t.case_title}</p>
                      )}
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                        <span>المكلف: {t.assigned_to_name}</span>
                        <span className="font-mono text-slate-600 font-semibold">استحقاق: {t.due_date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Deadlines Notifications */}
              {(notifTab === "all" || notifTab === "deadlines") &&
                deadlines.slice(0, 3).map((dl) => (
                  <div
                    key={dl.id}
                    onClick={() => navigate("/firm/deadlines")}
                    className="p-2 hover:bg-amber-50/70 rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>{dl.type}</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        ميعاد حتمي
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 truncate">{dl.case_title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      آخر ميعاد للإيداع: {dl.deadline_date}
                    </p>
                  </div>
                ))}

              {/* Court Sessions Notifications */}
              {(notifTab === "all" || notifTab === "sessions") &&
                sessions.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate("/firm/sessions")}
                    className="p-2 hover:bg-slate-50 rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-primary text-[11px] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-secondary" />
                        <span>جلسة محكمة</span>
                      </span>
                      {s.roll_number && (
                        <span className="text-[9px] font-mono font-bold bg-slate-200 px-1 rounded">
                          رول {s.roll_number}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-700 truncate">{s.case_title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {s.case_court} — {s.session_date}
                    </p>
                  </div>
                ))}

              {/* Empty state when tab has 0 notifications */}
              {((notifTab === "tasks" && myAssignedTasks.length === 0) ||
                (notifTab === "deadlines" && urgentDeadlines.length === 0)) && (
                <div className="py-6 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                  <p>لا توجد تنبيهات معلقة في هذا القسم</p>
                </div>
              )}
            </div>

            {/* Bottom Direct Links */}
            <div className="pt-2 border-t border-border flex items-center justify-between px-2 text-[11px]">
              <Link to="/firm/tasks" className="text-secondary font-bold hover:underline">
                لوحة المهام &larr;
              </Link>
              <Link to="/firm/deadlines" className="text-secondary font-bold hover:underline">
                أجندة المواعيد &larr;
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Submit Complaint or Support Ticket */}
        <button
          type="button"
          onClick={() => setIsComplaintModalOpen(true)}
          className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-blue-200 bg-blue-50/70 text-blue-900 hover:bg-blue-100 text-xs font-semibold transition-colors"
          title="تقديم شكوى أو استفسار للإدارة العليا"
        >
          <LifeBuoy className="w-3.5 h-3.5 text-blue-700" />
          <span className="hidden xl:inline">الدعم والشكاوى</span>
        </button>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 transition-colors focus:outline-none">
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="h-8 w-8 rounded-lg object-cover border border-border"
              />
              <div className="hidden text-start lg:block">
                <span className="block text-xs font-bold text-foreground leading-tight">
                  {user.full_name}
                </span>
                <span className="block text-[10px] text-muted-foreground">
                  مدير ومحامي أساسي
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold leading-none text-foreground">{user.full_name}</p>
                <p className="text-[11px] leading-none text-muted-foreground font-mono">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <UserIcon className="w-4 h-4 ml-2" />
              الملف الشخصي
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/firm/settings")}>
              <Settings className="w-4 h-4 ml-2" />
              إعدادات المكتب
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsComplaintModalOpen(true)}>
              <LifeBuoy className="w-4 h-4 ml-2 text-amber-600" />
              تقديم شكوى أو استفسار
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/super-admin")}
              className="bg-amber-50/60 text-primary font-bold hover:bg-amber-100/80 focus:bg-amber-100"
            >
              <ShieldCheck className="w-4 h-4 ml-2 text-amber-600" />
              لوحة الإدارة العليا (Super Admin)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/login")} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <GlobalSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    <SubmitComplaintModal open={isComplaintModalOpen} onOpenChange={setIsComplaintModalOpen} />
  </>
);
};
