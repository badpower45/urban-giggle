import { useState, useEffect } from 'react';
import {
  PlatformSettings,
  AdminSubscriptionPlan,
  ContactRequest,
  SupportComplaint,
  LeadStatus,
  TicketStatus,
  TicketPriority,
} from '../types/admin';

// LocalStorage Keys
const SETTINGS_KEY = 'siyaq_platform_settings';
const PLANS_KEY = 'siyaq_platform_plans';
const LEADS_KEY = 'siyaq_platform_leads';
const TICKETS_KEY = 'siyaq_platform_tickets';

// Default Platform Settings
export const DEFAULT_SETTINGS: PlatformSettings = {
  systemName: 'سِـيَـاق',
  systemSubtitle: 'نظام إدارة مكاتب وشركات المحاماة',
  tagline: 'المنظومة السحابية المتكاملة للمحاكم والمحامين',
  slogan: 'نظام لإدارة مكاتب المحاماة',
  currency: 'ج.م',
  contactEmail: 'support@siyaq.legal',
  contactPhone: '01023456789',
  supportEmail: 'support@siyaq.legal',
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
    message: 'نرغب في عرض توضيحي (ديمو) للنظام لفريق العمل لدينا لمعرفة كيفية نقل القضايا من الإكسيل لسياق.',
    status: 'new',
    created_at: '2026-09-18T14:30:00Z',
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
    status: 'contacted',
    created_at: '2026-09-17T11:20:00Z',
    internal_notes: 'تم الاتصال بها هاتفياً وتحديد موعد تجربة يوم الأحد القادم.',
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
    status: 'demo_scheduled',
    created_at: '2026-09-16T09:15:00Z',
    internal_notes: 'حجز ديمو زووم مع الشركاء يوم الإثنين الساعة 2 ظهراً.',
  },
];

// Initial Demo Complaints & Support Tickets
export const DEFAULT_COMPLAINTS: SupportComplaint[] = [
  {
    id: 'ticket-101',
    ticket_number: 'TCK-2026-081',
    firm_name: 'مكتب الأمل للمحاماة',
    user_name: 'الأستاذ / عبد الرحمن رضوان',
    user_phone: '01012345678',
    user_email: 'radwan@amal-law.com',
    category: 'technical',
    priority: 'urgent',
    subject: 'عدم ظهور قرار الجلسة المنعقدة اليوم في رول المحكمة بعد الحفظ',
    message: 'قمت بإدخال قرار جلسة محكمة شمال القاهرة الابتدائية برول اليوم ولم يظهر في الإشعارات الفورية للمساعدين في المكتب، أرجو المراجعة سريعاً.',
    status: 'new',
    created_at: '2026-09-18T16:45:00Z',
  },
  {
    id: 'ticket-102',
    ticket_number: 'TCK-2026-079',
    firm_name: 'مؤسسة العدالة الدولية',
    user_name: 'الأستاذة / نورهان سليم',
    user_phone: '01298765432',
    user_email: 'nourhan@justice-intl.com',
    category: 'billing',
    priority: 'high',
    subject: 'استفسار بخصوص تجديد الاشتراك السنوي وإصدار فاتورة إلكترونية باسم الشركة',
    message: 'نريد ترقية باقتنا للباقة الكبرى مع سداد سنوي، ونحتاج إصدار فاتورة ضريبية رسمية باسم شركتنا برقم السجل والبطاقة الضريبية.',
    status: 'in_progress',
    created_at: '2026-09-17T13:10:00Z',
    resolution_notes: 'تم التواصل من قسم الحسابات وجارٍ إصدار الفاتورة الضريبية.',
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
    subject: 'اقتراح لإضافة تنبيه عبر الرسائل النصية القصيرة SMS للموكلين بمواعيد جلساتهم',
    message: 'النظام ممتاز جداً، ونقترح إضافة ميزة إرسال رسالة SMS تلقائية للموكل تبلغه بميعاد جلسته القادمة وقرار المحكمة مباشرة.',
    status: 'resolved',
    created_at: '2026-09-15T10:00:00Z',
    resolution_notes: 'تمت إضافة الميزة لخارطة طريق التحديثات القادمة وإبلاغ المحامي.',
  },
];

// In-memory listeners for cross-component reactive updates
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

// Global state getters & setters with localStorage persistence
export const platformStorage = {
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

  const settings = platformStorage.getSettings();
  const plans = platformStorage.getPlans();
  const leads = platformStorage.getLeads();
  const complaints = platformStorage.getComplaints();

  // Calculated stats
  const stats = {
    totalLeads: leads.length,
    newLeadsCount: leads.filter((l) => l.status === 'new').length,
    openTicketsCount: complaints.filter((c) => c.status === 'new' || c.status === 'in_progress').length,
    urgentTicketsCount: complaints.filter((c) => c.priority === 'urgent' && c.status !== 'closed').length,
    totalSubscribedFirms: 124, // Mock metric
    monthlyRevenueEstimate: 1400 * 80 + 3700 * 30 + 500 * 14,
  };

  return {
    settings,
    plans,
    leads,
    complaints,
    stats,
    updateSettings: (s: PlatformSettings) => platformStorage.saveSettings(s),
    updatePlans: (p: AdminSubscriptionPlan[]) => platformStorage.savePlans(p),
    updatePlanPrice: (id: string, monthly: number, annual: number) =>
      platformStorage.updatePlanPrice(id, monthly, annual),
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
