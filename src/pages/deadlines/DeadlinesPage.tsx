import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  AlertTriangle,
  Plus,
  Calculator,
  Calendar,
  Briefcase,
  CheckCircle,
  ArrowLeft,
  X,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { LegalDeadline, Case } from "../../types";
import { CountBadge } from "../../components/common/CountBadge";
import { EmptyState } from "../../components/common/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  formatDate,
  getDaysRemaining,
  getDeadlineUrgencyLabel,
} from "../../lib/utils";

export const DeadlinesPage: React.FC = () => {
  const [deadlines, setDeadlines] = useState<LegalDeadline[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Add Deadline Calculator Dialog
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [deadlineType, setDeadlineType] = useState("استئناف");
  const [judgmentDate, setJudgmentDate] = useState("");
  const [calculatedDate, setCalculatedDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const d = await apiClient.getDeadlines();
      setDeadlines(d);
      const c = await apiClient.getCases();
      setCases(c);
      if (c.length > 0 && !selectedCaseId) {
        setSelectedCaseId(c[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate deadline date automatically based on statutory rule
  useEffect(() => {
    if (!judgmentDate) return;
    const base = new Date(judgmentDate);
    if (isNaN(base.getTime())) return;

    let daysToAdd = 15;
    if (deadlineType === "استئناف") daysToAdd = 15;
    else if (deadlineType === "طعن بالنقض") daysToAdd = 60;
    else if (deadlineType === "معارضة") daysToAdd = 8;
    else if (deadlineType === "مذكرة دفاع") daysToAdd = 3;
    else if (deadlineType === "تظلم أمر أداء") daysToAdd = 10;

    base.setDate(base.getDate() + daysToAdd);
    setCalculatedDate(base.toISOString().split("T")[0]);
  }, [judgmentDate, deadlineType]);

  const handleCreateDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !calculatedDate) return;

    setSubmitting(true);
    const matchedCase = cases.find((c) => c.id === selectedCaseId);

    try {
      await apiClient.createDeadline({
        case_id: selectedCaseId,
        case_title: matchedCase?.title,
        type: deadlineType,
        deadline_date: calculatedDate,
        urgency: "critical",
        description: description || `ميعاد قانوني محسوب من تاريخ الحكم ${judgmentDate}`,
        is_confirmed: true,
      });

      setIsOpen(false);
      setJudgmentDate("");
      setCalculatedDate("");
      setDescription("");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filterTabs = [
    { key: "", label: "كل المواعيد" },
    { key: "critical", label: "حرجة للغاية" },
    { key: "high", label: "أولوية عالية" },
    { key: "medium", label: "متوسطة" },
    { key: "normal", label: "عادية" },
    { key: "overdue", label: "منقضية" },
  ];

  const filteredDeadlines = deadlines.filter((dl) => {
    const daysLeft = getDaysRemaining(dl.deadline_date);
    const isOverdue = daysLeft < 0;

    if (filter === "overdue") return isOverdue;
    if (isOverdue) return false;
    if (!filter) return true;
    return dl.urgency === filter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-9">
        <div className="flex items-center gap-2">
          <h1 className="font-headline text-primary text-2xl font-semibold">
            المواعيد القانونية والمدد
          </h1>
          <CountBadge count={filteredDeadlines.length} isLoading={loading} />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 h-9 px-3.5 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-secondary/90 transition-colors shadow-2xs"
        >
          <Calculator className="w-4 h-4 shrink-0" />
          <span>حاسبة المدد الإجرائية</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {filterTabs.map(({ key, label }) => (
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

      {/* Deadlines List */}
      {loading ? (
        <div className="p-8 text-center text-tertiary space-y-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">جارٍ حساب وجلب المدد القانونية...</p>
        </div>
      ) : filteredDeadlines.length === 0 ? (
        <div className="rounded-xl border border-border bg-white py-12 px-4 text-center shadow-xs">
          <EmptyState
            icon={Clock}
            title="لا توجد مواعيد في هذا التصنيف"
            description="جميع المدد القانونية والطعون مجدولة ومنتظمة في أوقاتها المحددة."
            actionLabel="حساب ميعاد جديد"
            onAction={() => setIsOpen(true)}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDeadlines.map((dl) => {
            const daysLeft = getDaysRemaining(dl.deadline_date);
            const isOverdue = daysLeft < 0;

            return (
              <div
                key={dl.id}
                className="rounded-xl border border-border bg-white p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1 rounded-md ${
                        dl.urgency === "critical" || isOverdue
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-primary">{dl.type}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isOverdue
                          ? "bg-slate-100 text-tertiary"
                          : dl.urgency === "critical"
                          ? "bg-red-100 text-red-700"
                          : dl.urgency === "high"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {isOverdue ? "منقضي" : getDeadlineUrgencyLabel(daysLeft).label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs font-bold text-primary">
                      تاريخ الاستحقاق: {formatDate(dl.deadline_date)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isOverdue
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : daysLeft === 0
                          ? "bg-red-600 text-white animate-pulse"
                          : daysLeft <= 3
                          ? "bg-amber-100 text-amber-900"
                          : "bg-green-50 text-green-800"
                      }`}
                    >
                      {isOverdue
                        ? `فات منذ ${Math.abs(daysLeft)} يوم`
                        : daysLeft === 0
                        ? "اليوم آخر ميعاد!"
                        : `متبقي ${daysLeft} يوم`}
                    </span>
                  </div>
                </div>

                <div>
                  {dl.case_title && (
                    <Link
                      to={`/firm/cases/${dl.case_id}`}
                      className="font-headline font-bold text-sm text-primary hover:text-secondary hover:underline block"
                    >
                      {dl.case_title}
                    </Link>
                  )}
                  {dl.description && (
                    <p className="text-xs text-tertiary mt-1">{dl.description}</p>
                  )}
                </div>

                {dl.case_id && (
                  <div className="pt-2 border-t border-border/40 flex items-center justify-end">
                    <Link
                      to={`/firm/cases/${dl.case_id}`}
                      className="text-xs text-secondary hover:underline flex items-center gap-1 font-medium"
                    >
                      الانتقال لملف القضية <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Calculator Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="font-headline text-lg font-bold text-primary flex items-center gap-2">
              <Calculator className="w-5 h-5 text-secondary" />
              <span>حاسبة المدد الإجرائية ومواعيد الطعن</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateDeadline} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">
                اختر القضية المرتبطة <span className="text-red-500">*</span>
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

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">
                نوع الإجراء أو الطعن القانوني <span className="text-red-500">*</span>
              </label>
              <select
                value={deadlineType}
                onChange={(e) => setDeadlineType(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              >
                <option value="استئناف">استئناف حكم (15 يوماً)</option>
                <option value="طعن بالنقض">طعن بالنقض (60 يوماً)</option>
                <option value="معارضة">معارضة في حكم غيابي (8 أيام)</option>
                <option value="تظلم أمر أداء">تظلم في أمر أداء (10 أيام)</option>
                <option value="مذكرة دفاع">مذكرة دفاع ختامية (3 أيام)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  تاريخ صدور الحكم / الإعلان <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={judgmentDate}
                  onChange={(e) => setJudgmentDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  الميعاد النهائي المحسوب
                </label>
                <input
                  type="date"
                  readOnly
                  value={calculatedDate}
                  className="w-full h-9 px-3 rounded-md border border-border bg-neutral text-xs text-primary font-bold font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">بيان إضافي</label>
              <input
                type="text"
                placeholder="رقم الحكم، الدائرة الصادر منها، ملاحظات..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-9 px-4 rounded-md border border-border text-xs font-medium text-tertiary hover:text-primary hover:bg-neutral"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-9 px-4 rounded-md bg-secondary text-xs font-semibold text-white hover:bg-secondary/90 disabled:opacity-50"
              >
                {submitting ? "جارٍ التثبيت..." : "تثبيت الميعاد بالقضية"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default DeadlinesPage;
