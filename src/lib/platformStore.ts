import { useState, useEffect } from 'react';
import { supabaseService } from './supabase/client';
import {
  PlatformSettings,
  AdminSubscriptionPlan,
  ContactRequest,
  SupportComplaint,
  LeadStatus,
  TicketStatus,
  TenantFirm,
  PlatformInvoice,
  SuperAdminUser,
  FirmSubscriptionStatus,
} from '../types/admin';

// LocalStorage Keys
const SETTINGS_KEY = 'baseera_platform_settings';
const PLANS_KEY = 'baseera_platform_plans';
const LEADS_KEY = 'baseera_platform_leads';
const TICKETS_KEY = 'baseera_platform_tickets';
const FIRMS_KEY = 'baseera_platform_firms';
const INVOICES_KEY = 'baseera_platform_invoices';
const SUPER_ADMIN_SESSION_KEY = 'baseera_superadmin_session';

// Default Platform Settings
export const DEFAULT_SETTINGS: PlatformSettings = {
  systemName: 'بَـصِـيـرَة',
  systemSubtitle: 'نظام إدارة مكاتب وشركات المحاماة والذكاء القانوني',
  tagline: 'المنظومة السحابية الذكية للمحاكم والمحامين',
  slogan: 'نظام ذكي لإدارة مكاتب المحاماة',
  currency: 'ج.م',
  contactEmail: 'admin@baseera.legal',
  contactPhone: '01023456789',
  supportEmail: 'support@baseera.legal',
  supportPhone: '+20 102 345 6789',
  whatsappNumber: '201023456789',
  trialDays: 14,
  maintenanceMode: false,
};

// Default Subscription Plans
export const DEFAULT_PLANS: AdminSubscriptionPlan[] = [
  {
    id: 'individual',
    name: 'باقة المحامي الفردي',
    monthlyPrice: 500,
    annualPrice: 5000,
    description: 'مثالية للمحامي المستقل الذي يبحث عن تنظيم قضاياه ومواعيده بدقة وسرعة.',
    maxUsers: 2,
    maxStorageGb: 5,
    storageGb: 5,
    isActive: true,
    features: [
      'حتى ٢ مستخدمين (محام ومساعد)',
      'عدد غير محدود من القضايا والموكلين',
      'تصدير الأجندة والرول إلى Excel و Calendar',
      'مساحة تخزين سحابي ٥ جيجابايت للمستندات',
      'تنبيهات مواعيد السقوط والاستئناف والنقض',
      'منشئ العقود الذكية الأساسي',
    ],
  },
  {
    id: 'office',
    name: 'باقة المكاتب المتوسطة',
    monthlyPrice: 1400,
    annualPrice: 14000,
    description: 'الأكثر طلباً لمكاتب المحاماة التي تضم فريق عمل ومحامين ومساعدين.',
    isPopular: true,
    maxUsers: 10,
    maxStorageGb: 50,
    storageGb: 50,
    isActive: true,
    badgeText: 'الأكثر شعبية',
    features: [
      'حتى ١٠ مستخدمين مع صلاحيات مخصصة',
      'قضايا وموكلين وجلسات غير محدودة',
      'لوحة مهام كانبان لتوزيع الأعمال بين المحامين',
      'مساحة تخزين سحابي ٥٠ جيجابايت للمستندات',
      'سجل تدقيق العمليات الكامل (Audit Log)',
      'منشئ العقود الذكية المتقدم مع القوالب غير المحدودة',
      'الماسح الذكي للمستندات (OCR)',
      'دعم فني مخصص وسريع عبر واتساب',
    ],
  },
  {
    id: 'enterprise',
    name: 'باقة المكاتب الكبرى والشركات',
    monthlyPrice: 3700,
    annualPrice: 37000,
    description: 'حل متكامل للمؤسسات القانونية الكبرى والشركات متعددة الفروع.',
    maxUsers: 30,
    maxStorageGb: 150,
    storageGb: 150,
    isActive: true,
    features: [
      'حتى ٣٠ مستخدماً مع أدوار غير محدودة',
      'إدارة فروع متعددة ومخازن مستندات ضخمة',
      'مساحة تخزين ١٥٠ جيجابايت مؤمنة ومشفرة',
      'تقارير محاسبية ومالية متقدمة وتصدير شامل',
      'تخصيص ترويسة وهوية المنصة باسم المكتب',
      'مدير حساب مخصص وتدريب كامل لفريق العمل',
      'دعم فني مباشر على مدار الساعة',
    ],
  },
];

