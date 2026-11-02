import React, { useState } from "react";
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
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../../lib/api/store";
import { CountBadge } from "../../components/common/CountBadge";

interface AuditLogEntry {
  id: string;
  user_name: string;
  user_role: string;
  action_type: string;
  description: string;
  ip_address: string;
  timestamp: string;
  status: "success" | "warning" | "failed";
}

export const FirmAuditLogPage: React.FC = () => {
  const { firm } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const mockLogs: AuditLogEntry[] = [
    {
      id: "log-1",
      user_name: "المستشار أحمد رفعت",
      user_role: "مالك المكتب",
      action_type: "تسجيل دخول",
      description: "تسجيل دخول ناجح للمنصة من متصفح موثق",
      ip_address: "197.34.120.45",
      timestamp: "منذ 15 دقيقة",
      status: "success",
    },
    {
      id: "log-2",
      user_name: "خالد السعيد",
      user_role: "محامي مساعد",
      action_type: "إنشاء قضية",
      description: "إضافة قضية جديدة: دعوى تعويض عمالي (رقم 1842/2026)",
      ip_address: "197.34.120.48",
      timestamp: "منذ ساعتين",
      status: "success",
    },
    {
      id: "log-3",
      user_name: "خالد السعيد",
      user_role: "محامي مساعد",
      action_type: "تعديل أتعاب",
      description: "تحديث قيمة الدفعة المسددة للقضية رقم 912/2026 بمبلغ 5,000 ج.م.",
      ip_address: "197.34.120.48",
      timestamp: "منذ 4 ساعات",
      status: "warning",
    },
    {
      id: "log-4",
      user_name: "منى إبراهيم",
      user_role: "سكرتيرة قانونية",
      action_type: "رفع مستند",
      description: "رفع مذكرة دفاع وصورة توكيل في القضية 331/2026",
      ip_address: "197.34.120.50",
      timestamp: "أمس الساعة 03:15 م",
      status: "success",
    },
    {
      id: "log-5",
      user_name: "مستخدم غير معروف",
      user_role: "مجهول",
      action_type: "محاولة دخول",
      description: "محاولة تسجيل دخول فاشلة بكلمة مرور خاطئة",
      ip_address: "41.233.10.82",
      timestamp: "أمس الساعة 11:20 ص",
      status: "failed",
    },
  ];

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === "all" || log.action_type === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-5 p-3 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-headline text-primary text-xl sm:text-2xl font-semibold">
              سجل التدقيق والرقابة
            </h1>
            <CountBadge count={filteredLogs.length} prefix="الحركات: " />
          </div>
          <p className="text-tertiary text-xs sm:text-sm mt-0.5">
            تتبع أمني شامل لجميع عمليات التعديل والدخول والإجراءات المالية في المكتب
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-white text-primary text-xs font-medium hover:bg-neutral transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-tertiary" />
            <span>تصدير السجل</span>
          </button>
          <Link
            to="/firm/settings/subscription"
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>باقة الشركات المتقدمة</span>
          </Link>
        </div>
      </div>

      {/* Enterprise Audit Guarantee Card */}
      <div className="rounded-xl border border-blue-500/30 bg-gradient-to-l from-white via-white to-blue-500/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline text-primary text-sm font-bold">
              سجل تدقيق مشفر غير قابل للتعديل (Immutable Audit Trail)
            </h3>
            <p className="text-tertiary text-xs mt-0.5 max-w-2xl leading-relaxed">
              يتم تسجيل جميع الأنشطة الحساسة كحذف القضايا، تعديل أتعاب الموكلين، وتغيير الصلاحيات مع تسجيل عنوان IP والوقت بالتفصيل لضمان الامتثال القانوني وحماية المكتب.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md shrink-0 self-start sm:self-auto">
          مفعل ومراقب
        </span>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="بحث بالاسم، الإجراء، أو التفاصيل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 ps-9 pe-3 rounded-lg border border-border bg-white text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-primary"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">كل العمليات</option>
            <option value="تسجيل دخول">تسجيل دخول</option>
            <option value="إنشاء قضية">إنشاء قضية</option>
            <option value="تعديل أتعاب">تعديل أتعاب</option>
            <option value="رفع مستند">رفع مستند</option>
            <option value="محاولة دخول">محاولات غير ناجحة</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-xl border border-border bg-white overflow-hidden shadow-xs">
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
              {filteredLogs.map((log) => (
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
                    <span className="inline-block px-2 py-0.5 rounded bg-neutral border border-border font-medium text-primary text-[11px]">
                      {log.action_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-primary max-w-xs sm:max-w-sm truncate">
                    {log.description}
                  </td>
                  <td className="px-4 py-3 font-mono text-tertiary text-[11px] hidden sm:table-cell" dir="ltr">
                    {log.ip_address}
                  </td>
                  <td className="px-4 py-3 text-tertiary whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default FirmAuditLogPage;
