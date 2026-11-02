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
  Plus,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Building,
  ShieldAlert,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { Case, CourtSession, LegalDeadline, Task } from "../../types";
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

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [sessions, setSessions] = useState<CourtSession[]>([]);
  const [deadlines, setDeadlines] = useState<LegalDeadline[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Dialogs
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionReason, setSessionReason] = useState("");
  const [nextDate, setNextDate] = useState("");

  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const [deadlineType, setDeadlineType] = useState("استئناف (15 يوم)");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineDesc, setDeadlineDesc] = useState("");

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
    } catch (err) {
      console.error(err);
      navigate("/firm/cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

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
        adjournment_reason: sessionReason || "جلسة مرافعة وسماع أقوال",
        next_session_date: nextDate || null,
        outcome_type: "adjourned",
      });
      setIsAddSessionOpen(false);
      setSessionDate("");
      setSessionReason("");
      setNextDate("");
      await loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !deadlineDate) return;
    try {
      await apiClient.createDeadline({
        case_id: id,
        case_title: caseData?.title,
        type: deadlineType,
        deadline_date: deadlineDate,
        urgency: "high",
        description: deadlineDesc,
        is_confirmed: true,
      });
      setIsAddDeadlineOpen(false);
      setDeadlineDate("");
      setDeadlineDesc("");
      await loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground">
        جارٍ تحميل ملف القضية...
      </div>
    );
  }

  const outstanding = Math.max(0, caseData.total_fees - caseData.total_paid);

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-3 sm:space-y-5 sm:p-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
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
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/firm/cases/${id}/edit`)}
            className="gap-1.5 text-xs bg-white"
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
                ) : (
                  <Badge variant="outline">{caseData.status}</Badge>
                )}
                <span className="text-xs text-muted-foreground font-mono">
                  تاريخ القيد: {formatDate(caseData.filing_date)}
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
                <span className="text-[10px] text-muted-foreground block font-bold">الموكل ({caseData.client_role === 'plaintiff' ? 'المدعي' : 'المدعى عليه'})</span>
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
                  <span className="text-[10px] text-muted-foreground block truncate">محامي: {caseData.opponent_lawyer}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Mini Financial Summary Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-x-reverse divide-border bg-slate-50/50">
          <div className="p-3 sm:p-4 text-center">
            <span className="text-[11px] text-muted-foreground block">إجمالي الأتعاب التعاقدية</span>
            <span className="text-sm sm:text-base font-bold text-foreground font-mono mt-0.5 block">
              {formatCurrency(caseData.total_fees)}
            </span>
          </div>
          <div className="p-3 sm:p-4 text-center">
            <span className="text-[11px] text-muted-foreground block">المسدد للمكتب</span>
            <span className="text-sm sm:text-base font-bold text-emerald-700 font-mono mt-0.5 block">
              {formatCurrency(caseData.total_paid)}
            </span>
          </div>
          <div className="p-3 sm:p-4 text-center">
            <span className="text-[11px] text-muted-foreground block">المتبقي للتحصيل</span>
            <span className="text-sm sm:text-base font-bold text-blue-700 font-mono mt-0.5 block">
              {formatCurrency(outstanding)}
            </span>
          </div>
          <div className="p-3 sm:p-4 text-center">
            <span className="text-[11px] text-muted-foreground block">الجلسات المجدولة</span>
            <span className="text-sm sm:text-base font-bold text-primary font-mono mt-0.5 block">
              {sessions.length} جلسة
            </span>
          </div>
        </div>
      </Card>

      {/* Tabs Layout */}
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="sessions" className="gap-2 text-xs font-semibold">
            <Gavel className="w-4 h-4" />
            رول الجلسات ({sessions.length})
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="gap-2 text-xs font-semibold">
            <Clock className="w-4 h-4" />
            المواعيد القانونية ({deadlines.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            المهام ({tasks.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SESSIONS TIMELINE */}
        <TabsContent value="sessions" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-primary font-headline">
              سجل الجلسات والقرارات الصادرة
            </h3>
            <Button
              size="sm"
              onClick={() => setIsAddSessionOpen(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة وتثبيت جلسة
            </Button>
          </div>

          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <Card key={session.id} className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
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
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border">
              لا توجد جلسات مسجلة لهذه القضية حتى الآن.
            </div>
          )}
        </TabsContent>

        {/* TAB 2: DEADLINES */}
        <TabsContent value="deadlines" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-primary font-headline">
              المواعيد والمدد القانونية للطعن
            </h3>
            <Button
              size="sm"
              onClick={() => setIsAddDeadlineOpen(true)}
              className="gap-1.5 text-xs font-semibold"
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
                  <Card key={dl.id} className="p-4 sm:p-5">
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
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border">
              لا توجد مواعيد طعن مسجلة لهذه القضية.
            </div>
          )}
        </TabsContent>

        {/* TAB 3: TASKS */}
        <TabsContent value="tasks" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-primary font-headline">
              المهام والتحضيرات المطلوبة للقضية
            </h3>
            <Button
              size="sm"
              onClick={() => navigate(`/firm/tasks`)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة مهمة جديدة
            </Button>
          </div>

          {tasks.length > 0 ? (
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          task.status === "completed" ? "text-emerald-600" : "text-slate-300"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{task.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          المسؤول: {task.assigned_to_name || "غير محدد"} • تاريخ التسليم: {formatDate(task.due_date)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={task.status === "completed" ? "success" : "outline"} className="text-[10px]">
                      {task.status === "completed" ? "مكتملة" : "جارية"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border">
              لا توجد مهام جارية مرتبطة بهذه القضية.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Session Dialog */}
      <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
        <DialogContent>
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
              <Button type="submit">تثبيت الجلسة</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Deadline Dialog */}
      <Dialog open={isAddDeadlineOpen} onOpenChange={setIsAddDeadlineOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة ميعاد قانوني وسقوط للطعن</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateDeadline} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                نوع الميعاد القانوني
              </label>
              <select
                value={deadlineType}
                onChange={(e) => setDeadlineType(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="استئناف (15 يوم)">استئناف (15 يوم من تاريخ الحكم)</option>
                <option value="طعن بالنقض (60 يوم)">طعن بالنقض (60 يوم)</option>
                <option value="تقديم مذكرة دفاع">تقديم مذكرة دفاع</option>
                <option value="معارضة في حكم غيابي">معارضة في حكم غيابي</option>
                <option value="تظلم من قرار حفظ">تظلم من قرار حفظ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                تاريخ انتهاء الميعاد <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                تفاصيل وتوجيهات
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
              <Button type="submit">حفظ الميعاد</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