// Initial Demo Law Firms (Multi-Tenant SaaS Directory)
export const DEFAULT_FIRMS: TenantFirm[] = [
  {
    id: '01a08460-df3a-70c0-9a46-f3497eced7c7',
    name: 'مكتب محمد السيد للمحاماة والاستشارات القانونية',
    slug: 'sayed-legal',
    ownerName: 'المستشار / محمد السيد',
    ownerEmail: 'elezabybode375@gmail.com',
    ownerPhone: '01012345678',
    city: 'القاهرة',
    address: '14 شارع مصطفى النحاس، مدينة نصر، القاهرة',
    subscriptionPlan: 'enterprise',
    subscriptionStatus: 'active',
    billingCycle: 'yearly',
    subscriptionEndsAt: '2027-09-09T00:00:00Z',
    createdAt: '2026-01-10T10:00:00Z',
    casesCount: 84,
    clientsCount: 52,
    usersCount: 8,
    storageUsedMb: 14200,
    maxUsers: 30,
    maxStorageGb: 150,
    isVerified: true,
    notes: 'مكتب رئيسي متميز في القضايا المدنية والتجارية ومنازعات المقاولات.',
  },
  {
    id: 'firm-02',
    name: 'مجموعة طارق عبد العزيز للمحاماة والتحكيم الدولي',
    slug: 'tarek-firm',
    ownerName: 'المستشار / طارق عبد العزيز',
    ownerEmail: 'tarek.law@gmail.com',
    ownerPhone: '01098765432',
    city: 'القاهرة الجديدة',
    address: 'مجمع البنوك، التسعين الشمالي، التجمع الخامس',
    subscriptionPlan: 'enterprise',
    subscriptionStatus: 'active',
    billingCycle: 'yearly',
    subscriptionEndsAt: '2027-08-15T00:00:00Z',
    createdAt: '2026-02-15T08:30:00Z',
    casesCount: 132,
    clientsCount: 95,
    usersCount: 14,
    storageUsedMb: 38400,
    maxUsers: 30,
    maxStorageGb: 150,
    isVerified: true,
    notes: 'متخصصون في التحكيم الدولي وعقود الفيديك والشركات المساهمة.',
  },
  {
    id: 'firm-03',
    name: 'مكتب ميادة كمال للمحاماة التجارية والملكية الفكرية',
    slug: 'mayada-legal',
    ownerName: 'الأستاذة / ميادة كمال',
    ownerEmail: 'mayada.legal@outlook.com',
    ownerPhone: '01123456789',
    city: 'الإسكندرية',
    address: 'أبراج سموحة، شارع فوزي معاذ، الإسكندرية',
    subscriptionPlan: 'office',
    subscriptionStatus: 'active',
    billingCycle: 'monthly',
    subscriptionEndsAt: '2026-11-20T00:00:00Z',
    createdAt: '2026-03-20T12:00:00Z',
    casesCount: 46,
    clientsCount: 38,
    usersCount: 5,
    storageUsedMb: 8900,
    maxUsers: 10,
    maxStorageGb: 50,
    isVerified: true,
    notes: 'مكتب نشط جداً في قضايا المحاكم الاقتصادية والعلامات التجارية.',
  },
  {
    id: 'firm-04',
    name: 'الشناوي وشركاه للاستشارات القانونية والضرائب',
    slug: 'elshinawy-law',
    ownerName: 'الأستاذ / عمرو الشناوي',
    ownerEmail: 'elshinawy.law@yahoo.com',
    ownerPhone: '01234567890',
    city: 'الجيزة',
    address: 'شارع مصدق، الدقي، الجيزة',
    subscriptionPlan: 'office',
    subscriptionStatus: 'active',
    billingCycle: 'yearly',
    subscriptionEndsAt: '2027-05-10T00:00:00Z',
    createdAt: '2026-05-10T09:00:00Z',
    casesCount: 62,
    clientsCount: 44,
    usersCount: 7,
    storageUsedMb: 12500,
    maxUsers: 10,
    maxStorageGb: 50,
    isVerified: true,
    notes: 'شراكة مع مكاتب محاسبة قانونية، تخصص ضرائب ومنازعات جمارك.',
  },
  {
    id: 'firm-05',
    name: 'مكتب المستشار حسام الدين للمحاماة الجنائية والنقض',
    slug: 'hossam-law',
    ownerName: 'المستشار / حسام الدين محمد',
    ownerEmail: 'hossam@law.eg',
    ownerPhone: '01511223344',
    city: 'الدقهلية (المنصورة)',
    address: 'شارع الجيش، أمام مجمع المحاكم، المنصورة',
    subscriptionPlan: 'individual',
    subscriptionStatus: 'active',
    billingCycle: 'monthly',
    subscriptionEndsAt: '2026-11-15T00:00:00Z',
    createdAt: '2026-07-01T14:20:00Z',
    casesCount: 29,
    clientsCount: 22,
    usersCount: 2,
    storageUsedMb: 2400,
    maxUsers: 2,
    maxStorageGb: 5,
    isVerified: true,
    notes: 'محامٍ بالنقض الجنائي، يعتمد بكثافة على حاسبة مواعيد الطعن.',
  },
  {
    id: 'firm-06',
    name: 'مكتب الأستاذ أحمد البدري للمحاماة',
    slug: 'elbadry-law',
    ownerName: 'الأستاذ / أحمد البدري',
    ownerEmail: 'elbadry.law@gmail.com',
    ownerPhone: '01065432198',
    city: 'الغربية (طنطا)',
    address: 'شارع البحر، طنطا',
    subscriptionPlan: 'office',
    subscriptionStatus: 'trial',
    billingCycle: 'monthly',
    trialEndsAt: '2026-11-12T00:00:00Z',
    createdAt: '2026-10-29T11:00:00Z',
    casesCount: 8,
    clientsCount: 7,
    usersCount: 3,
    storageUsedMb: 620,
    maxUsers: 10,
    maxStorageGb: 50,
    isVerified: false,
    notes: 'فترة تجريبية 14 يوماً - مهتم بنظام رول الجلسات بدون إنترنت.',
  },
];

