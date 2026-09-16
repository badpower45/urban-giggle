import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  X,
  Smartphone,
  ChartColumn,
  BriefcaseBusiness,
  UserRound,
  CalendarCheck2,
  Users,
  Database,
  ListPlus,
  CircleCheckBig,
  CircleX,
  Copy,
  ChevronDown,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Menu,
} from "lucide-react";
import {
  DashboardMockup,
  CaseManagementMockup,
  ClientManagementMockup,
  SessionsMockup,
  PhoneMockup,
} from "./components/Mockups";
import { useToast } from "../../components/common/Toast";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("support@siyaq.legal");
    showToast("تم نسخ البريد الإلكتروني: support@siyaq.legal");
  };

  const faqs = [
    {
      q: "هل النظام مصمم خصيصاً للمحاكم والإجراءات في مصر؟",
      a: "نعم، سياق مبني من الأساس ليطابق منظومة القضاء المصري: محاكم النقض والاستئناف والابتدائية والجزئية، الدوائر، الرول، مدد الطعون (النقض، الاستئناف، المعارضة)، والتوكيلات الرسمية.",
    },
    {
      q: "هل يمكنني تجربة النظام مجاناً قبل الاشتراك؟",
      a: "نعم بكل تأكيد! نوفر تجربة مجانية كاملة المزايا لمدة 14 يوماً بدون الحاجة لإدخال أي بطاقة بنكية أو وسيلة دفع. يمكنك الدخول فوراً وبدء إدارة مكتبك.",
    },
    {
      q: "هل يدعم تطبيق الموبايل العمل بدون اتصال بالإنترنت؟",
      a: "نعم، يمكنك تسجيل قرارات الجلسات والاطلاع على تفاصيل القضايا والتوكيلات داخل قاعات المحاكم بدون شبكة إنترنت، وعند عودة الاتصال تتم المزامنة تلقائياً وآمناً مع قاعدة بيانات المكتب.",
    },
    {
      q: "هل بيانات موكلي وقضايا مكتبي آمنة وسرية؟",
      a: "بياناتك مشفرة وفق أعلى معايير التشفير المصرفي، وتتمتع بحماية كاملة وسجلات تدقيق دقيقة تتيح لك تحديد صلاحيات كل محامٍ أو إداري في المكتب لمنع أي تسريب للمستندات أو الأسرار المهنية.",
    },
    {
      q: "هل يمكن تصدير التقارير المالية ورول الجلسات؟",
      a: "بالتأكيد، يدعم سياق طباعة رول الجلسات الرسمي لتقديمه في المحكمة وتصدير كشوف الحسابات والتقارير المالية بصيغة Excel و CSV بضغطة زر واحدة.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased selection:bg-secondary/20 selection:text-primary">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-white/92 backdrop-blur-md">
        <nav className="flex min-h-16 w-full items-center justify-between px-6 md:px-10 max-w-7xl mx-auto">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex min-w-0 items-center gap-2.5 rounded-md focus:outline-none">
              <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-white shadow-xs">
                <img src="/logo.webp" alt="شعار سياق" width="40" height="40" className="size-full object-cover" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-xl font-black text-primary tracking-tight font-headline">سِـيَـاق</span>
                <span className="mt-1 text-[11px] font-semibold text-tertiary">نظام لإدارة مكاتب المحاماة</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-6 lg:gap-8 md:flex">
            <a href="#why" className="text-sm font-semibold text-primary/80 hover:text-primary transition-colors">
              لماذا سياق؟
            </a>
            <a href="#features" className="text-sm font-semibold text-primary/80 hover:text-primary transition-colors">
              المميزات
            </a>
            <a href="#mobile" className="text-sm font-semibold text-primary/80 hover:text-primary transition-colors">
              تطبيق الموبايل
            </a>
            <a href="#pricing" className="text-sm font-semibold text-primary/80 hover:text-primary transition-colors">
              الأسعار
            </a>
            <a href="#contact" className="text-sm font-semibold text-primary/80 hover:text-primary transition-colors">
              تواصل معنا
            </a>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => showToast("الواجهة العربية هي الأساسية حالياً")}
              className="text-xs font-bold text-primary/70 hover:text-primary px-2.5 py-1.5 rounded-lg transition-colors"
            >
              English
            </button>
            <Link
              to="/login"
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border bg-white px-4 py-2 text-xs font-bold text-primary hover:border-primary/40 hover:bg-slate-50 transition-all"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/firm/dashboard"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-sm transition-all group"
            >
              <span>دخول النظام (Live Demo)</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid size-11 place-items-center rounded-xl border border-border bg-white text-primary hover:bg-slate-50 md:hidden"
            aria-label="القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-white px-6 py-4 space-y-3 animate-in slide-in-from-top-2">
            <a
              href="#why"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-primary"
            >
              لماذا سياق؟
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-primary"
            >
              المميزات
            </a>
            <a
              href="#mobile"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-primary"
            >
              تطبيق الموبايل
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-primary"
            >
              الأسعار
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-primary"
            >
              تواصل معنا
            </a>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center py-2.5 rounded-xl border border-border font-bold text-xs text-primary"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/firm/dashboard"
                className="w-full text-center py-2.5 rounded-xl bg-primary text-white font-bold text-xs"
              >
                دخول النظام (Live Demo)
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8f9fa_0%,#ffffff_76%)] pb-12 pt-10 md:pb-20 md:pt-16">
          <div className="mx-auto max-w-5xl px-4 text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/35 bg-secondary/10 px-4 py-1.5 text-xs font-bold text-primary mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>جديد · تجربة 14 يوم مجانًا لجميع مكاتب المحاماة في مصر</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-black leading-[1.2] text-primary md:text-5xl lg:text-6xl font-headline tracking-tight">
              إدارة مكتب المحاماة بالكامل من{" "}
              <span className="text-secondary underline decoration-secondary/30 decoration-wavy decoration-2">
                نظام واحد
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-tertiary md:text-lg">
              سياق يربط كل خيوط المكتب ببعضها لتدير القضايا والمحاضر والموكلين والجلسات وتُسجل الأتعاب والمصروفات من
              نظام واحد وبدون تشتت
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <Link
                to="/firm/dashboard"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-bold text-white hover:bg-slate-800 shadow-md hover:shadow-lg transition-all group"
              >
                <span>ابدأ تجربتك المجانية</span>
                <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-bold text-primary hover:border-primary/40 hover:bg-slate-50 shadow-xs transition-all"
              >
                شاهد كيف يعمل
              </a>
              <Link
                to="/firm/dashboard"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-secondary/60 bg-secondary/10 px-5 py-3 text-sm font-bold text-primary hover:bg-secondary/20 transition-all"
              >
                <span>تجربة النظام الحي مباشرة 🚀</span>
              </Link>
            </div>

            {/* Assurances */}
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs font-bold text-primary/80">
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary stroke-[3]" />
                14 يوم مجانًا
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary stroke-[3]" />
                بدون بطاقة دفع
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary stroke-[3]" />
                مصمم خصيصًا لمكاتب المحاماة في مصر
              </span>
            </div>

            {/* Hero Interactive UI Preview */}
            <div className="mt-12 mx-auto max-w-4xl p-2 rounded-2xl bg-gradient-to-b from-slate-200 to-slate-100 shadow-2xl border border-border">
              <DashboardMockup />
            </div>
          </div>
        </section>

        {/* BEFORE SIYAQ / PROBLEM SECTION */}
        <section id="why" className="pb-16 pt-8 md:pb-24 md:pt-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-black leading-tight text-primary sm:text-3xl md:text-4xl font-headline">
                قبل سياق تفاصيل المكتب مشتتة في كل مكان
              </h2>
              <p className="mt-4 text-base leading-8 text-tertiary">
                المشكلة ليست في كثرة العمل فقط بل أن كل جزء منه موجود في أداة مختلفة
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <article className="rounded-2xl border border-border bg-slate-50/70 p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-2.5 text-lg font-bold text-primary">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h3>ملفات مبعثرة</h3>
                </div>
                <p className="mt-3.5 text-sm leading-7 text-tertiary">
                  بين ملفات الإكسيل والورد والواتساب ومجلدات بدون ترتيب واضح
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-slate-50/70 p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-2.5 text-lg font-bold text-primary">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h3>مواعيد ضائعة</h3>
                </div>
                <p className="mt-3.5 text-sm leading-7 text-tertiary">
                  جلسات ومتابعات موزعة بين الأجندة والهاتف وذاكرة الفريق
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-slate-50/70 p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-2.5 text-lg font-bold text-primary">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h3>أتعاب غير محصلة</h3>
                </div>
                <p className="mt-3.5 text-sm leading-7 text-tertiary">
                  لأن المدفوعات والمصروفات لا تظهر بجانب القضية نفسها
                </p>
              </article>
            </div>

            <p className="mx-auto mt-12 max-w-3xl text-center text-xl font-bold leading-9 text-primary">
              سياق يجمع كل هذا في مكان واحد وبكل بساطة
            </p>
          </div>
        </section>

        {/* FEATURES SHOWCASE SECTION */}
        <section id="features" className="bg-slate-50/60 py-16 md:py-24 border-y border-border">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-12 max-w-3xl">
              <h2 className="text-3xl font-black leading-tight text-primary md:text-5xl font-headline">
                كل أدوات مكتبك في واجهة واحدة
              </h2>
              <p className="mt-4 text-base leading-8 text-tertiary">
                محاور عملية تغطي تشغيل مكتب المحاماة اليومي: قضايا وجلسات ومواعيد وتنبيهات ومهام وموكلين وماليات بدون
                تنقل بين ملفات وتطبيقات
              </p>
            </div>

            {/* Feature 1: Dashboard */}
            <div className="grid gap-10">
              <article className="rounded-2xl border border-border bg-white p-6 md:p-10 shadow-sm grid items-center gap-8 lg:grid-cols-2">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-secondary/15 text-primary">
                      <ChartColumn className="w-6 h-6 text-secondary" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/75">لوحة التحكم</span>
                  </div>
                  <h3 className="text-2xl font-black leading-tight text-primary md:text-3xl font-headline">
                    الصورة الكاملة لمكتبك في لمحة
                  </h3>
                  <ul className="mt-6 grid gap-3.5 text-sm leading-7 text-primary/85">
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>متابعات اليوم والأسبوع فورًا عند الدخول للوحة التحكم</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>القضايا المتأخرة والمواعيد القانونية والطعون القادمة</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>مؤشرات أداء المكتب والأتعاب المحصلة والمتبقية بشكل مرئي وواضح</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link
                      to="/firm/dashboard"
                      className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:underline"
                    >
                      استكشف لوحة التحكم الحية &larr;
                    </Link>
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 bg-slate-50 p-2 shadow-xs">
                  <DashboardMockup />
                </div>
              </article>

              {/* Feature 2: Case Management */}
              <article className="rounded-2xl border border-border bg-white p-6 md:p-10 shadow-sm grid items-center gap-8 lg:grid-cols-2">
                <div className="lg:order-2">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-secondary/15 text-primary">
                      <BriefcaseBusiness className="w-6 h-6 text-secondary" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/75">إدارة القضايا</span>
                  </div>
                  <h3 className="text-2xl font-black leading-tight text-primary md:text-3xl font-headline">
                    كل ما يخص القضية في مكان واحد
                  </h3>
                  <ul className="mt-6 grid gap-3.5 text-sm leading-7 text-primary/85">
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>جلسات ومواعيد مرتبطة تلقائيًا بكل قضية برقم الدعوى والرول</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>مهام ومذكرات للفريق داخل القضية نفسها مع متابعة الإنجاز</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>مستندات وتوكيلات وأحكام منظمة دون فوضى</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link
                      to="/firm/cases"
                      className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:underline"
                    >
                      عرض جدول القضايا ونموذج الإضافة &larr;
                    </Link>
                  </div>
                </div>
                <div className="lg:order-1 rounded-xl border border-border/70 bg-slate-50 p-2 shadow-xs">
                  <CaseManagementMockup />
                </div>
              </article>

              {/* Feature 3: Client Directory */}
              <article className="rounded-2xl border border-border bg-white p-6 md:p-10 shadow-sm grid items-center gap-8 lg:grid-cols-2">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-secondary/15 text-primary">
                      <UserRound className="w-6 h-6 text-secondary" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/75">إدارة الموكلين</span>
                  </div>
                  <h3 className="text-2xl font-black leading-tight text-primary md:text-3xl font-headline">
                    سجل كامل لكل موكل في ثوانٍ
                  </h3>
                  <ul className="mt-6 grid gap-3.5 text-sm leading-7 text-primary/85">
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>بيانات الموكل وأرقام الهواتف وكافة قضاياه في مكان واحد</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>أرشيف إلكتروني لكافة مستندات وعقود وتوكيلات الموكل</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>ربط تلقائي بين الموكل وقضاياه وموقف سداد أتعابه</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link
                      to="/firm/clients"
                      className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:underline"
                    >
                      استعراض دليل الموكلين &larr;
                    </Link>
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 bg-slate-50 p-2 shadow-xs">
                  <ClientManagementMockup />
                </div>
              </article>

              {/* Feature 4: Court Sessions */}
              <article className="rounded-2xl border border-border bg-white p-6 md:p-10 shadow-sm grid items-center gap-8 lg:grid-cols-2">
                <div className="lg:order-2">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-secondary/15 text-primary">
                      <CalendarCheck2 className="w-6 h-6 text-secondary" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/75">الجلسات والمواعيد</span>
                  </div>
                  <h3 className="text-2xl font-black leading-tight text-primary md:text-3xl font-headline">
                    مواعيد جلساتك منظمة بدقة
                  </h3>
                  <ul className="mt-6 grid gap-3.5 text-sm leading-7 text-primary/85">
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>تسجيل المحكمة والدائرة وتاريخ الجلسة ورقم الرول تلقائياً</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>عرض المواعيد القادمة والمتأخرة بوضوح مع شارات تنبيه ذكية</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-secondary"></span>
                      <span>متابعة قرارات الجلسات وتوليد رول المحكمة اليومي المطبوع</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link
                      to="/firm/sessions"
                      className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:underline"
                    >
                      معاينة رول الجلسات &larr;
                    </Link>
                  </div>
                </div>
                <div className="lg:order-1 rounded-xl border border-border/70 bg-slate-50 p-2 shadow-xs">
                  <SessionsMockup />
                </div>
              </article>
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/firm/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-secondary bg-white px-8 py-3.5 text-sm font-bold text-primary hover:bg-secondary/10 transition-all shadow-xs group"
              >
                <span>استكشف كافة مميزات وأدوات سياق في النسخة الحية</span>
                <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* MOBILE APP SECTION */}
        <section
          id="mobile"
          className="overflow-hidden border-y border-border bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_62%)] py-16 md:py-24"
        >
          <div className="max-w-6xl mx-auto px-4 grid items-center gap-12 lg:grid-cols-[1fr_0.75fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-secondary/35 bg-secondary/15 px-3 py-1.5 text-xs font-bold text-primary">
                <Smartphone className="w-4 h-4 text-secondary" />
                <span>النسخة الاختبارية متاحة الآن</span>
              </div>
              <h2 className="text-3xl font-black leading-tight text-primary md:text-5xl font-headline">
                مكتبك معك أينما ذهبت
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-tertiary md:text-lg">
                تابع القضايا والجلسات والموكلين وسجّل نتائج عملك من الموبايل حتى بدون إنترنت مع مزامنة تلقائية وآمنة مع
                نظام المكتب
              </p>

              <div className="mt-8 grid gap-3.5 text-sm font-bold text-primary sm:grid-cols-2">
                <span className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-secondary stroke-[3] shrink-0" />
                  يعمل بكامل المميزات بدون إنترنت
                </span>
                <span className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-secondary stroke-[3] shrink-0" />
                  متاح حاليًا للاختبار عبر Google Play
                </span>
                <span className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-secondary stroke-[3] shrink-0" />
                  مزامنة مباشرة مع فريق المكتب
                </span>
                <span className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-secondary stroke-[3] shrink-0" />
                  جلسات وتنبيهات وملفات في جيبك
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => showToast("سيتم إرسال رابط تطبيق Google Play إلى بريدك")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 shadow-md transition-all"
                >
                  <span>اطلب رابط اختبار التطبيق</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
                <a
                  href="#features"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-white px-6 py-3 text-sm font-bold text-primary hover:border-primary/40 hover:bg-slate-50 transition-all"
                >
                  استكشف تفاصيل النظام
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full flex justify-center">
              <div className="absolute inset-4 rounded-full bg-secondary/20 blur-3xl" aria-hidden="true" />
              <PhoneMockup />
            </div>
          </div>
        </section>

        {/* ONBOARDING STEPS ("ابدأ بدون تعقيد") */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-black leading-tight text-primary md:text-5xl font-headline">
                ابدأ بدون تعقيد
              </h2>
              <p className="mt-4 text-base leading-8 text-tertiary">
                الإعداد الأول مصمم ليكون قصيرًا وواضحًا ثم تبدأ تشغيل المكتب خطوة بخطوة
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <article className="rounded-2xl border border-border bg-white p-7 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-white">
                    1
                  </span>
                  <h3 className="text-xl font-bold text-primary">أنشئ حسابك</h3>
                </div>
                <p className="mt-3.5 text-sm leading-7 text-tertiary">
                  افتح الحساب في دقيقتين وادخل بياناتك الأساسية بدون تعقيدات
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-white p-7 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-white">
                    2
                  </span>
                  <h3 className="text-xl font-bold text-primary">أضف مكتبك وفريقك</h3>
                </div>
                <p className="mt-3.5 text-sm leading-7 text-tertiary">
                  حدد الأدوار والصلاحيات لكل فرد داخل المكتب (محامي أساسي، باحث، مساعد)
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-white p-7 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-white">
                    3
                  </span>
                  <h3 className="text-xl font-bold text-primary">ابدأ بأول قضية</h3>
                </div>
                <p className="mt-3.5 text-sm leading-7 text-tertiary">
                  سجل الموكل والقضية واترك سياق يتابع تفاصيل الجلسات والمدد القانونية
                </p>
              </article>
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/firm/dashboard"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white hover:bg-slate-800 shadow-md transition-all"
              >
                ابدأ تجربتك المجانية الآن
              </Link>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="bg-slate-50/60 py-16 md:py-24 border-t border-border">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-black leading-tight text-primary md:text-5xl font-headline">الأسعار</h2>
                <p className="mt-4 text-base leading-8 text-tertiary">
                  باقات واضحة تناسب حجم مكتبك مع تجربة مجانية قبل اختيار الاشتراك المناسب
                </p>
              </div>

              {/* Monthly / Yearly Toggle */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-white border border-border shadow-xs self-start md:self-auto">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    billingCycle === "monthly" ? "bg-primary text-white shadow-xs" : "text-slate-600 hover:text-primary"
                  }`}
                >
                  الدفع الشهري
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    billingCycle === "yearly" ? "bg-primary text-white shadow-xs" : "text-slate-600 hover:text-primary"
                  }`}
                >
                  <span>الدفع السنوي</span>
                  <span className="text-[10px] bg-secondary text-primary font-black px-1.5 py-0.5 rounded-full">
                    توفير 15%
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Pricing Cards */}
            <div className="grid gap-6 lg:grid-cols-3 items-stretch">
              {/* Solo Plan */}
              <article className="relative flex flex-col rounded-2xl border border-border bg-white shadow-xs transition-all hover:border-secondary">
                <div className="border-b border-border p-6">
                  <h3 className="text-base font-bold text-primary">باقة المحامي الفردي</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary">
                      {billingCycle === "monthly" ? "500" : "425"}
                    </span>
                    <span className="text-xs font-semibold text-tertiary">ج.م / شهر</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <span className="text-[11px] text-emerald-700 font-bold mt-1 block">5,100 ج.م تُدفع سنوياً</span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-6 p-6">
                  <p className="text-xs font-semibold leading-relaxed text-tertiary">
                    للمحامي المستقل والمكاتب الصغيرة التي تريد تنظيم العمل بسهولة
                  </p>

                  <div>
                    <p className="mb-3 text-xs font-bold text-primary/75">العمليات الأساسية</p>
                    <ul className="grid gap-2.5 text-xs">
                      <li className="flex items-center gap-2 text-primary font-medium">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>قضايا غير محدودة</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary font-medium">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>موكلين غير محدودين</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary font-medium">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>جلسات ومهام ومواعيد غير محدودة</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-bold text-primary/75">فريق العمل والتخزين</p>
                    <ul className="grid gap-2.5 text-xs">
                      <li className="flex items-center gap-2 text-primary">
                        <Users className="w-4 h-4 text-tertiary shrink-0" />
                        <span>2 مستخدم</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary">
                        <Database className="w-4 h-4 text-tertiary shrink-0" />
                        <span>5 جيجابايت</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary">
                        <ListPlus className="w-4 h-4 text-tertiary shrink-0" />
                        <span>5 حقول مخصصة</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-bold text-primary/75">الأمان والرقابة</p>
                    <ul className="grid gap-2.5 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2 line-through opacity-60">
                        <CircleX className="w-4 h-4 shrink-0" />
                        <span>سجل تدقيق كامل</span>
                      </li>
                      <li className="flex items-center gap-2 line-through opacity-60">
                        <CircleX className="w-4 h-4 shrink-0" />
                        <span>إنشاء أدوار مخصصة للفريق</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-auto pt-4">
                    <Link
                      to="/firm/dashboard"
                      className="w-full inline-flex min-h-11 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
                    >
                      ابدأ تجربتك المجانية
                    </Link>
                  </div>
                </div>
              </article>

              {/* Firm Plan (Recommended) */}
              <article className="relative flex flex-col rounded-2xl border-2 border-secondary bg-white shadow-xl lg:-mt-3 lg:mb-3">
                <div className="absolute -top-3.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2">
                  <div className="inline-flex items-center whitespace-nowrap rounded-full bg-secondary px-3.5 py-1 text-xs font-black text-primary shadow-sm">
                    الخيار الموصى به للمكاتب
                  </div>
                </div>

                <div className="border-b border-border p-6 pt-8">
                  <h3 className="text-base font-bold text-primary">باقة المكاتب المتوسطة</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary">
                      {billingCycle === "monthly" ? "1,400" : "1,190"}
                    </span>
                    <span className="text-xs font-semibold text-tertiary">ج.م / شهر</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <span className="text-[11px] text-emerald-700 font-bold mt-1 block">14,280 ج.م تُدفع سنوياً</span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-6 p-6">
                  <p className="text-xs font-semibold leading-relaxed text-tertiary">
                    للمكاتب التي تدير فريقًا وتحتاج صلاحيات ورقابة اكثر
                  </p>

                  <div>
                    <p className="mb-3 text-xs font-bold text-primary/75">العمليات الأساسية</p>
                    <ul className="grid gap-2.5 text-xs">
                      <li className="flex items-center gap-2 text-primary font-medium">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>قضايا غير محدودة</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary font-medium">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>موكلين غير محدودين</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary font-medium">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>جلسات ومهام ومواعيد غير محدودة</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-bold text-primary/75">فريق العمل والتخزين</p>
                    <ul className="grid gap-2.5 text-xs">
                      <li className="flex items-center gap-2 text-primary font-semibold">
                        <Users className="w-4 h-4 text-secondary shrink-0" />
                        <span>حتى 10 مستخدمين</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary font-semibold">
                        <Database className="w-4 h-4 text-secondary shrink-0" />
                        <span>50 جيجابايت مساحة سحابية</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary font-semibold">
                        <ListPlus className="w-4 h-4 text-secondary shrink-0" />
                        <span>حقول مخصصة غير محدودة</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-bold text-primary/75">الأمان والرقابة</p>
                    <ul className="grid gap-2.5 text-xs text-primary">
                      <li className="flex items-center gap-2 font-semibold">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>سجل تدقيق كامل للأنشطة</span>
                      </li>
                      <li className="flex items-center gap-2 font-semibold">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>إنشاء أدوار مخصصة للفريق</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-auto pt-4">
                    <Link
                      to="/firm/dashboard"
                      className="w-full inline-flex min-h-11 items-center justify-center rounded-xl bg-secondary text-primary text-xs font-black hover:bg-amber-400 transition-all shadow-sm"
                    >
                      ابدأ تجربتك المجانية
                    </Link>
                  </div>
                </div>
              </article>

              {/* Large Enterprise Plan */}
              <article className="relative flex flex-col rounded-2xl border border-border bg-white shadow-xs transition-all hover:border-secondary">
                <div className="border-b border-border p-6">
                  <h3 className="text-base font-bold text-primary">باقة المكاتب الكبيرة</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary">
                      {billingCycle === "monthly" ? "3,700" : "3,145"}
                    </span>
                    <span className="text-xs font-semibold text-tertiary">ج.م / شهر</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <span className="text-[11px] text-emerald-700 font-bold mt-1 block">37,740 ج.م تُدفع سنوياً</span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-6 p-6">
                  <p className="text-xs font-semibold leading-relaxed text-tertiary">
                    للمكاتب الكبيرة التي تحتاج مساحة أكبر وعدد مستخدمين أكثر
                  </p>

                  <div>
                    <p className="mb-3 text-xs font-bold text-primary/75">العمليات الأساسية</p>
                    <ul className="grid gap-2.5 text-xs">
                      <li className="flex items-center gap-2 text-primary font-medium">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>قضايا غير محدودة</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary font-medium">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>موكلين غير محدودين</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary font-medium">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>جلسات ومهام ومواعيد غير محدودة</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-bold text-primary/75">فريق العمل والتخزين</p>
                    <ul className="grid gap-2.5 text-xs">
                      <li className="flex items-center gap-2 text-primary">
                        <Users className="w-4 h-4 text-tertiary shrink-0" />
                        <span>حتى 30 مستخدم</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary">
                        <Database className="w-4 h-4 text-tertiary shrink-0" />
                        <span>150 جيجابايت</span>
                      </li>
                      <li className="flex items-center gap-2 text-primary">
                        <ListPlus className="w-4 h-4 text-tertiary shrink-0" />
                        <span>حقول مخصصة غير محدودة</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-bold text-primary/75">الأمان والرقابة</p>
                    <ul className="grid gap-2.5 text-xs text-primary">
                      <li className="flex items-center gap-2 font-medium">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>سجل تدقيق كامل</span>
                      </li>
                      <li className="flex items-center gap-2 font-medium">
                        <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>إنشاء أدوار مخصصة للفريق</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-auto pt-4">
                    <Link
                      to="/firm/dashboard"
                      className="w-full inline-flex min-h-11 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
                    >
                      ابدأ تجربتك المجانية
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            <p className="mt-8 text-center text-xs font-bold text-tertiary">
              14 يوم مجانًا · بدون بطاقة دفع · إلغاء في أي وقت
            </p>
          </div>
        </section>

        {/* FIRST WEEK EXPERIENCE */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-black leading-tight text-primary md:text-5xl font-headline">
                كيف يساعدك سياق في أول أسبوع؟
              </h2>
              <p className="mt-4 text-base leading-8 text-tertiary">
                أمثلة عملية توضّح كيف يبدأ المكتب في تنظيم القضايا والمواعيد والمدفوعات من الأسبوع الأول
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <article className="rounded-2xl border border-border bg-slate-50/50 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
                  <span className="text-xs font-black text-secondary bg-secondary/15 px-2 py-0.5 rounded-lg">01</span>
                  أضف أول موكل وقضية
                </h3>
                <p className="mt-3 text-sm leading-7 text-tertiary">
                  اسم الموكل وبياناته ورقم القضية وحالتها في سجل واحد خلال دقائق
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-slate-50/50 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
                  <span className="text-xs font-black text-secondary bg-secondary/15 px-2 py-0.5 rounded-lg">02</span>
                  تابع أول جلسة وميعاد
                </h3>
                <p className="mt-3 text-sm leading-7 text-tertiary">
                  حدد تاريخ الجلسة وسيظهر الموعد داخل القضية ولوحة اليوم
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-slate-50/50 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
                  <span className="text-xs font-black text-secondary bg-secondary/15 px-2 py-0.5 rounded-lg">03</span>
                  سجل أول دفعة ومصروف
                </h3>
                <p className="mt-3 text-sm leading-7 text-tertiary">
                  أضف الأتعاب والمدفوع والمتبقي حتى لا تغلق القضية بدون تحصيل
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="py-16 md:py-24 bg-slate-50/60 border-t border-border">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-primary md:text-4xl font-headline">الأسئلة الشائعة</h2>
              <p className="mt-3 text-sm text-tertiary">كل ما تريد معرفته عن نظام سياق قبل البدء</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-start font-bold text-sm text-primary hover:text-secondary transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-600 border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT / SUPPORT SECTION */}
        <section id="contact" className="py-16 md:py-20 bg-white border-t border-border">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary mx-auto mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-primary md:text-3xl font-headline">
              هل لديك استفسار خاص بمكتبك؟
            </h2>
            <p className="mt-3 text-sm text-tertiary max-w-xl mx-auto">
              فريق الدعم الفني والاستشاريين القانونيين في سياق متاحون على مدار الساعة لمساعدتك في تهيئة النظام لمكتبك
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-2.5 text-xs font-bold text-primary hover:bg-slate-50 transition-colors"
              >
                <span>نسخ البريد: support@siyaq.legal</span>
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <a
                href="https://wa.me/201023456789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-bold transition-colors shadow-sm"
              >
                <span>تحدث معنا عبر واتساب</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION BANNER */}
        <section className="bg-primary py-16 text-white md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black leading-tight md:text-5xl font-headline">
              جرّب سياق لمدة 14 يوم مجانًا
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
              بدون بطاقة دفع · إلغاء في أي وقت · ابدأ تنظيم قضاياك وأتعابك اليوم
            </p>
            <div className="mt-8">
              <Link
                to="/firm/dashboard"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-3 text-sm font-black text-primary hover:bg-amber-400 shadow-lg transition-all group"
              >
                <span>ابدأ تجربتك المجانية الآن</span>
                <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link to="/" className="inline-flex min-w-0 items-center gap-2 rounded-md">
              <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-white">
                <img src="/logo.webp" alt="شعار سياق" width="40" height="40" className="size-full object-cover" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-lg font-black text-primary font-headline">سِـيَـاق</span>
                <span className="mt-1 text-xs font-medium text-tertiary">نظام لإدارة مكاتب المحاماة</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-xs leading-6 text-tertiary">
              نظام لإدارة مكاتب المحاماة يجمع القضايا، الموكلين، الجلسات، والمالية في مكان واحد
            </p>
            <p className="mt-3 text-xs text-tertiary flex items-center gap-2">
              <span>البريد الإلكتروني:</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="font-bold text-primary hover:text-secondary inline-flex items-center gap-1 font-mono"
              >
                <span>support@siyaq.legal</span>
                <Copy className="w-3 h-3" />
              </button>
            </p>
            <p className="mt-4 text-xs text-slate-400">© 2026 سياق — جميع الحقوق محفوظة</p>
          </div>

          <div className="grid gap-8 text-xs md:min-w-[500px] grid-cols-2 sm:grid-cols-3">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-3">الصفحات</h4>
              <div className="grid gap-2.5 font-semibold text-primary/80">
                <a href="#why" className="hover:text-primary">لماذا سياق؟</a>
                <a href="#features" className="hover:text-primary">المميزات</a>
                <a href="#mobile" className="hover:text-primary">تطبيق الموبايل</a>
                <a href="#pricing" className="hover:text-primary">الأسعار</a>
                <a href="#contact" className="hover:text-primary">تواصل معنا</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-3">النظام والتطبيق</h4>
              <div className="grid gap-2.5 font-semibold text-primary/80">
                <Link to="/firm/dashboard" className="hover:text-primary">لوحة التحكم</Link>
                <Link to="/firm/cases" className="hover:text-primary">إدارة القضايا</Link>
                <Link to="/firm/sessions" className="hover:text-primary">رول الجلسات</Link>
                <Link to="/firm/billing" className="hover:text-primary">التقرير المالي</Link>
                <Link to="/login" className="hover:text-primary">تسجيل الدخول</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-3">تابعنا</h4>
              <div className="grid gap-2.5 font-semibold text-primary/80">
                <a
                  href="https://www.facebook.com/siyaq.legal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Facebook
                </a>
                <a
                  href="https://twitter.com/siyaqlegal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Twitter / X
                </a>
                <a
                  href="https://linkedin.com/company/siyaqlegal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
