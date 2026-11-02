import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  Plus,
  Calendar,
  Gavel,
  Shield,
  FileText,
  Edit,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { Client, Case, PowerOfAttorney, PoliceReport } from "../../types";
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
import { formatDate, formatCurrency } from "../../lib/utils";

export const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [poas, setPoas] = useState<PowerOfAttorney[]>([]);
  const [reports, setReports] = useState<PoliceReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Add POA dialog state
  const [isAddPoaOpen, setIsAddPoaOpen] = useState(false);
  const [poaNumber, setPoaNumber] = useState("");
  const [poaDate, setPoaDate] = useState("");
  const [poaType, setPoaType] = useState<"general" | "special">("special");
  const [notaryOffice, setNotaryOffice] = useState("توثيق مدينة نصر");
  const [poaScope, setPoaScope] = useState("");
  const [poaNotes, setPoaNotes] = useState("");

  const loadAll = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const c = await apiClient.getClientById(id);
      setClient(c);

      const allCases = await apiClient.getCases();
      setCases(allCases.filter((item) => item.client_id === id));

      const clientPoas = await apiClient.getPoas(id);
      setPoas(clientPoas);

      const allReports = await apiClient.getPoliceReports();
      setReports(allReports.filter((r) => r.client_id === id));
    } catch (err) {
      console.error(err);
      navigate("/firm/clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const handleCreatePoa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !poaNumber.trim()) return;
    try {
      await apiClient.createPoa({
        client_id: id,
        poa_number: poaNumber.trim(),
        poa_date: poaDate || new Date().toISOString().split("T")[0],
        poa_type: poaType,
        poa_notary_type: "شهر عقاري",
        poa_notary_office: notaryOffice.trim(),
        poa_scope: poaScope.trim() || "الحضور والترافع في كافة القضايا والمنازعات القضائية.",
        status: "active",
        notes: poaNotes.trim() || undefined,
      });

      setIsAddPoaOpen(false);
      setPoaNumber("");
      setPoaDate("");
      setPoaScope("");
      setPoaNotes("");
      await loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !client) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground">
        جارٍ تحميل بيانات الموكل...
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
            onClick={() => navigate("/firm/clients")}
            className="text-slate-600 gap-1"
          >
            <ArrowRight className="w-4 h-4" />
            دليل الموكلين
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="font-bold text-sm text-primary">ملف الموكل</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/firm/clients/${id}/edit`)}
            className="gap-2 text-xs font-semibold bg-white border-slate-200 hover:bg-slate-50"
          >
            <Edit className="w-3.5 h-3.5 text-slate-600" />
            <span>تعديل الموكل</span>
          </Button>

          <Button
            size="sm"
            onClick={() => navigate(`/firm/cases/new`)}
            className="gap-2 text-xs font-semibold bg-primary text-white hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            إضافة قضية جديدة لهذا الموكل
          </Button>
        </div>
      </div>

      {/* Client Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                {client.client_type === "company" ? (
                  <Building className="w-8 h-8" />
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-headline text-primary">
                    {client.full_name}
                  </h1>
                  <Badge variant={client.client_type === "company" ? "secondary" : "outline"}>
                    {client.client_type === "company" ? "شركة / مؤسسة" : "شخص طبيعي (فرد)"}
                  </Badge>
                </div>

                {client.occupation && (
                  <p className="text-xs text-muted-foreground font-medium">
                    {client.occupation}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 flex-wrap">
                  <span className="flex items-center gap-1 font-mono text-foreground font-semibold">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {client.phone}
                  </span>

                  {client.email && (
                    <span className="flex items-center gap-1 font-mono">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {client.email}
                    </span>
                  )}

                  {client.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {client.address}
                    </span>
                  )}
                </div>

                {(client.national_id || client.company_reg) && (
                  <p className="text-xs text-slate-600 font-mono pt-1">
                    {client.national_id ? `الرقم القومي: ${client.national_id}` : `السجل التجاري: ${client.company_reg}`}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-border text-center shrink-0 w-full md:w-auto">
              <div className="px-3">
                <span className="text-[10px] text-muted-foreground block">القضايا النشطة</span>
                <span className="text-base font-bold text-primary font-mono">{cases.length}</span>
              </div>
              <div className="px-3 border-x border-border">
                <span className="text-[10px] text-muted-foreground block">التوكيلات</span>
                <span className="text-base font-bold text-secondary font-mono">{poas.length}</span>
              </div>
              <div className="px-3">
                <span className="text-[10px] text-muted-foreground block">المحاضر</span>
                <span className="text-base font-bold text-slate-700 font-mono">{reports.length}</span>
              </div>
            </div>
          </div>

          {client.notes && (
            <div className="mt-4 p-3 bg-slate-50/70 rounded-xl border border-border text-xs text-slate-700">
              <strong>ملاحظات:</strong> {client.notes}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs defaultValue="cases" className="w-full">
        <TabsList>
          <TabsTrigger value="cases" className="gap-2 text-xs font-semibold">
            <Briefcase className="w-4 h-4" />
            القضايا المتداولة ({cases.length})
          </TabsTrigger>
          <TabsTrigger value="poas" className="gap-2 text-xs font-semibold">
            <Shield className="w-4 h-4" />
            التوكيلات الرسمية ({poas.length})
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4" />
            محاضر الشرطة ({reports.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CASES */}
        <TabsContent value="cases" className="space-y-3 pt-2">
          {cases.length > 0 ? (
            cases.map((c) => (
              <Card
                key={c.id}
                onClick={() => navigate(`/firm/cases/${c.id}`)}
                className="p-4 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary bg-slate-100 px-2 py-0.5 rounded">
                        {c.case_number} / {c.case_year}
                      </span>
                      <h4 className="font-bold text-sm text-foreground truncate hover:text-secondary">
                        {c.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Gavel className="w-3.5 h-3.5 text-secondary" />
                      {c.court_name} • {c.circuit} • الخصم: {c.opponent_name}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-end">
                    <div>
                      <span className="text-xs font-bold text-foreground block font-mono">
                        {formatCurrency(c.total_fees)}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold font-mono block">
                        مسدد: {formatCurrency(c.total_paid)}
                      </span>
                    </div>
                    <Badge variant={c.status === "active" ? "success" : "outline"} className="text-xs">
                      {c.status === "active" ? "متداولة" : c.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border">
              لا توجد قضايا مسجلة لهذا الموكل حالياً.
            </div>
          )}
        </TabsContent>

        {/* TAB 2: POAS */}
        <TabsContent value="poas" className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-primary font-headline">
              التوكيلات الرسمية الصادرة من الشهر العقاري
            </h3>
            <Button
              size="sm"
              onClick={() => setIsAddPoaOpen(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة توكيل رسمي
            </Button>
          </div>

          {poas.length > 0 ? (
            <div className="space-y-3">
              {poas.map((poa) => (
                <Card key={poa.id} className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-secondary shrink-0" />
                        <span className="font-bold text-sm text-foreground">
                          توكيل رقم: {poa.poa_number}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {poa.poa_type === "general" ? "عام في القضايا" : "خاص بقضية"}
                        </Badge>
                        <Badge variant="success" className="text-[10px]">
                          ساري
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600">
                        <strong>مكتب التوثيق:</strong> {poa.poa_notary_office} • تاريخ التوثيق: {formatDate(poa.poa_date)}
                      </p>

                      <p className="text-xs text-muted-foreground leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-border mt-1">
                        <strong>نطاق وحدود التوكيل:</strong> {poa.poa_scope}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border">
              لم يتم حفظ أي توكيلات رسمية لهذا الموكل حتى الآن.
            </div>
          )}
        </TabsContent>

        {/* TAB 3: POLICE REPORTS */}
        <TabsContent value="reports" className="space-y-3 pt-2">
          {reports.length > 0 ? (
            reports.map((r) => (
              <Card
                key={r.id}
                onClick={() => navigate(`/firm/police-reports/${r.id}`)}
                className="p-4 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary bg-slate-100 px-2 py-0.5 rounded">
                        محضر {r.report_number} / {r.report_year}
                      </span>
                      <h4 className="font-bold text-sm text-foreground">{r.subject}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {r.police_station} • {r.general_prosecution}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {r.status === "under_investigation" ? "قيد التحقيق" : "مؤرشف"}
                  </Badge>
                </div>
              </Card>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground bg-white rounded-xl border border-dashed border-border">
              لا توجد محاضر شرطة مسجلة لهذا الموكل.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add POA Modal Dialog */}
      <Dialog open={isAddPoaOpen} onOpenChange={setIsAddPoaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تسجيل توكيل رسمي صادر من الشهر العقاري</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreatePoa} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  رقم التوكيل والحرف <span className="text-destructive">*</span>
                </label>
                <Input
                  value={poaNumber}
                  onChange={(e) => setPoaNumber(e.target.value)}
                  placeholder="مثال: 1254 ب لسنة 2026"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  تاريخ التوثيق <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={poaDate}
                  onChange={(e) => setPoaDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  نوع التوكيل
                </label>
                <select
                  value={poaType}
                  onChange={(e) => setPoaType(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="special">توكيل خاص بقضية محددة</option>
                  <option value="general">توكيل رسمي عام قضايا</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  فرع الشهر العقاري / التوثيق
                </label>
                <Input
                  value={notaryOffice}
                  onChange={(e) => setNotaryOffice(e.target.value)}
                  placeholder="مثال: توثيق مدينة نصر"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                نطاق وصلاحيات التوكيل
              </label>
              <textarea
                value={poaScope}
                onChange={(e) => setPoaScope(e.target.value)}
                rows={3}
                placeholder="مثال: الحضور والترافع وتقديم المذكرات والطعن بالاستئناف والنقض والصلح والإقرار..."
                className="w-full rounded-lg border border-input bg-white p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddPoaOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">حفظ التوكيل</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
