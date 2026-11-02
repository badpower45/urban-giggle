import {
  Case,
  Client,
  CourtSession,
  LegalDeadline,
  Task,
  PoliceReport,
  BillingReport,
  User,
  Firm,
  FirmMember,
  FirmRole,
  SubscriptionPlan,
  PowerOfAttorney
} from '../../types';
import { ContractInstance } from '../../types/contract';

const STORAGE_KEY = 'baseera_app_data_v1';

const now = new Date();
const addDays = (d: Date, days: number) => {
  const res = new Date(d);
  res.setDate(res.getDate() + days);
  return res.toISOString().split('T')[0];
};

export const INITIAL_USER: User = {
  id: '01a08460-b523-7667-b6cd-7863e99c38c7',
  full_name: 'محمد السيد',
  email: 'elezabybode375@gmail.com',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  member_since: '2026-09-09',
  auth_provider: 'google',
  two_fa_enabled: false,
};

export const INITIAL_FIRM: Firm = {
  id: '01a08460-df3a-70c0-9a46-f3497eced7c7',
  name: 'مكتب محمد السيد للمحاماة والاستشارات القانونية',
  logo_url: '/logo.svg',
  created_at: '2026-09-09T00:00:00Z',
};

export const INITIAL_ROLES: FirmRole[] = [
  {
    id: '019e413f-f4b3-7e2c-adc4-599d10397216',
    name: 'مالك المكتب',
    slug: 'owner',
    permissions: ['*'],
    is_system: true,
    members_count: 1,
  },
  {
    id: '019e413f-f4b4-7bb5-98d8-524f44e15cd4',
    name: 'محامٍ أساسي',
    slug: 'senior',
    permissions: ['cases.create', 'cases.edit', 'cases.view', 'sessions.create', 'sessions.edit', 'clients.view', 'clients.create', 'billing.manage'],
    is_system: true,
    members_count: 1,
  },
  {
    id: '019e413f-f4b5-7856-abc3-76500ed100c4',
    name: 'مساعد قانوني',
    slug: 'junior',
    permissions: ['cases.view', 'clients.view', 'sessions.create', 'tasks.view'],
    is_system: true,
    members_count: 1,
  },
];

export const INITIAL_MEMBERS: FirmMember[] = [
  {
    user_id: INITIAL_USER.id,
    full_name: INITIAL_USER.full_name,
    email: INITIAL_USER.email,
    avatar_url: INITIAL_USER.avatar_url,
    role_id: '019e413f-f4b3-7e2c-adc4-599d10397216',
    role_name: 'مالك المكتب',
    role_slug: 'owner',
    joined_at: '2026-09-09T00:00:00Z',
  },
  {
    user_id: 'user-2',
    full_name: 'خالد السعيد',
    email: 'khaled@baseera.legal',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role_id: '019e413f-f4b4-7bb5-98d8-524f44e15cd4',
    role_name: 'محامٍ أساسي',
    role_slug: 'senior',
    joined_at: '2026-08-20T00:00:00Z',
  },
  {
    user_id: 'user-3',
    full_name: 'منى إبراهيم',
    email: 'mona@baseera.legal',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role_id: '019e413f-f4b5-7856-abc3-76500ed100c4',
    role_name: 'مساعد قانوني',
    role_slug: 'junior',
    joined_at: '2026-08-28T00:00:00Z',
  },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '01a085e6-e9ad-71b6-95f2-766fc4418bdf',
    firm_id: INITIAL_FIRM.id,
    full_name: 'شركة عامر للتجارة الدولية',
    client_type: 'company',
    occupation: 'استيراد وتصدير',
    company_reg: '764764',
    phone: '01223456789',
    email: 'contact@amer-trade.eg',
    address: 'حي الشرق، بورسعيد',
    notes: 'موكل رئيسي بقضية تعويض تجاري وتوريدات.',
    active_cases: 1,
    case_count: 1,
    report_count: 0,
    created_at: '2026-09-09T11:21:37Z',
    updated_at: '2026-09-09T11:21:37Z',
  },
  {
    id: 'client-101',
    firm_id: INITIAL_FIRM.id,
    full_name: 'أحمد محمود إسماعيل',
    client_type: 'individual',
    occupation: 'مهندس مدني',
    national_id: '28501011234567',
    phone: '01012345678',
    email: 'ahmed.mahmoud@example.com',
    address: 'مدينة نصر، القاهرة',
    notes: 'عميل مرتبط بقضية تعويض عمالي ضد شركة مقاولات.',
    active_cases: 1,
    case_count: 1,
    report_count: 1,
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z',
  },
  {
    id: 'client-102',
    firm_id: INITIAL_FIRM.id,
    full_name: 'سارة عبد الرحمن حسن',
    client_type: 'individual',
    occupation: 'مديرة حسابات',
    national_id: '29104159876543',
    phone: '01123456789',
    email: 'sara.abdelrahman@example.com',
    address: 'مصر الجديدة، القاهرة',
    notes: 'دعوى نفقة ومصروفات علاجية وصغار.',
    active_cases: 1,
    case_count: 1,
    report_count: 0,
    created_at: '2026-08-22T14:30:00Z',
    updated_at: '2026-08-22T14:30:00Z',
  },
  {
    id: 'client-103',
    firm_id: INITIAL_FIRM.id,
    full_name: 'شركة النيل للصناعات الدوائية',
    client_type: 'company',
    occupation: 'صناعات دوائية ومستلزمات',
    company_reg: '452199',
    phone: '0223456789',
    email: 'legal@nile-pharma.com',
    address: 'المنطقة الصناعية، التجمع الخامس',
    notes: 'نزاع تجاري حول عقد توريد مواد خام.',
    active_cases: 1,
    case_count: 2,
    report_count: 0,
    created_at: '2026-08-10T09:15:00Z',
    updated_at: '2026-08-10T09:15:00Z',
  },
  {
    id: 'client-104',
    firm_id: INITIAL_FIRM.id,
    full_name: 'محمد عبد الله الشيخ',
    client_type: 'individual',
    occupation: 'رجل أعمال ومطور عقاري',
    national_id: '27911021239988',
    phone: '01234567890',
    email: 'm.elsheikh@example.com',
    address: 'دجلة، المعادي، القاهرة',
    notes: 'منازعة تثبيت ملكية عقار بالمعادي.',
    active_cases: 1,
    case_count: 1,
    report_count: 0,
    created_at: '2026-07-19T11:00:00Z',
    updated_at: '2026-07-19T11:00:00Z',
  },
];

