import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ShieldAlert,
  ArrowRight,
  Building2,
  User,
  Calendar,
  DollarSign,
  Link2,
  FileCheck,
  AlertTriangle,
  Edit,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { PoliceReport, Case } from "../../types";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { formatDate, formatCurrency } from "../../lib/utils";

export const PoliceReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<PoliceReport | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  // Link to case dialog
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState("");

  const loadData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const r = await apiClient.getPoliceReportById(id);
      setReport(r);
      const allCases = await apiClient.getCases();
      setCases(allCases);
      if (allCases.length > 0) {
        const defaultChoice = allCases.find((c) => c.client_id === r.client_id) || allCases[0];
        setSelectedCaseId(defaultChoice.id);
      }
    } catch (err) {
      console.error(err);
      navigate("/firm/police-reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleLinkCase = async () => {
    if (!id || !selectedCaseId) return;
    try {
      await apiClient.updatePoliceReport(id, { linked_case_id: selectedCaseId });
      setIsLinkOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !report) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground">
        جارٍ تحميل تفاصيل المحضر...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-3 sm:space-y-5 sm:p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/firm/police-reports")}
            className="text-slate-600 gap-1"
          >
            <ArrowRight className="w-4 h-4" />
            سجل المحاضر
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-primary font-bold">
            محضر رقم {report.report_number} لسنة {report.report_year}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/firm/police-reports/${id}/edit`)}
            className="gap-1.5 text-xs bg-white"
          >
            <Edit className="w-3.5 h-3.5" />
            تعديل المحضر
          </Button>

          {report.linked_case_id ? (
            <Link
              to={`/firm/cases/${report.linked_case_id}`}
              className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1 bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20"
            >
              <Link2 className="w-3.5 h-3.5" />
              مرتبط بالقضية
            </Link>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsLinkOpen(true)}
              className="gap-1.5 text-xs bg-white"
            >
              <Link2 className="w-3.5 h-3.5" />
              ربط بقضية موجودة للموكل
            </Button>
          )}
        </div>
      </div>

      {/* Main Details Card */}
      <Card>
        <CardHeader className="pb-3 border-b border-border bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono">
                {report.security_directorate}
              </Badge>
              <Badge variant="secondary">
                {report.police_station}
              </Badge>
              <Badge variant="info">
                {report.status === "under_investigation" ? "قيد التحقيق" : "مؤرشف"}
              </Badge>
            </div>
          </div>
          <h2 className="text-xl font-bold text-primary font-headline mt-2">
            {report.subject}
          </h2>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Parties Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-border space-y-1">
              <span className="text-xs text-muted-foreground font-bold block">الموكل الشاكي</span>
              <p className="text-sm font-bold text-foreground">{report.client_name}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-border space-y-1">
              <span className="text-xs text-muted-foreground font-bold block">النيابة المختصة</span>
              <p className="text-sm font-bold text-foreground">{report.district_prosecution}</p>
              <p className="text-xs text-muted-foreground">{report.general_prosecution}</p>
            </div>
          </div>

          {/* Workflow details */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-primary font-headline">
              المسار الإداري وحركة المحضر
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white border border-border rounded-xl">
                <span className="text-muted-foreground block text-[11px]">رقم صادر القسم</span>
                <span className="font-mono font-bold text-primary block mt-0.5">{report.dispatch_number || "لم يقيد"}</span>
              </div>
              <div className="p-3 bg-white border border-border rounded-xl">
                <span className="text-muted-foreground block text-[11px]">رقم وارد النيابة</span>
                <span className="font-mono font-bold text-primary block mt-0.5">{report.intake_number || "لم يقيد"}</span>
              </div>
              <div className="p-3 bg-white border border-border rounded-xl">
                <span className="text-muted-foreground block text-[11px]">وكيل النيابة المحقق</span>
                <span className="font-bold text-foreground block mt-0.5">{report.investigating_prosecutor || "غير محدد"}</span>
              </div>
              <div className="p-3 bg-white border border-border rounded-xl">
                <span className="text-muted-foreground block text-[11px]">تاريخ التسجيل</span>
                <span className="font-mono text-foreground block mt-0.5">{formatDate(report.created_at)}</span>
              </div>
            </div>
          </div>

          {report.incident_summary && (
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-primary font-headline">ملخص الواقعة والأقوال</h3>
              <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-border leading-relaxed">
                {report.incident_summary}
              </p>
            </div>
          )}

          {/* Appeal / Archive Section if any */}
          {report.appeal_number && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <h4 className="font-bold text-xs text-amber-900">
                  تظلم من قرار الحفظ: {report.appeal_number}
                </h4>
              </div>
              <p className="text-xs text-amber-800">
                الجهة المعروض أمامها: {report.appeal_authority} • القرار: {report.appeal_decision}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Link Case Dialog */}
      <Dialog open={isLinkOpen} onOpenChange={setIsLinkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ربط المحضر بملف قضية متداولة</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">
              اختر إحدى قضايا الموكل لضم هذا المحضر إلى أوراقها:
            </p>

            {cases.length > 0 ? (
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.case_number}/{c.case_year} — {c.title}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-destructive font-semibold">
                لا توجد قضايا مسجلة لهذا الموكل حالياً.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsLinkOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleLinkCase} disabled={cases.length === 0}>
              تأكيد الربط
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