// Initial Platform SaaS Invoices
export const DEFAULT_INVOICES: PlatformInvoice[] = [
  {
    id: 'inv-2026-001',
    invoiceNumber: 'INV-BAS-2026-0089',
    firmId: 'firm-02',
    firmName: 'مجموعة طارق عبد العزيز للمحاماة والتحكيم الدولي',
    planName: 'باقة المكاتب الكبرى (سنوي)',
    amount: 37000,
    currency: 'ج.م',
    billingCycle: 'yearly',
    paymentMethod: 'bank_transfer',
    status: 'paid',
    paidAt: '2026-08-15T11:30:00Z',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'inv-2026-002',
    invoiceNumber: 'INV-BAS-2026-0094',
    firmId: '01a08460-df3a-70c0-9a46-f3497eced7c7',
    firmName: 'مكتب محمد السيد للمحاماة والاستشارات القانونية',
    planName: 'باقة المكاتب الكبرى (سنوي)',
    amount: 37000,
    currency: 'ج.م',
    billingCycle: 'yearly',
    paymentMethod: 'instapay',
    status: 'paid',
    paidAt: '2026-09-09T14:15:00Z',
    createdAt: '2026-09-09T10:00:00Z',
  },
  {
    id: 'inv-2026-003',
    invoiceNumber: 'INV-BAS-2026-0105',
    firmId: 'firm-04',
    firmName: 'الشناوي وشركاه للاستشارات القانونية والضرائب',
    planName: 'باقة المكاتب المتوسطة (سنوي)',
    amount: 14000,
    currency: 'ج.م',
    billingCycle: 'yearly',
    paymentMethod: 'credit_card',
    status: 'paid',
    paidAt: '2026-05-10T16:00:00Z',
    createdAt: '2026-05-10T12:00:00Z',
  },
  {
    id: 'inv-2026-004',
    invoiceNumber: 'INV-BAS-2026-0142',
    firmId: 'firm-03',
    firmName: 'مكتب ميادة كمال للمحاماة التجارية',
    planName: 'باقة المكاتب المتوسطة (شهري)',
    amount: 1400,
    currency: 'ج.م',
    billingCycle: 'monthly',
    paymentMethod: 'instapay',
    status: 'paid',
    paidAt: '2026-10-20T10:20:00Z',
    createdAt: '2026-10-20T08:00:00Z',
  },
  {
    id: 'inv-2026-005',
    invoiceNumber: 'INV-BAS-2026-0158',
    firmId: 'firm-05',
    firmName: 'مكتب المستشار حسام الدين للمحاماة الجنائية',
    planName: 'باقة المحامي الفردي (شهري)',
    amount: 500,
    currency: 'ج.م',
    billingCycle: 'monthly',
    paymentMethod: 'vodafone_cash',
    status: 'paid',
    paidAt: '2026-10-15T15:45:00Z',
    createdAt: '2026-10-15T12:30:00Z',
  },
];

