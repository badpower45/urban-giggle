import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Briefcase,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Gavel,
  CheckCircle,
  Clock,
  MoreVertical,
  X,
  Sparkles,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { appStore } from "../../lib/api/store";
import { Case, CaseStatus } from "../../types";
import { CountBadge } from "../../components/common/CountBadge";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate } from "../../lib/utils";

export const CasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [courtFilter, setCourtFilter] = useState(searchParams.get("court") || "all");

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getCases({
        search: search.trim() || undefined,
        status: statusFilter,
        court: courtFilter,
      });
      setCases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
    const unsubscribe = appStore.subscribe(() => {
      loadCases();
    });
    return () => unsubscribe();
  }, [statusFilter, courtFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCases();
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف القضية: "${title}"؟`)) {
      await apiClient.deleteCase(id);
      await loadCases();
    }
  };

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-700">
            متداولة
          </span>
        );
      case "reserved_for_ruling":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-700">
            محجوزة للحكم
          </span>
        );
      case "on_hold":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800">
            معلقة
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-tertiary">
            مغلقة
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-tertiary">
            مؤرشفة
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
      {/* Header: Title + CountBadge + Action Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex items-baseline gap-2">
          <h1 className="truncate font-headline text-primary text-xl font-semibold sm:text-2xl">
            القضايا
          </h1>
          <CountBadge count={cases.length} isLoading={loading} />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/firm/scanner")}
            className="h-9 shrink-0 flex items-center gap-1.5 border border-primary/25 bg-primary/5 px-3 text-sm font-semibold text-primary rounded-lg hover:bg-primary/10 transition-colors shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>المسح الذكي</span>
            <span className="text-[10px] bg-primary text-white font-bold px-1.5 py-0.5 rounded-full">
              Beta
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/firm/cases/new")}
            className="h-9 shrink-0 flex items-center gap-1.5 bg-primary px-3.5 text-sm font-semibold text-white rounded-lg hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>قضية جديدة</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3">
        {/* Search Input (392px on sm) */}
        <div className="relative col-span-2 min-w-0 sm:w-[392px] sm:shrink-0">
          <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث برقم القضية، العنوان، الموكل، أو الخصم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 ps-9 pe-9 rounded-lg border border-border bg-white text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                loadCases();
              }}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-tertiary hover:text-primary rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-44 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">كل الحالات</option>
            <option value="active">متداولة (نشطة)</option>
            <option value="reserved_for_ruling">محجوزة للحكم</option>
            <option value="on_hold">معلقة</option>
            <option value="closed">مفصولة ومغلقة</option>
          </select>
        </div>

        {/* Court Filter */}
        <div className="w-full sm:w-48 shrink-0">
          <select
            value={courtFilter}
            onChange={(e) => setCourtFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">كل المحاكم</option>
            <option value="محكمة شمال القاهرة الابتدائية">شمال القاهرة الابتدائية</option>
            <option value="محكمة جنوب القاهرة الابتدائية">جنوب القاهرة الابتدائية</option>
            <option value="محكمة الأسرة بمدينة نصر">الأسرة بمدينة نصر</option>
            <option value="المحكمة الاقتصادية">المحكمة الاقتصادية</option>
            <option value="مجلس الدولة">مجلس الدولة</option>
          </select>
        </div>
      </form>

      {/* Cases Table */}
      <div className="rounded-xl border border-border bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-tertiary space-y-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">جارٍ تحميل القضايا...</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <EmptyState
              icon={Briefcase}
              title="لم يتم العثور على قضايا"
              description="لم يتم العثور على أي نتائج تطابق معايير البحث والفلترة المحددة."
              actionLabel="إضافة قضية جديدة"
              onAction={() => navigate("/firm/cases/new")}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-neutral/60 text-tertiary text-[11px] font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-start">رقم الدعوى</th>
                  <th className="px-4 py-3 text-start">موضوع القضية</th>
                  <th className="px-4 py-3 text-start hidden md:table-cell">المحكمة والدائرة</th>
                  <th className="px-4 py-3 text-start hidden sm:table-cell">الموكل</th>
                  <th className="px-4 py-3 text-start">الحالة</th>
                  <th className="px-4 py-3 text-start hidden lg:table-cell">الجلسة القادمة</th>
                  <th className="px-4 py-3 text-end w-24">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/firm/cases/${c.id}`)}
                    className="hover:bg-neutral/60 cursor-pointer transition-colors"
                  >
                    {/* Case Number & Year */}
                    <td className="px-4 py-3 font-mono font-bold text-primary whitespace-nowrap">
                      {c.case_number} / {c.case_year}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-primary truncate max-w-xs sm:max-w-sm">
                        {c.title}
                      </p>
                      <p className="text-[10px] text-tertiary truncate">نوع الدعوى: {c.case_type_name}</p>
                    </td>

                    {/* Court & Circuit */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-primary truncate">{c.court_name}</p>
                      {c.circuit && <p className="text-[10px] text-tertiary truncate">{c.circuit}</p>}
                    </td>

                    {/* Client */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="font-medium text-primary truncate">{c.client_name}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(c.status)}
                    </td>

                    {/* Next Session */}
                    <td className="px-4 py-3 font-mono text-tertiary hidden lg:table-cell whitespace-nowrap">
                      {c.next_session_date ? formatDate(c.next_session_date) : "—"}
                    </td>

                    {/* Action buttons */}
                    <td className="px-4 py-3 text-end whitespace-nowrap">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          to={`/firm/cases/${c.id}`}
                          title="عرض التفاصيل"
                          className="p-1 rounded-md text-tertiary hover:text-primary hover:bg-neutral transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/firm/cases/${c.id}/edit`}
                          title="تعديل"
                          className="p-1 rounded-md text-tertiary hover:text-primary hover:bg-neutral transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.title)}
                          title="حذف"
                          className="p-1 rounded-md text-tertiary hover:text-destructive hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
export default CasesPage;
