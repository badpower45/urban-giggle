import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CircleDollarSign,
  Download,
  Calendar,
  Briefcase,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { BillingReport } from "../../types";
import { CountBadge } from "../../components/common/CountBadge";
import { formatCurrency } from "../../lib/utils";

export const BillingReportPage: React.FC = () => {
  const [report, setReport] = useState<BillingReport | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getBillingReport(
        dateFrom || undefined,
        dateTo || undefined
      );
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [dateFrom, dateTo]);

  const handleExportCSV = () => {
    if (!report || report.cases.length === 0) return;

    const headers = [
      "معرف الدعوى",
      "عنوان الدعوى",
      "اسم الموكل",
      "إجمالي الأتعاب",
      "المسدد",
      "المتبقي",
      "المصروفات المقيدة",
      "صافي الإيراد",
    ];

    const rows = report.cases.map((c) => [
      c.case_id,
      `"${c.case_title.replace(/"/g, '""')}"`,
      `"${c.client_name.replace(/"/g, '""')}"`,
      c.total_fees,
      c.total_paid,
      c.outstanding_balance,
      c.total_expenses_firm,
      c.net_revenue,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `billing_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="font-headline text-primary text-xl sm:text-2xl font-semibold">
            التقرير المالي وكشوف الأتعاب
          </h1>
          {report && <CountBadge count={report.cases.length} prefix="القضايا: " />}
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={!report || report.cases.length === 0}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-border bg-white text-xs font-semibold text-primary hover:bg-neutral transition-colors shadow-2xs disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-tertiary" />
          <span>تصدير إلى CSV</span>
        </button>
      </div>

      {/* Date Range Filters */}
      <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-semibold text-primary whitespace-nowrap">
            الفترة المحاسبية:
          </span>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
            />
            <span className="text-xs text-tertiary">إلى</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
            />
            {(dateFrom || dateTo) && (
              <button
                type="button"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
                className="text-xs text-tertiary hover:text-primary flex items-center gap-1 ms-2"
              >
                <X className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5 Metric Financial Cards */}
      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Total Fees */}
          <div className="rounded-xl border border-border bg-white p-3.5 sm:p-4 shadow-xs">
            <span className="text-[11px] font-medium text-tertiary block mb-1">إجمالي الأتعاب</span>
            <span className="text-lg sm:text-xl font-bold font-headline text-finance-fees block">
              {formatCurrency(report.total_fees)}
            </span>
          </div>

          {/* Paid */}
          <div className="rounded-xl border border-border bg-white p-3.5 sm:p-4 shadow-xs">
            <span className="text-[11px] font-medium text-tertiary block mb-1">المحصل الفعلي</span>
            <span className="text-lg sm:text-xl font-bold font-headline text-finance-paid block">
              {formatCurrency(report.total_paid)}
            </span>
          </div>

          {/* Outstanding */}
          <div className="rounded-xl border border-border bg-white p-3.5 sm:p-4 shadow-xs">
            <span className="text-[11px] font-medium text-tertiary block mb-1">المتبقي للتحصيل</span>
            <span className="text-lg sm:text-xl font-bold font-headline text-finance-outstanding block">
              {formatCurrency(report.outstanding_balance)}
            </span>
          </div>

          {/* Expenses */}
          <div className="rounded-xl border border-border bg-white p-3.5 sm:p-4 shadow-xs">
            <span className="text-[11px] font-medium text-tertiary block mb-1">مصروفات المكتب</span>
            <span className="text-lg sm:text-xl font-bold font-headline text-finance-expenses block">
              {formatCurrency(report.total_expenses_firm)}
            </span>
          </div>

          {/* Net Revenue */}
          <div className="col-span-2 lg:col-span-1 rounded-xl border border-border bg-white p-3.5 sm:p-4 shadow-xs">
            <span className="text-[11px] font-medium text-tertiary block mb-1">صافي الإيراد</span>
            <span className="text-lg sm:text-xl font-bold font-headline text-finance-net block">
              {formatCurrency(report.net_revenue)}
            </span>
          </div>
        </div>
      )}

      {/* Financial Table */}
      <div className="rounded-xl border border-border bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-tertiary space-y-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">جارٍ إعداد كشوف الحسابات...</p>
          </div>
        ) : !report || report.cases.length === 0 ? (
          <div className="py-12 px-4 text-center text-tertiary text-xs">
            لا توجد حسابات مسجلة خلال الفترة المحددة
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-neutral/60 text-tertiary text-[11px] font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-start">القضية</th>
                  <th className="px-4 py-3 text-start">الموكل</th>
                  <th className="px-4 py-3 text-end">إجمالي الأتعاب</th>
                  <th className="px-4 py-3 text-end">المسدد</th>
                  <th className="px-4 py-3 text-end">المتبقي</th>
                  <th className="px-4 py-3 text-end hidden sm:table-cell">المصروفات</th>
                  <th className="px-4 py-3 text-end">صافي الإيراد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.cases.map((c) => (
                  <tr key={c.case_id} className="hover:bg-neutral/60 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        to={`/firm/cases/${c.case_id}`}
                        className="font-medium text-primary hover:text-secondary hover:underline truncate block max-w-xs"
                      >
                        {c.case_title}
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-primary truncate max-w-xs">
                      {c.client_name}
                    </td>

                    <td className="px-4 py-3 text-end font-mono font-medium text-finance-fees">
                      {formatCurrency(c.total_fees)}
                    </td>

                    <td className="px-4 py-3 text-end font-mono font-bold text-finance-paid">
                      {formatCurrency(c.total_paid)}
                    </td>

                    <td className="px-4 py-3 text-end font-mono font-medium text-finance-outstanding">
                      {formatCurrency(c.outstanding_balance)}
                    </td>

                    <td className="px-4 py-3 text-end font-mono text-finance-expenses hidden sm:table-cell">
                      {formatCurrency(c.total_expenses_firm)}
                    </td>

                    <td className="px-4 py-3 text-end font-mono font-bold text-finance-net">
                      {formatCurrency(c.net_revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-border bg-neutral/80 font-bold text-xs">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-primary">
                    الإجمالي العام
                  </td>
                  <td className="px-4 py-3 text-end font-mono text-finance-fees">
                    {formatCurrency(report.total_fees)}
                  </td>
                  <td className="px-4 py-3 text-end font-mono text-finance-paid">
                    {formatCurrency(report.total_paid)}
                  </td>
                  <td className="px-4 py-3 text-end font-mono text-finance-outstanding">
                    {formatCurrency(report.outstanding_balance)}
                  </td>
                  <td className="px-4 py-3 text-end font-mono text-finance-expenses hidden sm:table-cell">
                    {formatCurrency(report.total_expenses_firm)}
                  </td>
                  <td className="px-4 py-3 text-end font-mono text-finance-net">
                    {formatCurrency(report.net_revenue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default BillingReportPage;
