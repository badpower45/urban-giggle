/**
 * Egyptian Legal Procedures & Case Lifecycle Presets
 * Baseera Legal OS - Egyptian Jurisdiction Data Engine
 */

export interface LegalProcedureRule {
  id: string;
  name: string;
  nameEn: string;
  category: 'criminal' | 'civil' | 'family' | 'commercial' | 'administrative' | 'execution';
  days: number;
  legalArticle: string;
  urgencyDefault: 'critical' | 'high' | 'medium';
  description: string;
  consequenceOfExpiry: string;
}

export const EGYPTIAN_LEGAL_PROCEDURE_RULES: LegalProcedureRule[] = [
  {
    id: 'criminal_opposition',
    name: 'معارضة في حكم غيابي (جنح)',
    nameEn: 'Criminal In-Absentia Opposition',
    category: 'criminal',
    days: 10,
    legalArticle: 'المادة 398 من قانون الإجراءات الجنائية',
    urgencyDefault: 'critical',
    description: 'الطعن بالمعارضة في الأحكام الغيابية الصادرة في الجنح والمخالفات، ويترتب عليها إعادة نظر الدعوى ووقف التنفيذ.',
    consequenceOfExpiry: 'سقوط الحق في المعارضة وصيرورة الحكم قابلاً للاستئناف فقط مع قابلية التنفيذ الجبري.',
  },
  {
    id: 'criminal_appeal',
    name: 'استئناف حكم جنح جزئية',
    nameEn: 'Misdemeanor Appeal',
    category: 'criminal',
    days: 10,
    legalArticle: 'المادة 406 من قانون الإجراءات الجنائية',
    urgencyDefault: 'critical',
    description: 'استئناف الحكم الحضوري الصادر من محكمة أول درجة جنح جزئية أمام محكمة الجنح المستأنفة.',
    consequenceOfExpiry: 'سقوط حق المتهم في الاستئناف وصيرورة الحكم نهائياً وواجب النفاذ الجبري فوراً.',
  },
  {
    id: 'criminal_cassation',
    name: 'طعن بالنقض الجنائي',
    nameEn: 'Criminal Cassation Appeal',
    category: 'criminal',
    days: 60,
    legalArticle: 'المادة 34 من قانون حالات وإجراءات الطعن أمام محكمة النقض (قانون 57 لسنة 1959)',
    urgencyDefault: 'high',
    description: 'الطعن بالنقض وإيداع مذكرة الأسباب موقعة من محامٍ مقبول أمام محكمة النقض في أحكام الجنح المستأنفة والجنايات.',
    consequenceOfExpiry: 'سقوط حق الطعن بالنقض بطلاناً متعلقاً بالنظام العام وتأييد الحكم بصفة باتة.',
  },
  {
    id: 'civil_appeal',
    name: 'استئناف أحكام مدنية وتجارية ابتدائية',
    nameEn: 'Civil & Commercial Appeal',
    category: 'civil',
    days: 40,
    legalArticle: 'المادة 227 من قانون المرافعات المدنية والتجارية',
    urgencyDefault: 'critical',
    description: 'ميعاد استئناف الأحكام الصادرة في الدعاوى المدنية والتجارية الموضوعية من المحاكم الابتدائية.',
    consequenceOfExpiry: 'سقوط الحق في الاستئناف وصيرورة الحكم الابتدائي نهائياً وحائزاً لقوة الأمر المقضي.',
  },
  {
    id: 'urgent_civil_appeal',
    name: 'استئناف أحكام القضاء المستعجل',
    nameEn: 'Summary & Urgent Injunction Appeal',
    category: 'civil',
    days: 15,
    legalArticle: 'المادة 227 (الفقرة الثانية) من قانون المرافعات',
    urgencyDefault: 'critical',
    description: 'ميعاد استئناف الأوامر والأحكام الصادرة في المسائل المستعجلة وأوامر النفاذ الوقتي.',
    consequenceOfExpiry: 'فوات ميعاد الاستئناف وصيرورة الأمر المستعجل نهائياً.',
  },
  {
    id: 'civil_cassation',
    name: 'طعن بالنقض (مدني وتجاري وأسرة)',
    nameEn: 'Civil & Commercial Cassation',
    category: 'civil',
    days: 60,
    legalArticle: 'المادة 252 من قانون المرافعات المدنية والتجارية',
    urgencyDefault: 'high',
    description: 'الطعن بالنقض على الأحكام الاستئنافية الصادرة بصفة انتهائية من محاكم الاستئناف العالي ومحاكم الأسرة الاستئنافية.',
    consequenceOfExpiry: 'سقوط الحق في الطعن وصيرورة الحكم باتاً غير قابل للطعن بأي طريق عادي.',
  },
  {
    id: 'administrative_appeal',
    name: 'طعن أمام المحكمة الإدارية العليا (مجلس الدولة)',
    nameEn: 'Supreme Administrative Court Appeal',
    category: 'administrative',
    days: 60,
    legalArticle: 'المادة 44 من قانون مجلس الدولة رقم 47 لسنة 1972',
    urgencyDefault: 'high',
    description: 'الطعن أمام المحكمة الإدارية العليا على الأحكام الصادرة من محاكم القضاء الإداري والمحاكم التأديبية.',
    consequenceOfExpiry: 'سقوط الحق في الطعن وصيرورة القرار الإداري المحكوم به نهائياً وباتاً.',
  },
  {
    id: 'payment_order_grievance',
    name: 'تظلم في أمر أداء أو أمر على عريضة',
    nameEn: 'Payment Order Grievance',
    category: 'commercial',
    days: 10,
    legalArticle: 'المادة 206 والمادة 207 من قانون المرافعات',
    urgencyDefault: 'critical',
    description: 'التظلم من أمر الأداء الصادر بسداد ديون تجارية أو أوراق تجارية أو أوامر الحجز الوقتية.',
    consequenceOfExpiry: 'اعتبار أمر الأداء نهائياً وبمثابة حكم قضائي قابل للتنفيذ الجبري.',
  },
  {
    id: 'court_memo_filing',
    name: 'إيداع مذكرة دفاع ختامية بتصريح المحكمة',
    nameEn: 'Closing Defense Memorandum Submission',
    category: 'civil',
    days: 3,
    legalArticle: 'قرار هيئة المحكمة بمحضر الجلسة والمادة 168 مرافعات',
    urgencyDefault: 'critical',
    description: 'إيداع مذكرة الدفاع والرد على دفاع الخصم خلال الأجل الممنوح بقرار حجز الدعوى للحكم.',
    consequenceOfExpiry: 'استبعاد المذكرة وعدم إثباتها وحجز الدعوى للفصل فيها بحالتها دون دفاع ختامي.',
  },
  {
    id: 'expert_fee_deposit',
    name: 'سداد أمانة خبير وزارة العدل',
    nameEn: 'Expert Witness Fee Payment',
    category: 'civil',
    days: 14,
    legalArticle: 'المادة 137 من قانون الإثبات في المواد المدنية والتجارية رقم 25 لسنة 1968',
    urgencyDefault: 'high',
    description: 'سداد أمانة الخبير المنتدب بخزينة المحكمة تمهيداً لإرسال ملف الدعوى لمكتب الخبراء.',
    consequenceOfExpiry: 'سقوط حق الخصم المكلف بالسداد في التمسك بحكم ندب الخبير واعتبار الدعوى غير جاهزة.',
  },
  {
    id: 'prosecution_archive_grievance',
    name: 'تظلم من قرار حفظ إداري بالنيابة العامة',
    nameEn: 'Prosecution Archive Grievance',
    category: 'criminal',
    days: 15,
    legalArticle: 'التعليمات العامة للنيابات والمادة 63 إجراءات جنائية',
    urgencyDefault: 'high',
    description: 'التظلم أمام السيد المستشار المحامي العام الأول للنيابة الكلية لإلغاء قرار الحفظ وتقديم المتهم للمحاكمة.',
    consequenceOfExpiry: 'فوات مواعيد تحريك التظلم وصعوبة استخراج المحضر إلا بظهور أدلة جوهرية جديدة.',
  },
];

