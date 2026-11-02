import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  Search,
  Filter,
  ArrowUpDown,
  Lock,
  Download,
  Calendar,
  UserCheck,
  FileText,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "../../lib/api/store";
import { CountBadge } from "../../components/common/CountBadge";
import { getAuditLogs, logAuditEvent, clearAuditLogs, AuditLogEntry } from "../../lib/api/audit";
import { useToast } from "../../components/common/Toast";

export const FirmAuditLogPage: React.FC = () => {
  const { firm, user } = useAuthStore();
  const { showToast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const loadLogs = () => {
    setLogs(getAuditLogs());
  };

  useEffect(() => {
    loadLogs();
    const handleUpdate = () => loadLogs();
    window.addEventListener("audit-log-updated", handleUpdate);
    return () => window.removeEventListener("audit-log-updated", handleUpdate);
  }, []);

  const handleExportCSV = () => {
    if (logs.length === 0) {
      showToast("لا توجد حركات تدقيق لتصديرها حالياً.", "info");
      return;
    }

    const headers = ["المعرف", "المستخدم", "الصفة", "نوع الإجراء", "التفاصيل", "عنوان IP", "التوقيت", "الحالة"];
    const rows = logs.map((l) => [
      l.id,
      `"${l.user_name.replace(/"/g, '""')}"`,
      `"${l.user_role.replace(/"/g, '""')}"`,
      `"${l.action_type.replace(/"/g, '""')}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      l.ip_address,
      `"${l.timestamp}"`,
      l.status === "success" ? "ناجح" : l.status === "warning" ? "تحذير" : "فاشل",
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `سجل_تدقيق_المكتب_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("تم تصدير سجل التدقيق بصيغة CSV بنجاح!", "success");
  };

  const handleManualAuditCheck = () => {
    logAuditEvent({
      action_type: "فحص أمني دوري",
      description: `قام ${user?.full_name || "المشرف"} بإجراء فحص أمني وتدقيق يدوي لسجلات المكتب والبيانات السحابية.`,
      status: "success",
    });
    showToast("تم توثيق فحص أمني جديد بنجاح في سجل التدقيق!", "success");
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === "all" || log.action_type === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-5 p-3 sm:p-6" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-headline text-primary text-xl sm:text-2xl font-semibold">
              سجل التدقيق والرقابة (Audit Trail)
            </h1>
            <CountBadge count={filteredLogs.length} prefix="الحركات الموثقة: " />
          </div>
          <p className="text-tertiary text-xs sm:text-sm mt-0.5">
            تتبع أمني لحظي وموثق لكافة العمليات القضائية والمستندية والإدارية بمكتب {firm?.name}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleManualAuditCheck}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-white text-primary text-xs font-medium hover:bg-neutral transition-colors shadow-2xs"
            title="توثيق إجراء فحص أمني"
          >
            <RefreshCw className="w-3.5 h-3.5 text-secondary" />
            <span>توثيق فحص أمني</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-white text-primary text-xs font-semibold hover:bg-neutral transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-tertiary" />
            <span>تصدير السجل (CSV)</span>
          </button>
        </div>
      </div>

      {/* Enterprise Audit Guarantee Card */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-l from-white via-white to-blue-500/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline text-primary text-sm font-bold">
              سجل تدقيق مشفر ومربوط بنشاطات المكتب الحقيقية
            </h3>
            <p className="text-tertiary text-xs mt-0.5 max-w-2xl leading-relaxed">
              يرصد هذا السجل تلقائياً: إنشاء وتعديل القضايا، رفع أوراق وحوافظ المستندات، تعديل أتعاب الموكلين، توثيق قرارات الجلسات، وعمليات تسجيل الدخول الحقيقية لضمان الامتثال القانوني.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>تتبع حي ومستمر</span>
        </span>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="بحث باسم المستخدم، نوع الإجراء، أو تفاصيل الحركة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 ps-9 pe-3 rounded-xl border border-border bg-white text-xs sm:text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-primary shadow-2xs"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-border bg-white text-xs sm:text-sm text-primary focus:outline-none focus:border-primary shadow-2xs"
          >
            <option value="all">كل العمليات ({logs.length})</option>
            <option value="إنشاء قضية">إنشاء قضية</option>
            <option value="تعديل قضية">تعديل قضية</option>
            <option value="حذف قضية">حذف قضية</option>
            <option value="رفع مستند">رفع مستند وأوراق</option>
            <option value="تسجيل جلسة">تسجيل جلسة</option>
            <option value="إضافة موكل">إضافة موكل</option>
            <option value="إنشاء عقد">إنشاء عقد</option>
            <option value="تسجيل دخول">تسجيل دخول</option>
            <option value="تهيئة الأمان">تهيئة الأمان</option>
            <option value="فحص أمني دوري">فحص أمني</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-neutral/60 text-tertiary text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-4 py-3 text-start">المستخدم</th>
                <th className="px-4 py-3 text-start">نوع الإجراء</th>
                <th className="px-4 py-3 text-start">تفاصيل العملية</th>
                <th className="px-4 py-3 text-start hidden sm:table-cell">عنوان IP</th>
                <th className="px-4 py-3 text-start">التوقيت</th>
                <th className="px-4 py-3 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    لا توجد حركات تدقيق تطابق معايير البحث
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {log.user_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-primary truncate leading-tight">
                            {log.user_name}
                          </p>
                          <p className="text-[10px] text-tertiary truncate">{log.user_role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-semibold text-primary text-[10px]">
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-primary max-w-xs sm:max-w-md">
                      <span className="text-xs leading-relaxed">{log.description}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-tertiary text-[11px] hidden sm:table-cell" dir="ltr">
                      {log.ip_address}
                    </td>
                    <td className="px-4 py-3 text-tertiary whitespace-nowrap text-[11px]">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === "success"
                            ? "bg-green-100 text-green-700"
                            : log.status === "warning"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {log.status === "success" ? "ناجح" : log.status === "warning" ? "تنبيه" : "مرفوض"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FirmAuditLogPage;
