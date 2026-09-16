import React, { useState, useEffect } from "react";
import { Check, CreditCard, Sparkles, Shield, Zap, ArrowLeft } from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { SubscriptionPlan } from "../../types";
import { CountBadge } from "../../components/common/CountBadge";

export const SubscriptionPage: React.FC = () => {
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState(false);

  const planDetails = [
    {
      id: "individual",
      name: "المحامي الفردي",
      monthlyPrice: "500",
      annualPrice: "5,000",
      description: "مثالية للمحامي المستقل الذي يبحث عن تنظيم قضاياه ومواعيده بدقة وسرعة.",
      isCurrent: true,
      features: [
        "حتى 2 مستخدمين (محام ومساعد)",
        "عدد غير محدود من القضايا والموكلين",
        "تصدير الأجندة إلى Excel و Google Calendar",
        "مساحة تخزين سحابي 5 جيجابايت للمستندات",
        "تنبيهات مواعيد السقوط والاستئناف",
      ],
    },
    {
      id: "office",
      name: "المكاتب المتوسطة",
      monthlyPrice: "1,400",
      annualPrice: "14,000",
      description: "المفضلة لمكاتب المحاماة التي تضم فريق عمل ومحامين تحت التمرين ومساعدين.",
      isPopular: true,
      features: [
        "حتى 10 مستخدمين وصلاحيات مخصصة",
        "قضايا وموكلين وجلسات غير محدودة",
        "لوحة كانبان لمتابعة مهام الفريق وتوزيعها",
        "مساحة تخزين سحابي 50 جيجابايت للمستندات",
        "سجل تدقيق العمليات الكامل (Audit Log)",
        "دعم فني مخصص وسريع عبر واتساب",
      ],
    },
    {
      id: "enterprise",
      name: "المكاتب الكبيرة والشركات",
      monthlyPrice: "3,700",
      annualPrice: "37,000",
      description: "حل متكامل للمؤسسات القانونية الكبرى وشركات المحاماة متعددة الفروع.",
      features: [
        "حتى 30 مستخدم مع أدوار وصلاحيات غير محدودة",
        "إدارة فروع متعددة ومخازن مستندات ضخمة",
        "مساحة تخزين 150 جيجابايت مؤمنة ومشفرة",
        "تقارير محاسبية ومالية متقدمة وتصدير شامل",
        "مدير حساب مخصص وتدريب كامل للفريق",
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Current Subscription Status Card */}
      <div className="rounded-xl border border-border bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#9E7B35] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline font-bold text-sm text-primary">الاشتراك الحالي: باقة المحامي الفردي</h2>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                نشط
              </span>
            </div>
            <p className="text-xs text-tertiary mt-0.5">
              موعد التجديد القادم: 1 أكتوبر 2026 • يتم التجديد تلقائياً
            </p>
          </div>
        </div>

        <button
          type="button"
          className="h-8 px-3 rounded-lg border border-border text-xs font-semibold text-primary hover:bg-neutral transition-colors self-start sm:self-auto"
        >
          سجل الفواتير والمدفوعات
        </button>
      </div>

      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto pt-2">
        <h1 className="font-headline text-primary text-xl sm:text-3xl font-bold">
          باقات اشتراك نظام سياق
        </h1>
        <p className="text-xs sm:text-sm text-tertiary">
          اختر الخطة الملائمة لنمو مكتبك القانوني، مع إمكانية الترقية أو التعديل في أي وقت
        </p>

        {/* Billing Cycle Switch */}
        <div className="inline-flex items-center p-1 bg-neutral rounded-xl border border-border mt-3">
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cycle === "monthly" ? "bg-white text-primary shadow-xs" : "text-tertiary hover:text-primary"
            }`}
          >
            دفع شهري
          </button>
          <button
            type="button"
            onClick={() => setCycle("annual")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              cycle === "annual" ? "bg-white text-primary shadow-xs" : "text-tertiary hover:text-primary"
            }`}
          >
            <span>دفع سنوي</span>
            <span className="bg-[#C5A059]/15 text-[#9E7B35] text-[10px] px-1.5 py-0.2 rounded font-bold">
              خصم شهرين
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
              plan.isPopular
                ? "border-secondary ring-1 ring-secondary shadow-md"
                : "border-border hover:border-slate-300"
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 start-1/2 -translate-x-1/2 bg-secondary text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs">
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
                  ج.م. / {cycle === "monthly" ? "شهرياً" : "سنوياً"}
                </span>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-border">
                <p className="text-[11px] font-bold uppercase tracking-wider text-tertiary">
                  المميزات المشمولة:
                </p>
                <ul className="space-y-2 text-xs text-primary">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-50 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
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
                className={`w-full h-10 rounded-xl text-xs font-bold transition-colors ${
                  plan.isCurrent
                    ? "bg-neutral border border-border text-tertiary cursor-default"
                    : plan.isPopular
                    ? "bg-secondary text-white hover:bg-secondary/90 shadow-2xs"
                    : "bg-primary text-white hover:bg-primary/90 shadow-2xs"
                }`}
              >
                {plan.isCurrent ? "باقتك الحالية" : "ترقية والاشتراك الآن"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SubscriptionPage;
