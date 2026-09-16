import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined, lang: string = 'ar'): string {
  const isEn = lang.startsWith('en');
  const val = amount || 0;
  const formatted = val.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return isEn ? `${formatted} EGP` : `${formatted} ج.م.`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getDaysRemaining(targetDateStr: string): number {
  const target = new Date(targetDateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDeadlineUrgencyLabel(daysRemaining: number): { label: string; color: string; bg: string } {
  if (daysRemaining < 0) {
    return {
      label: `انتهى منذ ${Math.abs(daysRemaining)} يوم`,
      color: 'text-red-700',
      bg: 'bg-red-50 border-red-200',
    };
  }
  if (daysRemaining === 0) {
    return {
      label: 'ينتهي اليوم!',
      color: 'text-red-600 font-bold',
      bg: 'bg-red-100 border-red-300 animate-pulse',
    };
  }
  if (daysRemaining <= 2) {
    return {
      label: `حرج: خلال ${daysRemaining} يوم`,
      color: 'text-red-600',
      bg: 'bg-red-50 border-red-200',
    };
  }
  if (daysRemaining <= 7) {
    return {
      label: `عاجل: متبقي ${daysRemaining} أيام`,
      color: 'text-amber-700',
      bg: 'bg-amber-50 border-amber-200',
    };
  }
  return {
    label: `متبقي ${daysRemaining} يوم`,
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
  };
}

export const EGYPT_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'بورسعيد',
  'الدقهلية',
  'البحر الأحمر',
  'البحيرة',
  'الفيوم',
  'الغربية',
  'الإسماعيلية',
  'المنوفية',
  'المنيا',
  'القليوبية',
  'الوادي الجديد',
  'السويس',
  'أسوان',
  'أسيوط',
  'بني سويف',
  'دمياط',
  'الشرقية',
  'جنوب سيناء',
  'كفر الشيخ',
  'مطروح',
  'الأقصر',
  'قنا',
  'شمال سيناء',
  'سوهـاج',
];

export const COMMON_COURTS = [
  { id: 'c1', name: 'محكمة بورسعيد الابتدائية', governorate: 'بورسعيد' },
  { id: 'c2', name: 'محكمة شمال القاهرة الابتدائية', governorate: 'القاهرة' },
  { id: 'c3', name: 'محكمة جنوب القاهرة الابتدائية', governorate: 'القاهرة' },
  { id: 'c4', name: 'محكمة الأسرة بمدينة نصر', governorate: 'القاهرة' },
  { id: 'c5', name: 'المحكمة الاقتصادية بالقاهرة', governorate: 'القاهرة' },
  { id: 'c6', name: 'محكمة الجيزة الابتدائية', governorate: 'الجيزة' },
  { id: 'c7', name: 'محكمة استئناف القاهرة', governorate: 'القاهرة' },
  { id: 'c8', name: 'محكمة استئناف الإسكندرية', governorate: 'الإسكندرية' },
  { id: 'c9', name: 'محكمة النقض', governorate: 'القاهرة' },
  { id: 'c10', name: 'محكمة القضاء الإداري (مجلس الدولة)', governorate: 'القاهرة' },
];

export const CASE_TYPES = [
  { id: 'ct1', name: 'مدني جزئي', category: 'مدني' },
  { id: 'ct2', name: 'مدني كلي', category: 'مدني' },
  { id: 'ct3', name: 'تعويضات عمالية', category: 'عمالي' },
  { id: 'ct4', name: 'منازعات عقارية وتمليك', category: 'مدني' },
  { id: 'ct5', name: 'أسرة (نفقة وأحوال شخصية)', category: 'أسرة' },
  { id: 'ct6', name: 'تجاري وشركات', category: 'تجاري' },
  { id: 'ct7', name: 'جنح مستأنفة', category: 'جنائي' },
  { id: 'ct8', name: 'اقتصادي استئنافي', category: 'اقتصادي' },
  { id: 'ct9', name: 'مجلس دولة (إداري)', category: 'إداري' },
];
