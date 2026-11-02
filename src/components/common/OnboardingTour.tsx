import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Scale,
  Clock,
  FileCheck2,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Gavel,
  ShieldCheck,
  Building2,
  Briefcase,
  FileText,
} from 'lucide-react';
import { Button } from '../ui/button';

export const TOUR_STORAGE_KEY = 'baseera_tour_completed_v1';

export const openBaseeraTour = () => {
  window.dispatchEvent(new CustomEvent('open-baseera-tour'));
};

interface TourStep {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  glowColor: string;
  highlights: { title: string; desc: string }[];
  actionLabel?: string;
  actionRoute?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    badge: 'الخطوة الأولى • لوحة المتابعة الشاملة',
    title: 'مرحباً بك في بَـصِـيـرَة - لوحة العمليات اليومية',
    subtitle: 'المنظومة الذكية لإدارة مكاتب المحاماة والقضايا في جمهورية مصر العربية',
    description:
      'لوحة التحكم تمنحك رؤية فورية ومركزية لكل نشاطات مكتبك: رول الجلسات المنعقدة اليوم، مواعيد الطعون المعرضة للسقوط، أحدث المهام المكلف بها المحامون، والإحصائيات المالية اللحظية للأتعاب.',
    icon: LayoutDashboard,
    iconBg: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    iconColor: 'text-amber-500',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    highlights: [
      {
        title: 'رول الجلسات اليومي التفاعلي',
        desc: 'عرض فوري لرقم الدعوى، المحكمة، الدائرة، وتوقيت انعقاد الجلسة وقراراتها.',
      },
      {
        title: 'إنذارات مدد الطعون وسقوط الحقوق',
        desc: 'تنبيه استباقي قبل فوات مواعيد الاستئناف والنقض والإعلانات القضائية.',
      },
      {
        title: 'الحالة المالية والتدفقات النقدية',
        desc: 'متابعة الأتعاب المسددة، المتبقية للتحصيل، ومصروفات الدعاوى الرسمية.',
      },
    ],
    actionLabel: 'استكشف لوحة التحكم',
    actionRoute: '/firm/dashboard',
  },
  {
    id: 2,
    badge: 'الخطوة الثانية • إدارة الموكلين والشركات',
    title: 'دليل الموكلين والشركات والتوكيلات الرسمية',
    subtitle: 'قاعدة بيانات مشفرة ومؤمنة لكل موكل مع ربط التوكيلات الصادرة بالشهر العقاري',
    description:
      'سجل الموكلين كأفراد (بالرقم القومي) أو كشركات تجارية (بالسجل التجاري وبطاقة الضريبة)، مع إمكانية ربط أرقام دفاتر وسنوات التوكيلات الرسمية الصادرة من مكاتب الشهر العقاري والتوثيق.',
    icon: Users,
    iconBg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
    iconColor: 'text-emerald-500',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    highlights: [
      {
        title: 'سجل التوكيلات بالشهر العقاري',
        desc: 'حفظ رقم التوكيل، حرف التوثيق، المكتب الصادر منه، ونطاق الوكالة القضائية.',
      },
      {
        title: 'ربط متعدد بالقضايا والمحاضر',
        desc: 'عرض كافة قضايا ومحاضر الشرطة الخاصة بكل موكل بصفحة ملف موحدة.',
      },
      {
        title: 'كشف حساب مالي للموكل',
        desc: 'تتبع المبالغ المدفوعة، الدفعات المؤجلة، وسندات القبض الموقعة.',
      },
    ],
    actionLabel: 'تسجيل أول موكل الآن',
    actionRoute: '/firm/clients/new',
  },
  {
    id: 3,
    badge: 'الخطوة الثالثة • رول القضايا والدعاوى',
    title: 'إدارة القضايا والمسار القضائي بالمحاكم المصرية',
    subtitle: 'من أول درجة والاستئناف العالي وحتى محكمة النقض ومجلس الدولة',
    description:
      'تنظيم كامل لملف القضية: رقم الدعوى، سنة القيد، الدائرة المختصة، المحكمة الجزئية أو الكلية، أسماء الخصوم ومحاميهم، وقرار كل جلسة مع إمكانية إرفاق مذكرات الدفاع وحوافظ المستندات.',
    icon: Scale,
    iconBg: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    iconColor: 'text-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    highlights: [
      {
        title: 'تصنيف شامل لكافة فروع القانون',
        desc: 'مدني، جنائي، عمالي، أسرة، تجاري، اقتصادي، مجلس دولة وقضاء إداري.',
      },
      {
        title: 'سجل قرارات وتأجيلات الجلسات',
        desc: 'توثيق قرار كل جلسة وسند التأجيل والمحامي الحاضر من فريق المكتب.',
      },
      {
        title: 'حفظ مستندات وأحكام القضية',
        desc: 'أرشفة سحابية آمنة لعرائض الدعاوى وصور الأحكام والتقارير الهندسية والحسابية.',
      },
    ],
    actionLabel: 'قيد قضية جديدة',
    actionRoute: '/firm/cases/new',
  },
  {
    id: 4,
    badge: 'الخطوة الرابعة • حاسبة المواعيد القانونية',
    title: 'حاسبة المواعيد ومدد الطعون وسقوط الأحكام التلقائية',
    subtitle: 'حماية كاملة من فوات المواعيد الإجرائية طبقاً للقوانين المصرية السارية',
    description:
      'تقوم بصيرة بحساب مواعيد الطعن تلقائياً فور صدور الحكم أو الإعلان، مع عداد تنازلي دقيق وتنبيهات بالألوان لتنبيهك قبل الميعاد بـ ٧ أيام و ٣ أيام ويوم واحد لضمان حق الموكل.',
    icon: Clock,
    iconBg: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
    iconColor: 'text-rose-500',
    glowColor: 'rgba(244, 63, 94, 0.15)',
    highlights: [
      {
        title: 'مواعيد الاستئناف المقررة قانوناً',
        desc: '٤٠ يوماً في المواد المدنية والتجارية، ١٠ أيام في الجنح، و١٥ يوماً في المستعجل.',
      },
      {
        title: 'ميعاد الطعن بالنقض والإلغاء',
        desc: '٦٠ يوماً للطعن بالنقض أمام محكمة النقض أو الطعن أمام المحكمة الإدارية العليا.',
      },
      {
        title: 'تنبيهات فورية متعددة القنوات',
        desc: 'إشعارات بارزة برأس الصفحة ورسائل تنبيهية لمنع فوات أي ميعاد إجرائي حاسم.',
      },
    ],
    actionLabel: 'عرض جدول المواعيد والطعون',
    actionRoute: '/firm/deadlines',
  },
  {
    id: 5,
    badge: 'الخطوة الخامسة • صانع العقود والمحاضر',
    title: 'صانع العقود الذكي وتوثيق محاضر الشرطة والنيابة',
    subtitle: 'توليد قانوني آلي بنقرة واحدة من بيانات القضية والموكل',
    description:
      'صياغة العقود القانونية المعتمدة (عقد اتفاق أتعاب محاماة، إقرار تصالح وتنازل، مخالصة نهائية) بسحب بيانات القضية والخصوم تلقائياً، مع توثيق محاضر أقسام الشرطة وقيد أرقام قضايا الجنح والتحقيقات.',
    icon: FileCheck2,
    iconBg: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    iconColor: 'text-purple-500',
    glowColor: 'rgba(168, 85, 247, 0.15)',
    highlights: [
      {
        title: 'توليد تلقائي دون كتابة مكررة',
        desc: 'يتم ملء أرقام القضايا والمحكمة وبيانات الموكل والخصم في العقد بضغطة زر واحدة.',
      },
      {
        title: 'قوالب صياغة محكمة قانونياً',
        desc: 'صياغات نموذجية مطابقة لقانون المحاماة رقم ١٧ لسنة ١٩٨٣ وتعديلاته.',
      },
      {
        title: 'توثيق محاضر أقسام الشرطة',
        desc: 'قيد رقم المحضر، السنة، القسم، وتاريخ الإحالة للنيابة العامة مع الربط بالدعوى.',
      },
    ],
    actionLabel: 'فتح صانع العقود الذكي',
    actionRoute: '/firm/contracts',
  },
];

