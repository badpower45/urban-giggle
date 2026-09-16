import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Briefcase,
  X,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { Task, TaskStatus, TaskPriority, Case, FirmMember } from "../../types";
import { CountBadge } from "../../components/common/CountBadge";
import { ViewToggle } from "../../components/common/ViewToggle";
import { EmptyState } from "../../components/common/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { formatDate } from "../../lib/utils";

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [members, setMembers] = useState<FirmMember[]>([]);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");

  // Add Task Dialog
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const t = await apiClient.getTasks();
      setTasks(t);
      const c = await apiClient.getCases();
      setCases(c);
      const m = await apiClient.getFirmMembers();
      setMembers(m);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    setSubmitting(true);
    const matchedCase = cases.find((c) => c.id === selectedCaseId);
    const matchedMember = members.find((m) => m.user_id === assignedTo);

    try {
      await apiClient.createTask({
        title: title.trim(),
        case_id: selectedCaseId || null,
        case_title: matchedCase?.title || null,
        assigned_to: assignedTo || null,
        assigned_to_name: matchedMember?.full_name || "غير محدد",
        priority,
        status: "pending",
        due_date: dueDate,
        description: description.trim() || null,
      });

      setIsAddOpen(false);
      setTitle("");
      setSelectedCaseId("");
      setAssignedTo("");
      setDueDate("");
      setDescription("");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await apiClient.updateTask(taskId, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssigned = assignedFilter === "all" || task.assigned_to === assignedFilter;
    return matchesStatus && matchesPriority && matchesAssigned;
  });

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case "urgent":
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">طارئة</span>;
      case "high":
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">عالية</span>;
      case "medium":
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">متوسطة</span>;
      case "low":
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-tertiary">منخفضة</span>;
      default:
        return null;
    }
  };

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: "pending", title: "قيد الانتظار", color: "bg-slate-100 text-slate-800" },
    { id: "in_progress", title: "جارٍ التنفيذ", color: "bg-blue-100 text-blue-800" },
    { id: "completed", title: "مكتملة", color: "bg-green-100 text-green-800" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-3 sm:space-y-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex items-baseline gap-2">
          <h1 className="truncate font-headline text-primary text-xl font-semibold sm:text-2xl">
            إدارة المهام والتكليفات
          </h1>
          <CountBadge count={filteredTasks.length} isLoading={loading} />
        </div>

        <div className="flex items-center gap-2">
          <ViewToggle<"kanban" | "table">
            viewMode={viewMode}
            onChange={setViewMode}
            firstMode="kanban"
            secondMode="table"
            firstTitle="لوحة كانبان"
            secondTitle="جدول"
          />
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="h-9 shrink-0 flex items-center gap-1.5 bg-primary px-3.5 text-sm font-semibold text-white rounded-lg hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>مهمة جديدة</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3">
        <div className="w-full sm:w-44 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">كل الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="in_progress">جارٍ التنفيذ</option>
            <option value="completed">مكتملة</option>
          </select>
        </div>

        <div className="w-full sm:w-44 shrink-0">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">كل الأولويات</option>
            <option value="urgent">طارئة جداً</option>
            <option value="high">عالية</option>
            <option value="medium">متوسطة</option>
            <option value="low">منخفضة</option>
          </select>
        </div>

        <div className="col-span-2 sm:col-span-1 w-full sm:w-48 shrink-0">
          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">كل أعضاء الفريق</option>
            {members.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content: Kanban or Table */}
      {loading ? (
        <div className="p-8 text-center text-tertiary space-y-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">جارٍ جلب المهام...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-xl border border-border bg-white py-12 px-4 text-center shadow-xs">
          <EmptyState
            icon={CheckSquare}
            title="لا توجد مهام مطابقة"
            description="جميع المهام والتكليفات منجزة أو لا توجد نتائج مطابقة لخيارات الفلترة."
            actionLabel="تكليف بمهمة جديدة"
            onAction={() => setIsAddOpen(true)}
          />
        </div>
      ) : viewMode === "kanban" ? (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="rounded-xl border border-border bg-neutral/50 p-3 space-y-3 min-h-[400px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border/80">
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-xs text-primary">
                      {col.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-border text-tertiary">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-lg border border-border bg-white p-3 shadow-2xs hover:border-slate-300 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs text-primary leading-snug">
                          {task.title}
                        </span>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {task.case_title && (
                        <p className="text-[10px] text-tertiary truncate">
                          القضية: {task.case_title}
                        </p>
                      )}

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-tertiary">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" />
                          {formatDate(task.due_date)}
                        </span>
                        <span className="truncate">{task.assigned_to_name || "غير محدد"}</span>
                      </div>

                      {/* Quick Status Mover */}
                      <div className="pt-1.5 flex items-center justify-end gap-1">
                        {col.id !== "pending" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(task.id, "pending")}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-border bg-neutral text-tertiary hover:text-primary"
                          >
                            للانتظار
                          </button>
                        )}
                        {col.id !== "in_progress" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(task.id, "in_progress")}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-700"
                          >
                            للتنفيذ
                          </button>
                        )}
                        {col.id !== "completed" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(task.id, "completed")}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-green-200 bg-green-50 text-green-700"
                          >
                            إكمال ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-border bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-neutral/60 text-tertiary text-[11px] font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-start">المهمة</th>
                  <th className="px-4 py-3 text-start hidden sm:table-cell">القضية المرتبطة</th>
                  <th className="px-4 py-3 text-start">المكلف بها</th>
                  <th className="px-4 py-3 text-start">الأولوية</th>
                  <th className="px-4 py-3 text-start">تاريخ الاستحقاق</th>
                  <th className="px-4 py-3 text-start">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary">{t.title}</td>
                    <td className="px-4 py-3 text-tertiary hidden sm:table-cell">{t.case_title || "—"}</td>
                    <td className="px-4 py-3 text-primary">{t.assigned_to_name || "غير محدد"}</td>
                    <td className="px-4 py-3">{getPriorityBadge(t.priority)}</td>
                    <td className="px-4 py-3 font-mono text-tertiary">{formatDate(t.due_date)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value as TaskStatus)}
                        className="h-7 px-2 rounded border border-border text-[11px] bg-white text-primary"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="in_progress">جارٍ التنفيذ</option>
                        <option value="completed">مكتملة</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="font-headline text-lg font-bold text-primary">
              تكليف بمهمة قانونية جديدة
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateTask} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">
                عنوان المهمة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: استخراج شهادة سلبية، تحضير مستندات..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  القضية المرتبطة
                </label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                >
                  <option value="">بدون قضية محددة</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  المكلف بالمهمة
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                >
                  <option value="">اختر عضو الفريق...</option>
                  {members.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  درجة الأولوية
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                >
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                  <option value="urgent">طارئة جداً</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  تاريخ الإنجاز المطلوب <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">تفاصيل وملاحظات المهمة</label>
              <textarea
                rows={2}
                placeholder="تعليمات التنفيذ، الجهة المقصودة..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                {submitting ? "جارٍ الحفظ..." : "حفظ التكليف"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default TasksPage;
