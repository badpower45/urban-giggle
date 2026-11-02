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
  Scale,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { appStore } from "../../lib/api/store";
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
import {
  EGYPTIAN_LEGAL_PROCEDURE_RULES,
  calculateStatutoryDeadline,
} from "../../lib/data/egyptianLegalWorkflows";

export const DeadlinesPage: React.FC = () => {
  const [deadlines, setDeadlines] = useState<LegalDeadline[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Add Deadline Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [selectedRuleId, setSelectedRuleId] = useState(EGYPTIAN_LEGAL_PROCEDURE_RULES[0].id);
  const [deadlineType, setDeadlineType] = useState(EGYPTIAN_LEGAL_PROCEDURE_RULES[0].name);
  const [judgmentDate, setJudgmentDate] = useState(new Date().toISOString().split("T")[0]);
  const [calculatedDate, setCalculatedDate] = useState("");
  const [description, setDescription] = useState("");
  const [statutoryCitation, setStatutoryCitation] = useState(EGYPTIAN_LEGAL_PROCEDURE_RULES[0].legalArticle);
  const [holidayExtended, setHolidayExtended] = useState(false);
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
    // Live subscription to reactive store updates
    const unsubscribe = appStore.subscribe(() => {
      setDeadlines(appStore.getDeadlines());
      setCases(appStore.getCases());
    });
    return () => unsubscribe();
  }, []);

  // Recalculate deadline date based on chosen rule and start/judgment date
  useEffect(() => {
    const rule = EGYPTIAN_LEGAL_PROCEDURE_RULES.find((r) => r.id === selectedRuleId);
    if (!rule) return;

    setDeadlineType(rule.name);
    setStatutoryCitation(rule.legalArticle);

    if (judgmentDate) {
      const calc = calculateStatutoryDeadline(judgmentDate, rule.days);
      setCalculatedDate(calc.targetDate);
      setHolidayExtended(calc.wasExtended);
    }
  }, [selectedRuleId, judgmentDate]);

  const handleCreateDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) {
      alert("يرجى اختيار القضية المرتبطة بالميعاد");
      return;
    }
    if (!calculatedDate) {
      alert("يرجى تحديد تاريخ استحقاق الميعاد");
      return;
    }

    setSubmitting(true);
    const matchedCase = cases.find((c) => c.id === selectedCaseId);
    const daysLeft = getDaysRemaining(calculatedDate);
    const urgency = daysLeft <= 2 ? "critical" : daysLeft <= 7 ? "high" : "medium";

    try {
      const created = await apiClient.createDeadline({
        case_id: selectedCaseId,
        case_title: matchedCase?.title,
        type: deadlineType,
        deadline_date: calculatedDate,
        urgency,
        description:
          description ||
          `${statutoryCitation ? `وفقاً لـ (${statutoryCitation}). ` : ""}تاريخ البداية: ${judgmentDate}`,
        is_confirmed: true,
      });

      setIsOpen(false);
      setDescription("");
      setFeedbackMsg(`تم تثبيت ميعاد (${created.type}) بنجاح وإدراجه في الأجندة.`);
      setTimeout(() => setFeedbackMsg(null), 4000);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ الميعاد");
    } finally {
      setSubmitting(false);
    }
  };

  const filterTabs = [
    { key: "", label: "كل المواعيد الحالية" },
    { key: "critical", label: "حرجة للغاية (خلال يومين)" },
    { key: "high", label: "أولوية عالية (خلال أسبوع)" },
    { key: "medium", label: "متوسطة" },
    { key: "overdue", label: "منقضية" },
  ];

  const filteredDeadlines = deadlines.filter((dl) => {
    const daysLeft = getDaysRemaining(dl.deadline_date);
    const isOverdue = daysLeft < 0;

    if (filter === "overdue") return isOverdue;
    if (filter === "critical") return !isOverdue && daysLeft <= 2;
    if (filter === "high") return !isOverdue && daysLeft > 2 && daysLeft <= 7;
    if (filter === "medium") return !isOverdue && daysLeft > 7;
    return true; // All
  }).sort((a, b) => {
    // Sort closest deadline first
    const dateA = new Date(a.deadline_date).getTime();
    const dateB = new Date(b.deadline_date).getTime();
    return dateA - dateB;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5 p-4 sm:p-6" dir="rtl">
      {/* Success Feedback Banner */}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-9">
        <div className="flex items-center gap-2">
          <h1 className="font-headline text-primary text-2xl font-semibold">
            المواعيد القانونية ومدد الطعون
          </h1>
          <CountBadge count={filteredDeadlines.length} isLoading={loading} />
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/firm/calendar"
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-white text-xs font-semibold text-primary hover:bg-neutral transition-colors shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-secondary" />
            <span>عرض في التقويم القضائي</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 h-9 px-3.5 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-secondary/90 transition-colors shadow-2xs"
          >
            <Calculator className="w-4 h-4 shrink-0" />
            <span>حاسبة وإضافة ميعاد قانوني</span>
          </button>
        </div>
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
                ? "bg-primary text-white shadow-xs font-bold"
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
            actionLabel="حساب وتثبيت ميعاد جديد"
            onAction={() => setIsOpen(true)}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDeadlines.map((dl) => {
            const daysLeft = getDaysRemaining(dl.deadline_date);
            const isOverdue = daysLeft < 0;
            const urgency = getDeadlineUrgencyLabel(daysLeft);

            return (
              <div
                key={dl.id}
                className="rounded-xl border border-border bg-white p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`p-1 rounded-md ${
                        isOverdue || daysLeft <= 2
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : daysLeft <= 7
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : "bg-blue-50 text-blue-600 border border-blue-200"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-primary">{dl.type}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${urgency.bg} ${urgency.color}`}
                    >
                      {urgency.label}
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
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{dl.description}</p>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-tertiary">
                  <span className="font-mono">معرف الميعاد: {dl.id}</span>
                  <Link
                    to={`/firm/cases/${dl.case_id}`}
                    className="text-secondary font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>فتح ملف القضية</span>
                    <ArrowLeft className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Calculator Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-primary text-base">
              <Calculator className="w-5 h-5 text-secondary" />
              <span>حاسبة المدد الإجرائية ومواعيد الطعن المصرية</span>
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
                    {c.title} (رقم {c.case_number}/{c.case_year} - {c.court_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">
                نوع الإجراء أو الطعن القانوني (حسب نصوص القانون المصري) <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedRuleId}
                onChange={(e) => setSelectedRuleId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              >
                {EGYPTIAN_LEGAL_PROCEDURE_RULES.map((rule) => (
                  <option key={rule.id} value={rule.id}>
                    {rule.name} ({rule.days} يوماً) - {rule.legalArticle}
                  </option>
                ))}
              </select>
              {statutoryCitation && (
                <p className="text-[11px] text-muted-foreground mt-1 bg-slate-50 p-1.5 rounded border border-slate-200">
                  <strong>السند القانوني:</strong> {statutoryCitation}
                </p>
              )}
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
                  الميعاد النهائي المحسوب <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={calculatedDate}
                  onChange={(e) => setCalculatedDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-secondary/50 bg-secondary/5 text-xs text-primary font-bold font-mono focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>

            {holidayExtended && (
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-md border border-amber-200">
                ⚠️ <strong>تطبيق المادة 18 مرافعات:</strong> صادف نهاية الميعاد عطلة رسمية (جمعة/سبت)، فامتد الأجل تلقائياً إلى أول يوم عمل (الأحد).
              </p>
            )}

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">
                بيان أو توجيهات لفريق العمل القانوني
              </label>
              <input
                type="text"
                placeholder="رقم الحكم، الدائرة الصادر منها، ملاحظات الإيداع..."
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
                {submitting ? "جارٍ التثبيت..." : "تثبيت الميعاد بالقضية والأجندة"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeadlinesPage;
