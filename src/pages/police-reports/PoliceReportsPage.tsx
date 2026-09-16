import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Search,
  Plus,
  Eye,
  Building2,
  FileText,
  User,
  ArrowRight,
  X,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { PoliceReport } from "../../types";
import { CountBadge } from "../../components/common/CountBadge";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate } from "../../lib/utils";

export const PoliceReportsPage: React.FC = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState<PoliceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPoliceReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.report_number.includes(search) ||
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.police_station.toLowerCase().includes(search.toLowerCase()) ||
      (r.client_name && r.client_name.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === "all" || r.report_type === typeFilter;
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "admin":
        return "إداري";
      case "junhah":
        return "جنح";
      case "ahwal":
        return "أحوال";
      case "awared":
        return "عوارض";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "under_investigation":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-700">
            قيد التحقيق
          </span>
        );
      case "referred_to_court":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-700">
            أحيل للمحكمة
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-tertiary">
            حفظ إداري
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-tertiary">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-3 sm:space-y-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex items-baseline gap-2">
          <h1 className="truncate font-headline text-primary text-xl font-semibold sm:text-2xl">
            محاضر الشرطة
          </h1>
          <CountBadge count={filtered.length} isLoading={loading} />
        </div>

        <button
          type="button"
          onClick={() => navigate("/firm/police-reports/new")}
          className="h-9 shrink-0 flex items-center gap-1.5 bg-primary px-3.5 text-sm font-semibold text-white rounded-lg hover:bg-primary/90 transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>محضر جديد</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3">
        {/* Search Input */}
        <div className="relative col-span-2 min-w-0 sm:w-[392px] sm:shrink-0">
          <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="بحث برقم المحضر، القسم، الموكل، أو الموضوع..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 ps-9 pe-9 rounded-lg border border-border bg-white text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-tertiary hover:text-primary rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type Filter */}
        <div className="w-full sm:w-44 shrink-0">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">كل الأنواع</option>
            <option value="junhah">جنح</option>
            <option value="admin">إداري</option>
            <option value="ahwal">أحوال</option>
            <option value="awared">عوارض</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-44 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">كل الحالات</option>
            <option value="under_investigation">قيد التحقيق</option>
            <option value="referred_to_court">أحيل للمحكمة</option>
            <option value="archived">حفظ</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-xl border border-border bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-tertiary space-y-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">جارٍ تحميل دفاتر المحاضر...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <EmptyState
              icon={ShieldAlert}
              title="لم يتم العثور على محاضر"
              description="لم يتم العثور على أي محاضر شرطة مطابقة لخيارات البحث المحددة."
              actionLabel="تسجيل محضر جديد"
              onAction={() => navigate("/firm/police-reports/new")}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-neutral/60 text-tertiary text-[11px] font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-start">رقم المحضر / السنة</th>
                  <th className="px-4 py-3 text-start">قسم الشرطة</th>
                  <th className="px-4 py-3 text-start">موضوع البلاغ</th>
                  <th className="px-4 py-3 text-start hidden sm:table-cell">الموكل / الشاكي</th>
                  <th className="px-4 py-3 text-start hidden md:table-cell">النوع</th>
                  <th className="px-4 py-3 text-start">الحالة</th>
                  <th className="px-4 py-3 text-end w-20">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/firm/police-reports/${r.id}`)}
                    className="hover:bg-neutral/60 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-primary whitespace-nowrap">
                      {r.report_number} / {r.report_year}
                    </td>

                    <td className="px-4 py-3 font-medium text-primary">
                      {r.police_station}
                    </td>

                    <td className="px-4 py-3 text-primary max-w-xs truncate">
                      {r.subject}
                    </td>

                    <td className="px-4 py-3 text-tertiary hidden sm:table-cell">
                      {r.client_name || "—"}
                    </td>

                    <td className="px-4 py-3 text-tertiary hidden md:table-cell">
                      <span className="inline-block px-2 py-0.5 rounded bg-neutral border border-border text-[11px]">
                        {getReportTypeLabel(r.report_type)}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(r.status)}
                    </td>

                    <td className="px-4 py-3 text-end whitespace-nowrap">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          to={`/firm/police-reports/${r.id}`}
                          title="عرض التفاصيل"
                          className="p-1 rounded-md text-tertiary hover:text-primary hover:bg-neutral transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default PoliceReportsPage;
