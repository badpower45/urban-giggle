import React from "react";
import {
  Gavel,
  Briefcase,
  Users,
  Calendar,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  Smartphone,
  WifiOff,
  Search,
} from "lucide-react";

export const DashboardMockup: React.FC = () => {
  return (
    <div className="w-full rounded-xl border border-border/80 bg-white p-4 shadow-xl text-start select-none font-sans">
      {/* Mini App Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
            ب
          </div>
          <span className="text-xs font-bold text-primary">مكتب الشربيني للمحاماة والاستشارات</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            متصل بالنظام
          </span>
        </div>
      </div>

      {/* Mini Metric Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-border/60">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[10px] font-semibold">القضايا النشطة</span>
            <Briefcase className="w-3 h-3 text-primary" />
          </div>
          <div className="text-sm font-bold text-primary">14 قضية</div>
          <span className="text-[9px] text-emerald-600 font-semibold">+2 هذا الأسبوع</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-border/60">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[10px] font-semibold">جلسات اليوم</span>
            <Gavel className="w-3 h-3 text-secondary" />
          </div>
          <div className="text-sm font-bold text-secondary">3 جلسات</div>
          <span className="text-[9px] text-slate-500 font-semibold">بورسعيد والإسكندرية</span>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-[10px] font-semibold">المحصل هذا الشهر</span>
            <ArrowUpRight className="w-3 h-3 text-emerald-700" />
          </div>
          <div className="text-sm font-bold text-emerald-800">45,000 ج.م</div>
          <span className="text-[9px] text-emerald-600 font-semibold">82% من المستهدف</span>
        </div>
      </div>

      {/* Upcoming Court Session Card */}
      <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            الجلسة القادمة: غداً 09:00 ص
          </span>
          <span className="text-[10px] font-mono bg-blue-200/80 text-blue-900 px-1.5 py-0.5 rounded font-bold">
            رول 14
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-800 truncate">
          دعوى تعويض مدني رقم 1248 لسنة 2024
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">
          محكمة بورسعيد الابتدائية — الدائرة الأولى مدني كلي
        </p>
      </div>

      {/* Mini Cases Preview */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px]">
          <span className="font-semibold text-primary truncate max-w-[180px]">
            شركة الفنار للمقاولات ضد الهيئة العامة
          </span>
          <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
            متداولة
          </span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px]">
          <span className="font-semibold text-primary truncate max-w-[180px]">
            طعن بالنقض جنائي — جنح مستأنف
          </span>
          <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
            حجز للحكم
          </span>
        </div>
      </div>
    </div>
  );
};

