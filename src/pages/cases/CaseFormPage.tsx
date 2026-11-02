import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Briefcase,
  Gavel,
  User,
  DollarSign,
  FileText,
  ArrowRight,
  Save,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { useOffline } from "../../lib/offline";
import { ClientPicker } from "../../components/common/ClientPicker";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  COMMON_COURTS,
  CASE_TYPES,
  EGYPT_GOVERNORATES,
} from "../../lib/utils";
import { CaseStatus, ClientRole } from "../../types";

const caseSchema = z.object({
  client_id: z.string().min(1, "يرجى اختيار الموكل"),
  client_name: z.string().min(1, "اسم الموكل مطلوب"),
  client_role: z.enum(["plaintiff", "defendant", "appellant", "respondent", "third_party"]),
  title: z.string().min(3, "موضوع الدعوى يجب أن يكون 3 أحرف على الأقل"),
  case_number: z.string().min(1, "رقم الدعوى مطلوب"),
  case_year: z.coerce.number().min(1980, "سنة الدعوى غير صالحة").max(2050, "سنة الدعوى غير صالحة"),
  court_id: z.string().optional(),
  court_name: z.string().min(1, "المحكمة مطلوبة"),
  court_governorate: z.string().min(1, "المحافظة مطلوبة"),
  circuit: z.string().min(1, "الدائرة القضائية مطلوبة"),
  case_type_id: z.string().optional(),
  case_type_name: z.string().min(1, "نوع القضية مطلوب"),
  opponent_name: z.string().min(2, "اسم الخصم مطلوب"),
  opponent_lawyer: z.string().optional(),
  description: z.string().optional(),
  total_fees: z.coerce.number().min(0, "الأتعاب يجب أن تكون صفر أو أكثر"),
  total_paid: z.coerce.number().min(0, "المسدد يجب أن يكون صفر أو أكثر"),
  status: z.enum(["active", "reserved_for_ruling", "on_hold", "closed", "archived"]),
});

type CaseFormData = z.infer<typeof caseSchema>;