// Initial Demo Leads from Landing Page
export const DEFAULT_LEADS: ContactRequest[] = [
  {
    id: 'lead-01',
    full_name: 'المستشار / طارق عبد العزيز',
    firm_name: 'مجموعة طارق عبد العزيز للمحاماة والاستشارات',
    phone: '01098765432',
    email: 'tarek.law@gmail.com',
    city: 'القاهرة (التجمع الخامس)',
    team_size: '6-15',
    message: 'نرغب في عرض توضيحي (ديمو) للنظام لفريق العمل لدينا لمعرفة كيفية نقل القضايا من الإكسيل لبصيرة.',
    status: 'converted',
    created_at: '2026-09-18T14:30:00Z',
    internal_notes: 'تم الاشتراك بالفعل في باقة المكاتب الكبرى.',
  },
  {
    id: 'lead-02',
    full_name: 'الأستاذة / ميادة كمال',
    firm_name: 'مكتب ميادة كمال للمحاماة التجارية',
    phone: '01123456789',
    email: 'mayada.legal@outlook.com',
    city: 'الإسكندرية (سموحة)',
    team_size: '2-5',
    message: 'مهتمة بباقة المكاتب المتوسطة واستخدام منشئ العقود الذكية ونظام متابعة مواعيد الطعون.',
    status: 'converted',
    created_at: '2026-09-17T11:20:00Z',
    internal_notes: 'تم تفعيل حساب المكتب والبدء بالباقة المتوسطة.',
  },
  {
    id: 'lead-03',
    full_name: 'الأستاذ / عمرو الشناوي',
    firm_name: 'الشناوي وشركاه للاستشارات القانونية والضرائب',
    phone: '01234567890',
    email: 'elshinawy.law@yahoo.com',
    city: 'الجيزة (الدقي)',
    team_size: '15+',
    message: 'نبحث عن نظام متكامل لإدارة 4 فروع مع صلاحيات دقيقة للمحامين ومتابعة محاسبية للأتعاب.',
    status: 'converted',
    created_at: '2026-09-16T09:15:00Z',
    internal_notes: 'تم الربط بالباقة المتوسطة مع إمكانية الترقية.',
  },
  {
    id: 'lead-04',
    full_name: 'المستشار / وائل سلامة',
    firm_name: 'مجموعة سلامة للمحاماة والتحكيم الهندسي',
    phone: '01011447788',
    email: 'wael.salama@law.com.eg',
    city: 'القاهرة (المعادي)',
    team_size: '6-15',
    message: 'نحتاج تجربة لنظام الرول الذكي ومزامنة قاعة المحكمة أوفلاين مع 5 محامين بالمكتب.',
    status: 'demo_scheduled',
    created_at: '2026-11-01T15:00:00Z',
    internal_notes: 'موعد الديمو عبر زووم غداً الساعة 4 عصراً.',
  },
  {
    id: 'lead-05',
    full_name: 'الأستاذة / رانيا الشافعي',
    firm_name: 'مكتب الشافعي للمنازعات العمالية والمدنية',
    phone: '01288990011',
    email: 'rania.shafie@gmail.com',
    city: 'بورسعيد',
    team_size: '2-5',
    message: 'نريد الاستفسار عن إمكانية نقل قضايا 3 سنوات سابقة ومستندات موكلينا إلى النظام.',
    status: 'new',
    created_at: '2026-11-02T10:15:00Z',
  },
];

