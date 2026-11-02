import React, { useState, useEffect } from "react";
import { Check, Sparkles, ShieldCheck, AlertTriangle, ArrowUpRight, BarChart3, Database, Users, Briefcase } from "lucide-react";
import { usePlatformStore } from "../../lib/platformStore";
import { getFirmQuotaStatus, upgradeFirmPlan, QuotaStatus } from "../../lib/api/quotas";
import { useToast } from "../../components/common/Toast";

export const SubscriptionPage: React.FC = () => {
  const { showToast } = useToast();
  const [cycle, setCycle] = useState<"monthly" | "annual">("annual");
  const { plans, settings } = usePlatformStore();
  const [quota, setQuota] = useState<QuotaStatus>(getFirmQuotaStatus());

  const refreshQuota = () => {
    setQuota(getFirmQuotaStatus());
  };

  useEffect(() => {
    refreshQuota();
    const handleUpdate = () => refreshQuota();
    window.addEventListener("firm-subscription-updated", handleUpdate);
    return () => window.removeEventListener("firm-subscription-updated", handleUpdate);
  }, []);

  const handleUpgrade = (planId: "individual" | "office" | "enterprise") => {
    if (planId === quota.planId) {
      showToast("هذه هي باقتك المفعلة بالفعل.", "info");
      return;
    }
    const upgraded = upgradeFirmPlan(planId);
    refreshQuota();
    showToast(`تمت ترقية باقة مكتبك بنجاح إلى "${upgraded.name}"!`, "success");
  };

  const planDetails = plans.map((p) => ({
    id: p.id as "individual" | "office" | "enterprise",
    name: p.name,
    monthlyPrice: p.monthlyPrice.toLocaleString("ar-EG"),
    annualPrice: p.annualPrice.toLocaleString("ar-EG"),
    description: p.description,
    isCurrent: p.id === quota.planId,
    isPopular: p.id === "office",
    features: p.features,
    maxUsers: p.maxUsers,
    maxStorage: p.maxStorageGb,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6" dir="rtl">
      {/* Current Subscription Status Card with Live Usage Meters */}
      <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline font-bold text-base text-primary">
                  الاشتراك الحالي: {quota.planName}
                </h2>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    quota.isSuspended
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {quota.subscriptionStatus === "active"
                    ? "نشط ومسدد"
                    : quota.subscriptionStatus === "trial"
                    ? "فترة تجريبية"
                    : "معلق / يتطلب التجديد"}
                </span>
              </div>
              <p className="text-xs text-tertiary mt-0.5">
                تطبق قيود وحصص الاستخدام الصارمة لضمان حماية موارد النظام السحابية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              دورة السداد: {cycle === "annual" ? "سنوي (مخفض)" : "شهري"}
            </span>
          </div>
        </div>

        {/* Live Quota Consumption Meters (ريجلوشن الاستهلاك الفعلي) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Cases Quota */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-primary" />
                <span>القضايا المسجلة</span>
              </span>
              <span className="font-mono font-bold text-primary">
                {quota.cases.current} / {quota.cases.max}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  quota.cases.percentage > 85
                    ? "bg-rose-500"
                    : quota.cases.percentage > 60
                    ? "bg-amber-500"
                    : "bg-primary"
                }`}
                style={{ width: `${quota.cases.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>نسبة الاستهلاك: {quota.cases.percentage}%</span>
              {quota.cases.isExceeded && (
                <span className="text-rose-600 font-bold">تم بلوغ الحد الأقصى!</span>
              )}
            </div>
          </div>

          {/* Users Quota */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>المحامون والمستخدمون</span>
              </span>
              <span className="font-mono font-bold text-primary">
                {quota.users.current} / {quota.users.max}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  quota.users.percentage > 85 ? "bg-rose-500" : "bg-blue-600"
                }`}
                style={{ width: `${quota.users.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>نسبة الاستهلاك: {quota.users.percentage}%</span>
              {quota.users.isExceeded && (
                <span className="text-rose-600 font-bold">الحد مكتمل</span>
              )}
            </div>
          </div>

          {/* Cloud Storage Quota */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>التخزين السحابي للمستندات</span>
              </span>
              <span className="font-mono font-bold text-primary">
                {quota.storage.currentMb} MB / {Math.round(quota.storage.maxMb / 1024)} GB
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${quota.storage.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>سعة آمنة ومشفرة</span>
              <span className="text-emerald-700 font-bold">متاح للاستخدام</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto pt-2">
        <h1 className="font-headline text-primary text-xl sm:text-3xl font-bold">
          باقات ترقية وتوسيع نظام {settings.systemName}
        </h1>
        <p className="text-xs sm:text-sm text-tertiary">
          اختر الخطة الملائمة لحجم مكتبك، مع ترقية فورية وتفعيل الحصص الجديدة في نفس اللحظة
        </p>

        {/* Billing Cycle Switch */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-border mt-3">
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cycle === "monthly" ? "bg-white text-primary shadow-xs" : "text-tertiary hover:text-primary"
            }`}
          >
            سداد شهري
          </button>
          <button
            type="button"
            onClick={() => setCycle("annual")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              cycle === "annual" ? "bg-white text-primary shadow-xs" : "text-tertiary hover:text-primary"
            }`}
          >
            <span>سداد سنوي</span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold border border-emerald-200">
              خصم شهرين مجاناً
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {planDetails.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between relative transition-all ${
              plan.isCurrent
                ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md bg-emerald-50/10"
                : plan.isPopular
                ? "border-amber-500 ring-1 ring-amber-500/30 shadow-md"
                : "border-border hover:border-slate-300"
            }`}
          >
            {plan.isCurrent && (
              <div className="absolute -top-3 start-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>باقتك الحالية المفعلة</span>
              </div>
            )}

            {!plan.isCurrent && plan.isPopular && (
              <div className="absolute -top-3 start-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                الأكثر اختياراً للمكاتب
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-primary">{plan.name}</h3>
                <p className="text-xs text-tertiary mt-1 min-h-[36px]">{plan.description}</p>
              </div>

              <div className="pt-2 border-t border-border flex items-baseline gap-1">
                <span className="font-headline text-3xl font-extrabold text-primary">
                  {cycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                </span>
                <span className="text-xs text-tertiary">
                  {settings.currency} / {cycle === "monthly" ? "شهرياً" : "سنوياً"}
                </span>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-border">
                <p className="text-[11px] font-bold uppercase tracking-wider text-tertiary">
                  محددات وحصص الباقة:
                </p>
                <ul className="space-y-2 text-xs text-primary">
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>حتى {plan.maxUsers} مستخدمين ومحامين</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>مساحة تخزين سحابي: {plan.maxStorage} GB</span>
                  </li>
                  {plan.features.slice(2).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 text-[9px]">
                        ✓
                      </div>
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-border">
              <button
                type="button"
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.isCurrent}
                className={`w-full h-10 rounded-xl text-xs font-bold transition-all ${
                  plan.isCurrent
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800 cursor-default"
                    : plan.isPopular
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md font-black"
                    : "bg-primary text-white hover:bg-primary/90 shadow-xs"
                }`}
              >
                {plan.isCurrent ? "باقتك الحالية المفعلة" : "ترقية إلى هذه الباقة الآن"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