export const CaseManagementMockup: React.FC = () => {
  return (
    <div className="w-full rounded-xl border border-border/80 bg-white p-4 shadow-xl text-start select-none font-sans">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-primary">سجل القضايا الموحد</span>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
          14 قضية مسجلة
        </span>
      </div>

      {/* Search & Filter simulation */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-border text-xs text-muted-foreground">
          <Search className="w-3.5 h-3.5" />
          <span className="text-[11px]">بحث باسم الموكل أو رقم الرول...</span>
        </div>
        <span className="text-[10px] px-2 py-1.5 rounded-lg bg-primary text-white font-bold flex items-center">
          + قضية جديدة
        </span>
      </div>

      {/* Case Rows */}
      <div className="space-y-2">
        <div className="p-3 rounded-lg border border-border hover:border-secondary transition-colors bg-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-primary">دعوى بطلان عقد بيع عقار</span>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
              342 / 2024
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mt-2">
            <div>
              <span className="text-[10px] text-muted-foreground block">الموكل:</span>
              <span className="font-semibold text-slate-800">م. أحمد سامي البحيري</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">المحكمة:</span>
              <span className="font-semibold text-slate-800">محكمة شمال القاهرة</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              أتعاب مسددة: 20,000 ج.م
            </span>
            <span className="text-slate-500">الجلسة القادمة: 18 سبتمبر</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-border bg-slate-50/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-primary">استئناف عمالي تعويض فصل تعسفي</span>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
              812 / 2023
            </span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>الموكل: طارق محمود السيد</span>
            <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded text-[10px]">
              متبقي 5,000 ج.م
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ClientManagementMockup: React.FC = () => {
  return (
    <div className="w-full rounded-xl border border-border/80 bg-white p-4 shadow-xl text-start select-none font-sans">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-primary">ملف الموكل الإلكتروني</span>
        </div>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
          موكل رئيسي
        </span>
      </div>

      {/* Client Profile Card */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-border/80 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
          أ.ب
        </div>
        <div>
          <h4 className="text-xs font-bold text-primary">أحمد سامي البحيري</h4>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">01098765432 · رقم قومي 28904120300...</p>
        </div>
      </div>

      {/* POA & Documents */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded-lg border border-border bg-white text-xs">
          <span className="text-[10px] text-muted-foreground block">بيانات التوكيل:</span>
          <span className="font-bold text-slate-800 text-[11px] mt-0.5 block">
            توكيل عام قضايا 1420 / ب
          </span>
          <span className="text-[9px] text-slate-500">توثيق الشرق - بورسعيد</span>
        </div>
        <div className="p-2 rounded-lg border border-border bg-white text-xs">
          <span className="text-[10px] text-muted-foreground block">الأتعاب والمالية:</span>
          <span className="font-bold text-emerald-700 text-[11px] mt-0.5 block">
            مسدد: 25,000 ج.م
          </span>
          <span className="text-[9px] text-slate-500">متبقي: 5,000 ج.م</span>
        </div>
      </div>

      {/* Linked Cases */}
      <div>
        <span className="text-[10px] font-bold text-muted-foreground block mb-1.5">
          القضايا المرتبطة (2 قضية)
        </span>
        <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-[11px] flex items-center justify-between">
          <span className="font-semibold text-slate-800 truncate">دعوى تعويض مدني كلي</span>
          <span className="text-[10px] font-mono text-slate-600">جلسة 24 سبتمبر</span>
        </div>
      </div>
    </div>
  );
};

export const SessionsMockup: React.FC = () => {
  return (
    <div className="w-full rounded-xl border border-border/80 bg-white p-4 shadow-xl text-start select-none font-sans">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-primary">رول جلسات المحكمة اليومي</span>
        </div>
        <span className="text-[10px] bg-secondary/15 text-secondary px-2 py-0.5 rounded-full font-bold">
          توليد وطباعة الرول
        </span>
      </div>

      <div className="space-y-2">
        <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-primary text-white text-[10px] font-bold font-mono flex items-center justify-center">
                1
              </span>
              <div>
                <span className="text-xs font-bold text-primary block">
                  محكمة بورسعيد الابتدائية — الدائرة الأولى مدني
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  رول: 14 · رقم الدعوى: 1248/2024
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              تم النطق
            </span>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-200 text-[11px] text-slate-700">
            <span className="font-bold text-slate-900">القرار: </span>
            تأجيل الجلسة لتاريخ 15 أكتوبر للمذكرات الختامية
          </div>
        </div>

        <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-secondary text-white text-[10px] font-bold font-mono flex items-center justify-center">
                2
              </span>
              <div>
                <span className="text-xs font-bold text-primary block">
                  محكمة استئناف الإسكندرية — دائرة التعويضات
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  رول: 8 · رقم الدعوى: 512/2023
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
              قيد المرافعة
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PhoneMockup: React.FC = () => {
  return (
    <div className="relative mx-auto w-full max-w-[240px] select-none font-sans">
      <div className="relative rounded-[32px] border-[4px] border-[#0f172a] bg-[#0f172a] p-[3px] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.35)] ring-1 ring-white/20">
        {/* Notch */}
        <div className="absolute top-2.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-16 h-3.5 bg-[#0f172a] rounded-full z-20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950/80 border border-slate-800" />
        </div>

        <div className="relative overflow-hidden rounded-[26px] bg-slate-900 text-white min-h-[440px] p-3 pt-6 flex flex-col justify-between">
          {/* Top Bar */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
              <span className="font-bold text-secondary">بَـصِـيـرَة Mobile</span>
              <span className="flex items-center gap-1 text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                <WifiOff className="w-2.5 h-2.5 text-blue-400" />
                أوفلاين
              </span>
            </div>

            {/* Header Greeting */}
            <div className="mt-3">
              <span className="text-[10px] text-slate-400 block">صباح الخير،</span>
              <h5 className="text-xs font-bold text-white">أستاذ محمود الشربيني</h5>
            </div>

            {/* Quick Today Card */}
            <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-secondary">جلسات اليوم (3)</span>
                <span className="text-[9px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded font-bold">
                  محكمة بورسعيد
                </span>
              </div>
              <p className="text-[11px] font-semibold text-white truncate mt-1">
                رول 14 — مدني كلي
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">
                قرار الجلسة السابقة: ورود تقرير الخبراء
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5 mt-3">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                <Gavel className="w-3.5 h-3.5 text-secondary mx-auto mb-1" />
                <span className="text-[9px] font-bold text-slate-200 block">تسجيل قرار</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                <FileText className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                <span className="text-[9px] font-bold text-slate-200 block">سند قبض</span>
              </div>
            </div>

            {/* Recent Notification */}
            <div className="mt-3 p-2 rounded-lg bg-blue-950/40 border border-blue-800/40 text-[9px] text-blue-200 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-blue-400 shrink-0" />
              <span>ميعاد استئناف وشيك: متبقي يومان</span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-2 border-t border-slate-800 flex justify-around text-[9px] text-slate-400">
            <span className="text-secondary font-bold">الرئيسية</span>
            <span>القضايا</span>
            <span>الجلسات</span>
            <span>الموكلين</span>
          </div>
        </div>
      </div>
    </div>
  );
};