export const OnboardingTour: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Check if tour should auto-open on first visit
  useEffect(() => {
    const isCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!isCompleted) {
      // Small timeout so page elements mount smoothly first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen to custom event to reopen tour anytime from header/menu
  useEffect(() => {
    const handleOpen = () => {
      setCurrentStepIndex(0);
      setIsOpen(true);
    };
    window.addEventListener('open-baseera-tour', handleOpen);
    return () => window.removeEventListener('open-baseera-tour', handleOpen);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        // Next step in RTL
        handleNext();
      } else if (e.key === 'ArrowRight') {
        // Prev step in RTL
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  const handleClose = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleAction = (route?: string) => {
    handleClose();
    if (route) {
      navigate(route);
    }
  };

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const progressPercent = Math.round(((currentStepIndex + 1) / TOUR_STEPS.length) * 100);
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in-50 duration-300 select-none"
      dir="rtl"
    >
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300"
        style={{
          boxShadow: `0 20px 50px ${currentStep.glowColor}, 0 0 0 1px rgba(255, 255, 255, 0.08)`,
        }}
      >
        {/* Top Progress Bar */}
        <div className="w-full bg-slate-800/80 h-1.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wide">
                الجولة التعريفية بالنظام
              </span>
              <span className="text-[11px] text-slate-400 me-2">
                ({currentStepIndex + 1} من {TOUR_STEPS.length})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title="تخطي الجولة وإغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 custom-scrollbar">
          {/* Badge & Icon Hero */}
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentStep.iconBg} border flex items-center justify-center shrink-0 shadow-lg`}
            >
              <StepIcon className={`w-7 h-7 ${currentStep.iconColor}`} />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {currentStep.badge}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-headline">
                {currentStep.title}
              </h3>
              <p className="text-xs text-slate-400">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          {/* Description Text */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentStep.description}
          </div>

          {/* 3 Key Highlights */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>أهم المزايا والقدرات في هذا القسم:</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {currentStep.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{h.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:px-6 sm:py-4 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Step Indicator Dots */}
          <div className="flex items-center gap-1.5 order-2 sm:order-1">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`transition-all rounded-full ${
                  idx === currentStepIndex
                    ? 'w-7 h-2 bg-amber-400'
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`الذهاب إلى: ${step.title}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-white h-9 px-3"
            >
              تخطي الجولة
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={currentStepIndex === 0}
                onClick={handlePrev}
                className="h-9 px-3 text-xs bg-slate-800 border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 rounded-xl gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </Button>

              {isLastStep ? (
                <Button
                  type="button"
                  onClick={() => handleAction(currentStep.actionRoute)}
                  className="h-9 px-4 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>إنهاء والبدء بالعمل</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-9 px-4 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