export const INITIAL_CASES: Case[] = [
  {
    id: '01a085f6-51f3-7bf7-bf6e-d58b1182af70',
    firm_id: INITIAL_FIRM.id,
    client_id: '01a085e6-e9ad-71b6-95f2-766fc4418bdf',
    client_name: 'شركة عامر للتجارة الدولية',
    title: 'دعوى فسخ عقد توريد ومطالبة بتعويض',
    case_number: '3542523',
    case_year: 2026,
    court_id: 'c1',
    court_name: 'محكمة بورسعيد الابتدائية',
    court_governorate: 'بورسعيد',
    case_type_id: 'ct1',
    case_type_name: 'مدني جزئي',
    circuit: 'الدائرة 3 مدني بورسعيد',
    description: 'المطالبة بمستحقات بضائع متأخرة ومصروفات تفريغ وشحن بالحاويات بميناء بورسعيد.',
    opponent_name: 'شركة الصفا للشحن والتفريغ',
    opponent_lawyer: 'الأستاذ أحمد فؤاد المحامي',
    client_role: 'plaintiff',
    filing_date: '2026-09-01T00:00:00Z',
    status: 'active',
    assigned_to: INITIAL_USER.id,
    assigned_to_name: INITIAL_USER.full_name,
    next_session_date: addDays(now, 14),
    nearest_deadline_date: addDays(now, 10),
    sessions_count: 2,
    pending_deadlines_count: 1,
    total_fees: 30000,
    total_paid: 20000,
    created_by: INITIAL_USER.id,
    created_at: '2026-09-09T11:38:27Z',
    updated_at: '2026-09-09T11:38:49Z',
  },
  {
    id: 'case-201',
    firm_id: INITIAL_FIRM.id,
    client_id: 'client-101',
    client_name: 'أحمد محمود إسماعيل',
    title: 'دعوى تعويض عن إصابة عمل وفصل تعسفي',
    case_number: '1842',
    case_year: 2026,
    court_id: 'c2',
    court_name: 'محكمة شمال القاهرة الابتدائية',
    court_governorate: 'القاهرة',
    case_type_id: 'ct3',
    case_type_name: 'تعويضات عمالية',
    circuit: 'الدائرة 7 عمال',
    description: 'مطالبة بتعويض مادي وأدبي طبقاً للمادة 122 من قانون العمل 12 لسنة 2003.',
    opponent_name: 'شركة الأهرام للإنشاءات الحديثة',
    opponent_lawyer: 'الأستاذ عادل الشربيني',
    client_role: 'plaintiff',
    filing_date: '2026-06-12T00:00:00Z',
    status: 'active',
    assigned_to: 'user-2',
    assigned_to_name: 'خالد السعيد',
    next_session_date: addDays(now, 2),
    nearest_deadline_date: addDays(now, 3),
    sessions_count: 3,
    pending_deadlines_count: 1,
    total_fees: 15000,
    total_paid: 5000,
    created_by: INITIAL_USER.id,
    created_at: '2026-06-12T10:00:00Z',
    updated_at: '2026-09-05T12:00:00Z',
  },
  {
    id: 'case-202',
    firm_id: INITIAL_FIRM.id,
    client_id: 'client-102',
    client_name: 'سارة عبد الرحمن حسن',
    title: 'دعوى نفقة زوجية وبدل فرش وغطاء',
    case_number: '912',
    case_year: 2026,
    court_id: 'c4',
    court_name: 'محكمة الأسرة بمدينة نصر',
    court_governorate: 'القاهرة',
    case_type_id: 'ct5',
    case_type_name: 'أسرة',
    circuit: 'الدائرة 3 أسرة',
    description: 'طلب فرض نفقة مؤقتة وإلزام المدعى عليه بالإنفاق ومصاريف التعليم.',
    opponent_name: 'حسام مصطفى كمال',
    opponent_lawyer: 'الأستاذ إبراهيم جلال',
    client_role: 'plaintiff',
    filing_date: '2026-07-01T00:00:00Z',
    status: 'active',
    assigned_to: INITIAL_USER.id,
    assigned_to_name: INITIAL_USER.full_name,
    next_session_date: addDays(now, 5),
    nearest_deadline_date: addDays(now, 8),
    sessions_count: 1,
    pending_deadlines_count: 1,
    total_fees: 12000,
    total_paid: 8000,
    created_by: INITIAL_USER.id,
    created_at: '2026-07-01T11:20:00Z',
    updated_at: '2026-09-01T09:00:00Z',
  },
  {
    id: 'case-203',
    firm_id: INITIAL_FIRM.id,
    client_id: 'client-103',
    client_name: 'شركة النيل للصناعات الدوائية',
    title: 'منازعة تجارية وإلزام بسداد فواتير اعتمادات مستندية',
    case_number: '331',
    case_year: 2026,
    court_id: 'c5',
    court_name: 'المحكمة الاقتصادية بالقاهرة',
    court_governorate: 'القاهرة',
    case_type_id: 'ct6',
    case_type_name: 'تجاري وشركات',
    circuit: 'الدائرة الاستئنافية الأولى',
    description: 'نزاع تحكيمي ومطالبة بقيمة شحنات دوائية وتطبيق غرامات التأخير التعاقدية.',
    opponent_name: 'الشركة السويسرية للكيماويات',
    opponent_lawyer: 'مكتب الشرقاوي وسراج للمحاماة',
    client_role: 'plaintiff',
    filing_date: '2026-04-10T00:00:00Z',
    status: 'reserved_for_ruling',
    assigned_to: 'user-2',
    assigned_to_name: 'خالد السعيد',
    next_session_date: addDays(now, 9),
    nearest_deadline_date: addDays(now, 6),
    sessions_count: 5,
    pending_deadlines_count: 1,
    total_fees: 45000,
    total_paid: 25000,
    created_by: INITIAL_USER.id,
    created_at: '2026-04-10T08:30:00Z',
    updated_at: '2026-09-08T16:00:00Z',
  },
  {
    id: 'case-204',
    firm_id: INITIAL_FIRM.id,
    client_id: 'client-104',
    client_name: 'محمد عبد الله الشيخ',
    title: 'دعوى صحة ونفاذ عقد بيع أرض فضاء بالمعادي',
    case_number: '77',
    case_year: 2025,
    court_id: 'c3',
    court_name: 'محكمة جنوب القاهرة الابتدائية',
    court_governorate: 'القاهرة',
    case_type_id: 'ct4',
    case_type_name: 'منازعات عقارية وتمليك',
    circuit: 'الدائرة 12 مدني كلي',
    description: 'تثبيت ملكية قطعة أرض مساحتها 1200 متر مربع والتحقق من صحة توقيع البائع.',
    opponent_name: 'ورثة المرحوم كامل البشري',
    opponent_lawyer: 'الأستاذ عصام توفيق',
    client_role: 'plaintiff',
    filing_date: '2025-11-20T00:00:00Z',
    status: 'on_hold',
    assigned_to: INITIAL_USER.id,
    assigned_to_name: INITIAL_USER.full_name,
    next_session_date: null,
    nearest_deadline_date: addDays(now, 7),
    sessions_count: 4,
    pending_deadlines_count: 1,
    total_fees: 20000,
    total_paid: 10000,
    created_by: INITIAL_USER.id,
    created_at: '2025-11-20T13:00:00Z',
    updated_at: '2026-08-30T10:00:00Z',
  },
];

