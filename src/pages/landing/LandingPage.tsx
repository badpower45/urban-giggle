import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Gavel,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  Users,
  Briefcase,
  Calendar,
  Clock,
  Smartphone,
  WifiOff,
  Building2,
  FileText,
  Star,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Layers,
  Copy,
  Lock,
  MessageSquare,
  Phone,
  Mail,
  Zap,
  DollarSign,
  Scale,
  Send,
  Database,
  Search,
} from 'lucide-react';
import {
  DashboardMockup,
  CaseManagementMockup,
  SessionsMockup,
} from './components/Mockups';
import { LandingContactForm } from './components/LandingContactForm';
import { usePlatformStore } from '../../lib/platformStore';
import { useToast } from '../../components/common/Toast';

// Lightweight Viewport Reveal Component for Butter-Smooth Scroll Animations
const RevealOnScroll: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '40px' }
    );
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Egyptian Appeals Procedural Definitions
interface AppealRule {
  id: string;
  name: string;
  days: number;
  courtType: string;
  lawReference: string;
  description: string;
  badge: string;
}

const EGYPTIAN_APPEAL_RULES: AppealRule[] = [
  {
    id: 'civil_appeal',
    name: 'استئناف الأحكام المدنية والتجارية الابتدائية',
    days: 40,
    courtType: 'محكمة الاستئناف العالي',
    lawReference: 'المادة 227 من قانون المرافعات المدنية والتجارية',
    description: 'ميعاد استئناف الأحكام الصادرة في المواد المدنية والتجارية من المحاكم الابتدائية كدرجة أولى.',
    badge: '٤٠ يوماً',
  },
  {
    id: 'urgent_appeal',
    name: 'استئناف أحكام القضاء المستعجل والأوامر الوقتية',
    days: 15,
    courtType: 'دائرة مستأنف مستعجل',
    lawReference: 'المادة 227 من قانون المرافعات',
    description: 'ميعاد خاص وموجز للطعن بالاستئناف في الأحكام المستعجلة لسرعة الفصل وحماية المراكز الوقتية.',
    badge: '١٥ يوماً',
  },
  {
    id: 'civil_cassation',
    name: 'طعن بالنقض في الأحكام المدنية والتجارية',
    days: 60,
    courtType: 'محكمة النقض (دار القضاء العالي)',
    lawReference: 'المادة 252 من قانون المرافعات',
    description: 'ميعاد الطعن بطريق النقض للأحكام الصادرة من محاكم الاستئناف العالي كدرجة نهائية.',
    badge: '٦٠ يوماً',
  },
  {
    id: 'misdemeanor_appeal',
    name: 'استئناف أحكام الجنح والمخالفات الجنائية',
    days: 10,
    courtType: 'محكمة الجنح المستأنفة',
    lawReference: 'المادة 406 من قانون الإجراءات الجنائية',
    description: 'ميعاد استئناف الحكم الصادر في جنحة حضورياً أو من تاريخ انقضاء ميعاد المعارضة.',
    badge: '١٠ أيام',
  },
  {
    id: 'misdemeanor_opposition',
    name: 'معارضة في حكم جنحة غيابي',
    days: 10,
    courtType: 'محكمة الجنح الجزئية',
    lawReference: 'المادة 398 من قانون الإجراءات الجنائية',
    description: 'ميعاد المعارضة في الحكم الغيابي الصادر ضد المتهم من تاريخ إعلانه رسمياً بالحكم.',
    badge: '١٠ أيام',
  },
  {
    id: 'criminal_cassation',
    name: 'طعن بالنقض الجنائي (جنح مستأنف / جنايات)',
    days: 60,
    courtType: 'محكمة النقض (الدائرة الجنائية)',
    lawReference: 'المادة 34 من القانون 57 لسنة 1959 بشأن إجراءات الطعن أمام محكمة النقض',
    description: 'ميعاد التقرير بالطعن بالنقض وإيداع مذكرة الأسباب موقعة من محامٍ مقبول أمام النقض.',
    badge: '٦٠ يوماً',
  },
  {
    id: 'state_council_annulment',
    name: 'دعوى إلغاء قرار إداري (مجلس الدولة)',
    days: 60,
    courtType: 'محكمة القضاء الإداري',
    lawReference: 'المادة 24 من قانون مجلس الدولة رقم 47 لسنة 1972',
    description: 'ميعاد رفع دعوى الإلغاء ضد القرارات الإدارية من تاريخ النشر أو الإعلان أو البت في التظلم.',
    badge: '٦٠ يوماً',
  },
];

