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
} from "lucide-react";
import { appStore } from "../../lib/api/store";
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

  useEffect(() => {
    return appStore.subscribe(() => {
      setStoreState(appStore.getState());
    });
  }, []);

  const { user, firm, deadlines, sessions } = storeState;

  const urgentCount = deadlines.filter((d) => d.urgency === "critical" || d.urgency === "high").length;

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur sm:px-6">
        {/* Right Side: Mobile Menu & Firm Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="القائمة"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-border">
            <Building2 className="w-4 h-4 text-secondary" />
            <span className="text-xs font-semibold text-primary truncate max-w-[200px] lg:max-w-[320px]">
              {firm.name}
            </span>
          </div>

          <Link
            to="/"
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            title="الانتقال إلى الموقع التعريفي"
          >
            <Globe className="w-3.5 h-3.5 text-secondary" />
            <span>الموقع التعريفي</span>
          </Link>
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
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 h-9 w-9"
            aria-label="بحث"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Quick Add Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 text-xs font-medium">
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">إضافة جديدة</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>إجراءات سريعة</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/firm/cases/new")}>
              <Briefcase className="w-4 h-4 ml-2 text-primary" />
              إضافة قضية جديدة
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/firm/clients/new")}>
              <UserPlus className="w-4 h-4 ml-2 text-primary" />
              إضافة موكل جديد
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Popover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-slate-600 hover:bg-slate-100 hover:text-foreground transition-colors"
              title="التنبيهات"
            >
              <Bell className="h-4 w-4" />
              {urgentCount > 0 && (
                <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow">
                  {urgentCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2">
            <div className="flex items-center justify-between pb-2 border-b border-border px-2">
              <span className="font-bold text-xs text-primary">التنبيهات والمواعيد الحرجة</span>
              <span className="text-[10px] text-muted-foreground">{urgentCount} ميعاد وشيك</span>
            </div>
            <div className="py-2 divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {deadlines.slice(0, 3).map((dl) => (
                <div key={dl.id} className="py-2 px-1 hover:bg-slate-50 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{dl.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">{dl.case_title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">تاريخ الاستحقاق: {dl.deadline_date}</p>
                </div>
              ))}
              {sessions.slice(0, 2).map((s) => (
                <div key={s.id} className="py-2 px-1 hover:bg-slate-50 rounded-lg text-xs">
                  <span className="font-semibold text-primary block">جلسة محكمة قادمة</span>
                  <p className="text-[11px] text-slate-600 truncate">{s.case_title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.case_court} — {s.session_date}</p>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border text-center">
              <Link
                to="/firm/deadlines"
                className="text-[11px] text-secondary font-bold hover:underline"
              >
                عرض كل المواعيد والمدد القانونية &larr;
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Submit Complaint or Support Ticket */}
        <button
          type="button"
          onClick={() => setIsComplaintModalOpen(true)}
          className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-amber-200 bg-amber-50/70 text-amber-900 hover:bg-amber-100 text-xs font-semibold transition-colors"
          title="تقديم شكوى أو استفسار للإدارة العليا"
        >
          <LifeBuoy className="w-3.5 h-3.5 text-amber-700" />
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
