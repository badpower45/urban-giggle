import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Scale,
  Gavel,
  ShieldCheck,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '../ui/button';

export const TOUR_STORAGE_KEY = 'baseera_tour_completed_v1';

export const openBaseeraTour = () => {
  window.dispatchEvent(new CustomEvent('open-baseera-tour'));
};

interface TourStep {
  id: number;
  badge: string;
  pageName: string;
  title: string;
  route: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  highlights: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    badge: 'الخطوة ١ من ٦ • نظرة عامة',
    pageName: 'لوحة التحكم والمؤشرات اليومية',
    route: '/firm/dashboard',
    title: 'مركز العمليات اليومي للمكتب',
    description:
      'تمنحك لوحة التحكم رؤية لحظية موحدة لكل نشاطات مكتبك: رول الجلسات المنعقدة اليوم، تنبيهات الطعون المعرضة للسقوط، والمهام العاجلة المكلف بها فريق المحامين.',
    icon: LayoutDashboard,
    iconColor: 'text-amber-400',
    highlights: [
      'رول الجلسات المنعقدة اليوم في المحاكم وقراراتها.',
      'إنذارات مدد الطعون الحرجة قبل فوات المواعيد الرسمية.',
      'ملخص تكليفات السادة المحامين ومؤشرات التحصيل.',
    ],
  },
  {
    id: 2,
    badge: 'الخطوة ٢ من ٦ • الأرشيف القضائي',
    pageName: 'رول القضايا والدعاوى',
    route: '/firm/cases',
    title: 'إدارة القضايا والمسار القضائي الكامل',
    description:
      'تنظيم كامل لملف القضية: أرقام الدعاوى، سنوات القيد، الدائرة المختصة، المحكمة، مع أرشفة مذكرات الدفاع وحوافظ المستندات وسجل قرارات كل جلسة.',
    icon: Scale,
    iconColor: 'text-blue-400',
    highlights: [
      'تتبع القضايا بمختلف المحاكم (ابتدائي، استئناف عالي، نقض، مجلس دولة).',
      'سجل شامل لحوافظ المستندات ومذكرات الدفاع والأحكام.',
      'ربط كل دعوى بالموكل والخصوم والمحامي الحاضر.',
    ],
  },
  {
    id: 3,
    badge: 'الخطوة ٣ من ٦ • أجندة المحكمة',
    pageName: 'رول الجلسات وحضور المحكمة (أوفلاين)',
    route: '/firm/sessions',
    title: 'تسجيل قرارات الجلسة داخل قاعة المحكمة',
    description:
      'مصمم ليعمل في قاعات المحاكم وغرف المداولة وأقبية المحاكم حتى بدون اتصال بالإنترنت (Offline-First)؛ سجل القرار الفوري وسند التأجيل وستتم المزامنة تلقائياً.',
    icon: Gavel,
    iconColor: 'text-emerald-400',
    highlights: [
      'محرك محلي فائق السرعة يعمل بالكامل بدون شبكة في المحكمة.',
      'تدوين قرار القاضي وسند التأجيل المحتمل فور النطق به.',
      'إشعار فوري لأعضاء المكتب بالقرار بمجرد عودة الاتصال.',
    ],
  },
  {
    id: 4,
    badge: 'الخطوة ٤ من ٦ • محاضر الشرطة',
    pageName: 'سجل محاضر الشرطة والنيابة العامة',
    route: '/firm/police-reports',
    title: 'تتبع حركة المحضر من القسم إلى النيابة',
    description:
      'نظام مخصص لتتبع محاضر الأقسام في مصر: قيد رقم المحضر والقسم، متابعة نتيجة تصرف النيابة العامة واستيفاء التحقيق، وتحويله لجنحة وجلسة متداولة بنقرة زر.',
    icon: ShieldCheck,
    iconColor: 'text-rose-400',
    highlights: [
      'قيد رقم المحضر، اسم القسم، والضابط المحرر وتاريخ التحرير.',
      'متابعة نتيجة تصرف النيابة (حفظ، جنحة، إحالة).',
      'تحويل المحضر مباشرة لدعوى قضائية وجلسة فور نزول الرول.',
    ],
  },
  {
    id: 5,
    badge: 'الخطوة ٥ من ٦ • الصياغة القانونية',
    pageName: 'منشئ العقود والصيغ الذكية',
    route: '/firm/contracts',
    title: 'صياغة العقود بالصيغ المعتمدة قانوناً',
    description:
      'مكتبة متكاملة من نماذج العقود المدنية والتجارية المعتمدة وفقاً للقوانين المصرية (بيع، إيجار، شركات، اتفاقيات)، مع دمج بيانات الموكلين تلقائياً والتصدير إلى Word و PDF.',
    icon: FileText,
    iconColor: 'text-purple-400',
    highlights: [
      'نماذج قانونية جاهزة ومدققة طبقاً للقانون المدني والتجاري.',
      'إدراج بيانات الأطراف والبنود آلياً لتفادي الأخطاء الإملائية.',
      'تصدير فوري لملفات Word و PDF قابلة للطباعة بختم مكتبك.',
    ],
  },
  {
    id: 6,
    badge: 'الخطوة ٦ من ٦ • العمل الجماعي',
    pageName: 'إدارة المهام والتكليفات',
    route: '/firm/tasks',
    title: 'توزيع التكليفات على فريق المحامين',
    description:
      'تنظيم وتنسيق العمل الداخلي لمكتب المحاماة؛ إسناد التكليفات (كتابة مذكرة، استخراج شهادة، حضور جلسة) لمحامٍ محدد مع تحديد الأولويات والإشعار التلقائي.',
    icon: CheckCircle2,
    iconColor: 'text-amber-400',
    highlights: [
      'إشعار فوري وتنبيه للمحامي المكلف بالعمل في مركز الإشعارات.',
      'ربط كل تكليف بملف القضية أو الموكل المعني مباشرة.',
      'متابعة نسب الإنجاز والمهام المتأخرة والعاجلة.',
    ],
  },
];