export const LandingPage: React.FC = () => {
  const { showToast } = useToast();
  const { settings, plans } = usePlatformStore();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [activePreviewTab, setActivePreviewTab] = useState<'dashboard' | 'sessions' | 'cases'>('dashboard');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  // Interactive Calculator State
  const [selectedRuleId, setSelectedRuleId] = useState<string>(EGYPTIAN_APPEAL_RULES[0].id);
  const [rulingDate, setRulingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [copiedMemo, setCopiedMemo] = useState(false);

  // FAQ Open States
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Selected Rule Object
  const currentRule = useMemo(() => {
    return EGYPTIAN_APPEAL_RULES.find((r) => r.id === selectedRuleId) || EGYPTIAN_APPEAL_RULES[0];
  }, [selectedRuleId]);

  // Calculated Appeal Deadline
  const deadlineInfo = useMemo(() => {
    if (!rulingDate) return null;
    const base = new Date(rulingDate);
    const deadline = new Date(base.getTime() + currentRule.days * 24 * 60 * 60 * 1000);
    const dayOfWeek = deadline.getDay(); // 5 = Friday, 6 = Saturday

    let adjusted = new Date(deadline);
    let isWeekendExtended = false;

    // Under Egyptian Civil Procedures Law (Article 18), holiday extension to Sunday
    if (dayOfWeek === 5) {
      adjusted.setDate(adjusted.getDate() + 2); // Friday -> Sunday
      isWeekendExtended = true;
    } else if (dayOfWeek === 6) {
      adjusted.setDate(adjusted.getDate() + 1); // Saturday -> Sunday
      isWeekendExtended = true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = adjusted.getTime() - today.getTime();
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      deadlineDate: deadline.toISOString().split('T')[0],
      adjustedDate: adjusted.toISOString().split('T')[0],
      isWeekendExtended,
      remainingDays,
      isExpired: remainingDays < 0,
      formattedDate: adjusted.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  }, [rulingDate, currentRule]);

  // Copy Legal Memo to Clipboard
  const handleCopyLegalReport = () => {
    if (!deadlineInfo) return;
    const reportText = `📌 [مذكرة إجرائية بميعاد الطعن القضائي - منصة ${settings.systemName}]
⚖️ نوع الطعن: ${currentRule.name}
🏛️ الاختصاص القضائي: ${currentRule.courtType}
📜 السند القانوني: ${currentRule.lawReference}
📅 تاريخ صدور الحكم / الإعلان: ${rulingDate}
⏳ مدة الطعن القانونية: ${currentRule.days} يوماً
🎯 آخر موعد قانوني لرفع الطعن: ${deadlineInfo.formattedDate}
${deadlineInfo.isWeekendExtended ? '⚠️ تنبيه إجرائي: صادف الميعاد عطلة رسمية فامتد لليوم العمل التالي طبقاً للمادة 18 مرافعات.\n' : ''}
⚡ الأيام المتبقية لاتخاذ الإجراء: ${deadlineInfo.remainingDays > 0 ? `${deadlineInfo.remainingDays} يوماً` : 'انقضى الميعاد'}`;

    navigator.clipboard.writeText(reportText);
    setCopiedMemo(true);
    showToast('تم نسخ المذكرة الإجرائية بنجاح إلى الحافظة!', 'success');
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  // WhatsApp Share Handler
  const handleShareWhatsApp = () => {
    if (!deadlineInfo) return;
    const msg = encodeURIComponent(
      `⚖️ *إخطار رسمي بميعاد طعن قضائي - مكتب المحاماة*\n\n` +
      `*نوع الإجراء:* ${currentRule.name}\n` +
      `*المحكمة المختصة:* ${currentRule.courtType}\n` +
      `*تاريخ الحكم:* ${rulingDate}\n` +
      `*آخر موعد لرفع الطعن:* ${deadlineInfo.formattedDate}\n` +
      `*المدة المتبقية:* ${deadlineInfo.remainingDays} يوماً\n` +
      `*السند:* ${currentRule.lawReference}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  // Testimonials
  const testimonials = [
    {
      quote:
        'نظام بصيرة أنهى تماماً هاجس سقوط مواعيد الطعون في قضايا الجنايات والاستئناف. حاسبة المواعيد ورول الجلسات الذي يعمل أوفلاين في المحكمة غيرا طريقة عمل مكتبنا بالكامل.',
      author: 'المستشار د. فاروق الرفاعي',
      role: 'محامٍ بالنقض ومحكّم دولي مقيد',
      location: 'مكتب الرفاعي للمحاماة • القاهرة',
      firmType: 'باقة المكاتب الكبرى',
    },
    {
      quote:
        'ميزة العزل السحابي المتعدد التام تعطينا طمأنينة مطلقة على أسرار عملائنا من الشركات والمؤسسات. كما أن تسجيل قرارات الجلسات داخل قاعة المحكمة وفر ساعات من العمل اليومي.',
      author: 'الأستاذة / نهال عبد المنعم',
      role: 'شريكة متخصصة في المنازعات التجارية',
      location: 'مجموعة العدالة للاستشارات • الإسكندرية',
      firmType: 'باقة المكاتب المتوسطة',
    },
    {
      quote:
        'التطبيق الميداني في يد المحامي الشاب بالمحكمة، وربطه المباشر بأجندة المكتب والتقارير المالية جعل متابعة أكثر من 150 قضية أسهل من متابعة 10 قضايا بالطريقة القديمة.',
      author: 'الأستاذ / حازم خفاجة',
      role: 'مؤسس مكتب خفاجة للدعاوى المدنية والضرائب',
      location: 'خفاجة وشركاه • الجيزة',
      firmType: 'باقة المكاتب الكبرى',
    },
  ];

  // FAQs
  const faqs = [
    {
      q: 'هل بيانات قضايا وموكلي مكتبي معزولة تماماً عن أي مكاتب أخرى؟',
      a: 'نعم، بكل تأكيد. تم بناء منصة بصيرة على معمارية العزل السحابي متعدد المكاتب (Multi-Tenant Isolation) وقواعد أمنية صارمة على مستوى الصفوف (Row Level Security)، مما يضمن استحالة وصول أي مكتب آخر أو مستخدم خارجي إلى سجلاتك أو مستنداتك القانونية.',
    },
    {
      q: 'كيف يعمل تطبيق بصيرة في قاعات المحاكم وأماكن انقطاع الإنترنت؟',
      a: 'يحتوي تطبيق بصيرة على محرك محلي مدمج فائق السرعة (Offline-First Engine) يعتمد على SQLite. يمكنك تصفح رول الجلسات، وقراءة قرارات المحكمة السابقة، وتسجيل القرار الجديد بالكامل داخل قبو المحكمة. وفور التقاط الهاتف للشبكة، تتم المزامنة تلقائياً وبأمان مع خوادم المكتب.',
    },
    {
      q: 'هل يمكن نقل ملفاتنا وقضايانا السابقة من شيتات Excel بسهولة؟',
      a: 'نعم، يوفر النظام أداة استيراد ذكية تمكّنك من رفع ملفات القضايا والموكلين والجلسات بضغطة زر واحدة، مع مساعدة فريق الدعم الفني في تجهيز ونقل بيانات مكتبك بالكامل خلال ساعات.',
    },
    {
      q: 'ما هي طرق الدفع المتاحة للاشتراك السنوي والشهري؟',
      a: 'ندعم كافة وسائل السداد المحلية في مصر: انستا باي (InstaPay)، التحويل البنكي المباشر، بطاقات ميزة وفيزا وماستركارد، ومحافظ الهاتف المحمول (فودافون كاش وغيرها)، مع إصدار فواتير إلكترونية رسمية باسم مكتبك أو شركتك.',
    },
    {
      q: 'هل أحتاج لإدخال بطاقة بنكية لبدء التجربة المجانية؟',
      a: 'لا، إطلاقاً! تبدأ التجربة المجانية لمدة 14 يوماً بكامل مزايا النظام بضغطة زر واحدة دون الحاجة لأي بطاقة بنكية أو التزام مالي مسبق.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden relative" dir="rtl">
      {/* 100% Hardware-Accelerated Ambient Light Mesh (Zero Gaussian Blur Overhead for 120 FPS Scrolling) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,rgba(37,99,235,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_35%,rgba(245,158,11,0.07),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_75%,rgba(99,102,241,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      {/* =========================================================================
          FLOATING SLICK HEADER
         ========================================================================= */}
      <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 py-3 transition-all">
        <div className="max-w-7xl mx-auto rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl shadow-black/40">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              ⚖️
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white font-headline tracking-wide">
                  {settings.systemName}
                </span>
                <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                  SaaS 3.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:block">
                المنظومة السحابية للمحاكم والمحامين
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-amber-400 transition-colors">
              المميزات والمنظومة
            </a>
            <a href="#calculator" className="hover:text-amber-400 transition-colors flex items-center gap-1 text-amber-300 font-bold">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>حاسبة الطعون القضائية</span>
            </a>
            <a href="#courtroom" className="hover:text-amber-400 transition-colors">
              وضع المحكمة أوفلاين
            </a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">
              باقات الاشتراك
            </a>
            <a href="#faq" className="hover:text-amber-400 transition-colors">
              الأسئلة الشائعة
            </a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">
              طلب ديمو
            </a>
          </nav>

          {/* Action CTAs (Dual Logins + Free Trial) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-amber-400/90 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all hover:scale-105 active:scale-95"
              title="بوابة دخول الإدارة المركزية للمنصة"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">دخول الإدارة</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>دخول المكاتب</span>
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>ابدأ مجاناً</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-28 sm:pt-36 space-y-24 sm:space-y-32">
        {/* =========================================================================
            SECTION 1: HERO SECTION
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Right Column: Hero Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-start animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>المنظومة السحابية المعتمدة للمحاكم المصرية • الإصدار 3.0</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-headline leading-[1.2] tracking-tight">
                إدارة مكاتب المحاماة في مصر{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  بدقة الحساب وحصانة السرية
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                منظومة سحابية متكاملة مصممة خصيصاً للمحاماة المصرية: رول الجلسات اليومي، احتساب مواعيد الطعون طبقاً للمرافعات والإجراءات الجنائية، تسجيل قرارات الجلسة داخل قاعة المحكمة أوفلاين، وعزل سحابي تام لحصانة كل مكتب.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/register"
                  className="h-12 px-7 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ابدأ تجربتك المجانية ١٤ يوماً</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>

                <a
                  href="#calculator"
                  className="h-12 px-6 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 hover:text-white transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>جرب حاسبة المواعيد الإجرائية</span>
                </a>

                <a
                  href="#contact"
                  className="h-12 px-5 rounded-xl font-semibold text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <span>طلب ديمو للمكتب</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Micro Proof Chips */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>بدون بطاقة بنكية</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>مزامنة أوفلاين في قاعة المحكمة</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>عزل سحابي متعدد المكاتب RLS</span>
                </span>
              </div>
            </div>

            {/* Left Column: Interactive Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl border border-slate-800 bg-[#0d1424] p-4 sm:p-5 shadow-2xl shadow-black/80">
                {/* Floating Preview Switcher */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab('dashboard')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                        activePreviewTab === 'dashboard'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      لوحة التحكم
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab('sessions')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                        activePreviewTab === 'sessions'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      رول الجلسات
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab('cases')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                        activePreviewTab === 'cases'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ملف القضية
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>سحابي متصل</span>
                  </span>
                </div>

                {/* Tab Previews with smooth crossfade */}
                <div className="overflow-hidden rounded-2xl bg-slate-950 border border-slate-800/80 p-1 transition-opacity duration-300">
                  {activePreviewTab === 'dashboard' && <DashboardMockup />}
                  {activePreviewTab === 'sessions' && <SessionsMockup />}
                  {activePreviewTab === 'cases' && <CaseManagementMockup />}
                </div>

                {/* Floating Notification Pill with smooth float animation */}
                <div className="absolute -bottom-5 -start-5 sm:-start-8 bg-slate-900 border border-amber-500/40 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 animate-float-smooth">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                    ⚖️
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">جلسة قادمة: اليوم ١٠:٠٠ ص</span>
                    <span className="text-[10px] text-slate-400">محكمة شمال القاهرة • الدائرة ٧ مدني</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: PROOF & METRICS TICKER
           ========================================================================= */}
        <RevealOnScroll className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-800 bg-[#0c1322] p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-headline font-mono">
                ٥٠٠+
              </span>
              <p className="text-xs text-slate-400 font-semibold">مكتب محاماة ومستشار في مصر</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white font-headline font-mono">
                ١٢٠,٠٠٠+
              </span>
              <p className="text-xs text-slate-400 font-semibold">قضية وجلسة مسجلة بالنظام</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-headline font-mono">
                ٩٩.٩٪
              </span>
              <p className="text-xs text-slate-400 font-semibold">جاهزية وتوافر سحابي</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-blue-400 font-headline font-mono">
                ٠ دقيقة
              </span>
              <p className="text-xs text-slate-400 font-semibold">مواعيد طعن مفقودة بفضل التنبيهات</p>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            SECTION 3: THE EGYPTIAN LEGAL APPEALS CALCULATOR
           ========================================================================= */}
        <RevealOnScroll className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-28 cv-auto">
          <div id="calculator" className="rounded-3xl border border-amber-500/30 bg-[#0c1322] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Scale className="w-3.5 h-3.5" />
                <span>أداة قانونية تفاعلية مجانية</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-headline tracking-tight">
                حاسبة المواعيد الإجرائية والطعون القضائية في القانون المصري
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                حدد نوع الطعن أو الإجراء القضائي وتاريخ صدور الحكم لحساب الميعاد الحتمي بدقة متناهية طبقاً لقانون المرافعات والإجراءات الجنائية مع احتساب العطلات الرسمية.
              </p>
            </div>

            {/* Rule Selector Pills with Hover Effects */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
              {EGYPTIAN_APPEAL_RULES.map((rule) => {
                const isSelected = rule.id === selectedRuleId;
                return (
                  <button
                    key={rule.id}
                    type="button"
                    onClick={() => setSelectedRuleId(rule.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{rule.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                        isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rule.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Calculator Display Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Settings & Inputs */}
              <div className="lg:col-span-5 rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      تاريخ صدور الحكم أو الإعلان الرسمي:
                    </label>
                    <input
                      type="date"
                      value={rulingDate}
                      onChange={(e) => setRulingDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>المحكمة المختصة بنظر الطعن:</span>
                      <span className="font-bold text-white">{currentRule.courtType}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>المدة القانونية الصافية:</span>
                      <span className="font-mono font-bold text-amber-400">{currentRule.days} يوماً</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                      <span className="text-amber-400/90 font-semibold block mb-0.5">السند في القانون المصري:</span>
                      {currentRule.lawReference}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyLegalReport}
                    className="flex-1 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 hover:scale-105 active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{copiedMemo ? 'تم النسخ بنجاح ✓' : 'نسخ المذكرة الإجرائية'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                    title="مشاركة الميعاد إلى واتساب الموكل"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>واتساب</span>
                  </button>
                </div>
              </div>

              {/* Right Output Card */}
              <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-amber-500/20 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400">نتيجة الفحص الإجرائي الآلي:</span>
                    {deadlineInfo && (
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full transition-colors ${
                          deadlineInfo.isExpired
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : deadlineInfo.remainingDays <= 5
                            ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {deadlineInfo.isExpired
                          ? 'انقضى الميعاد القانوني'
                          : `متبقي ${deadlineInfo.remainingDays} يوماً على فوات الميعاد`}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 block">آخر موعد لإيداع وتقرير الطعن:</span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 font-headline">
                      {deadlineInfo ? deadlineInfo.formattedDate : '—'}
                    </div>
                  </div>

                  {deadlineInfo?.isWeekendExtended && (
                    <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 leading-relaxed">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <div>
                        <span className="font-bold block">امتداد الميعاد للعطلة القضائية (المادة 18 مرافعات):</span>
                        صادف اليوم الأخير للطعن عطلة رسمية (جمعة/سبت)، فامتد الميعاد تلقائياً إلى أول يوم عمل تالٍ طبقاً للمستقر عليه في أحكام محكمة النقض.
                      </div>
                    </div>
                  )}

                  <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                    {currentRule.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>منظومة تنبيهات الطعون التلقائية</span>
                  <Link to="/register" className="text-amber-400 hover:underline font-bold flex items-center gap-1 hover:translate-x-1 transition-transform">
                    <span>تفعيل التنبيهات التلقائية لمكتبك</span>
                    <ArrowRight className="w-3 h-3 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            SECTION 4: THE COMPARISON - OLD CHAOS VS BASEERA SYSTEM
           ========================================================================= */}
        <RevealOnScroll className="max-w-7xl mx-auto px-4 sm:px-6 cv-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold">
              التحول الرقمي لمكتبك
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-headline">
              الفرق بين الإدارة التقليدية ومنظومة بصيرة
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              المشكلة ليست في ضغط القضايا وكثرتها، بل في تشتت الأوراق والأجندات وغياب نظام يربطها فورياً
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old Way */}
            <div className="rounded-3xl border border-rose-950/60 bg-rose-950/20 p-6 sm:p-8 space-y-4 hover:border-rose-900/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-900/50 text-rose-300 flex items-center justify-center font-bold">
                  ✕
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">الطريقة التقليدية المرهقة</h3>
                  <p className="text-xs text-rose-400 font-semibold">فوضى المذكرات وسقوط المواعيد</p>
                </div>
              </div>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center shrink-0 text-xs font-bold">✕</span>
                  <span>قضايا مبعثرة بين ملفات إكسيل وواتساب ومجلدات بدون رقم دعوى موحد.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center shrink-0 text-xs font-bold">✕</span>
                  <span>مواعيد استئناف ونقض تضيع في الأجندات الورقية مهددة بسقوط حق الموكل.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center shrink-0 text-xs font-bold">✕</span>
                  <span>أتعاب ومصروفات قضائية غير محصلة بسبب غياب كشوف حسابات واضحة للموكل.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center shrink-0 text-xs font-bold">✕</span>
                  <span>عجز عن معرفة قرارات الجلسات أثناء تواجد المحامي في قاعة المحكمة لانعدام الشبكة.</span>
                </li>
              </ul>
            </div>

            {/* Baseera Way */}
            <div className="rounded-3xl border border-amber-500/40 bg-[#0d1527] p-6 sm:p-8 space-y-4 shadow-xl hover:border-amber-400 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">مع منظومة بصيرة السحابية</h3>
                  <p className="text-xs text-amber-400 font-semibold">تنظيم آلي محكم وراحة بال تامة</p>
                </div>
              </div>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xs font-bold">✓</span>
                  <span>ملف إلكتروني موحد لكل قضية يجمع الأحكام والعرائض والتوكيلات والمذكرات.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xs font-bold">✓</span>
                  <span>محرك ذكي يحسب مدد الطعون القانونية ويرسل تنبيهات مبكرة قبل فوات الميعاد.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xs font-bold">✓</span>
                  <span>تقارير مالية دقيقة وسندات قبض وكشوف حسابات تصدر بضغطة زر واحدة.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xs font-bold">✓</span>
                  <span>تسجيل القرارات ورول الجلسات داخل قاعة المحكمة بدون إنترنت مع مزامنة لحظية.</span>
                </li>
              </ul>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            SECTION 5: CORE SYSTEM MODULES (BENTO ARCHITECTURE)
           ========================================================================= */}
        <RevealOnScroll className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-28 cv-auto">
          <div id="features" className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold">
              منظومة متكاملة
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-headline">
              كل ما يحتاجه مكتب المحاماة في مكان واحد
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              أدوات متخصصة بنيت خصيصاً على تفاصيل وقواعد المحاكم المصرية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Module 1: Cases */}
            <div className="p-6 rounded-3xl bg-[#0c1322] border border-slate-800 hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">إدارة القضايا والنزاعات</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تتبع درجات التقاضي (ابتدائي، استئناف، نقض)، الدوائر، الخصوم، ومحامي الخصم مع أرشفة العرائض والمذكرات.
                </p>
              </div>
              <Link to="/firm/cases" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                <span>تصفح ملفات القضايا</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            {/* Module 2: Court Sessions Roll */}
            <div className="p-6 rounded-3xl bg-[#0c1322] border border-slate-800 hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Gavel className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">رول الجلسات وطباعة الكشف</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  توليد وطباعة رول جلسات اليوم للمحكمة بتنسيق رسمي، تسجيل القرارات والتأجيلات مع تحديد أسباب التأجيل.
                </p>
              </div>
              <Link to="/firm/sessions" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                <span>استعراض رول الجلسات</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            {/* Module 3: Clients & POA */}
            <div className="p-6 rounded-3xl bg-[#0c1322] border border-slate-800 hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">الموكلون وتوكيلات الشهر العقاري</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  سجل متكامل للأفراد والشركات مع أرشفة أرقام وتواريخ توكيلات الشهر العقاري ومتابعة صلاحيتها القانونية.
                </p>
              </div>
              <Link to="/firm/clients" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                <span>دليل الموكلين والتوكيلات</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            {/* Module 4: Police Reports */}
            <div className="p-6 rounded-3xl bg-[#0c1322] border border-slate-800 hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">محاضر الشرطة والنيابات</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  متابعة المحاضر الإدارية، العوارض، الجنح، والنيابات الجزئية والكلية ومسار الإحالة للمحكمة.
                </p>
              </div>
              <Link to="/firm/police-reports" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                <span>سجل المحاضر والنيابة</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            {/* Module 5: Financials & Fees */}
            <div className="p-6 rounded-3xl bg-[#0c1322] border border-slate-800 hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">الفواتير والأتعاب والمصروفات</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  إصدار سندات القبض، متابعة الأتعاب المستحقة، كشوف حسابات الموكلين، ورصد المصروفات القضائية للمحكمة.
                </p>
              </div>
              <Link to="/firm/billing" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                <span>التقارير المالية والأتعاب</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            {/* Module 6: Smart Contracts & OCR */}
            <div className="p-6 rounded-3xl bg-[#0c1322] border border-slate-800 hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">منشئ العقود والماسح الذكي (OCR)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  صياغة العقود القانونية تلقائياً، وتحويل صور الأحكام ومذكرات الخصوم إلى نصوص قابلة للبحث والتعديل.
                </p>
              </div>
              <Link to="/firm/contracts" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                <span>محرر العقود والماسح الذكي</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            SECTION 6: COURTROOM WORKFLOW & INTERACTIVE OFFLINE SIMULATOR
           ========================================================================= */}
        <RevealOnScroll className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-28 cv-auto">
          <div id="courtroom" className="rounded-3xl border border-slate-800 bg-[#0c1322] p-8 sm:p-12 space-y-10">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>تقنية العمل الميداني بدون إنترنت (Offline-First)</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-headline">
                كيف تسير جلستك في المحكمة مع بصيرة؟
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                ثلاث خطوات متسلسلة تضمن أن مكتبك وفريق المحامين في قاعة الجلسة يعملون بتناغم تام حتى في أقبية المحاكم
              </p>
            </div>

            {/* Interactive Step Switcher */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveWorkflowStep(1)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  activeWorkflowStep === 1
                    ? 'bg-slate-900 border-amber-500/80 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shadow-amber-500/20 mb-3">
                  ١
                </span>
                <h3 className="text-base font-bold text-white mb-2">قبل التوجه للمحكمة</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  توليد وطباعة رول الجلسات اليومي، مراجعة طلبات الدفاع والمستندات الناقصة، وإسناد المهام لمحامي الجلسة.
                </p>
              </div>

              <div
                onClick={() => setActiveWorkflowStep(2)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  activeWorkflowStep === 2
                    ? 'bg-slate-900 border-amber-500/80 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shadow-amber-500/20 mb-3">
                  ٢
                </span>
                <h3 className="text-base font-bold text-white mb-2">داخل قاعة الجلسة (أوفلاين)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  بمجرد نطق القاضي بالقرار أو التأجيل، يسجل المحامي القرار فوراً في تطبيق الموبايل دون الحاجة لأي اتصال بالإنترنت.
                </p>
              </div>

              <div
                onClick={() => setActiveWorkflowStep(3)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  activeWorkflowStep === 3
                    ? 'bg-slate-900 border-amber-500/80 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shadow-amber-500/20 mb-3">
                  ٣
                </span>
                <h3 className="text-base font-bold text-white mb-2">مزامنة فورية مع المكتب</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  فور خروج المحامي وعودة شبكة الهاتف، تتدفق قرارات الجلسات تلقائياً للوحة تحكم المكتب وتتحدث ملفات الموكلين.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            SECTION 7: PRICING PLANS
           ========================================================================= */}
        <RevealOnScroll className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-28 cv-auto">
          <div id="pricing" className="max-w-3xl mx-auto text-center mb-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold">
              خطط واضحة وشفافة
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-headline">
              باقات اشتراك تناسب جميع أحجام مكاتب المحاماة
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              جميع الباقات تشمل تجربة مجانية كاملة المزايا لمدة 14 يوماً بدون أي التزام مالي
            </p>

            {/* Monthly / Yearly Switcher */}
            <div className="inline-flex items-center p-1.5 bg-slate-900 rounded-2xl border border-slate-800 mt-4 shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                اشتراك شهري
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  billingCycle === 'yearly'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>اشتراك سنوي</span>
                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  وفر شهرين (20%)
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isPopular = plan.id === 'office' || plan.isPopular;
              const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between space-y-6 relative transition-all duration-300 hover:-translate-y-1 ${
                    isPopular
                      ? 'border-amber-500/80 bg-gradient-to-b from-[#11192e] to-[#0c1222] shadow-2xl shadow-amber-500/10'
                      : 'border-slate-800 bg-[#0c1322] hover:border-slate-700'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 start-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[11px] font-black px-4 py-1 rounded-full shadow-md">
                      {plan.badgeText || 'الأكثر اختياراً لمكاتب المحاماة'}
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold text-white font-headline">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 min-h-[36px] leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-white font-headline font-mono">
                        {price.toLocaleString('ar-EG')}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        ج.م / {billingCycle === 'monthly' ? 'شهرياً' : 'سنوياً'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex justify-between text-slate-400">
                        <span>عدد المستخدمين:</span>
                        <span className="font-bold text-white">حتى {plan.maxUsers} محامين</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>المساحة السحابية:</span>
                        <span className="font-bold text-white">{plan.maxStorageGb || plan.storageGb} جيجابايت</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 mb-2.5">مميزات الباقة:</p>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="leading-snug text-[11px]">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    to="/register"
                    className={`w-full h-11 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 ${
                      isPopular
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>ابدأ تجربتك المجانية (14 يوماً)</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs text-slate-500 font-medium">
            ✓ تجربة مجانية فورية · بدون بطاقة بنكية · ترقية أو إلغاء في أي وقت · دعم فني عبر واتساب
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            SECTION 8: TESTIMONIALS
           ========================================================================= */}
        <RevealOnScroll className="max-w-7xl mx-auto px-4 sm:px-6 cv-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold">
              شهادات الثقة
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-headline">
              يثق بنا نخبة من كبار المستشارين والمحامين في مصر
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-800 bg-[#0c1322] p-6 sm:p-7 flex flex-col justify-between space-y-5 hover:-translate-y-1 transition-transform"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      {t.firmType}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <span className="font-bold text-xs text-white block">{t.author}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{t.role}</span>
                  <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            SECTION 9: FAQ ACCORDION
           ========================================================================= */}
        <RevealOnScroll className="max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-28 cv-auto">
          <div id="faq" className="text-center mb-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold">
              إجابات استفساراتك
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-headline">
              الأسئلة الأكثر شيوعاً
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-[#0c1322] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-start hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-white">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-amber-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3 animate-in fade-in-50 duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </RevealOnScroll>

        {/* =========================================================================
            SECTION 10: CONTACT & DEMO REQUEST FORM
           ========================================================================= */}
        <RevealOnScroll className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-28 cv-auto">
          <div id="contact" className="rounded-3xl border border-slate-800 bg-[#0c1322] p-6 sm:p-12 shadow-2xl">
            <div className="max-w-2xl mx-auto text-center mb-8 space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Mail className="w-3.5 h-3.5" />
                <span>طلب عرض توضيحي وتواصل مباشر</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-headline">
                دعنا نساعدك في رقمنة مكتبك القانوني
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                سيتواصل معك أحد مستشارينا خلال دقائق لمساعدتك في تجربة النظام وضبط بيانات قضاياك
              </p>
            </div>

            <LandingContactForm />
          </div>
        </RevealOnScroll>
      </main>

      {/* =========================================================================
          LUXURY FOOTER
         ========================================================================= */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 mt-28 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-lg">
                  ⚖️
                </div>
                <span className="font-black text-lg text-white font-headline">
                  {settings.systemName}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                المنظومة السحابية المتكاملة لإدارة مكاتب المحاماة في مصر. قضايا، جلسات، موكلون، توكيلات، ومحاضر، مع حاسبة الطعون القانونية ودعم العمل في المحكمة بدون إنترنت.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{settings.contactPhone}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{settings.contactEmail}</span>
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white mb-3">روابط النظام</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link to="/login" className="hover:text-amber-400 transition-colors">
                    بوابة دخول مكاتب المحاماة
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-amber-400 transition-colors">
                    تسجيل وقيد مكتب جديد (تجربة 14 يوماً)
                  </Link>
                </li>
                <li>
                  <a href="#calculator" className="hover:text-amber-400 transition-colors">
                    حاسبة الطعون القضائية المصرية
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-amber-400 transition-colors">
                    باقات الاشتراك والأسعار
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white mb-3">الإدارة والحصانة</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link
                    to="/admin/login"
                    className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Lock className="w-3 h-3" />
                    <span>بوابة الإدارة المركزية (Super Admin)</span>
                  </Link>
                </li>
                <li>
                  <span className="text-slate-500">حماية البيانات 256-Bit SSL</span>
                </li>
                <li>
                  <span className="text-slate-500">عزل سحابي متعدد المكاتب (RLS)</span>
                </li>
                <li>
                  <span className="text-slate-500">متوافق مع قانون المحاماة المصري</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>
              جميع الحقوق محفوظة لمنصة {settings.systemName} القانونية SaaS © 2026 • جمهورية مصر العربية
            </span>
            <div className="flex items-center gap-3">
              <Link to="/admin/login" className="text-slate-500 hover:text-amber-400 transition-colors">
                الإدارة المركزية
              </Link>
              <span>•</span>
              <a href="#contact" className="hover:text-slate-300">
                الدعم الفني
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