/**
 * Common Case Types supported in Egyptian Law
 */
export const EGYPT_CASE_TYPES_DETAILED = [
  { id: 'ct_civil_injunction', name: 'مدني مستعجل', category: 'civil', description: 'إثبات حالة، طرد للغصب، أو حراسة قضائية' },
  { id: 'ct_civil_full', name: 'مدني كلي / جزئي', category: 'civil', description: 'تعويضات، فسخ عقود، صحة ونفاذ، وتثبيت ملكية' },
  { id: 'ct_commercial', name: 'تجاري وشركات', category: 'commercial', description: 'منازعات شركاء، أوراق تجارية، وتوريدات' },
  { id: 'ct_economic', name: 'اقتصادي واستثماري', category: 'commercial', description: 'بنوك، حماية ملكية فكرية، وشركات كبرى' },
  { id: 'ct_labor', name: 'تعويضات ومنازعات عمالية', category: 'civil', description: 'فصل تعسفي، مكافأة نهاية الخدمة، وإصابات عمل' },
  { id: 'ct_family', name: 'أسرة ونفقات', category: 'family', description: 'نفقات، خلع، طلاق، رؤية، ومصروفات علاج وتعليم' },
  { id: 'ct_misdemeanor', name: 'جنح وتعديات', category: 'criminal', description: 'شيكات بدون رصيد، إيصالات أمانة، تبديد، ونصب' },
  { id: 'ct_felony', name: 'جنايات', category: 'criminal', description: 'قضايا الجنايات الكبرى والاتجار والأموال العامة' },
  { id: 'ct_admin_state', name: 'مجلس دولة وقضاء إداري', category: 'administrative', description: 'إلغاء قرارات إدارية، ترقيات، وعقود إدارية' },
  { id: 'ct_execution', name: 'تنفيذ جبري وإشكالات', category: 'execution', description: 'إشكالات وقتية، حجز ما للمدين، وصيغ تنفيذية' },
];

/**
 * Calculate statutory deadline with Article 18 legal holiday safety extension
 */
export function calculateStatutoryDeadline(startDateStr: string, daysToAdd: number): { targetDate: string; wasExtended: boolean } {
  const d = new Date(startDateStr);
  if (isNaN(d.getTime())) {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    return { targetDate: today.toISOString().split('T')[0], wasExtended: false };
  }

  d.setDate(d.getDate() + daysToAdd);

  // Article 18 of the Egyptian Civil Procedure Code:
  // If the last day of the legal deadline falls on a statutory holiday (Friday = 5, Saturday = 6 in court calendars),
  // it extends automatically to the first working day following it.
  const dayOfWeek = d.getDay();
  let wasExtended = false;

  if (dayOfWeek === 5) { // Friday
    d.setDate(d.getDate() + 2); // Push to Sunday
    wasExtended = true;
  } else if (dayOfWeek === 6) { // Saturday (Official court holiday in many jurisdictions)
    d.setDate(d.getDate() + 1); // Push to Sunday
    wasExtended = true;
  }

  return {
    targetDate: d.toISOString().split('T')[0],
    wasExtended,
  };
}