export const CaseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { isOnline, createCaseOffline } = useOffline();

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      client_id: "",
      client_name: "",
      client_role: "plaintiff",
      title: "",
      case_number: "",
      case_year: new Date().getFullYear(),
      court_name: COMMON_COURTS[0].name,
      court_governorate: "القاهرة",
      circuit: "الدائرة الأولى",
      case_type_name: CASE_TYPES[0].name,
      opponent_name: "",
      opponent_lawyer: "",
      description: "",
      total_fees: 10000,
      total_paid: 0,
      status: "active",
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadCase(id);
    }
  }, [id, isEditing]);

  const loadCase = async (caseId: string) => {
    try {
      setLoading(true);
      const data = await apiClient.getCaseById(caseId);
      setValue("client_id", data.client_id);
      setValue("client_name", data.client_name);
      setValue("client_role", data.client_role);
      setValue("title", data.title);
      setValue("case_number", data.case_number);
      setValue("case_year", data.case_year);
      setValue("court_name", data.court_name);
      setValue("court_governorate", data.court_governorate);
      setValue("circuit", data.circuit);
      setValue("case_type_name", data.case_type_name);
      setValue("opponent_name", data.opponent_name);
      setValue("opponent_lawyer", data.opponent_lawyer || "");
      setValue("description", data.description || "");
      setValue("total_fees", data.total_fees);
      setValue("total_paid", data.total_paid);
      setValue("status", data.status);
    } catch (err) {
      console.error(err);
      alert("تعذر تحميل بيانات القضية");
      navigate("/firm/cases");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: CaseFormData) => {
    setSubmitting(true);
    try {
      if (!isOnline) {
        // Offline Mode: Save directly to local SQLite database, enqueue mutation, trigger Toast
        await createCaseOffline({
          title: formData.title,
          case_number: formData.case_number,
          client_id: formData.client_id,
          client_name: formData.client_name,
          court: formData.court_name,
          circuit: formData.circuit,
          status: formData.status,
          fees: formData.total_fees,
          paid_amount: formData.total_paid,
        });
        navigate("/firm/cases");
        return;
      }

      // Online Mode
      if (isEditing && id) {
        await apiClient.updateCase(id, formData);
      } else {
        await apiClient.createCase({
          ...formData,
          court_id: formData.court_id || "c1",
          case_type_id: formData.case_type_id || "ct1",
          firm_id: "01a08460-df3a-70c0-9a46-f3497eced7c7",
          filing_date: new Date().toISOString().split("T")[0],
          created_by: "01a08460-b523-7667-b6cd-7863e99c38c7",
        });

        // Mirror to local SQLite for local-first reads
        await createCaseOffline({
          title: formData.title,
          case_number: formData.case_number,
          client_id: formData.client_id,
          client_name: formData.client_name,
          court: formData.court_name,
          circuit: formData.circuit,
          status: formData.status,
          fees: formData.total_fees,
          paid_amount: formData.total_paid,
          synced: 1,
        });
      }
      navigate("/firm/cases");
    } catch (err) {
      console.warn("[CaseFormPage] Online save failed, persisting offline:", err);
      // Fallback: save to SQLite and sync queue
      await createCaseOffline({
        title: formData.title,
        case_number: formData.case_number,
        client_id: formData.client_id,
        client_name: formData.client_name,
        court: formData.court_name,
        circuit: formData.circuit,
        status: formData.status,
        fees: formData.total_fees,
        paid_amount: formData.total_paid,
      });
      navigate("/firm/cases");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground">
        جارٍ تجهيز نموذج القضية...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-3 sm:space-y-5 sm:p-6">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/firm/cases")}
            className="text-slate-600 gap-1.5"
          >
            <ArrowRight className="w-4 h-4" />
            الرجوع للقضايا
          </Button>
          <span className="text-muted-foreground text-sm">/</span>
          <h1 className="text-xl sm:text-2xl font-bold font-headline text-primary">
            {isEditing ? "تعديل بيانات الدعوى" : "إضافة قضية جديدة"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* SECTION 1: Client Information & Role */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-secondary" />
              بيانات الموكل والصفة في الدعوى
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <Controller
              name="client_id"
              control={control}
              render={({ field }) => (
                <ClientPicker
                  value={field.value}
                  onChange={(clientId, clientName) => {
                    field.onChange(clientId);
                    setValue("client_name", clientName);
                  }}
                  error={errors.client_id?.message}
                />
              )}
            />

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                صفة الموكل في الدعوى <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: "plaintiff", label: "مدعي (طالب حق)" },
                  { value: "defendant", label: "مدعى عليه" },
                  { value: "appellant", label: "مستأنف / طاعن" },
                  { value: "respondent", label: "مستأنف عليه" },
                ].map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      watch("client_role") === role.value
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value={role.value}
                      {...register("client_role")}
                      className="sr-only"
                    />
                    {role.label}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: Case Identity & Judiciary Jurisdiction */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Gavel className="w-4 h-4 text-secondary" />
              بيانات القضية والاختصاص القضائي
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                موضوع الدعوى / عنوان القضية <span className="text-destructive">*</span>
              </label>
              <Input
                {...register("title")}
                placeholder="مثال: دعوى تعويض عن إصابة عمل وفصل تعسفي"
                error={errors.title?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  رقم الدعوى (الرول) <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("case_number")}
                  placeholder="مثال: 1842"
                  dir="ltr"
                  error={errors.case_number?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  سنة الدعوى <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  {...register("case_year")}
                  placeholder="2026"
                  dir="ltr"
                  error={errors.case_year?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  نوع القضية <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("case_type_name")}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {CASE_TYPES.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  المحكمة <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("court_name")}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {COMMON_COURTS.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  المحافظة <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("court_governorate")}
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
                  الدائرة القضائية <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("circuit")}
                  placeholder="مثال: الدائرة 7 عمال"
                  error={errors.circuit?.message}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                حالة القضية الحالية
              </label>
              <select
                {...register("status")}
                className="w-full h-10 px-3 rounded-lg border border-input bg-white text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">متداولة (نشطة)</option>
                <option value="reserved_for_ruling">محجوزة للحكم</option>
                <option value="on_hold">معلقة / تحت الفحص</option>
                <option value="closed">مفصولة ومغلقة</option>
                <option value="archived">مؤرشفة</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: Opponent Information */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-secondary" />
              بيانات الخصم ومحامي الخصم
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  اسم الخصم / الشركة الخصم <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("opponent_name")}
                  placeholder="مثال: شركة الأهرام للإنشاءات"
                  error={errors.opponent_name?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  اسم محامي الخصم (إن وجد)
                </label>
                <Input
                  {...register("opponent_lawyer")}
                  placeholder="مثال: الأستاذ عادل الشربيني"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                ملاحظات ووقائع الدعوى
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="أضف ملخصاً لدفوع الدعوى والمستندات الجوهرية..."
                className="w-full rounded-lg border border-input bg-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: Agreed Fees & Installments */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-secondary" />
              الأتعاب المتفق عليها والدفعات
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  إجمالي الأتعاب التعاقدية (ج.م.)
                </label>
                <Input
                  type="number"
                  {...register("total_fees")}
                  placeholder="15000"
                  dir="ltr"
                  error={errors.total_fees?.message}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  المبلغ الإجمالي المتفق عليه مع الموكل عن هذه القضية.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  المقدم / المسدد حتى الآن (ج.م.)
                </label>
                <Input
                  type="number"
                  {...register("total_paid")}
                  placeholder="5000"
                  dir="ltr"
                  error={errors.total_paid?.message}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  سيتم خصم هذا المبلغ وحساب المتبقي تلقائياً في التقرير المالي.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/firm/cases")}
            disabled={submitting}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={submitting} className="gap-2 px-6">
            <Save className="w-4 h-4" />
            {submitting ? "جارٍ الحفظ..." : isEditing ? "تحديث القضية" : "حفظ وإنشاء القضية"}
          </Button>
        </div>
      </form>
    </div>
  );
};
