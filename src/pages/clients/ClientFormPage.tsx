import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Save,
  ArrowRight,
  Briefcase,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { ClientType } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { useToast } from "../../components/common/Toast";
import { logAuditEvent } from "../../lib/api/audit";
import { getFirmQuotaStatus } from "../../lib/api/quotas";

export const ClientFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [clientType, setClientType] = useState<ClientType>("individual");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [companyReg, setCompanyReg] = useState("");
  const [occupation, setOccupation] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Optional Power of Attorney (for new clients)
  const [includePoa, setIncludePoa] = useState(false);
  const [poaNumber, setPoaNumber] = useState("");
  const [poaDate, setPoaDate] = useState(new Date().toISOString().split("T")[0]);
  const [poaType, setPoaType] = useState<"general" | "special">("special");
  const [poaNotaryOffice, setPoaNotaryOffice] = useState("توثيق مدينة نصر النموذجي");
  const [poaScope, setPoaScope] = useState("حضور والترافع في سائر القضايا والمنازعات القضائية.");

  useEffect(() => {
    if (isEdit && id) {
      loadClient(id);
    }
  }, [id, isEdit]);

  const loadClient = async (clientId: string) => {
    try {
      setLoading(true);
      const c = await apiClient.getClientById(clientId);
      if (c) {
        setFullName(c.full_name);
        setClientType(c.client_type);
        setPhone(c.phone);
        setEmail(c.email || "");
        setNationalId(c.national_id || "");
        setCompanyReg(c.company_reg || "");
        setOccupation(c.occupation || "");
        setAddress(c.address || "");
        setNotes(c.notes || "");
      }
    } catch (err) {
      console.error(err);
      showToast("تعذر تحميل بيانات الموكل", "error");
      navigate("/firm/clients");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast("يرجى إدخال اسم الموكل ورقم الهاتف", "error");
      return;
    }

    const quota = getFirmQuotaStatus();
    if (quota.isSuspended) {
      showToast(
        "حساب المكتب معلق أو متأخر السداد حالياً. يرجى سداد الاشتراك أو التواصل مع الإدارة لإتاحة قيد وتعديل العمليات.",
        "error"
      );
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await apiClient.updateClient(id, {
          full_name: fullName.trim(),
          client_type: clientType,
          phone: phone.trim(),
          email: email.trim() || undefined,
          national_id: clientType === "individual" ? nationalId.trim() || undefined : undefined,
          company_reg: clientType === "company" ? companyReg.trim() || undefined : undefined,
          occupation: occupation.trim() || undefined,
          address: address.trim() || undefined,
          notes: notes.trim() || undefined,
        });

        logAuditEvent({
          action_type: "تعديل موكل",
          description: `تم تعديل بيانات الموكل: "${fullName.trim()}"`,
          status: "success",
        });

        showToast("تم تحديث بيانات الموكل بنجاح", "success");
        navigate(`/firm/clients/${id}`);
      } else {
        const created = await apiClient.createClient({
          full_name: fullName.trim(),
          client_type: clientType,
          phone: phone.trim(),
          email: email.trim() || undefined,
          national_id: clientType === "individual" ? nationalId.trim() || undefined : undefined,
          company_reg: clientType === "company" ? companyReg.trim() || undefined : undefined,
          occupation: occupation.trim() || undefined,
          address: address.trim() || undefined,
          notes: notes.trim() || undefined,
        });

        logAuditEvent({
          action_type: "إضافة موكل",
          description: `إضافة موكل جديد بالدليل: "${fullName.trim()}" (${clientType === "individual" ? "فرد" : "شركة"})`,
          status: "success",
        });

        // Add POA if requested
        if (includePoa && poaNumber.trim() && created?.id) {
          try {
            await apiClient.createPoa({
              client_id: created.id,
              poa_number: poaNumber.trim(),
              poa_date: poaDate,
              poa_type: poaType,
              poa_notary_type: "شهر عقاري",
              poa_notary_office: poaNotaryOffice.trim(),
              poa_scope: poaScope.trim(),
              status: "active",
            });
          } catch (poaErr) {
            console.error("Failed to create initial POA:", poaErr);
          }
        }

        showToast("تم تسجيل الموكل الجديد بنجاح", "success");
        navigate(`/firm/clients/${created.id}`);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "حدث خطأ أثناء حفظ بيانات الموكل", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-96 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/80">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(isEdit ? `/firm/clients/${id}` : "/firm/clients")}
            className="text-slate-600 gap-1.5 hover:bg-slate-100"
          >
            <ArrowRight className="w-4 h-4" />
            <span>رجوع</span>
          </Button>
          <div className="h-4 w-px bg-slate-300" />
          <div>
            <h1 className="font-headline text-xl sm:text-2xl font-bold text-primary">
              {isEdit ? "تعديل بيانات الموكل" : "تسجيل موكل جديد"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEdit
                ? "تحديث السجلات والبيانات الشخصية وجهات الاتصال للموكل"
                : "إضافة ملف موكل جديد وربطه بالتوكيلات وسجلات القضايا"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(isEdit ? `/firm/clients/${id}` : "/firm/clients")}
            disabled={submitting}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-2 bg-primary text-white hover:bg-primary/90 font-semibold"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "تسجيل الموكل"}</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details Card */}
        <Card className="border-border shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-border/60 py-4 px-6">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                {clientType === "company" ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </span>
              <div>
                <CardTitle className="text-base font-bold text-primary">البيانات الأساسية للموكل</CardTitle>
                <CardDescription className="text-xs">
                  اختر صفة الموكل وأدخل بيانات الهوية والتواصل الرسمية
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Client Type Selector */}
            <div>
              <label className="block text-xs font-bold text-primary mb-2">
                صفة الموكل <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setClientType("individual")}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-start transition-all cursor-pointer ${
                    clientType === "individual"
                      ? "border-primary bg-primary/5 text-primary shadow-xs"
                      : "border-border bg-white hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      clientType === "individual" ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold">شخص طبيعي (فرد)</span>
                    <span className="block text-[11px] text-muted-foreground">
                      مواطن، موظف، مهني، أو تاجر فردي
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setClientType("company")}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-start transition-all cursor-pointer ${
                    clientType === "company"
                      ? "border-primary bg-primary/5 text-primary shadow-xs"
                      : "border-border bg-white hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      clientType === "company" ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold">شخص اعتباري (شركة / مؤسسة)</span>
                    <span className="block text-[11px] text-muted-foreground">
                      شركة مساهمة، ذات مسؤولية محدودة، أو جمعية
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Names & Identification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">
                  {clientType === "company" ? "اسم الشركة / المؤسسة" : "الاسم الثلاثي أو الرباعي للموكل"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={
                    clientType === "company" ? "مثال: شركة النيل للتطوير العقاري" : "مثال: أحمد عبد الله محمود"
                  }
                  className="h-10 text-xs"
                />
              </div>

              {clientType === "individual" ? (
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5">
                    الرقم القومي (14 رقماً)
                  </label>
                  <Input
                    type="text"
                    maxLength={14}
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="29XXXXXXXXXXXX"
                    dir="ltr"
                    className="h-10 text-xs font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5">
                    رقم السجل التجاري / البطاقة الضريبية
                  </label>
                  <Input
                    type="text"
                    value={companyReg}
                    onChange={(e) => setCompanyReg(e.target.value)}
                    placeholder="مثال: س.ت 104928 القاهرة"
                    className="h-10 text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">
                  رقم الهاتف الأساسي <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    dir="ltr"
                    className="h-10 text-xs font-mono ps-9"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">البريد الإلكتروني</label>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@example.com"
                    dir="ltr"
                    className="h-10 text-xs ps-9"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {clientType === "individual" && (
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5">المهنة / الوظيفة</label>
                  <Input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="مثال: مهندس برمجيات، محاسب، تاجر..."
                    className="h-10 text-xs"
                  />
                </div>
              )}

              <div className={clientType === "company" ? "md:col-span-2" : ""}>
                <label className="block text-xs font-bold text-primary mb-1.5">العنوان ومحل الإقامة</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثال: 14 شارع مصطفى النحاس - مدينة نصر - القاهرة"
                    className="h-10 text-xs ps-9"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-primary mb-1.5">
                ملاحظات إضافية وتوصيات خاصة
              </label>
              <Textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي ملاحظات خاصة بالموكل، أوقات الاتصال المفضلة، أو تفاصيل هامة..."
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Optional Initial Power of Attorney (Only on creation) */}
        {!isEdit && (
          <Card className="border-border shadow-xs overflow-hidden">
            <CardHeader className="bg-blue-50/40 border-b border-blue-100 py-4 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-secondary/15 text-secondary">
                    <FileCheck className="w-4 h-4" />
                  </span>
                  <div>
                    <CardTitle className="text-base font-bold text-primary">
                      التوكيل الرسمي الأولي (اختياري)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      يمكنك تسجيل بيانات التوكيل الصادر من الموكل مباشرة الآن
                    </CardDescription>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includePoa}
                    onChange={(e) => setIncludePoa(e.target.checked)}
                    className="w-4 h-4 rounded text-secondary focus:ring-secondary"
                  />
                  <span>إضافة توكيل الآن</span>
                </label>
              </div>
            </CardHeader>

            {includePoa && (
              <CardContent className="p-6 space-y-4 bg-blue-50/15">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1.5">
                      رقم التوكيل الرسمي <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      required={includePoa}
                      value={poaNumber}
                      onChange={(e) => setPoaNumber(e.target.value)}
                      placeholder="مثال: 1842 / ب لسنة 2026"
                      className="h-10 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1.5">تاريخ التوثيق</label>
                    <Input
                      type="date"
                      value={poaDate}
                      onChange={(e) => setPoaDate(e.target.value)}
                      className="h-10 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1.5">نوع التوكيل</label>
                    <select
                      value={poaType}
                      onChange={(e) => setPoaType(e.target.value as "general" | "special")}
                      className="w-full h-10 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                    >
                      <option value="special">توكيل خاص بالقضايا</option>
                      <option value="general">توكيل رسمي عام قضايا</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-primary mb-1.5">
                      مكتب التوثيق (الشهر العقاري)
                    </label>
                    <Input
                      type="text"
                      value={poaNotaryOffice}
                      onChange={(e) => setPoaNotaryOffice(e.target.value)}
                      placeholder="مثال: توثيق مدينة نصر النموذجي"
                      className="h-10 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1.5">نطاق التوكيل</label>
                    <Input
                      type="text"
                      value={poaScope}
                      onChange={(e) => setPoaScope(e.target.value)}
                      placeholder="حضور وترافع في القضايا..."
                      className="h-10 text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(isEdit ? `/firm/clients/${id}` : "/firm/clients")}
            disabled={submitting}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="gap-2 bg-primary text-white hover:bg-primary/90 font-semibold px-6"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? "جارٍ الحفظ..." : isEdit ? "تحديث بيانات الموكل" : "تسجيل الموكل"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

