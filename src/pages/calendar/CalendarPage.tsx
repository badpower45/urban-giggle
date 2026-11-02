import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Gavel,
  Clock,
  Briefcase,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { appStore } from "../../lib/api/store";
import { CourtSession, LegalDeadline } from "../../types";
import { CountBadge } from "../../components/common/CountBadge";
import { formatDate } from "../../lib/utils";

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<CourtSession[]>([]);
  const [deadlines, setDeadlines] = useState<LegalDeadline[]>([]);
  const [selectedDayStr, setSelectedDayStr] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const unsubscribe = appStore.subscribe(() => {
      setSessions(appStore.getSessions());
      setDeadlines(appStore.getDeadlines());
    });
    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const s = await apiClient.getSessions("all");
      setSessions(s);
      const d = await apiClient.getDeadlines();
      setDeadlines(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const calendarDays: Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }> = [];

  // Previous month trailing days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const dStr = new Date(year, month - 1, day).toISOString().split("T")[0];
    calendarDays.push({ dateStr: dStr, dayNum: day, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, "0");
    const dStr = `${year}-${mStr}-${String(d).padStart(2, "0")}`;
    calendarDays.push({ dateStr: dStr, dayNum: d, isCurrentMonth: true });
  }

  // Next month trailing days
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const dStr = new Date(year, month + 1, d).toISOString().split("T")[0];
    calendarDays.push({ dateStr: dStr, dayNum: d, isCurrentMonth: false });
  }

  const selectedSessions = sessions.filter((s) => (s.session_date || '').split('T')[0] === selectedDayStr);
  const selectedDeadlines = deadlines.filter((d) => (d.deadline_date || '').split('T')[0] === selectedDayStr);

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-3 sm:space-y-5 sm:p-6">
      {/* Header & Month Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="font-headline text-primary text-xl sm:text-2xl font-semibold">
            التقويم والأجندة القضائية
          </h1>
          <CountBadge count={sessions.length + deadlines.length} prefix="الأحداث: " />
        </div>

        <div className="flex items-center gap-2 bg-white border border-border rounded-lg p-1 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 text-tertiary hover:text-primary rounded-md transition-colors"
            title="الشهر القادم"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-xs sm:text-sm font-bold text-primary px-3 min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 text-tertiary hover:text-primary rounded-md transition-colors"
            title="الشهر السابق"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-border bg-white overflow-hidden shadow-xs">
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 border-b border-border bg-neutral/60 text-center py-2 text-[11px] font-semibold text-tertiary">
          <div>الأحد</div>
          <div>الإثنين</div>
          <div>الثلاثاء</div>
          <div>الأربعاء</div>
          <div>الخميس</div>
          <div>الجمعة</div>
          <div>السبت</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border rtl:divide-x-reverse">
          {calendarDays.map((cd, index) => {
            const daySessions = sessions.filter((s) => (s.session_date || '').split('T')[0] === cd.dateStr);
            const dayDeadlines = deadlines.filter((d) => (d.deadline_date || '').split('T')[0] === cd.dateStr);
            const isSelected = cd.dateStr === selectedDayStr;
            const isToday = cd.dateStr === new Date().toISOString().split("T")[0];

            return (
              <div
                key={index}
                onClick={() => setSelectedDayStr(cd.dateStr)}
                className={`min-h-[85px] sm:min-h-[105px] p-1.5 transition-colors cursor-pointer flex flex-col justify-between ${
                  !cd.isCurrentMonth
                    ? "bg-neutral/40 text-slate-400"
                    : isSelected
                    ? "bg-neutral ring-1 ring-primary"
                    : "bg-white hover:bg-neutral/50 text-primary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-bold w-6 h-6 rounded-full ${
                      isToday
                        ? "bg-primary text-white shadow-xs"
                        : "text-primary"
                    }`}
                  >
                    {cd.dayNum}
                  </span>
                </div>

                <div className="space-y-1 mt-1 overflow-hidden">
                  {daySessions.map((s) => (
                    <div
                      key={s.id}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/60 truncate font-medium"
                      title={s.case_title}
                    >
                      جلسة: {s.case_title}
                    </div>
                  ))}
                  {dayDeadlines.map((dl) => (
                    <div
                      key={dl.id}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60 truncate font-medium"
                      title={dl.type}
                    >
                      ميعاد: {dl.type}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Detail */}
      <div className="rounded-xl border border-border bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="font-headline font-semibold text-sm text-primary flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-secondary" />
            <span>جدول أعمال اليوم المحدد ({formatDate(selectedDayStr)})</span>
          </h2>
          <span className="text-xs text-tertiary">
            {selectedSessions.length + selectedDeadlines.length} التزامات قانونية
          </span>
        </div>

        {selectedSessions.length === 0 && selectedDeadlines.length === 0 ? (
          <p className="text-xs text-tertiary py-4 text-center">
            لا توجد جلسات أو مواعيد قانونية مجدولة في هذا اليوم
          </p>
        ) : (
          <div className="space-y-2">
            {selectedSessions.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-lg border border-border bg-neutral/40 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="p-1 rounded bg-blue-50 text-blue-700">
                    <Gavel className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <Link
                      to={`/firm/cases/${s.case_id}`}
                      className="font-semibold text-primary hover:text-secondary hover:underline truncate block"
                    >
                      {s.case_title}
                    </Link>
                    <p className="text-[10px] text-tertiary">{s.case_court || "المحكمة"}</p>
                  </div>
                </div>

                <Link
                  to={`/firm/cases/${s.case_id}`}
                  className="text-xs text-secondary hover:underline flex items-center gap-1 shrink-0"
                >
                  تفاصيل <ArrowLeft className="w-3 h-3" />
                </Link>
              </div>
            ))}

            {selectedDeadlines.map((dl) => (
              <div
                key={dl.id}
                className="p-3 rounded-lg border border-border bg-neutral/40 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="p-1 rounded bg-amber-50 text-amber-700">
                    <Clock className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="font-semibold text-primary block">{dl.type}</span>
                    <p className="text-[10px] text-tertiary truncate">{dl.case_title}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                  ميعاد حرج
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CalendarPage;