// Initial Demo Complaints & Support Tickets
export const DEFAULT_COMPLAINTS: SupportComplaint[] = [
  {
    id: 'ticket-101',
    ticket_number: 'TCK-2026-081',
    firm_name: 'مكتب محمد السيد للمحاماة',
    user_name: 'المستشار / محمد السيد',
    user_phone: '01012345678',
    user_email: 'elezabybode375@gmail.com',
    category: 'technical',
    priority: 'urgent',
    subject: 'مزامنة رول جلسات محكمة شمال القاهرة الابتدائية بعد الخروج من القاعة',
    message: 'تم إدخال قرار تأجيل جلسة اليوم في وضع الأوفلاين، ونريد التأكد من اكتمال رفع المستند في السحابة فور عودة الشبكة.',
    status: 'resolved',
    created_at: '2026-11-01T14:45:00Z',
    resolution_notes: 'تم التحقق من اكتمال المزامنة وظهور القرار في أجندة المكتب بنجاح.',
  },
  {
    id: 'ticket-102',
    ticket_number: 'TCK-2026-079',
    firm_name: 'مجموعة طارق عبد العزيز للمحاماة',
    user_name: 'المستشار / طارق عبد العزيز',
    user_phone: '01098765432',
    user_email: 'tarek.law@gmail.com',
    category: 'billing',
    priority: 'high',
    subject: 'طلب إصدار فاتورة إلكترونية ضريبية رسمية باشتراك العام القادم',
    message: 'نريد إصدار فاتورة ضريبية إلكترونية رسمية باسم شركتنا متضمنة رقم السجل التجاري والبطاقة الضريبية لخصمها في المركز المالي.',
    status: 'in_progress',
    created_at: '2026-10-28T13:10:00Z',
    resolution_notes: 'تم تحويل الطلب لقسم الحسابات والمالية لإصدار الفاتورة الضريبية.',
  },
  {
    id: 'ticket-103',
    ticket_number: 'TCK-2026-075',
    firm_name: 'مكتب المستشار / حسام الدين',
    user_name: 'الأستاذ / حسام الدين محمد',
    user_phone: '01511223344',
    user_email: 'hossam@law.eg',
    category: 'feature_request',
    priority: 'medium',
    subject: 'اقتراح إضافة تنبيه تلقائي بميعاد الطعن عبر واتساب للموكل مع إرفاق نص الحكم',
    message: 'النظام مذهل في احتساب مواعيد الطعون، ونقترح إضافة زر مباشر لإرسال ملخص الميعاد القانوني إلى واتساب الموكل بنص رسمي.',
    status: 'resolved',
    created_at: '2026-10-20T10:00:00Z',
    resolution_notes: 'تمت إضافة ميزة المشاركة الفورية عبر واتساب في حاسبة الطعون.',
  },
];

// Super Admin Default Credentials (For Platform SaaS Owners)
export const DEFAULT_SUPER_ADMIN: SuperAdminUser = {
  id: 'super-admin-01',
  email: 'admin@baseera.legal',
  fullName: 'المدير التنفيذي للمنصة',
  role: 'super_admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  lastLoginAt: new Date().toISOString(),
};

// In-memory listeners for cross-component reactive updates
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

