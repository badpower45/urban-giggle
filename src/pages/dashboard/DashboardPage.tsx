import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  CircleDollarSign,
  Clock,
  Gavel,
  Calendar,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ListTodo,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { DashboardData } from "../../types";
import { useAuthStore } from "../../lib/api/store";
import { CountBadge } from "../../components/common/CountBadge";
import { formatCurrency, formatDate, getDaysRemaining, getDeadlineUrgencyLabel } from "../../lib/utils";
import { openBaseeraTour } from "../../components/common/OnboardingTour";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, firm } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const todayStr = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? "صباح الخير" : "مساء الخير";
  };

  if (loading || !data) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 bg-slate-200 rounded-xl" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  const { owner_stats, upcoming_sessions, critical_deadlines, task_summary, recent_tasks } = data;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Greeting & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs text-tertiary">{todayStr}</p>
          <h1 className="font-headline text-primary text-2xl sm:text-3xl font-bold mt-0.5">
            {getGreeting()}، {user?.full_name || "المستشار"}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => navigate("/firm/cases/new")}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>قضية جديدة</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/firm/clients/new")}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border bg-white text-primary text-xs font-semibold hover:bg-neutral transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>موكل جديد</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/firm/police-reports/new")}
            className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-800 text-xs font-semibold hover:bg-rose-100 transition-all shadow-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>محضر جديد</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/firm/scanner")}
            className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-xl border border-secondary/30 bg-secondary/10 text-secondary-hover text-xs font-semibold hover:bg-secondary/15 transition-all shadow-xs"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>الماسح الذكي</span>
          </button>
        </div>
      </div>

      {/* Fresh Account Guided Onboarding Banner */}
      {owner_stats.active_cases === 0 && owner_stats.new_clients_month === 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary font-headline">مرحباً بك في منظومة {firm?.name || "المكتب"}!</h3>
              <p className="text-xs text-tertiary mt-0.5">ابدأ جولة تعريفية سريعة لاستكشاف مميزات النظام، أو أضف أول موكل وقضية للبدء فوراً.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => openBaseeraTour()}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>بدء الجولة التعريفية في النظام</span>
            </button>
          </div>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="space-y-3">
        <h2 className="font-headline text-primary text-sm font-semibold">نظرة عامة على المكتب</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Active Cases */}
          <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-tertiary">القضايا النشطة</span>
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl sm:text-3xl font-bold font-headline text-primary">
                {owner_stats.active_cases}
              </span>
            </div>
            <p className="text-[11px] text-tertiary mt-1">قضايا متداولة بالمحاكم</p>
          </div>

          {/* New Clients */}
          <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-tertiary">موكلون جدد هذا الشهر</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-headline text-primary">
                {owner_stats.new_clients_month}
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-semibold">
                +{owner_stats.new_clients_month - owner_stats.new_clients_prev_month} عن الماضي
              </span>
            </div>
            <p className="text-[11px] text-tertiary mt-1">مسجلين بالدليل الرقمي</p>
          </div>

          {/* Monthly Revenue */}
          <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-tertiary">الإيرادات المحصلة شهرياً</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CircleDollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-xl sm:text-2xl font-bold font-headline text-emerald-700 font-mono">
                {formatCurrency(owner_stats.revenue_month)}
              </span>
            </div>
            <p className="text-[11px] text-tertiary mt-1">دفعات أتعاب مستلمة</p>
          </div>

          {/* Pending Revenue */}
          <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-tertiary">الأتعاب المعلقة للتحصيل</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-xl sm:text-2xl font-bold font-headline text-primary font-mono">
                {formatCurrency(owner_stats.pending_revenue)}
              </span>
            </div>
            <p className="text-[11px] text-tertiary mt-1">مستحقات جارية على موكلين</p>
          </div>
        </div>
      </div>

      {/* Grid 2 Columns: Upcoming Sessions & Critical Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Sessions Card */}
        <div className="rounded-xl border border-border bg-white p-4 sm:p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Gavel className="w-3.5 h-3.5" />
              </div>
              <h2 className="font-headline text-primary text-sm font-semibold">الجلسات القادمة بالمحاكم</h2>
              <CountBadge count={upcoming_sessions.length} />
            </div>
            <Link
              to="/firm/sessions"
              className="text-xs font-medium text-secondary hover:underline flex items-center gap-1"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border flex-1">
            {upcoming_sessions.length > 0 ? (
              upcoming_sessions.map((session) => {
                const daysLeft = getDaysRemaining(session.session_date);
                return (
                  <div key={session.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/firm/cases/${session.case_id}`}
                        className="font-semibold text-xs sm:text-sm text-primary hover:text-secondary hover:underline truncate block"
                      >
                        {session.case_title}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-tertiary mt-0.5 flex-wrap">
                        <span>{session.case_court || "المحكمة"}</span>
                        {session.case_client && <span>• {session.case_client}</span>}
                      </div>
                    </div>
                    <div className="text-end shrink-0">
                      <span className="text-xs font-bold text-primary block">
                        {formatDate(session.session_date)}
                      </span>
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded mt-0.5 ${
                          daysLeft === 0
                            ? "bg-red-100 text-red-700 animate-pulse"
                            : daysLeft > 0 && daysLeft <= 3
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {daysLeft === 0 ? "اليوم" : `بعد ${daysLeft} يوم`}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-tertiary py-8 text-center">لا توجد جلسات قادمة مجدولة</p>
            )}
          </div>
        </div>

        {/* Critical Deadlines Card */}
        <div className="rounded-xl border border-border bg-white p-4 sm:p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <h2 className="font-headline text-primary text-sm font-semibold">المواعيد والمدد القانونية الحرجة</h2>
              <CountBadge count={critical_deadlines.length} />
            </div>
            <Link
              to="/firm/deadlines"
              className="text-xs font-medium text-secondary hover:underline flex items-center gap-1"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border flex-1">
            {critical_deadlines.length > 0 ? (
              critical_deadlines.map((dl) => {
                const daysLeft = getDaysRemaining(dl.deadline_date);
                const urgencyInfo = getDeadlineUrgencyLabel(daysLeft);
                return (
                  <div key={dl.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        to={dl.case_id ? `/firm/cases/${dl.case_id}` : "/firm/deadlines"}
                        className="font-semibold text-xs sm:text-sm text-primary hover:text-secondary hover:underline truncate block"
                      >
                        {dl.type}
                      </Link>
                      <p className="text-[11px] text-tertiary truncate mt-0.5">
                        {dl.description || dl.case_title}
                      </p>
                    </div>
                    <div className="text-end shrink-0">
                      <span className="text-xs font-bold text-primary block">
                        {formatDate(dl.deadline_date)}
                      </span>
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded mt-0.5 ${
                          dl.urgency === "critical"
                            ? "bg-red-100 text-red-700"
                            : dl.urgency === "high"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {urgencyInfo.label}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-tertiary py-8 text-center">لا توجد مدد حرجة حالياً</p>
            )}
          </div>
        </div>
      </div>

      {/* Task Summary Grid */}
      <div className="rounded-xl border border-border bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ListTodo className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-headline text-primary text-sm font-semibold">ملخص مهام المكتب</h2>
          </div>
          <Link
            to="/firm/tasks"
            className="text-xs font-medium text-secondary hover:underline flex items-center gap-1"
          >
            <span>لوحة المهام</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-neutral p-3 border border-border">
            <p className="text-xl font-bold font-headline text-primary">{task_summary.pending}</p>
            <p className="text-[11px] text-tertiary mt-0.5">قيد الانتظار</p>
          </div>
          <div className="rounded-lg bg-blue-50/70 p-3 border border-blue-100">
            <p className="text-xl font-bold font-headline text-blue-700">{task_summary.in_progress}</p>
            <p className="text-[11px] text-blue-600 mt-0.5">جارٍ العمل عليها</p>
          </div>
          <div className="rounded-lg bg-red-50/70 p-3 border border-red-100">
            <p className="text-xl font-bold font-headline text-red-700">{task_summary.overdue}</p>
            <p className="text-[11px] text-red-600 mt-0.5">متأخرة</p>
          </div>
        </div>

        {recent_tasks.length > 0 && (
          <div className="pt-2 divide-y divide-border">
            {recent_tasks.map((task) => (
              <div key={task.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <Link
                  to={task.case_id ? `/firm/cases/${task.case_id}` : "/firm/tasks"}
                  className="font-medium text-primary hover:text-secondary hover:underline truncate"
                >
                  {task.title}
                </Link>
                <span className="text-tertiary shrink-0 font-mono">{formatDate(task.due_date)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardPage;