export const OnboardingTour: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Auto-open tour for fresh users who haven't completed it
  useEffect(() => {
    const isCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen to custom event to reopen tour anytime from header/menu
  useEffect(() => {
    const handleOpen = () => {
      setCurrentStepIndex(0);
      setIsCollapsed(false);
      setIsOpen(true);
      navigate(TOUR_STEPS[0].route);
    };
    window.addEventListener('open-baseera-tour', handleOpen);
    return () => window.removeEventListener('open-baseera-tour', handleOpen);
  }, [navigate]);

  // Sync step index if user manually navigates
  useEffect(() => {
    if (!isOpen) return;
    const matchedIdx = TOUR_STEPS.findIndex((s) => s.route === location.pathname);
    if (matchedIdx !== -1 && matchedIdx !== currentStepIndex) {
      setCurrentStepIndex(matchedIdx);
    }
  }, [location.pathname, isOpen]);

  // Keyboard navigation (Escape to close, Left/Right for Next/Prev)
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
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      navigate(TOUR_STEPS[nextIdx].route);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      navigate(TOUR_STEPS[prevIdx].route);
    }
  };

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  // Render Collapsed Floating Pill at Bottom-Left
  if (isCollapsed) {
    return (
      <div
        className="fixed bottom-5 left-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 select-none"
        dir="rtl"
      >
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/95 border border-amber-500/40 text-white shadow-2xl shadow-black/80 hover:bg-slate-850 hover:border-amber-400 transition-all text-xs font-bold"
        >
          <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </div>
          <span>جولة النظام ({currentStepIndex + 1}/{TOUR_STEPS.length}): {currentStep.pageName}</span>
          <ChevronUp className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    );
  }

  // Render Compact Floating Card at Bottom-Left (No Screen-Blocking Backdrop!)
  return (
    <div
      className="fixed bottom-5 left-5 z-50 w-[360px] sm:w-[400px] max-w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-4 duration-300 select-none"
      dir="rtl"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 text-white rounded-2xl shadow-2xl shadow-black/80 ring-1 ring-white/10 overflow-hidden flex flex-col">
        {/* Top Progress Line */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Card Header: Step Badge & Action Controls */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-amber-300">
              {currentStep.badge}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="تصغير الكارت"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="إغلاق الجولة"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card Body: Page Title & Explanations */}
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-md">
              <StepIcon className={`w-5 h-5 ${currentStep.iconColor}`} />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">
                الصفحة الحالية: {currentStep.pageName}
              </span>
              <h3 className="text-sm font-bold text-white font-headline leading-tight mt-0.5">
                {currentStep.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/70">
            {currentStep.description}
          </p>

          {/* Key Bullet Highlights */}
          <div className="space-y-1.5 pt-0.5">
            {currentStep.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold shrink-0">
                  ✓
                </div>
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer: Step Dots, Skip, Prev & Next (with Route Navigation) */}
        <div className="px-4 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-2">
          {/* Progress Dots */}
          <div className="flex items-center gap-1">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setCurrentStepIndex(idx);
                  navigate(step.route);
                }}
                className={`transition-all rounded-full ${
                  idx === currentStepIndex
                    ? 'w-5 h-1.5 bg-amber-400'
                    : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
                title={step.pageName}
              />
            ))}
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={currentStepIndex === 0}
              onClick={handlePrev}
              className="h-8 px-2.5 text-xs bg-slate-800 border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 rounded-xl gap-1"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span>السابق</span>
            </Button>

            {isLastStep ? (
              <Button
                type="button"
                onClick={handleClose}
                className="h-8 px-3 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>إنهاء الجولة ✨</span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="h-8 px-3 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl gap-1 shadow-md shadow-amber-500/20"
              >
                <span>التالي</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