// Global state getters & setters with localStorage persistence
export const platformStorage = {
  // Super Admin Session
  getSuperAdminSession(): SuperAdminUser | null {
    try {
      const stored = localStorage.getItem(SUPER_ADMIN_SESSION_KEY) || sessionStorage.getItem(SUPER_ADMIN_SESSION_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  },
  setSuperAdminSession(user: SuperAdminUser | null, remember: boolean = true) {
    if (user) {
      const data = JSON.stringify(user);
      if (remember) {
        localStorage.setItem(SUPER_ADMIN_SESSION_KEY, data);
      } else {
        sessionStorage.setItem(SUPER_ADMIN_SESSION_KEY, data);
      }
    } else {
      localStorage.removeItem(SUPER_ADMIN_SESSION_KEY);
      sessionStorage.removeItem(SUPER_ADMIN_SESSION_KEY);
    }
    notify();
  },

  // Settings
  getSettings(): PlatformSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_SETTINGS;
  },
  saveSettings(settings: PlatformSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    notify();
  },

  // Subscription Plans
  getPlans(): AdminSubscriptionPlan[] {
    try {
      const stored = localStorage.getItem(PLANS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_PLANS;
  },
  savePlans(plans: AdminSubscriptionPlan[]) {
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
    notify();
  },
  updatePlanPrice(id: string, monthlyPrice: number, annualPrice: number) {
    const plans = this.getPlans().map((p) =>
      p.id === id ? { ...p, monthlyPrice, annualPrice } : p
    );
    this.savePlans(plans);
  },

  // Tenant Law Firms (Multi-Tenancy)
  getFirms(): TenantFirm[] {
    try {
      const stored = localStorage.getItem(FIRMS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_FIRMS;
  },
  saveFirms(firms: TenantFirm[]) {
    localStorage.setItem(FIRMS_KEY, JSON.stringify(firms));
    notify();
  },
  addFirm(firmData: Omit<TenantFirm, 'id' | 'createdAt' | 'casesCount' | 'clientsCount' | 'usersCount' | 'storageUsedMb'>) {
    const newId = `firm-${Date.now()}`;
    const newFirm: TenantFirm = {
      ...firmData,
      id: newId,
      createdAt: new Date().toISOString(),
      casesCount: 0,
      clientsCount: 0,
      usersCount: 1,
      storageUsedMb: 10,
    };
    const current = this.getFirms();
    this.saveFirms([newFirm, ...current]);

    // Push to Supabase if configured
    if (supabaseService.isConfigured() && supabaseService.client) {
      supabaseService.client.from('firms').insert([{
        id: newId,
        name: firmData.name,
        slug: firmData.slug || newId,
        phone: firmData.ownerPhone,
        email: firmData.ownerEmail,
        city: firmData.city,
        address: firmData.address,
        subscription_status: firmData.subscriptionStatus,
        subscription_plan: firmData.subscriptionPlan,
        subscription_cycle: firmData.billingCycle,
        max_users: firmData.maxUsers,
        max_storage_gb: firmData.maxStorageGb,
        max_cases: 10000,
        is_verified: true,
        notes: `المالك: ${firmData.ownerName} | ${firmData.notes || ''}`,
      }]).then(({ error }) => {
        if (error) console.warn('[Supabase firms insert notice]:', error.message);
      });
    }

    return newFirm;
  },
  updateFirm(id: string, data: Partial<TenantFirm>) {
    const firms = this.getFirms().map((f) => (f.id === id ? { ...f, ...data } : f));
    this.saveFirms(firms);
  },
  extendFirmTrial(id: string, days: number = 14) {
    const firms = this.getFirms().map((f) => {
      if (f.id === id) {
        const currentEnd = f.trialEndsAt ? new Date(f.trialEndsAt) : new Date();
        const newEnd = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000);
        return {
          ...f,
          subscriptionStatus: 'trial' as FirmSubscriptionStatus,
          trialEndsAt: newEnd.toISOString(),
        };
      }
      return f;
    });
    this.saveFirms(firms);
  },
  toggleFirmStatus(id: string, newStatus: FirmSubscriptionStatus) {
    const firms = this.getFirms().map((f) => (f.id === id ? { ...f, subscriptionStatus: newStatus } : f));
    this.saveFirms(firms);
  },
  updateFirmPlan(id: string, plan: 'individual' | 'office' | 'enterprise') {
    const quotas = {
      individual: { maxUsers: 2, maxStorageGb: 5 },
      office: { maxUsers: 10, maxStorageGb: 50 },
      enterprise: { maxUsers: 30, maxStorageGb: 150 },
    }[plan];

    const firms = this.getFirms().map((f) =>
      f.id === id
        ? {
            ...f,
            subscriptionPlan: plan,
            maxUsers: quotas.maxUsers,
            maxStorageGb: quotas.maxStorageGb,
          }
        : f
    );
    this.saveFirms(firms);
  },
  deleteFirm(id: string) {
    const firms = this.getFirms().filter((f) => f.id !== id);
    this.saveFirms(firms);
  },

  // Platform Invoices
  getInvoices(): PlatformInvoice[] {
    try {
      const stored = localStorage.getItem(INVOICES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_INVOICES;
  },
  saveInvoices(invoices: PlatformInvoice[]) {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    notify();
  },
  addInvoice(inv: Omit<PlatformInvoice, 'id' | 'createdAt'>) {
    const newInvoice: PlatformInvoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const current = this.getInvoices();
    this.saveInvoices([newInvoice, ...current]);
    return newInvoice;
  },
  updateInvoiceStatus(id: string, status: 'paid' | 'pending' | 'failed' | 'refunded', paidAt?: string) {
    const invoices = this.getInvoices().map((inv) =>
      inv.id === id ? { ...inv, status, ...(paidAt ? { paidAt } : {}) } : inv
    );
    this.saveInvoices(invoices);
  },

  // Leads
  getLeads(): ContactRequest[] {
    try {
      const stored = localStorage.getItem(LEADS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_LEADS;
  },
  saveLeads(leads: ContactRequest[]) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    notify();
  },
  addLead(lead: Omit<ContactRequest, 'id' | 'created_at' | 'status'>) {
    const newLead: ContactRequest = {
      ...lead,
      id: `lead-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'new',
    };
    const current = this.getLeads();
    this.saveLeads([newLead, ...current]);
    return newLead;
  },
  updateLeadStatus(id: string, status: LeadStatus, internal_notes?: string) {
    const leads = this.getLeads().map((l) =>
      l.id === id ? { ...l, status, ...(internal_notes ? { internal_notes } : {}) } : l
    );
    this.saveLeads(leads);
  },

  // Complaints / Support Tickets
  getComplaints(): SupportComplaint[] {
    try {
      const stored = localStorage.getItem(TICKETS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_COMPLAINTS;
  },
  saveComplaints(tickets: SupportComplaint[]) {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    notify();
  },
  addComplaint(ticket: Omit<SupportComplaint, 'id' | 'ticket_number' | 'created_at' | 'status'>) {
    const newTicket: SupportComplaint = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      ticket_number: `TCK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
      status: 'new',
    };
    const current = this.getComplaints();
    this.saveComplaints([newTicket, ...current]);
    return newTicket;
  },
  updateComplaintStatus(id: string, status: TicketStatus, resolution_notes?: string) {
    const tickets = this.getComplaints().map((t) =>
      t.id === id ? { ...t, status, ...(resolution_notes ? { resolution_notes } : {}) } : t
    );
    this.saveComplaints(tickets);
  },
};

/**
 * Custom React Hook to consume and update Platform State reactively across the whole app
 */
export function usePlatformStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const adminSession = platformStorage.getSuperAdminSession();
  const settings = platformStorage.getSettings();
  const plans = platformStorage.getPlans();
  const firms = platformStorage.getFirms();
  const invoices = platformStorage.getInvoices();
  const leads = platformStorage.getLeads();
  const complaints = platformStorage.getComplaints();

  // Financial & platform stats calculation
  const activeFirms = firms.filter((f) => f.subscriptionStatus === 'active');
  const trialFirms = firms.filter((f) => f.subscriptionStatus === 'trial');
  
  // Calculate approximate MRR from active firms
  const monthlyRevenueEstimate = activeFirms.reduce((acc, firm) => {
    const plan = plans.find((p) => p.id === firm.subscriptionPlan);
    if (!plan) return acc;
    if (firm.billingCycle === 'monthly') {
      return acc + plan.monthlyPrice;
    } else {
      return acc + Math.round(plan.annualPrice / 12);
    }
  }, 0);

  const annualRunRate = monthlyRevenueEstimate * 12;
  const totalUsersCount = firms.reduce((acc, f) => acc + (f.usersCount || 1), 0);
  const totalCasesCount = firms.reduce((acc, f) => acc + (f.casesCount || 0), 0);

  const stats = {
    totalLeads: leads.length,
    newLeadsCount: leads.filter((l) => l.status === 'new').length,
    openTicketsCount: complaints.filter((c) => c.status === 'new' || c.status === 'in_progress').length,
    urgentTicketsCount: complaints.filter((c) => c.priority === 'urgent' && c.status !== 'closed').length,
    totalSubscribedFirms: firms.length,
    activeFirmsCount: activeFirms.length,
    trialFirmsCount: trialFirms.length,
    totalUsersCount,
    totalCasesCount,
    monthlyRevenueEstimate,
    annualRunRate,
  };

  return {
    adminSession,
    isSuperAdminAuthenticated: !!adminSession,
    loginSuperAdmin: (email: string, pass: string, remember: boolean = true) => {
      const cleanEmail = email.trim().toLowerCase();
      // Valid credentials check: default admin or demo master
      const valid =
        (cleanEmail === 'admin@baseera.legal' && (pass === 'superadmin2026' || pass === 'admin123' || pass === 'password123')) ||
        (cleanEmail === 'elezabybode375@gmail.com' && (pass === 'password123' || pass === 'superadmin2026')) ||
        pass === 'superadmin2026' || pass === 'admin123';

      if (!valid) {
        return { success: false, error: 'البريد الإلكتروني أو كلمة المرور الرئيسية للإدارة غير صحيحة.' };
      }

      const user: SuperAdminUser = {
        id: 'super-admin-01',
        email: cleanEmail || DEFAULT_SUPER_ADMIN.email,
        fullName: cleanEmail.includes('elezaby') ? 'م. عبد الرحمن العزبي (المالك)' : 'المشرف العام للمنصة',
        role: 'super_admin',
        avatarUrl: DEFAULT_SUPER_ADMIN.avatarUrl,
        lastLoginAt: new Date().toISOString(),
      };

      platformStorage.setSuperAdminSession(user, remember);
      return { success: true, user };
    },
    logoutSuperAdmin: () => {
      platformStorage.setSuperAdminSession(null);
    },
    settings,
    plans,
    firms,
    invoices,
    leads,
    complaints,
    stats,

    // Actions
    updateSettings: (s: PlatformSettings) => platformStorage.saveSettings(s),
    updatePlans: (p: AdminSubscriptionPlan[]) => platformStorage.savePlans(p),
    updatePlanPrice: (id: string, monthly: number, annual: number) =>
      platformStorage.updatePlanPrice(id, monthly, annual),

    // Firm actions
    syncFirmsFromSupabase: async () => {
      if (!supabaseService.isConfigured() || !supabaseService.client) return;
      try {
        const { data: dbFirms } = await supabaseService.client
          .from('firms')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbFirms && dbFirms.length > 0) {
          const mapped: TenantFirm[] = dbFirms.map((f: any) => ({
            id: f.id,
            name: f.name,
            slug: f.slug || `firm-${f.id.slice(0, 8)}`,
            ownerName: f.notes?.includes('المالك: ') ? f.notes.split('المالك: ')[1]?.split('|')[0]?.trim() : 'مدير المكتب',
            ownerEmail: f.email || 'lawyer@baseera.legal',
            ownerPhone: f.phone || '',
            city: f.city || 'القاهرة',
            address: f.address || '',
            subscriptionPlan: f.subscription_plan || 'office',
            subscriptionStatus: f.subscription_status || 'active',
            billingCycle: f.subscription_cycle || 'monthly',
            trialEndsAt: f.trial_ends_at,
            subscriptionEndsAt: f.current_period_end,
            createdAt: f.created_at,
            casesCount: f.max_cases || 0,
            clientsCount: 0,
            usersCount: f.max_users || 1,
            storageUsedMb: 0,
            maxUsers: f.max_users || 10,
            maxStorageGb: f.max_storage_gb || 50,
            isVerified: f.is_verified ?? true,
            notes: f.notes || '',
          }));
          platformStorage.saveFirms(mapped);
        }
      } catch (err) {
        console.warn('[syncFirmsFromSupabase] error:', err);
      }
    },
    addFirm: (f: Parameters<typeof platformStorage.addFirm>[0]) => platformStorage.addFirm(f),
    updateFirm: (id: string, data: Partial<TenantFirm>) => platformStorage.updateFirm(id, data),
    extendFirmTrial: (id: string, days?: number) => platformStorage.extendFirmTrial(id, days),
    toggleFirmStatus: (id: string, status: FirmSubscriptionStatus) =>
      platformStorage.toggleFirmStatus(id, status),
    updateFirmPlan: (id: string, plan: 'individual' | 'office' | 'enterprise') =>
      platformStorage.updateFirmPlan(id, plan),
    deleteFirm: (id: string) => platformStorage.deleteFirm(id),

    // Invoices actions
    addInvoice: (inv: Parameters<typeof platformStorage.addInvoice>[0]) =>
      platformStorage.addInvoice(inv),
    updateInvoiceStatus: (id: string, status: Parameters<typeof platformStorage.updateInvoiceStatus>[1], paidAt?: string) =>
      platformStorage.updateInvoiceStatus(id, status, paidAt),

    // Leads & Tickets actions
    addLead: (l: Omit<ContactRequest, 'id' | 'created_at' | 'status'>) =>
      platformStorage.addLead(l),
    updateLeadStatus: (id: string, status: LeadStatus, notes?: string) =>
      platformStorage.updateLeadStatus(id, status, notes),
    addComplaint: (c: Omit<SupportComplaint, 'id' | 'ticket_number' | 'created_at' | 'status'>) =>
      platformStorage.addComplaint(c),
    updateComplaintStatus: (id: string, status: TicketStatus, notes?: string) =>
      platformStorage.updateComplaintStatus(id, status, notes),
  };
}
