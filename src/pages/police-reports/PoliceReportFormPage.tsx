import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ShieldAlert, ArrowRight, Save, User, Building, Briefcase } from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { ClientPicker } from "../../components/common/ClientPicker";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { EGYPT_GOVERNORATES } from "../../lib/utils";
import { PoliceReportType, Case } from "../../types";

export const PoliceReportFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const queryCaseId = searchParams.get("caseId") || "";

  const [loading, setLoading] = useState(isEdit);
  const [cases, setCases] = useState<Case[]>([]);
  const [linkedCaseId, setLinkedCaseId] = useState(queryCaseId);
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [reportNumber, setReportNumber] = useState("");
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportType, setReportType] = useState<PoliceReportType>("admin");
  const [governorate, setGovernorate] = useState("القاهرة");
  const [policeStation, setPoliceStation] = useState("قسم شرطة أول مدينة نصر");
  const [districtProsecution, setDistrictProsecution] = useState("نيابة أول مدينة نصر الجزئية");
  const [generalProsecution, setGeneralProsecution] = useState("نيابة شرق القاهرة الكلية");
  const [subject, setSubject] = useState("");
  const [incidentSummary, setIncidentSummary] = useState("");
  const [dispatchNumber, setDispatchNumber] = useState("");
  const [fees, setFees] = useState(3000);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [id, isEdit]);

  const loadInitialData = async () => {
    try {
      const allCases = await apiClient.getCases();
      setCases(allCases);

      if (queryCaseId) {
        const foundCase = allCases.find((c) => c.id === queryCaseId);
        if (foundCase) {
          setLinkedCaseId(foundCase.id);
          setClientId(foundCase.client_id);
          setClientName(foundCase.client_name);
          setSubject(`محضر متعلق بـ: ${foundCase.title}`);
        }
      }

      if (isEdit && id) {
        await loadReport(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadReport = async (reportId: string) => {
    try {
      setLoading(true);
      const r = await apiClient.getPoliceReportById(reportId);
      if (r) {
        setClientId(r.client_id);
        setClientName(r.client_name || "");
        setLinkedCaseId(r.linked_case_id || "");
        setReportNumber(r.report_number);
        setReportYear(r.report_year);
        setReportType(r.report_type);
        setPoliceStation(r.police_station);
        setDistrictProsecution(r.district_prosecution);
        setGeneralProsecution(r.general_prosecution);
        setSubject(r.subject);
        setIncidentSummary(r.incident_summary || "");
        setDispatchNumber(r.dispatch_number || "");
        setFees(r.total_fees || 0);
      }
    } catch (err) {
      console.error(err);
      navigate("/firm/police-reports");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !reportNumber.trim() || !subject.trim()) {
      alert("يرجى ملء الحقول الإلزامية");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await apiClient.updatePoliceReport(id, {
          client_id: clientId,
          client_name: clientName,
          linked_case_id: linkedCaseId || null,
          report_number: reportNumber.trim(),
          report_year: reportYear,
          report_type: reportType,
          security_directorate: `مديرية أمن ${governorate}`,
          police_station: policeStation.trim(),
          general_prosecution: generalProsecution.trim(),
          district_prosecution: districtProsecution.trim(),
          subject: subject.trim(),
          incident_summary: incidentSummary.trim() || undefined,
          dispatch_number: dispatchNumber.trim() || undefined,
          total_fees: fees,
        });
        if (linkedCaseId) {
          navigate(`/firm/cases/${linkedCaseId}`);
        } else {
          navigate(`/firm/police-reports/${id}`);
        }
      } else {
        await apiClient.createPoliceReport({
          client_id: clientId,
          client_name: clientName,
          linked_case_id: linkedCaseId || null,
          report_number: reportNumber.trim(),
          report_year: reportYear,
          report_type: reportType,
          security_directorate: `مديرية أمن ${governorate}`,
          police_station: policeStation.trim(),
          general_prosecution: generalProsecution.trim(),
          district_prosecution: districtProsecution.trim(),
          status: "under_investigation",
          subject: subject.trim(),
          incident_summary: incidentSummary.trim() || undefined,
          dispatch_number: dispatchNumber.trim() || undefined,
          total_fees: fees,
          total_expenses: 0,
        });
        if (linkedCaseId) {
          navigate(`/firm/cases/${linkedCaseId}`);
        } else {
          navigate("/firm/police-reports");
        }
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ المحضر");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-3 sm:space-y-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(isEdit ? `/firm/police-reports/${id}` : "/firm/police-reports")}
          className="text-slate-600 gap-1.5"
        >
          <ArrowRight className="w-4 h-4" />
          {isEdit ? "رجوع لتفاصيل المحضر" : "رجوع للمحاضر"}
        </Button>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl sm:text-2xl font-bold font-headline text-primary">
          {isEdit ? "تعديل بيانات محضر الشرطة" : "تسجيل محضر شرطة جديد"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Picker */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-secondary" />
              الموكل مقدم البلاغ أو الشاكي
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ClientPicker
              value={clientId}
              onChange={(cId, cName) => {
                setClientId(cId);
                setClientName(cName);
              }}
            />
          </CardContent>
        </Card>

        {/* Linked Case Picker */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-secondary" />
              القضية المرتبطة بالمحضر (اختياري)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                اختر القضية القضائية إن كان المحضر تمهيداً لها أو متفرعاً منها
              </label>
              <select
                value={linkedCaseId}
                onChange={(e) => {
                  const cId = e.target.value;
                  setLinkedCaseId(cId);
                  const found = cases.find((c) => c.id === cId);
                  if (found) {
                    if (!clientId) {
                      setClientId(found.client_id);
                      setClientName(found.client_name);
                    }
                    if (!subject) {
                      setSubject(`محضر متعلق بـ: ${found.title}`);
                    }
                  }
                }}
                className="w-full h-10 px-3 rounded-lg border border-input bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- بدون ربط بقضية حالية (محضر مستقل) --</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} (رقم {c.case_number}/{c.case_year} - {c.court_name})
                  </option>
                ))}
              </select>
              {linkedCaseId && (
                <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded mt-2 border border-emerald-200">
                  ✓ سيتم ربط هذا المحضر تلقائياً بالقضية وعرضه في تبويب (محاضر الشرطة والنيابة) داخل ملف القضية.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Identity */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-secondary" />
              بيانات القيد بالقسم والنيابة
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  رقم المحضر <span className="text-destructive">*</span>
                </label>
                <Input
                  value={reportNumber}
                  onChange={(e) => setReportNumber(e.target.value)}
                  placeholder="مثال: 3421"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  سنة المحضر <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  value={reportYear}
                  onChange={(e) => setReportYear(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  تصنيف المحضر <span className="text-destructive">*</span>
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="admin">إداري</option>
                  <option value="junhah">جنح</option>
                  <option value="ahwal">أحوال</option>
                  <option value="awared">عوارض</option>
                  <option value="econ_junhah">جنحة اقتصادية</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  المحافظة
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {EGYPT_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  قسم الشرطة <span className="text-destructive">*</span>
                </label>
                <Input
                  value={policeStation}
                  onChange={(e) => setPoliceStation(e.target.value)}
                  placeholder="مثال: قسم شرطة المعادي"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  النيابة الجزئية المختصة
                </label>
                <Input
                  value={districtProsecution}
                  onChange={(e) => setDistrictProsecution(e.target.value)}
                  placeholder="مثال: نيابة المعادي الجزئية"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                موضوع الشكوى / البلاغ <span className="text-destructive">*</span>
              </label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: تبديد منقولات زوجية / شيك بدون رصيد / إثبات حالة"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                ملخص أقوال المحضر والواقعة
              </label>
              <textarea
                value={incidentSummary}
                onChange={(e) => setIncidentSummary(e.target.value)}
                rows={3}
                placeholder="تفاصيل أقوال الشاكي والشهود وتحريات المباحث..."
                className="w-full rounded-lg border border-input bg-white p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dispatch & Fees */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="w-4 h-4 text-secondary" />
              رقم الصادر وأتعاب المتابعة
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                رقم صادر القسم إلى النيابة (إن وجد)
              </label>
              <Input
                value={dispatchNumber}
                onChange={(e) => setDispatchNumber(e.target.value)}
                placeholder="مثال: صادر 241 / 2026"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                أتعاب متابعة المحضر (ج.م.)
              </label>
              <Input
                type="number"
                value={fees}
                onChange={(e) => setFees(Number(e.target.value))}
                dir="ltr"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/firm/police-reports")}
            disabled={submitting}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={submitting} className="gap-2">
            <Save className="w-4 h-4" />
            {submitting ? "جارٍ الحفظ..." : isEdit ? "تحديث بيانات المحضر" : "حفظ وقيد المحضر"}
          </Button>
        </div>
      </form>
    </div>
  );
};