export const INITIAL_SESSIONS: CourtSession[] = [
  {
    id: 'session-301',
    case_id: 'case-201',
    case_title: 'دعوى تعويض عن إصابة عمل وفصل تعسفي',
    case_court: 'محكمة شمال القاهرة الابتدائية',
    case_client: 'أحمد محمود إسماعيل',
    session_date: addDays(now, 2),
    outcome_type: 'adjourned',
    adjournment_reason: 'لتقديم أصل عقد العمل ومطابقة شهادة التأمينات الاجتماعية والرد على مذكرة الخصم.',
    notes: 'حضور المحامي خالد السعيد بتوكيل رسمي.',
    next_session_date: addDays(now, 21),
  },
  {
    id: 'session-302',
    case_id: 'case-202',
    case_title: 'دعوى نفقة زوجية وبدل فرش وغطاء',
    case_court: 'محكمة الأسرة بمدينة نصر',
    case_client: 'سارة عبد الرحمن حسن',
    session_date: addDays(now, 5),
    outcome_type: 'adjourned',
    adjournment_reason: 'لورود التحريات المالية عن دخل الزوج من جهة عمله بالبنك الأهلي.',
    notes: 'الجلسة الأولى بعد إعادة الإعلان.',
    next_session_date: addDays(now, 28),
  },
  {
    id: 'session-303',
    case_id: 'case-203',
    case_title: 'منازعة تجارية وإلزام بسداد فواتير اعتمادات مستندية',
    case_court: 'المحكمة الاقتصادية بالقاهرة',
    case_client: 'شركة النيل للصناعات الدوائية',
    session_date: addDays(now, 9),
    outcome_type: 'reserved_for_ruling',
    adjournment_reason: 'حجز الدعوى للحكم مع التصريح بمذكرات ختامية خلال 3 أيام.',
    notes: 'المرافعة الختامية مكتملة وتم إيداع تقرير الخبير الحسابي.',
    next_session_date: null,
  },
  {
    id: 'session-304',
    case_id: '01a085f6-51f3-7bf7-bf6e-d58b1182af70',
    case_title: 'دعوى فسخ عقد توريد ومطالبة بتعويض',
    case_court: 'محكمة بورسعيد الابتدائية',
    case_client: 'شركة عامر للتجارة الدولية',
    session_date: addDays(now, 14),
    outcome_type: 'adjourned',
    adjournment_reason: 'لضم المفردات الجمركية من ميناء بورسعيد.',
    notes: 'جلسة استجواب الخصم وتقديم المستندات.',
    next_session_date: addDays(now, 35),
  },
];

