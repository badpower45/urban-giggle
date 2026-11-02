import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Briefcase,
  Gavel,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  User,
  ArrowRight,
  ArrowLeft,
  Plus,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Building,
  ShieldAlert,
  Printer,
  Sparkles,
  Receipt,
  FileCheck,
  Scale,
  FolderOpen,
  Send,
  ExternalLink,
  Info,
  Check,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { appStore } from "../../lib/api/store";
import { Case, CourtSession, LegalDeadline, Task, PoliceReport } from "../../types";
import { ContractInstance } from "../../types/contract";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import {
  formatCurrency,
  formatDate,
  getDaysRemaining,
  getDeadlineUrgencyLabel,
} from "../../lib/utils";
import {
  EGYPTIAN_LEGAL_PROCEDURE_RULES,
  calculateStatutoryDeadline,
} from "../../lib/data/egyptianLegalWorkflows";

// Common contract choices when generating from a case
const CASE_CONTRACT_OPTIONS = [
  {
    id: "tmpl-retainer-lawyer",
    title: "عقد اتفاق وتحديد أتعاب محاماة ووكالة قضائية",
    badge: "الأكثر طلباً",
    description: "عقد رسمي لتحديد الأتعاب والمصروفات ومراحل السير في الدعوى طبقاً لقانون المحاماة رقم 17 لسنة 1983.",
    category: "أتعاب ومحاماة",
  },
  {
    id: "tmpl-settlement-court",
    title: "إقرار تصالح وتنازل نهائي عن جنحة / دعوى قضائية",
    badge: "تصالح قضائي",
    description: "صيغة تصالح رسمي وتنازل بات لا رجعة فيه يُقدم للنيابة العامة وهيئة المحكمة لإنهاء النزاع.",
    category: "إقرارات ومصالحات",
  },
  {
    id: "tmpl-financial-release",
    title: "إقرار ومخالصة مالية نهائية وإبراء ذمة شامل",
    badge: "مخالصة",
    description: "مخالصة باستلام كامل المستحقات والمبالغ المقضي بها وإبراء ذمة الطرف الخصم إبراءً شاملاً.",
    category: "ماليات ومخالصات",
  },
  {
    id: "tmpl-sale-apartment",
    title: "عقد بيع نهائي لشقة سكنية / عقار",
    badge: "عقارات",
    description: "عقد بيع نهائي متضمن حصة شائعة في الأرض وأركان الملكية وإجراءات صحة التوقيع أو النفاذ.",
    category: "بيوع ونقل ملكية",
  },
  {
    id: "tmpl-lease-residential",
    title: "عقد إيجار وحدة سكنية (خاضع للقانون 4 لسنة 1996)",
    badge: "إيجارات",
    description: "عقد إيجار مشاهرة محدد المدة خاضع لأحكام القانون المدني مع التزام بالصيغة التنفيذية.",
    category: "إيجار وسكن",
  },
  {
    id: "tmpl-commercial-partnership",
    title: "عقد اتفاق شراكة ومحاصة في مشروع تجاري",
    badge: "شركات",
    description: "تنظيم حصص الشركاء والأرباح والإدارة واختصاص التحكيم أو المحكمة الاقتصادية.",
    category: "شركات وتجارة",
  },
];

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [sessions, setSessions] = useState<CourtSession[]>([]);
  const [deadlines, setDeadlines] = useState<LegalDeadline[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [policeReports, setPoliceReports] = useState<PoliceReport[]>([]);
  const [contracts, setContracts] = useState<ContractInstance[]>([]);
  const [expenses, setExpenses] = useState<Array<{ id: string; title: string; amount: number; date: string; case_id?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal Dialogs
  // 1. Session Modal
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionReason, setSessionReason] = useState("");
  const [nextDate, setNextDate] = useState("");

  // 2. Deadline Modal
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState(EGYPTIAN_LEGAL_PROCEDURE_RULES[3].id); // Default: civil appeal
  const [deadlineType, setDeadlineType] = useState(EGYPTIAN_LEGAL_PROCEDURE_RULES[3].name);
  const [judgmentDate, setJudgmentDate] = useState(new Date().toISOString().split("T")[0]);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineDesc, setDeadlineDesc] = useState("");
  const [holidayExtended, setHolidayExtended] = useState(false);

  // 3. Contract Generation Modal
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedContractTemplateId, setSelectedContractTemplateId] = useState(CASE_CONTRACT_OPTIONS[0].id);

  // 4. Task Modal
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState<"urgent" | "high" | "medium" | "low">("high");

  // 5. Expense Modal
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(500);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);

  const loadAll = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const c = await apiClient.getCaseById(id);
      setCaseData(c);

      const allSessions = await apiClient.getSessionsByCase(id);
      setSessions(allSessions);

      const allDeadlines = await apiClient.getDeadlines();
      setDeadlines(allDeadlines.filter((d) => d.case_id === id));

      const allTasks = await apiClient.getTasks();
      setTasks(allTasks.filter((t) => t.case_id === id));

      const linkedReports = await apiClient.getPoliceReportsByCase(id);
      setPoliceReports(linkedReports);

      const caseContracts = await apiClient.getContracts(id);
      setContracts(caseContracts);

      const caseExpenses = await apiClient.getExpenses(id);
      setExpenses(caseExpenses);
    } catch (err) {
      console.error(err);
      navigate("/firm/cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const unsubscribe = appStore.subscribe(() => {
      if (id) {
        const c = appStore.getCaseById(id);
        if (c) setCaseData(c);
        setSessions(appStore.getSessionsByCase(id));
        setDeadlines(appStore.getDeadlines().filter((d) => d.case_id === id));
        setTasks(appStore.getTasks().filter((t) => t.case_id === id));
        setPoliceReports(appStore.getPoliceReportsByCase(id));
        setContracts(appStore.getContracts(id));
        setExpenses(appStore.getExpenses(id));
      }
    });
    return () => unsubscribe();
  }, [id]);

  // Recalculate deadline modal date
  useEffect(() => {
    const rule = EGYPTIAN_LEGAL_PROCEDURE_RULES.find((r) => r.id === selectedRuleId);
    if (!rule) return;
    setDeadlineType(rule.name);
    if (judgmentDate) {
      const calc = calculateStatutoryDeadline(judgmentDate, rule.days);
      setDeadlineDate(calc.targetDate);
      setHolidayExtended(calc.wasExtended);
    }
  }, [selectedRuleId, judgmentDate]);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handlers
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !sessionDate) return;
    try {
      await apiClient.createSession({
        case_id: id,
        case_title: caseData?.title,
        case_court: caseData?.court_name,
        case_client: caseData?.client_name,
        session_date: sessionDate,
        adjournment_reason: sessionReason || "جلسة مرافعة وتقديم مستندات",
        next_session_date: nextDate || null,
        outcome_type: "adjourned",
      });
      setIsAddSessionOpen(false);
      setSessionDate("");
      setSessionReason("");
      setNextDate("");
      showNotification("تم تثبيت الجلسة بنجاح وتحديث أجندة المحكمة.");
      await loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !deadlineDate) return;
    try {
      const rule = EGYPTIAN_LEGAL_PROCEDURE_RULES.find((r) => r.id === selectedRuleId);
      await apiClient.createDeadline({
        case_id: id,
        case_title: caseData?.title,
        type: deadlineType,
        deadline_date: deadlineDate,
        urgency: "critical",
        description: deadlineDesc || (rule ? `${rule.legalArticle} - تاريخ صدور الحكم ${judgmentDate}` : `ميعاد قانوني`),
        is_confirmed: true,
      });
      setIsAddDeadlineOpen(false);
      setDeadlineDesc("");
      showNotification("تم حفظ الميعاد القانوني وإدراجه في لوحة المواعيد والتقويم القضائي.");
      await loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !taskTitle.trim()) return;
    try {
      await apiClient.createTask({
        case_id: id,
        case_title: caseData?.title,
        title: taskTitle.trim(),
        description: `مهمة مرتبطة بالقضية: ${caseData?.title}`,
        priority: taskPriority,
        status: "pending",
        assigned_to: caseData?.assigned_to || "01a08460-b523-7667-b6cd-7863e99c38c7",
        assigned_to_name: caseData?.assigned_to_name || "محمد السيد",
        due_date: taskDueDate || new Date().toISOString().split("T")[0],
      });
      setIsAddTaskOpen(false);
      setTaskTitle("");
      setTaskDueDate("");
      showNotification("تم إضافة المهمة بنجاح وإسنادها للمحامي المسؤول.");
      await loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !expenseTitle.trim() || expenseAmount <= 0) return;
    try {
      await apiClient.addExpense({
        case_id: id,
        title: expenseTitle.trim(),
        amount: Number(expenseAmount),
        date: expenseDate,
      });
      setIsAddExpenseOpen(false);
      setExpenseTitle("");
      setExpenseAmount(500);
      showNotification("تم تسجيل المصروف القضائي وإضافته للسجل المالي للمكتب.");
      await loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceedToContract = () => {
    if (!caseData) return;
    setIsContractModalOpen(false);
    navigate(`/firm/contracts?templateId=${selectedContractTemplateId}&caseId=${caseData.id}&mode=generator`);
  };

  if (loading || !caseData) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground" dir="rtl">
        جارٍ تحميل ملف القضية والبيانات المرتبطة...
      </div>
    );
  }

  const outstanding = Math.max(0, caseData.total_fees - caseData.total_paid);
  const totalExpensesAmount = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-3 sm:space-y-5 sm:p-6" dir="rtl">
      {/* Toast Alert Banner */}
      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-950">
            ×
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/firm/cases")}
            className="text-slate-600 gap-1"
          >
            <ArrowRight className="w-4 h-4" />
            القضايا
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-primary font-bold">
            رقم {caseData.case_number} لسنة {caseData.case_year}
          </span>
          <span className="text-xs text-tertiary">({caseData.court_name})</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsContractModalOpen(true)}
            className="gap-1.5 text-xs bg-secondary text-white hover:bg-secondary/90 shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>إنشاء عقد لهذه القضية</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/firm/police-reports/new?caseId=${id}`)}
            className="gap-1.5 text-xs bg-white text-primary border-border hover:bg-neutral"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-secondary" />
            <span>+ محضر شرطة مرتبط</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/firm/cases/${id}/edit`)}
            className="gap-1.5 text-xs bg-white text-slate-700 border-border"
          >
            <Edit className="w-3.5 h-3.5" />
            تعديل القضية
          </Button>
        </div>
      </div>

      {/* Case Identity Banner */}
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="bg-primary/5 p-5 sm:p-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="default" className="text-xs">
                  {caseData.case_type_name}
                </Badge>
                {caseData.status === "active" ? (
                  <Badge variant="success">متداولة (نشطة)</Badge>
                ) : caseData.status === "reserved_for_ruling" ? (
                  <Badge variant="warning">محجوزة للحكم</Badge>
                ) : (
                  <Badge variant="outline">{caseData.status}</Badge>
                )}
                <span className="text-xs text-muted-foreground font-mono">
                  تاريخ القيد: {formatDate(caseData.filing_date)}
                </span>
                <span className="text-xs text-slate-600 bg-white px-2 py-0.5 rounded border border-border">
                  المحامي المسؤول: {caseData.assigned_to_name || "محمد السيد"}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold font-headline text-primary">
                {caseData.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Gavel className="w-3.5 h-3.5 text-secondary" />
                  {caseData.court_name} • {caseData.circuit} ({caseData.court_governorate})
                </span>
              </div>
            </div>

            {/* Client & Opponent Badges */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="p-3 bg-white rounded-xl border border-border shadow-xs text-xs space-y-1 min-w-[170px]">
                <span className="text-[10px] text-muted-foreground block font-bold">
                  الموكل ({caseData.client_role === 'plaintiff' ? 'المدعي' : 'المدعى عليه'})
                </span>
                <Link
                  to={`/firm/clients/${caseData.client_id}`}
                  className="font-bold text-primary hover:text-secondary block truncate"
                >
                  {caseData.client_name}
                </Link>
              </div>

              <div className="p-3 bg-white rounded-xl border border-border shadow-xs text-xs space-y-1 min-w-[170px]">
                <span className="text-[10px] text-muted-foreground block font-bold">الطرف الخصم</span>
                <span className="font-bold text-slate-700 block truncate">{caseData.opponent_name}</span>
                {caseData.opponent_lawyer && (
                  <span className="text-[10px] text-muted-foreground block truncate">
                    محامي: {caseData.opponent_lawyer}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Operational Summary Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-x-reverse divide-border bg-slate-50/50">
          <div className="p-3 text-center">
            <span className="text-[11px] text-muted-foreground block">الأتعاب التعاقدية</span>
            <span className="text-sm sm:text-base font-bold text-foreground font-mono mt-0.5 block">
              {formatCurrency(caseData.total_fees)}
            </span>
          </div>
          <div className="p-3 text-center">
            <span className="text-[11px] text-muted-foreground block">المسدد للمكتب</span>
            <span className="text-sm sm:text-base font-bold text-emerald-700 font-mono mt-0.5 block">
              {formatCurrency(caseData.total_paid)}
            </span>
          </div>
          <div className="p-3 text-center">
            <span className="text-[11px] text-muted-foreground block">المتبقي للتحصيل</span>
            <span className="text-sm sm:text-base font-bold text-blue-700 font-mono mt-0.5 block">
              {formatCurrency(outstanding)}
            </span>
          </div>
          <div className="p-3 text-center">
            <span className="text-[11px] text-muted-foreground block">المصروفات القضائية</span>
            <span className="text-sm sm:text-base font-bold text-amber-700 font-mono mt-0.5 block">
              {formatCurrency(totalExpensesAmount)}
            </span>
          </div>
          <div className="p-3 text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-muted-foreground block">الجلسات والمواعيد</span>
            <span className="text-sm sm:text-base font-bold text-primary font-mono mt-0.5 block">
              {sessions.length} جلسة • {deadlines.length} ميعاد
            </span>
          </div>
        </div>
      </Card>

      {/* Tabs Layout */}
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="w-full sm:w-auto flex flex-wrap h-auto gap-1 bg-slate-100 p-1">
          <TabsTrigger value="sessions" className="gap-2 text-xs font-semibold py-2">
            <Gavel className="w-4 h-4 text-secondary" />
            رول الجلسات ({sessions.length})
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="gap-2 text-xs font-semibold py-2">
            <Clock className="w-4 h-4 text-secondary" />
            المواعيد القانونية ({deadlines.length})
          </TabsTrigger>
          <TabsTrigger value="contracts" className="gap-2 text-xs font-semibold py-2">
            <FileText className="w-4 h-4 text-secondary" />
            العقود والاتفاقات ({contracts.length})
          </TabsTrigger>
          <TabsTrigger value="police_reports" className="gap-2 text-xs font-semibold py-2">
            <ShieldAlert className="w-4 h-4 text-secondary" />
            محاضر الشرطة ({policeReports.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2 text-xs font-semibold py-2">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            المهام ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-2 text-xs font-semibold py-2">
            <Receipt className="w-4 h-4 text-secondary" />
            المصروفات والماليات ({expenses.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SESSIONS */}
        <TabsContent value="sessions" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-primary font-headline">
                سجل الجلسات والقرارات الصادرة في رول الدعوى
              </h3>
              <p className="text-xs text-muted-foreground">
                توثيق جلسات المرافعة، قرارات التأجيل، ومنطوق الأحكام التمهيدية.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddSessionOpen(true)}
              className="gap-1.5 text-xs font-semibold bg-primary text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة وتثبيت جلسة
            </Button>
          </div>

          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <Card key={session.id} className="p-4 sm:p-5 hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {sessions.length - index}
                        </span>
                        <span className="font-bold text-sm text-foreground">
                          جلسة يوم {formatDate(session.session_date)}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {session.outcome_type === "reserved_for_ruling"
                            ? "محجوزة للحكم"
                            : "تأجيل ومرافعة"}
                        </Badge>
                      </div>

                      {session.adjournment_reason && (
                        <p className="text-xs text-amber-900 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 mt-2">
                          <strong>القرار والمنطوق:</strong> {session.adjournment_reason}
                        </p>
                      )}

                      {session.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ملاحظات الحضور: {session.notes}
                        </p>
                      )}
                    </div>

                    {session.next_session_date && (
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-border text-xs shrink-0 text-start sm:text-end">
                        <span className="text-[10px] text-muted-foreground block">
                          تأجلت إلى جلسة:
                        </span>
                        <span className="font-bold text-primary font-mono block">
                          {formatDate(session.next_session_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border space-y-2">
              <Gavel className="w-6 h-6 text-slate-300 mx-auto" />
              <p>لا توجد جلسات مسجلة لهذه القضية حتى الآن.</p>
              <Button size="sm" variant="outline" onClick={() => setIsAddSessionOpen(true)}>
                تثبيت أول جلسة
              </Button>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: DEADLINES */}
        <TabsContent value="deadlines" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-primary font-headline">
                المواعيد القانونية ومدد الطعون المرتبطة
              </h3>
              <p className="text-xs text-muted-foreground">
                حساب مواعيد الاستئناف والنقض والمعارضة وفقاً لقانون المرافعات والإجراءات الجنائية.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddDeadlineOpen(true)}
              className="gap-1.5 text-xs font-semibold bg-secondary text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة ميعاد قانوني
            </Button>
          </div>

          {deadlines.length > 0 ? (
            <div className="space-y-3">
              {deadlines.map((dl) => {
                const daysRemaining = getDaysRemaining(dl.deadline_date);
                const urgency = getDeadlineUrgencyLabel(daysRemaining);
                return (
                  <Card key={dl.id} className="p-4 sm:p-5 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="font-bold text-sm text-foreground">
                            {dl.type}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${urgency.bg} ${urgency.color}`}
                          >
                            {urgency.label}
                          </span>
                        </div>
                        {dl.description && (
                          <p className="text-xs text-muted-foreground">{dl.description}</p>
                        )}
                      </div>

                      <div className="text-end shrink-0">
                        <span className="text-xs font-mono font-bold text-primary block">
                          {formatDate(dl.deadline_date)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">تاريخ الانتهاء</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border space-y-2">
              <Clock className="w-6 h-6 text-slate-300 mx-auto" />
              <p>لا توجد مواعيد طعن مسجلة لهذه القضية حتى الآن.</p>
              <Button size="sm" variant="outline" onClick={() => setIsAddDeadlineOpen(true)}>
                حساب وإضافة ميعاد
              </Button>
            </div>
          )}
        </TabsContent>

        {/* TAB 3: CONTRACTS & AGREEMENTS */}
        <TabsContent value="contracts" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-primary font-headline">
                العقود والاتفاقات القانونية المولدة للقضية
              </h3>
              <p className="text-xs text-muted-foreground">
                عقود أتعاب المحاماة، إقرارات الصلح والتنازل، والاتفاقات التمهيدية.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsContractModalOpen(true)}
              className="gap-1.5 text-xs font-semibold bg-secondary text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              إنشاء عقد جديد للقضية
            </Button>
          </div>

          {contracts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contracts.map((c) => (
                <Card key={c.id} className="p-4 hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        {c.status === "signed" ? "موقع وموثق" : c.status === "finalized" ? "نهائي جاهز للطباعة" : "مسودة عمل"}
                      </span>
                      <span className="text-[10px] text-tertiary font-mono">
                        {formatDate(c.created_at)}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-primary line-clamp-1">
                      {c.template_name}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      طرف العقد: {c.client_name || caseData.client_name}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                    <Link
                      to={`/firm/contracts?templateId=${c.template_id}&caseId=${caseData.id}&mode=generator`}
                      className="text-xs text-secondary font-semibold hover:underline flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      معاينة وطباعة
                    </Link>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        apiClient.deleteContract(c.id);
                        showNotification("تم حذف نسخة العقد بنجاح");
                      }}
                      className="text-slate-400 hover:text-destructive text-xs h-7 px-2"
                    >
                      حذف
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border space-y-3">
              <FileText className="w-8 h-8 text-secondary/40 mx-auto" />
              <div className="space-y-1">
                <p className="font-semibold text-primary">لم يتم توليد أي عقد لهذه القضية بعد</p>
                <p className="text-[11px] max-w-md mx-auto text-muted-foreground">
                  يمكنك توليد عقد أتعاب محاماة رسمي أو اتفاق صلح وتسوية؛ وسيقوم النظام بسحب بيانات الموكل والخصم والمحكمة والأتعاب وتعبئتها في بنود العقد فوراً.
                </p>
              </div>
              <Button size="sm" onClick={() => setIsContractModalOpen(true)} className="bg-secondary text-white">
                <Plus className="w-3.5 h-3.5 mr-1" />
                اختيار وتوليد عقد الآن
              </Button>
            </div>
          )}
        </TabsContent>

        {/* TAB 4: POLICE REPORTS */}
        <TabsContent value="police_reports" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-primary font-headline">
                محاضر الشرطة والنيابة العامة المرتبطة
              </h3>
              <p className="text-xs text-muted-foreground">
                المحاضر المحررة بأقسام الشرطة والتي تم قيدها أو استيفاؤها بالنيابة العامة.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate(`/firm/police-reports/new?caseId=${id}`)}
              className="gap-1.5 text-xs font-semibold bg-primary text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              تحرير محضر شرطة مرتبط
            </Button>
          </div>

          {policeReports.length > 0 ? (
            <div className="space-y-3">
              {policeReports.map((pr) => (
                <Card key={pr.id} className="p-4 sm:p-5 hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-primary font-mono">
                          محضر رقم {pr.report_number} لسنة {pr.report_year}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {pr.report_type === "junhah" ? "جنحة" : "إداري"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ({pr.police_station})
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-800">
                        {pr.subject}
                      </p>

                      {pr.incident_summary && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {pr.incident_summary}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-tertiary pt-1">
                        <span>النيابة: {pr.district_prosecution}</span>
                        {pr.dispatch_number && <span>رقم الصادر: {pr.dispatch_number}</span>}
                      </div>
                    </div>

                    <Link
                      to={`/firm/police-reports/${pr.id}`}
                      className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1 shrink-0 self-start"
                    >
                      <span>عرض تفاصيل المحضر</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border space-y-2">
              <ShieldAlert className="w-6 h-6 text-slate-300 mx-auto" />
              <p>لا توجد محاضر شرطة مرتبطة بهذه القضية حتى الآن.</p>
              <Button size="sm" variant="outline" onClick={() => navigate(`/firm/police-reports/new?caseId=${id}`)}>
                تحرير محضر جديد
              </Button>
            </div>
          )}
        </TabsContent>

        {/* TAB 5: TASKS */}
        <TabsContent value="tasks" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-primary font-headline">
                المهام والتحضيرات القضائية المطلوبة
              </h3>
              <p className="text-xs text-muted-foreground">
                إيداع مذكرات، استخراج شهادات، تجهيز حوافظ مستندات، ومتابعة المحضرين.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddTaskOpen(true)}
              className="gap-1.5 text-xs font-semibold bg-primary text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة مهمة جديدة
            </Button>
          </div>

          {tasks.length > 0 ? (
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <Card key={task.id} className="p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={async () => {
                          const nextStatus = task.status === "completed" ? "pending" : "completed";
                          await apiClient.updateTask(task.id, { status: nextStatus });
                          showNotification(nextStatus === "completed" ? "تم إكمال المهمة بنجاح" : "تمت إعادة المهمة كجارية");
                        }}
                        className="shrink-0"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            task.status === "completed" ? "text-emerald-600" : "text-slate-300 hover:text-slate-400"
                          }`}
                        />
                      </button>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold text-foreground truncate ${task.status === "completed" ? "line-through text-slate-400" : ""}`}>
                          {task.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          المسؤول: {task.assigned_to_name || "غير محدد"} • تاريخ الاستحقاق: {formatDate(task.due_date)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={task.status === "completed" ? "success" : "outline"} className="text-[10px]">
                      {task.status === "completed" ? "مكتملة" : "قيد التنفيذ"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border space-y-2">
              <CheckCircle2 className="w-6 h-6 text-slate-300 mx-auto" />
              <p>لا توجد مهام جارية مرتبطة بهذه القضية.</p>
              <Button size="sm" variant="outline" onClick={() => setIsAddTaskOpen(true)}>
                إسناد مهمة للفريق
              </Button>
            </div>
          )}
        </TabsContent>

        {/* TAB 6: EXPENSES & DISBURSEMENTS */}
        <TabsContent value="expenses" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-primary font-headline">
                المصروفات القضائية والنثريات المسجلة
              </h3>
              <p className="text-xs text-muted-foreground">
                رسوم قيد الدعوى، دمغات، أمانات الخبراء، وإعلانات قلم المحضرين.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddExpenseOpen(true)}
              className="gap-1.5 text-xs font-semibold bg-primary text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              تسجيل مصروف قضائي
            </Button>
          </div>

          {expenses.length > 0 ? (
            <div className="space-y-2.5">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-xl border border-border bg-white flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-amber-50 text-amber-700">
                      <Receipt className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <span className="font-bold text-foreground block">{exp.title}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        تاريخ الصرف: {formatDate(exp.date)}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-destructive text-sm">
                    {formatCurrency(exp.amount)}
                  </span>
                </div>
              ))}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold">
                <span>إجمالي المصروفات والنثريات المسددة للمحكمة:</span>
                <span className="text-destructive font-mono text-sm">{formatCurrency(totalExpensesAmount)}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border space-y-2">
              <Receipt className="w-6 h-6 text-slate-300 mx-auto" />
              <p>لم يتم تسجيل أي مصروفات قضائية لهذه القضية حتى الآن.</p>
              <Button size="sm" variant="outline" onClick={() => setIsAddExpenseOpen(true)}>
                تسجيل أول مصروف
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 1. Add Session Dialog */}
      <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تسجيل جلسة وقرار في رول الدعوى</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSession} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                تاريخ الجلسة <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                منطوق القرار أو سبب التأجيل <span className="text-destructive">*</span>
              </label>
              <Input
                value={sessionReason}
                onChange={(e) => setSessionReason(e.target.value)}
                placeholder="مثال: لضم المفردات وإيداع تقرير الخبير"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                تاريخ الجلسة القادمة (إن تقرر التأجيل)
              </label>
              <Input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddSessionOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">تثبيت الجلسة بالأجندة</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Add Deadline Dialog */}
      <Dialog open={isAddDeadlineOpen} onOpenChange={setIsAddDeadlineOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              <span>إضافة ميعاد قانوني وسقوط للطعن</span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateDeadline} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                نوع الإجراء الإجرائي (حسب القانون المصري) <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedRuleId}
                onChange={(e) => setSelectedRuleId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {EGYPTIAN_LEGAL_PROCEDURE_RULES.map((rule) => (
                  <option key={rule.id} value={rule.id}>
                    {rule.name} ({rule.days} يوماً)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  تاريخ الحكم / الإعلان
                </label>
                <Input
                  type="date"
                  value={judgmentDate}
                  onChange={(e) => setJudgmentDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  الميعاد النهائي المحسوب
                </label>
                <Input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="font-mono font-bold text-primary bg-secondary/5 border-secondary/40"
                  required
                />
              </div>
            </div>

            {holidayExtended && (
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                ⚠️ صادف نهاية الميعاد عطلة رسمية فامتد تلقائياً لأول يوم عمل (المادة 18 مرافعات).
              </p>
            )}

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                توجيهات أو ملاحظات للمحامي المسؤول
              </label>
              <Input
                value={deadlineDesc}
                onChange={(e) => setDeadlineDesc(e.target.value)}
                placeholder="توجيهات للفريق القانوني بشأن هذا الميعاد..."
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDeadlineOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" className="bg-secondary text-white">تثبيت الميعاد</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Choose Contract Type First Modal */}
      <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-headline text-primary">
              <FileText className="w-5 h-5 text-secondary" />
              <span>اختيار نوع العقد لتوليده من بيانات القضية</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">التوليد التلقائي لبيانات العقد:</p>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  سيقوم النظام تلقائياً بسحب اسم الموكل <strong>({caseData.client_name})</strong>، اسم الخصم <strong>({caseData.opponent_name})</strong>، رقم الدعوى <strong>({caseData.case_number}/{caseData.case_year})</strong>، المحكمة <strong>({caseData.court_name})</strong>، والأتعاب <strong>({formatCurrency(caseData.total_fees)})</strong>، وتعبئتها في بنود العقد المختار فوراً.
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              <label className="block text-xs font-bold text-foreground">
                اختر نموذج العقد المطلوب:
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {CASE_CONTRACT_OPTIONS.map((opt) => {
                  const isSelected = selectedContractTemplateId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedContractTemplateId(opt.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-secondary/5 border-secondary ring-1 ring-secondary shadow-xs"
                          : "bg-white border-border hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-secondary bg-secondary text-white" : "border-slate-300"
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </span>
                          <span className="font-bold text-xs text-primary">{opt.title}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground pr-6 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      <span className="text-[10px] text-tertiary shrink-0">
                        {opt.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsContractModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={handleProceedToContract}
                className="bg-secondary text-white hover:bg-secondary/90 gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>توليد وتعبئة العقد فوراً</span>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة مهمة جديدة لملف القضية</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                عنوان المهمة <span className="text-destructive">*</span>
              </label>
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="مثال: استخراج صورة رسمية من محضر التحريات"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  تاريخ التسليم
                </label>
                <Input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  درجة الأهمية
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="urgent">حرجة وعاجلة جداً</option>
                  <option value="high">أولوية عالية</option>
                  <option value="medium">متوسطة</option>
                  <option value="low">عادية</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddTaskOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">إسناد المهمة</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 5. Add Expense Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تسجيل مصروف قضائي أو نثريات</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateExpense} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                بيان المصروف <span className="text-destructive">*</span>
              </label>
              <Input
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                placeholder="مثال: رسوم قيد دعوى / أمانة خبير / مصاريف إعلان محضرين"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  المبلغ (ج.م) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  تاريخ الصرف
                </label>
                <Input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddExpenseOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">تسجيل المصروف</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseDetailPage;
