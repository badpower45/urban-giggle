import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Gavel,
  Calendar,
  Clock,
  Plus,
  Printer,
  FileText,
  MapPin,
  ArrowLeft,
  X,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { CourtSession, Case } from "../../types";
import { CountBadge } from "../../components/common/CountBadge";
import { EmptyState } from "../../components/common/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { formatDate, getDaysRemaining } from "../../lib/utils";
import { PrintSessionsRollModal } from "../../components/common/PrintSessionsRollModal";

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<CourtSession[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [loading, setLoading] = useState(true);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // New Session Dialog
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [decisionReason, setDecisionReason] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSessions(filter);
      setSessions(data);

      const allCases = await apiClient.getCases();
      setCases(allCases);
      if (allCases.length > 0 && !selectedCaseId) {
        setSelectedCaseId(allCases[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !sessionDate) return;

    setSubmitting(true);
    const matchedCase = cases.find((c) => c.id === selectedCaseId);

    try {
      await apiClient.createSession({
        case_id: selectedCaseId,
        case_title: matchedCase?.title,
        case_court: matchedCase?.court_name,
        case_client: matchedCase?.client_name,
        session_date: sessionDate,
        outcome_type: "adjourned",
        adjournment_reason: decisionReason || "جلسة مرافعة",
        next_session_date: nextDate || null,
        notes: notes || undefined,
      });

      setIsAddOpen(false);
      setSessionDate("");
      setDecisionReason("");
      setNextDate("");
      setNotes("");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filterButtons = [
    { key: "upcoming" as const, label: "الجلسات القادمة" },
    { key: "past" as const, label: "الجلسات السابقة" },
    { key: "all" as const, label: "كل الجلسات" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-9">
        <div className="flex items-center gap-2">
          <h1 className="font-headline text-primary text-2xl font-semibold">
            رول الجلسات
          </h1>
          <CountBadge count={sessions.length} isLoading={loading} />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPrintOpen(true)}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-white text-xs font-semibold text-primary hover:bg-neutral transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-tertiary" />
            <span>طباعة الرول</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل جلسة</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {filterButtons.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === key
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-border text-tertiary hover:text-primary hover:bg-neutral"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="p-8 text-center text-tertiary space-y-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">جارٍ تحميل رول الجلسات...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-xl border border-border bg-white py-12 px-4 text-center shadow-xs">
          <EmptyState
            icon={Gavel}
            title="لا توجد جلسات"
            description="لم يتم العثور على أي جلسات محاكم مجدولة في هذا التبويب."
            actionLabel="تسجيل جلسة جديدة"
            onAction={() => setIsAddOpen(true)}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const daysRemaining = getDaysRemaining(session.session_date);
            return (
              <div
                key={session.id}
                className="rounded-xl border border-border bg-white p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-neutral border border-border text-tertiary">
                      <Gavel className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      {session.case_court || "محكمة متداولة"}
                    </span>
                    {session.case_client && (
                      <span className="text-xs text-tertiary">• الموكل: {session.case_client}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs font-bold text-primary">
                      {formatDate(session.session_date)}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        daysRemaining === 0
                          ? "bg-red-100 text-red-700 animate-pulse"
                          : daysRemaining > 0 && daysRemaining <= 3
                          ? "bg-amber-100 text-amber-800"
                          : daysRemaining > 3
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-tertiary"
                      }`}
                    >
                      {daysRemaining === 0
                        ? "اليوم!"
                        : daysRemaining > 0
                        ? `بعد ${daysRemaining} يوم`
                        : "منقضية"}
                    </span>
                  </div>
                </div>

                <div>
                  <Link
                    to={`/firm/cases/${session.case_id}`}
                    className="font-headline font-bold text-sm sm:text-base text-primary hover:text-secondary hover:underline block"
                  >
                    {session.case_title}
                  </Link>

                  {session.adjournment_reason && (
                    <div className="mt-2 text-xs bg-neutral rounded-lg p-2.5 border border-border text-primary">
                      <span className="font-semibold text-tertiary block mb-0.5">القرار / التأجيل:</span>
                      <p>{session.adjournment_reason}</p>
                    </div>
                  )}

                  {session.notes && (
                    <p className="text-xs text-tertiary mt-2">
                      ملاحظات: {session.notes}
                    </p>
                  )}
                </div>

                {session.next_session_date && (
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-tertiary">
                    <span className="flex items-center gap-1.5 font-medium text-secondary">
                      <Calendar className="w-3.5 h-3.5" />
                      الجلسة القادمة المقررة: {formatDate(session.next_session_date)}
                    </span>
                    <Link
                      to={`/firm/cases/${session.case_id}`}
                      className="text-secondary hover:underline flex items-center gap-1"
                    >
                      ملف القضية <ArrowLeft className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Session Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="font-headline text-lg font-bold text-primary">
              تسجيل جلسة محكمة جديدة
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSession} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">
                اختر القضية <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.case_number}/{c.case_year})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  تاريخ الجلسة <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  الجلسة القادمة (إن وجدت)
                </label>
                <input
                  type="date"
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">
                قرار الجلسة أو سبب التأجيل
              </label>
              <input
                type="text"
                placeholder="مثال: حجزت للحكم، التأجيل للاطلاع والمذكرات..."
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">ملاحظات التحضير</label>
              <textarea
                rows={2}
                placeholder="طلبات الدفاع، المستندات المطلوبة للجلسة..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="h-9 px-4 rounded-md border border-border text-xs font-medium text-tertiary hover:text-primary hover:bg-neutral"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-9 px-4 rounded-md bg-primary text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? "جارٍ الحفظ..." : "حفظ الجلسة"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Print Roll Modal */}
      <PrintSessionsRollModal
        open={isPrintOpen}
        onOpenChange={setIsPrintOpen}
        sessions={sessions}
      />
    </div>
  );
};
export default SessionsPage;