export const INITIAL_DEADLINES: LegalDeadline[] = [
  {
    id: 'dl-401',
    case_id: 'case-201',
    case_title: 'دعوى تعويض عمالي - أحمد محمود',
    deadline_date: addDays(now, 3),
    type: 'تقديم مذكرة دفاع',
    urgency: 'critical',
    is_confirmed: true,
    description: 'إيداع مذكرة رد ختامية على مذكرة الدفاع المقدمة من محامي شركة الأهرام.',
  },
  {
    id: 'dl-402',
    case_id: 'case-203',
    case_title: 'نزاع تجاري - شركة النيل',
    deadline_date: addDays(now, 6),
    type: 'إيداع أصل عقد التوريد',
    urgency: 'high',
    is_confirmed: true,
    description: 'تسليم النسخة الموثقة من العقد إلى سكرتارية الدائرة قبل موعد النطق بالحكم.',
  },
  {
    id: 'dl-403',
    case_id: 'case-204',
    case_title: 'منازعة ملكية عقارية - محمد الشيخ',
    deadline_date: addDays(now, 7),
    type: 'تجديد التوكيل الخاص',
    urgency: 'medium',
    is_confirmed: true,
    description: 'تجديد توكيل القضايا من الشهر العقاري بالمعادي لإرفاقه بمحضر الجلسة.',
  },
  {
    id: 'dl-404',
    case_id: 'case-202',
    case_title: 'قضية نفقة - سارة عبد الرحمن',
    deadline_date: addDays(now, 8),
    type: 'إيداع شهادة التحريات',
    urgency: 'high',
    is_confirmed: true,
    description: 'استلام شهادة دخل الزوج من مصلحة الضرائب وإيداعها ملف الدعوى.',
  },
  {
    id: 'dl-405',
    case_id: '01a085f6-51f3-7bf7-bf6e-d58b1182af70',
    case_title: 'دعوى فسخ توريد - شركة عامر',
    deadline_date: addDays(now, 10),
    type: 'سداد أمانة الخبير',
    urgency: 'medium',
    is_confirmed: true,
    description: 'سداد رسم أمانة خبير وزارة العدل المنتدب لفحص البضائع.',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    firm_id: INITIAL_FIRM.id,
    case_id: 'case-201',
    case_title: 'دعوى تعويض عمالي',
    title: 'مراجعة أصل عقد العمل وتحضير حافظة المستندات',
    description: 'ترتيب إيصالات التحويل البنكي وتوقيعات الحضور والانصراف.',
    priority: 'high',
    status: 'in_progress',
    assigned_to: 'user-2',
    assigned_to_name: 'خالد السعيد',
    due_date: addDays(now, 2),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-2',
    firm_id: INITIAL_FIRM.id,
    case_id: 'case-202',
    case_title: 'قضية نفقة',
    title: 'استخراج شهادة رسمية من السجل المدني للزوج والطفل',
    description: 'إرفاق شهادة الميلاد المميكنة وقيد الزواج في ملف المحكمة.',
    priority: 'medium',
    status: 'pending',
    assigned_to: 'user-3',
    assigned_to_name: 'منى إبراهيم',
    due_date: addDays(now, 4),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-3',
    firm_id: INITIAL_FIRM.id,
    case_id: null,
    case_title: null,
    title: 'متابعة تأسيس شركة ذات مسؤولية محدودة بالهيئة العامة للاستثمار',
    description: 'حجز الاسم التجاري والحصول على شهادة عدم الالتباس.',
    priority: 'urgent',
    status: 'pending',
    assigned_to: INITIAL_USER.id,
    assigned_to_name: INITIAL_USER.full_name,
    due_date: addDays(now, 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-4',
    firm_id: INITIAL_FIRM.id,
    case_id: 'case-203',
    case_title: 'المحكمة الاقتصادية',
    title: 'تسليم المذكرات الختامية لسكرتارية الدائرة التجارية',
    description: 'تم تسليم النسخ وسداد رسوم الإيداع والحصول على إيصال التوريد.',
    priority: 'high',
    status: 'completed',
    assigned_to: 'user-2',
    assigned_to_name: 'خالد السعيد',
    due_date: addDays(now, -1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_POAS: PowerOfAttorney[] = [
  {
    id: 'poa-701',
    firm_id: INITIAL_FIRM.id,
    client_id: 'client-101',
    poa_number: '1254 ب لسنة 2026',
    poa_date: '2026-01-15',
    poa_type: 'special',
    poa_notary_type: 'شهر عقاري',
    poa_notary_office: 'توثيق مدينة نصر',
    poa_scope: 'الحضور والترافع واتخاذ كافة إجراءات التقاضي والصلح والإقرار في دعوى التعويض العمالي رقم 1842 لسنة 2026 عمال شمال القاهرة.',
    status: 'active',
    notes: 'توكيل ساري ومودع صورة طبق الأصل منه بملف الدعوى.',
    created_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 'poa-702',
    firm_id: INITIAL_FIRM.id,
    client_id: 'client-103',
    poa_number: '984 أ لسنة 2025',
    poa_date: '2025-10-01',
    poa_type: 'general',
    poa_notary_type: 'شهر عقاري',
    poa_notary_office: 'توثيق استثمار القاهرة',
    poa_scope: 'توكيل رسمي عام في القضايا والتحكيم وتمثيل الشركة أمام كافة المحاكم والهيئات القضائية ولجان فض المنازعات.',
    status: 'active',
    notes: 'توكيل رسمي عام شركات ساري.',
    created_at: '2025-10-01T10:00:00Z',
  },
];

export const INITIAL_POLICE_REPORTS: PoliceReport[] = [
  {
    id: 'pr-801',
    firm_id: INITIAL_FIRM.id,
    client_id: 'client-101',
    client_name: 'أحمد محمود إسماعيل',
    report_number: '3421',
    report_year: 2026,
    report_type: 'junhah',
    security_directorate: 'مديرية أمن القاهرة',
    police_station: 'قسم شرطة أول مدينة نصر',
    police_point: 'نقطة الحي العاشر',
    general_prosecution: 'نيابة شرق القاهرة الكلية',
    district_prosecution: 'نيابة أول مدينة نصر الجزئية',
    status: 'under_investigation',
    subject: 'تبديد أمانة (وصل أمانة)',
    incident_summary: 'تحرير محضر بواقعة خيانة أمانة ضد المقاول لامتناعه عن رد مبالغ مالية مسلمة إليه بموجب إيصال أمانة.',
    incident_location: 'موقع العمل بمدينة نصر',
    dispatch_number: 'صادر 541 / 2026',
    intake_number: 'وارد نيابة 812 / 2026',
    investigating_prosecutor: 'الأستاذ عمر الشريف - وكيل النائب العام',
    total_fees: 5000,
    total_expenses: 500,
    linked_case_id: null,
    created_at: '2026-08-10T12:00:00Z',
    updated_at: '2026-08-10T12:00:00Z',
  },
  {
    id: 'pr-802',
    firm_id: INITIAL_FIRM.id,
    client_id: 'client-104',
    client_name: 'محمد عبد الله الشيخ',
    report_number: '1245',
    report_year: 2026,
    report_type: 'admin',
    security_directorate: 'مديرية أمن القاهرة',
    police_station: 'قسم شرطة المعادي',
    general_prosecution: 'نيابة جنوب القاهرة الكلية',
    district_prosecution: 'نيابة المعادي الجزئية',
    status: 'archived',
    subject: 'إثبات حالة / عدم تعرض ومنازعة حيازة عقار',
    incident_summary: 'إثبات محاولة وضع يد غير مشروع على قطعة أرض وتكليف المباحث بإجراء التحريات.',
    incident_location: 'شارع النادي، دجلة المعادي',
    dispatch_number: '210 / 2026',
    archive_number: 'حفظ إداري 88 / 2026',
    appeal_number: 'تظلم 14 لسنة 2026',
    appeal_date: '2026-09-02',
    appeal_authority: 'المحامي العام الأول لنيابات جنوب القاهرة',
    appeal_decision: 'قيد الفحص والدراسة',
    total_fees: 7000,
    total_expenses: 850,
    linked_case_id: 'case-204',
    created_at: '2026-08-25T11:00:00Z',
    updated_at: '2026-09-02T15:00:00Z',
  },
];

export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: '019e413f-f467-74c7-8a8d-7c1551adea8d',
    name: 'المحامي الفردي',
    slug: 'individual-monthly',
    billing_cycle: 'monthly',
    price: '500.00',
    currency: 'EGP',
    interval_days: 30,
    features: [
      { key_name: 'max_members', type: 'quota', limit_value: 2 },
      { key_name: 'max_clients', type: 'quota', limit_value: 0 },
      { key_name: 'max_cases', type: 'quota', limit_value: 0 },
      { key_name: 'calendar_export', type: 'boolean', limit_value: 1 },
      { key_name: 'storage_bytes', type: 'quota', limit_value: 5368709120 },
    ],
  },
  {
    id: '019e413f-f46e-7970-a147-f9d7993eba29',
    name: 'المكاتب المتوسطة',
    slug: 'office-monthly',
    billing_cycle: 'monthly',
    price: '1400.00',
    currency: 'EGP',
    interval_days: 30,
    features: [
      { key_name: 'max_members', type: 'quota', limit_value: 10 },
      { key_name: 'max_clients', type: 'quota', limit_value: 0 },
      { key_name: 'max_cases', type: 'quota', limit_value: 0 },
      { key_name: 'calendar_export', type: 'boolean', limit_value: 1 },
      { key_name: 'storage_bytes', type: 'quota', limit_value: 53687091200 },
    ],
  },
  {
    id: '019e413f-f473-7a87-99ce-21d2f484c400',
    name: 'المكاتب الكبيرة',
    slug: 'enterprise-monthly',
    billing_cycle: 'monthly',
    price: '3700.00',
    currency: 'EGP',
    interval_days: 30,
    features: [
      { key_name: 'max_members', type: 'quota', limit_value: 30 },
      { key_name: 'max_clients', type: 'quota', limit_value: 0 },
      { key_name: 'max_cases', type: 'quota', limit_value: 0 },
      { key_name: 'calendar_export', type: 'boolean', limit_value: 1 },
      { key_name: 'storage_bytes', type: 'quota', limit_value: 161061273600 },
    ],
  },
];

// App Data Model
export interface AppData {
  user: User;
  firm: Firm;
  members: FirmMember[];
  roles: FirmRole[];
  clients: Client[];
  cases: Case[];
  sessions: CourtSession[];
  deadlines: LegalDeadline[];
  tasks: Task[];
  poas: PowerOfAttorney[];
  policeReports: PoliceReport[];
  plans: SubscriptionPlan[];
  expenses: Array<{ id: string; title: string; amount: number; date: string; case_id?: string }>;
  contracts: ContractInstance[];
}

class Store {
  private data: AppData;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.data = this.load();
  }

  private load(): AppData {
    if (typeof window === 'undefined') return this.getInitialData();
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('siyaq_app_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.contracts) parsed.contracts = [];
        if (!parsed.deadlines) parsed.deadlines = [];
        if (!parsed.sessions) parsed.sessions = [];
        if (!parsed.tasks) parsed.tasks = [];
        if (!parsed.policeReports) parsed.policeReports = [];
        if (!parsed.expenses) parsed.expenses = [];
        return parsed;
      }
    } catch {
      // ignore
    }
    const initial = this.getInitialData();
    this.persist(initial);
    return initial;
  }

  private persist(data: AppData) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }
    }
  }

  private getInitialData(): AppData {
    return {
      user: INITIAL_USER,
      firm: INITIAL_FIRM,
      members: INITIAL_MEMBERS,
      roles: INITIAL_ROLES,
      clients: INITIAL_CLIENTS,
      cases: INITIAL_CASES,
      sessions: INITIAL_SESSIONS,
      deadlines: INITIAL_DEADLINES,
      tasks: INITIAL_TASKS,
      poas: INITIAL_POAS,
      policeReports: INITIAL_POLICE_REPORTS,
      plans: INITIAL_PLANS,
      expenses: [
        { id: 'exp-1', title: 'رسوم قيد دعوى ورسوم دمغة', amount: 650, date: '2026-06-12', case_id: 'case-201' },
        { id: 'exp-2', title: 'إعلانات محضري الأسرة', amount: 300, date: '2026-07-01', case_id: 'case-202' },
        { id: 'exp-3', title: 'أمانة خبير حسابي بالمحكمة الاقتصادية', amount: 2200, date: '2026-05-15', case_id: 'case-203' },
      ],
      contracts: [
        {
          id: 'ci-101',
          template_id: 'tmpl-retainer-lawyer',
          template_name: 'عقد اتفاق وتحديد أتعاب محاماة واستشارات قانونية ووكالة قضائية',
          case_id: 'case-201',
          case_title: 'دعوى تعويض عن إصابة عمل وفصل تعسفي',
          client_id: 'client-101',
          client_name: 'أحمد محمود إسماعيل',
          status: 'signed',
          final_html: '<p>عقد أتعاب محاماة موثق وموقع بين مكتب المحاماة والموكل أحمد محمود إسماعيل في دعوى التعويض رقم 1842 لسنة 2026 عمال شمال القاهرة.</p>',
          filled_data: {
            second_party_name: 'أحمد محمود إسماعيل',
            second_party_id: '28501011234567',
            case_number: '1842 لسنة 2026 عمال شمال القاهرة',
            contract_value: '15000',
            down_payment: '5000',
            lawyer_name: 'محمد السيد المحامي',
          },
          created_at: '2026-06-12T10:00:00Z',
          updated_at: '2026-06-12T10:00:00Z',
        },
        {
          id: 'ci-102',
          template_id: 'tmpl-settlement-court',
          template_name: 'إقرار تصالح وتنازل نهائي عن جنحة / دعوى قضائية',
          case_id: '01a085f6-51f3-7bf7-bf6e-d58b1182af70',
          case_title: 'دعوى فسخ عقد توريد ومطالبة بتعويض',
          client_id: '01a085e6-e9ad-71b6-95f2-766fc4418bdf',
          client_name: 'شركة عامر للتجارة الدولية',
          status: 'under_review',
          final_html: '<p>مشروع إقرار تصالح وتنازل نهائي عن الدعوى رقم 3542523 لسنة 2026 مدني بورسعيد بعد التراضي والوفاء بالالتزامات.</p>',
          filled_data: {
            first_party_name: 'شركة عامر للتجارة الدولية',
            second_party_name: 'شركة الصفا للشحن والتفريغ',
            case_number: '3542523 لسنة 2026 مدني بورسعيد',
          },
          created_at: '2026-09-10T14:00:00Z',
          updated_at: '2026-09-10T14:00:00Z',
        },
      ],
    };
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.persist(this.data);
    this.listeners.forEach((l) => l());
  }

  public getState(): AppData {
    return this.data;
  }

  // CASES
  public getCases(): Case[] {
    return this.data.cases;
  }

  public setCases(cases: Case[]) {
    const incomingIds = new Set(cases.map((c) => c.id));
    const localOnly = this.data.cases.filter((c) => !incomingIds.has(c.id));
    this.data.cases = [...cases, ...localOnly];
    this.notify();
  }

  public getCaseById(id: string): Case | undefined {
    return this.data.cases.find((c) => c.id === id);
  }

  public addCase(newCase: Omit<Case, 'id' | 'created_at' | 'updated_at' | 'sessions_count' | 'pending_deadlines_count'> & { id?: string }): Case {
    const id = newCase.id || `case-${Date.now()}`;
    const created: Case = {
      ...newCase,
      id,
      sessions_count: 0,
      pending_deadlines_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.cases.unshift(created);

    // Update client active cases
    const client = this.data.clients.find((c) => c.id === newCase.client_id);
    if (client) {
      client.active_cases += 1;
      client.case_count += 1;
    }

    this.notify();
    return created;
  }

  public updateCase(id: string, updates: Partial<Case>): Case | null {
    const idx = this.data.cases.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.cases[idx] = {
      ...this.data.cases[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.notify();
    return this.data.cases[idx];
  }

  public deleteCase(id: string): boolean {
    const idx = this.data.cases.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    const removed = this.data.cases.splice(idx, 1)[0];
    const client = this.data.clients.find((c) => c.id === removed.client_id);
    if (client && client.active_cases > 0) {
      client.active_cases -= 1;
    }
    this.notify();
    return true;
  }

  // CLIENTS
  public getClients(): Client[] {
    return this.data.clients;
  }

  public setClients(clients: Client[]) {
    this.data.clients = clients;
    this.notify();
  }

  public getClientById(id: string): Client | undefined {
    return this.data.clients.find((c) => c.id === id);
  }

  public addClient(newClient: Omit<Client, 'id' | 'firm_id' | 'active_cases' | 'case_count' | 'report_count' | 'created_at' | 'updated_at'> & { id?: string }): Client {
    const id = newClient.id || `client-${Date.now()}`;
    const created: Client = {
      ...newClient,
      id,
      firm_id: this.data.firm.id,
      active_cases: 0,
      case_count: 0,
      report_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.clients.unshift(created);
    this.notify();
    return created;
  }

  public updateClient(id: string, updates: Partial<Client>): Client | null {
    const idx = this.data.clients.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.clients[idx] = {
      ...this.data.clients[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.notify();
    return this.data.clients[idx];
  }

  public deleteClient(id: string): boolean {
    const idx = this.data.clients.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.data.clients.splice(idx, 1);
    this.notify();
    return true;
  }

  // SESSIONS
  public getSessions(): CourtSession[] {
    return this.data.sessions;
  }

  public setSessions(sessions: CourtSession[]) {
    const incomingIds = new Set(sessions.map((s) => s.id));
    const localOnly = this.data.sessions.filter((s) => !incomingIds.has(s.id));
    this.data.sessions = [...sessions, ...localOnly];
    this.notify();
  }

  public getSessionsByCase(caseId: string): CourtSession[] {
    return this.data.sessions.filter((s) => s.case_id === caseId);
  }

  public addSession(session: Omit<CourtSession, 'id' | 'created_at'> & { id?: string }): CourtSession {
    const id = session.id || `session-${Date.now()}`;
    const created: CourtSession = {
      ...session,
      id,
      created_at: new Date().toISOString(),
    };
    this.data.sessions.unshift(created);

    // Update case next session date
    const c = this.data.cases.find((item) => item.id === session.case_id);
    if (c) {
      c.sessions_count += 1;
      if (session.next_session_date) {
        c.next_session_date = session.next_session_date;
      }
    }

    this.notify();
    return created;
  }

  public updateSession(id: string, updates: Partial<CourtSession>): CourtSession | null {
    const idx = this.data.sessions.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.sessions[idx] = {
      ...this.data.sessions[idx],
      ...updates,
    };
    this.notify();
    return this.data.sessions[idx];
  }

  public deleteSession(id: string): boolean {
    const idx = this.data.sessions.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.data.sessions.splice(idx, 1);
    this.notify();
    return true;
  }

  // DEADLINES
  public getDeadlines(): LegalDeadline[] {
    return this.data.deadlines;
  }

  public setDeadlines(deadlines: LegalDeadline[]) {
    const incomingIds = new Set(deadlines.map((d) => d.id));
    const localOnly = this.data.deadlines.filter((d) => !incomingIds.has(d.id));
    this.data.deadlines = [...deadlines, ...localOnly];
    this.notify();
  }

  public addDeadline(deadline: Omit<LegalDeadline, 'id' | 'created_at'> & { id?: string }): LegalDeadline {
    const id = deadline.id || `dl-${Date.now()}`;
    const created: LegalDeadline = {
      ...deadline,
      id,
      created_at: new Date().toISOString(),
    };
    this.data.deadlines.unshift(created);

    const c = this.data.cases.find((item) => item.id === deadline.case_id);
    if (c) {
      c.pending_deadlines_count += 1;
      c.nearest_deadline_date = deadline.deadline_date;
    }

    this.notify();
    return created;
  }

  public updateDeadline(id: string, updates: Partial<LegalDeadline>): LegalDeadline | null {
    const idx = this.data.deadlines.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.data.deadlines[idx] = {
      ...this.data.deadlines[idx],
      ...updates,
    };
    this.notify();
    return this.data.deadlines[idx];
  }

  public deleteDeadline(id: string): boolean {
    const idx = this.data.deadlines.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    this.data.deadlines.splice(idx, 1);
    this.notify();
    return true;
  }

  // TASKS
  public getTasks(): Task[] {
    return this.data.tasks;
  }

  public setTasks(tasks: Task[]) {
    const incomingIds = new Set(tasks.map((t) => t.id));
    const localOnly = this.data.tasks.filter((t) => !incomingIds.has(t.id));
    this.data.tasks = [...tasks, ...localOnly];
    this.notify();
  }

  public addTask(task: Omit<Task, 'id' | 'firm_id' | 'created_at' | 'updated_at'> & { id?: string }): Task {
    const id = task.id || `task-${Date.now()}`;
    const created: Task = {
      ...task,
      id,
      firm_id: this.data.firm.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.tasks.unshift(created);
    this.notify();
    return created;
  }

  public updateTask(id: string, updates: Partial<Task>): Task | null {
    const idx = this.data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.data.tasks[idx] = {
      ...this.data.tasks[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.notify();
    return this.data.tasks[idx];
  }

  public deleteTask(id: string): boolean {
    const idx = this.data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.data.tasks.splice(idx, 1);
    this.notify();
    return true;
  }

  // POLICE REPORTS
  public getPoliceReports(): PoliceReport[] {
    return this.data.policeReports;
  }

  public setPoliceReports(reports: PoliceReport[]) {
    const incomingIds = new Set(reports.map((r) => r.id));
    const localOnly = this.data.policeReports.filter((r) => !incomingIds.has(r.id));
    this.data.policeReports = [...reports, ...localOnly];
    this.notify();
  }

  public getPoliceReportsByCase(caseId: string): PoliceReport[] {
    return this.data.policeReports.filter((r) => r.linked_case_id === caseId);
  }

  // CONTRACTS
  public getContracts(caseId?: string): ContractInstance[] {
    if (!this.data.contracts) this.data.contracts = [];
    if (caseId) {
      return this.data.contracts.filter((c) => c.case_id === caseId);
    }
    return this.data.contracts;
  }

  public addContract(contract: Omit<ContractInstance, 'id' | 'created_at' | 'updated_at'> & { id?: string }): ContractInstance {
    if (!this.data.contracts) this.data.contracts = [];
    const id = contract.id || `ci-${Date.now()}`;
    const created: ContractInstance = {
      ...contract,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.contracts.unshift(created);
    this.notify();
    return created;
  }

  public deleteContract(id: string): boolean {
    if (!this.data.contracts) return false;
    const idx = this.data.contracts.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.data.contracts.splice(idx, 1);
    this.notify();
    return true;
  }

  // EXPENSES
  public getExpenses(caseId?: string) {
    if (!this.data.expenses) this.data.expenses = [];
    if (caseId) {
      return this.data.expenses.filter((e) => e.case_id === caseId);
    }
    return this.data.expenses;
  }

  public addExpense(expense: { title: string; amount: number; date: string; case_id?: string }) {
    if (!this.data.expenses) this.data.expenses = [];
    const id = `exp-${Date.now()}`;
    const created = { id, ...expense };
    this.data.expenses.unshift(created);
    this.notify();
    return created;
  }

  public getPoliceReportById(id: string): PoliceReport | undefined {
    return this.data.policeReports.find((r) => r.id === id);
  }

  public addPoliceReport(report: Omit<PoliceReport, 'id' | 'firm_id' | 'created_at' | 'updated_at'> & { id?: string }): PoliceReport {
    const id = report.id || `pr-${Date.now()}`;
    const created: PoliceReport = {
      ...report,
      id,
      firm_id: this.data.firm.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.policeReports.unshift(created);
    this.notify();
    return created;
  }

  public updatePoliceReport(id: string, updates: Partial<PoliceReport>): PoliceReport | null {
    const idx = this.data.policeReports.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.policeReports[idx] = {
      ...this.data.policeReports[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.notify();
    return this.data.policeReports[idx];
  }

  public deletePoliceReport(id: string): boolean {
    const idx = this.data.policeReports.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.data.policeReports.splice(idx, 1);
    this.notify();
    return true;
  }

  // POAS
  public getPoas(clientId?: string): PowerOfAttorney[] {
    if (clientId) {
      return this.data.poas.filter((p) => p.client_id === clientId);
    }
    return this.data.poas;
  }

  public setPoas(poas: PowerOfAttorney[]) {
    this.data.poas = poas;
    this.notify();
  }

  public addPoa(poa: Omit<PowerOfAttorney, 'id' | 'firm_id' | 'created_at'>): PowerOfAttorney {
    const id = `poa-${Date.now()}`;
    const created: PowerOfAttorney = {
      ...poa,
      id,
      firm_id: this.data.firm.id,
      created_at: new Date().toISOString(),
    };
    this.data.poas.unshift(created);
    this.notify();
    return created;
  }

  public deletePoa(id: string): boolean {
    const idx = this.data.poas.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.data.poas.splice(idx, 1);
    this.notify();
    return true;
  }

  // BILLING
  public getBillingReport(dateFrom?: string, dateTo?: string): BillingReport {
    let casesList = this.data.cases;
    if (dateFrom) {
      casesList = casesList.filter((c) => c.created_at >= dateFrom);
    }
    if (dateTo) {
      casesList = casesList.filter((c) => c.created_at <= dateTo);
    }

    const casesSummary = casesList.map((c) => {
      const expenses = this.data.expenses
        .filter((e) => e.case_id === c.id)
        .reduce((sum, e) => sum + e.amount, 0);

      const outstanding = Math.max(0, c.total_fees - c.total_paid);
      const net = c.total_paid - expenses;

      return {
        case_id: c.id,
        case_title: c.title,
        client_name: c.client_name,
        total_fees: c.total_fees,
        total_paid: c.total_paid,
        outstanding_balance: outstanding,
        total_expenses_firm: expenses,
        net_revenue: net,
        entity_type: 'case' as const,
      };
    });

    const totalFees = casesSummary.reduce((acc, c) => acc + c.total_fees, 0);
    const totalPaid = casesSummary.reduce((acc, c) => acc + c.total_paid, 0);
    const outstandingTotal = casesSummary.reduce((acc, c) => acc + c.outstanding_balance, 0);
    const expensesTotal = casesSummary.reduce((acc, c) => acc + c.total_expenses_firm, 0);
    const netRevenue = totalPaid - expensesTotal;

    return {
      cases: casesSummary,
      total_fees: totalFees,
      total_paid: totalPaid,
      outstanding_balance: outstandingTotal,
      total_expenses_firm: expensesTotal,
      net_revenue: netRevenue,
    };
  }

  // Reset to initial state
  public reset() {
    this.data = this.getInitialData();
    this.notify();
  }

  public logout() {
    this.reset();
  }
}

export const appStore = new Store();

import { useState, useEffect } from 'react';

export const useAuthStore = () => {
  const [state, setState] = useState(appStore.getState());
  useEffect(() => {
    return appStore.subscribe(() => setState(appStore.getState()));
  }, []);
  return {
    user: state.user,
    firm: state.firm,
    logout: () => appStore.logout(),
  };
};
