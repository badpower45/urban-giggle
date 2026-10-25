import { PredefinedVariableGroup, ContractTemplate, TemplateVariable } from '../../types/contract';

/**
 * Standard legal variables organized by comprehensive categories
 */
export const PREDEFINED_VARIABLE_GROUPS: PredefinedVariableGroup[] = [
  {
    id: 'parties',
    label: 'أطراف العقد والبيانات الشخصية',
    labelEn: 'Parties & Identifications',
    iconName: 'Users',
    variables: [
      {
        key: 'first_party_name',
        label: 'اسم الطرف الأول (البائع / المؤجر / صاحب العمل)',
        labelEn: 'First Party Name',
        category: 'parties',
        type: 'text',
        defaultValue: 'شركة الأمل للتطوير والاستثمار العقاري',
        description: 'الاسم الكامل أو اسم الكيان التجاري للطرف الأول',
        required: true,
      },
      {
        key: 'first_party_id',
        label: 'رقم قومي / سجل تجاري الطرف الأول',
        labelEn: 'First Party National ID / CR',
        category: 'parties',
        type: 'text',
        defaultValue: '29001010101234',
        description: 'الرقم القومي المكون من 14 رقماً أو رقم السجل التجاري',
        required: true,
      },
      {
        key: 'first_party_address',
        label: 'موطن / عنوان الطرف الأول',
        labelEn: 'First Party Address',
        category: 'parties',
        type: 'text',
        defaultValue: 'القاهرة، مدينة نصر، شارع الطيران عمارة 15',
        description: 'المحل المختار للطرف الأول للإخطارات القانونية',
      },
      {
        key: 'second_party_name',
        label: 'اسم الطرف الثاني (المشتري / المستأجر / العامل)',
        labelEn: 'Second Party Name',
        category: 'parties',
        type: 'text',
        defaultValue: 'أحمد محمود السعيد إبراهيم',
        description: 'الاسم الكامل للطرف الثاني وفقاً لبطاقة الرقم القومي',
        required: true,
      },
      {
        key: 'second_party_id',
        label: 'الرقم القومي للطرف الثاني',
        labelEn: 'Second Party National ID',
        category: 'parties',
        type: 'text',
        defaultValue: '29505051203456',
        description: 'الرقم القومي للطرف الثاني',
        required: true,
      },
      {
        key: 'second_party_address',
        label: 'موطن / عنوان الطرف الثاني',
        labelEn: 'Second Party Address',
        category: 'parties',
        type: 'text',
        defaultValue: 'الجيزة، الدقي، شارع مصدق، شقة 4',
        description: 'عنوان الإقامة الفعلي للطرف الثاني',
      },
      {
        key: 'second_party_phone',
        label: 'هاتف الطرف الثاني',
        labelEn: 'Second Party Phone',
        category: 'parties',
        type: 'text',
        defaultValue: '01012345678',
      },
      {
        key: 'third_party_name',
        label: 'اسم الطرف الثالث (الضامن / المستلم إليه)',
        labelEn: 'Third Party Name',
        category: 'parties',
        type: 'text',
        defaultValue: 'محمد إبراهيم حسان خليل',
      },
      {
        key: 'third_party_id',
        label: 'الرقم القومي للطرف الثالث',
        labelEn: 'Third Party National ID',
        category: 'parties',
        type: 'text',
        defaultValue: '28803031509876',
      },
    ],
  },
  {
    id: 'financial',
    label: 'البيانات المالية والمبالغ',
    labelEn: 'Financials & Values',
    iconName: 'CircleDollarSign',
    variables: [
      {
        key: 'contract_value',
        label: 'إجمالي قيمة العقد / الثمن الإجمالي',
        labelEn: 'Total Contract Value',
        category: 'financial',
        type: 'currency',
        defaultValue: '150,000',
        description: 'القيمة المالية الإجمالية للعقد رقماً وكتابة',
        required: true,
      },
      {
        key: 'monthly_rent',
        label: 'القيمة الإيجارية الشهرية',
        labelEn: 'Monthly Rent',
        category: 'financial',
        type: 'currency',
        defaultValue: '12,000',
        description: 'مبلغ الإيجار المستحق شهرياً',
      },
      {
        key: 'security_deposit',
        label: 'مبلغ التأمين النقدي',
        labelEn: 'Security Deposit',
        category: 'financial',
        type: 'currency',
        defaultValue: '24,000',
        description: 'مبلغ التأمين المسترد عند انتهاء العقد',
      },
      {
        key: 'down_payment',
        label: 'الدفعة المقدمة / العربون المدفوع',
        labelEn: 'Down Payment',
        category: 'financial',
        type: 'currency',
        defaultValue: '50,000',
      },
      {
        key: 'installment_amount',
        label: 'قيمة القسط الشهري / الدوري',
        labelEn: 'Installment Amount',
        category: 'financial',
        type: 'currency',
        defaultValue: '10,000',
      },
      {
        key: 'installments_count',
        label: 'عدد الأقساط الإجمالية',
        labelEn: 'Installments Count',
        category: 'financial',
        type: 'number',
        defaultValue: '10',
      },
      {
        key: 'penalty_clause_amount',
        label: 'قيمة الشرط الجزائي الاتفاقي',
        labelEn: 'Penalty Clause Amount',
        category: 'financial',
        type: 'currency',
        defaultValue: '100,000',
      },
      {
        key: 'late_penalty_daily',
        label: 'غرامة التأخير اليومية',
        labelEn: 'Daily Late Penalty',
        category: 'financial',
        type: 'currency',
        defaultValue: '500',
      },
      {
        key: 'currency',
        label: 'العملة المعتمدة',
        labelEn: 'Currency',
        category: 'financial',
        type: 'text',
        defaultValue: 'جنيه مصري (EGP)',
      },
      {
        key: 'payment_method',
        label: 'طريقة السداد / الدفع',
        labelEn: 'Payment Method',
        category: 'financial',
        type: 'text',
        defaultValue: 'نقداً مع إيصال استلام / تحويل بنكي',
      },
    ],
  },
  {
    id: 'dates',
    label: 'التواريخ والمدد الزمنية',
    labelEn: 'Dates & Duration',
    iconName: 'Calendar',
    variables: [
      {
        key: 'contract_date',
        label: 'تاريخ تحرير العقد',
        labelEn: 'Contract Execution Date',
        category: 'dates',
        type: 'date',
        defaultValue: '2026-09-18',
        description: 'اليوم والتاريخ الذي تم فيه توقيع العقد',
        required: true,
      },
      {
        key: 'start_date',
        label: 'تاريخ بداية السريان / التسليم',
        labelEn: 'Start / Effective Date',
        category: 'dates',
        type: 'date',
        defaultValue: '2026-10-01',
        description: 'تاريخ بدء نفاذ الالتزامات أو استلام العين',
        required: true,
      },
      {
        key: 'end_date',
        label: 'تاريخ انتهاء السريان',
        labelEn: 'End / Expiration Date',
        category: 'dates',
        type: 'date',
        defaultValue: '2027-09-30',
        description: 'تاريخ انتهاء العقد بحلول أجله',
        required: true,
      },
      {
        key: 'contract_duration',
        label: 'مدة العقد الكلية',
        labelEn: 'Contract Duration',
        category: 'dates',
        type: 'text',
        defaultValue: 'سنة ميلادية واحدة تبدأ من تاريخ التسليم',
      },
      {
        key: 'probation_period',
        label: 'فترة الاختبار (للعمل)',
        labelEn: 'Probation Period',
        category: 'dates',
        type: 'text',
        defaultValue: 'ثلاثة أشهر تبدأ من أول يوم عمل',
      },
      {
        key: 'notice_period',
        label: 'مهلة الإخطار بإنهاء العقد',
        labelEn: 'Notice Period',
        category: 'dates',
        type: 'text',
        defaultValue: 'ستين (60) يوماً قبل انتهاء المدة',
      },
    ],
  },
  {
    id: 'property',
    label: 'بيانات العقار والوحدة والأرض',
    labelEn: 'Property & Real Estate',
    iconName: 'Home',
    variables: [
      {
        key: 'property_address',
        label: 'عنوان العقار / موقع الوحدة',
        labelEn: 'Property Address',
        category: 'property',
        type: 'text',
        defaultValue: 'عمارة 12 شارع عباس العقاد، المنطقة الأولى، مدينة نصر، القاهرة',
      },
      {
        key: 'unit_number',
        label: 'رقم الشقة / المحل / الوحدة',
        labelEn: 'Unit Number',
        category: 'property',
        type: 'text',
        defaultValue: 'شقة رقم 5 بالدور الثالث فوق الأرضي',
      },
      {
        key: 'property_area_sqm',
        label: 'مساحة الوحدة (متر مربع)',
        labelEn: 'Unit Area (sqm)',
        category: 'property',
        type: 'number',
        defaultValue: '165',
      },
      {
        key: 'land_borders',
        label: 'الحدود والمعالم الأربعة للأرض/العقار',
        labelEn: 'Property Borders',
        category: 'property',
        type: 'textarea',
        defaultValue: 'الحد البحري: شارع بعرض 12م، الحد القبلي: ملك الجار، الحد الشرقي: ممر خاص، الحد الغربي: شارع رئيسي',
      },
      {
        key: 'unit_purpose',
        label: 'الغرض من الاستخدام والنشاط',
        labelEn: 'Usage Purpose',
        category: 'property',
        type: 'text',
        defaultValue: 'سكن عائلي خاص ولا يجوز استغلالها في غير ذلك',
      },
      {
        key: 'ownership_document',
        label: 'سند ملكية البائع / المؤجر',
        labelEn: 'Ownership Document',
        category: 'property',
        type: 'text',
        defaultValue: 'العقد المسجل رقم 1482 لسنة 2018 شهر عقاري شمال القاهرة',
      },
    ],
  },
  {
    id: 'vehicle',
    label: 'بيانات السيارات والمركبات',
    labelEn: 'Vehicle Details',
    iconName: 'Car',
    variables: [
      {
        key: 'car_brand_model',
        label: 'ماركة وطراز وسنة صنع السيارة',
        labelEn: 'Car Make & Model & Year',
        category: 'property',
        type: 'text',
        defaultValue: 'تويوتا كورولا موديل 2024 لون فضي',
      },
      {
        key: 'car_plate_number',
        label: 'رقم اللوحات المعدنية للسيارة',
        labelEn: 'Plate Number',
        category: 'property',
        type: 'text',
        defaultValue: 'أ ب ج // 1 2 3 4',
      },
      {
        key: 'car_chassis_number',
        label: 'رقم الشاسيه',
        labelEn: 'Chassis Number',
        category: 'property',
        type: 'text',
        defaultValue: 'JTDBU4EE7N1298456',
      },
      {
        key: 'car_motor_number',
        label: 'رقم الموتور',
        labelEn: 'Motor Number',
        category: 'property',
        type: 'text',
        defaultValue: '2ZR-FE984210',
      },
      {
        key: 'car_traffic_dept',
        label: 'وحدة مرور الترخيص',
        labelEn: 'Traffic Department',
        category: 'property',
        type: 'text',
        defaultValue: 'مرور مدينة نصر - القاهرة',
      },
    ],
  },
  {
    id: 'litigation',
    label: 'البيانات القضائية والتوكيلات والنزاعات',
    labelEn: 'Litigation & Court',
    iconName: 'Scale',
    variables: [
      {
        key: 'competent_court',
        label: 'المحكمة المختصة بنظر النزاع',
        labelEn: 'Competent Court',
        category: 'litigation',
        type: 'text',
        defaultValue: 'محاكم شمال القاهرة الابتدائية وجزئياتها',
      },
      {
        key: 'case_number',
        label: 'رقم الجنحة / القضية / المحضر',
        labelEn: 'Case / Report Number',
        category: 'litigation',
        type: 'text',
        defaultValue: 'جنحة رقم 4821 لسنة 2026 جنح مدينة نصر أول',
      },
      {
        key: 'poa_number',
        label: 'رقم التوكيل الرسمي الموثق',
        labelEn: 'POA Number',
        category: 'litigation',
        type: 'text',
        defaultValue: 'توكيل رسمي عام قضايا رقم 4587 لسنة 2025 حرف ب',
      },
      {
        key: 'notary_office',
        label: 'مكتب الشهر العقاري والتوثيق',
        labelEn: 'Notary Office',
        category: 'litigation',
        type: 'text',
        defaultValue: 'مكتب توثيق مدينة نصر النموذجي',
      },
      {
        key: 'lawyer_name',
        label: 'اسم المحامي / المستشار القانوني',
        labelEn: 'Lawyer Name',
        category: 'litigation',
        type: 'text',
        defaultValue: 'الأستاذ / عبد الرحمن العزبي - المحامي بالنقض',
      },
    ],
  },
];

/**
 * Quick lookup dictionary for variable definitions
 */
export const PREDEFINED_VARIABLES_MAP: Record<string, TemplateVariable> = {};
PREDEFINED_VARIABLE_GROUPS.forEach((group) => {
  group.variables.forEach((v) => {
    PREDEFINED_VARIABLES_MAP[v.key] = v;
  });
});

/**
 * 20 Diverse, Highly Curated Egyptian & Arab Legal Templates for Siyaq Legal SaaS
 */
export const SAMPLE_CONTRACT_TEMPLATES: ContractTemplate[] = [
  // 1. عقد إيجار شقة سكنية (مشاهرة)
  {
    id: 'tmpl-lease-residential',
    name: 'عقد إيجار شقة سكنية مشاهرة (خاضع للقانون 4 لسنة 1996)',
    name_en: 'Residential Apartment Lease Agreement',
    description: 'صيغة قانونية رسمية ومحكمة لإيجار شقة محددة المدة مع أحكام التأمين والإخلاء طبقا للقانون 4 لسنة 1996.',
    category: 'real_estate',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'first_party_address',
      'second_party_name',
      'second_party_id',
      'second_party_address',
      'property_address',
      'unit_number',
      'unit_purpose',
      'contract_duration',
      'start_date',
      'end_date',
      'monthly_rent',
      'security_deposit',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد إيجار شقة سكنية خاضع لأحكام القانون رقم 4 لسنة 1996</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم الموافق <span data-variable-id="contract_date" data-variable-label="تاريخ تحرير العقد" class="siyaq-variable-chip">{{contract_date}}</span> تم الاتفاق والتراضي بين كل من:</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 20px;">أولاً: بيانات طرفي التعاقد</h3>
  <p><strong>الطرف الأول (المؤجر):</strong> السيد/ <span data-variable-id="first_party_name" data-variable-label="اسم المؤجر" class="siyaq-variable-chip">{{first_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="first_party_id" data-variable-label="رقم قومي المؤجر" class="siyaq-variable-chip">{{first_party_id}}</span>، والمقيم في: <span data-variable-id="first_party_address" data-variable-label="عنوان المؤجر" class="siyaq-variable-chip">{{first_party_address}}</span>.</p>
  
  <p><strong>الطرف الثاني (المستأجر):</strong> السيد/ <span data-variable-id="second_party_name" data-variable-label="اسم المستأجر" class="siyaq-variable-chip">{{second_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="second_party_id" data-variable-label="رقم قومي المستأجر" class="siyaq-variable-chip">{{second_party_id}}</span>، والمقيم في: <span data-variable-id="second_party_address" data-variable-label="عنوان المستأجر" class="siyaq-variable-chip">{{second_party_address}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">التمهيد والبنود القانونية</h3>
  <p>يقر الطرفان بأهليتهما القانونية الكاملة للتصرف والتعاقد وخلوهما من كافة موانع الأهلية، وقد اتفقا وتراضيا على ما يلي:</p>

  <p><strong>البند الأول (العين المؤجرة):</strong> أجر الطرف الأول للطرف الثاني الوحدة الكائنة في: <span data-variable-id="property_address" data-variable-label="عنوان العقار" class="siyaq-variable-chip">{{property_address}}</span>، والمتمثلة في: <span data-variable-id="unit_number" data-variable-label="رقم الوحدة" class="siyaq-variable-chip">{{unit_number}}</span>، بقصد استخدامها في: <span data-variable-id="unit_purpose" data-variable-label="غرض الاستخدام" class="siyaq-variable-chip">{{unit_purpose}}</span> ولا يحق للمستأجر تغيير النشاط أو التأجير من الباطن.</p>

  <p><strong>البند الثاني (مدة الإيجار):</strong> مدة هذا العقد هي <span data-variable-id="contract_duration" data-variable-label="مدة العقد" class="siyaq-variable-chip">{{contract_duration}}</span>، تبدأ اعتباراً من تاريخ <span data-variable-id="start_date" data-variable-label="تاريخ البدء" class="siyaq-variable-chip">{{start_date}}</span> وتنتهي حتماً ودون حاجة إلى تنبيه أو إنذار بتاريخ <span data-variable-id="end_date" data-variable-label="تاريخ الانتهاء" class="siyaq-variable-chip">{{end_date}}</span>، حيث يلتزم المستأجر بتسليم العين خالية تماماً من كافة الشواغل.</p>

  <p><strong>البند الثالث (القيمة الإيجارية والتأمين):</strong> تم الاتفاق على أن تكون القيمة الإيجارية الشهرية مبلغ وقدره <span data-variable-id="monthly_rent" data-variable-label="الإيجار الشهري" class="siyaq-variable-chip">{{monthly_rent}}</span> جنيهاً مصرياً، تسدد مقدماً في أول كل شهر. كما دفع المستأجر مبلغ تأمين نقدي قدره <span data-variable-id="security_deposit" data-variable-label="مبلغ التأمين" class="siyaq-variable-chip">{{security_deposit}}</span> جنيهاً يرد عند انتهاء العقد ومطابقة الفواتير وسلامة الوحدة.</p>

  <p><strong>البند الرابع (الاختصاص القضائي):</strong> تختص <span data-variable-id="competent_court" data-variable-label="المحكمة المختصة" class="siyaq-variable-chip">{{competent_court}}</span> دون غيرها بنظر أي نزاع قد ينشأ لا قدر الله بخصوص تفسير أو تنفيذ أحكام هذا العقد.</p>

  <div style="margin-top: 40px; display: flex; justify-content: space-between; padding-top: 20px;">
    <div style="text-align: center; width: 40%;">
      <p><strong>توقيع الطرف الأول (المؤجر)</strong></p>
      <p style="margin-top: 35px; color: #94a3b8;">..........................................</p>
    </div>
    <div style="text-align: center; width: 40%;">
      <p><strong>توقيع الطرف الثاني (المستأجر)</strong></p>
      <p style="margin-top: 35px; color: #94a3b8;">..........................................</p>
    </div>
  </div>
</div>
    `.trim(),
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 2. عقد إيجار محل تجاري / مقر إداري
  {
    id: 'tmpl-lease-commercial',
    name: 'عقد إيجار محل تجاري ومقر إداري',
    name_en: 'Commercial Shop / Office Lease Agreement',
    description: 'نموذج إيجار محل تجاري أو مقر لشركة مع شروط التراخيص، الصيانة، عدادات الكهرباء التجارية ونسبة الزيادة السنوية.',
    category: 'real_estate',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'first_party_address',
      'second_party_name',
      'second_party_id',
      'second_party_address',
      'property_address',
      'unit_number',
      'unit_purpose',
      'contract_duration',
      'start_date',
      'end_date',
      'monthly_rent',
      'security_deposit',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد إيجار مقر تجاري / إداري محدد المدة</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم الموافق <span data-variable-id="contract_date" data-variable-label="تاريخ العقد" class="siyaq-variable-chip">{{contract_date}}</span> تم الاتفاق بين كل من:</p>

  <p><strong>الطرف الأول (المؤجر):</strong> السيد/ <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، رقم قومي: <span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span>، والمقيم: <span data-variable-id="first_party_address" class="siyaq-variable-chip">{{first_party_address}}</span>.</p>
  <p><strong>الطرف الثاني (المستأجر):</strong> السيد/ <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، رقم قومي: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>، والمقيم: <span data-variable-id="second_party_address" class="siyaq-variable-chip">{{second_party_address}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">الشروط والبنود</h3>
  <p><strong>البند الأول (محل الإيجار والنشاط):</strong> أجر الطرف الأول للطرف الثاني المحل التجاري الكائن في: <span data-variable-id="property_address" class="siyaq-variable-chip">{{property_address}}</span>، رقم: <span data-variable-id="unit_number" class="siyaq-variable-chip">{{unit_number}}</span>، وذلك لاستغلاله في نشاط: <span data-variable-id="unit_purpose" class="siyaq-variable-chip">{{unit_purpose}}</span> دون غيره.</p>

  <p><strong>البند الثاني (المدة والإخلاء):</strong> مدة الإيجار هي <span data-variable-id="contract_duration" class="siyaq-variable-chip">{{contract_duration}}</span> تبدأ من <span data-variable-id="start_date" class="siyaq-variable-chip">{{start_date}}</span> وتنتهي في <span data-variable-id="end_date" class="siyaq-variable-chip">{{end_date}}</span> ويلتزم المستأجر بالإخلاء التام الفوري دون مماطلة.</p>

  <p><strong>البند الثالث (الإيجار والتأمين):</strong> يلتزم المستأجر بسداد مبلغ وقدره <span data-variable-id="monthly_rent" class="siyaq-variable-chip">{{monthly_rent}}</span> جنيهاً شهرياً في الأسبوع الأول من كل شهر، وسدد تأميناً نقدياً قدره <span data-variable-id="security_deposit" class="siyaq-variable-chip">{{security_deposit}}</span> جنيهاً.</p>

  <p><strong>البند الرابع (المحكمة المختصة):</strong> تختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بالنظر في أي نزاع متعلق بهذا العقد.</p>
</div>
    `.trim(),
    created_at: '2026-09-02T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 3. عقد إيجار سيارة / مركبة
  {
    id: 'tmpl-lease-car',
    name: 'عقد إيجار سيارة / مركبة (محدد المدة)',
    name_en: 'Vehicle Rental Agreement',
    description: 'عقد إيجار سيارة محدد المدة، يشمل بيانات الشاسيه والموتور واللوحات وتحمل المخالفات المرورية والصيانة.',
    category: 'real_estate',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'second_party_name',
      'second_party_id',
      'car_brand_model',
      'car_plate_number',
      'car_chassis_number',
      'car_motor_number',
      'car_traffic_dept',
      'contract_duration',
      'start_date',
      'end_date',
      'contract_value',
      'security_deposit',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد إيجار مركبة محدد المدة</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">حرر هذا العقد في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> بين كل من:</p>

  <p><strong>الطرف الأول (المؤجر/المالك):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span>.</p>
  <p><strong>الطرف الثاني (المستأجر):</strong> <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">بيانات السيارة والتزامات التشغيل</h3>
  <p><strong>البند الأول (السيارة المؤجرة):</strong> أجر الطرف الأول للطرف الثاني سيارة مواصفاتها كالتالي: ماركة وطراز: <span data-variable-id="car_brand_model" class="siyaq-variable-chip">{{car_brand_model}}</span>، لوحات رقم: <span data-variable-id="car_plate_number" class="siyaq-variable-chip">{{car_plate_number}}</span>، شاسيه رقم: <span data-variable-id="car_chassis_number" class="siyaq-variable-chip">{{car_chassis_number}}</span>، موتور رقم: <span data-variable-id="car_motor_number" class="siyaq-variable-chip">{{car_motor_number}}</span>، تابعة لوحدة مرور: <span data-variable-id="car_traffic_dept" class="siyaq-variable-chip">{{car_traffic_dept}}</span>.</p>

  <p><strong>البند الثاني (المدة والقيمة):</strong> مدة الإيجار هي <span data-variable-id="contract_duration" class="siyaq-variable-chip">{{contract_duration}}</span> تبدأ من <span data-variable-id="start_date" class="siyaq-variable-chip">{{start_date}}</span> حتى <span data-variable-id="end_date" class="siyaq-variable-chip">{{end_date}}</span> بإجمالي قيمة قدرها <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً ومبلغ تأمين قدره <span data-variable-id="security_deposit" class="siyaq-variable-chip">{{security_deposit}}</span> جنيهاً.</p>

  <p><strong>البند الثالث (المسؤولية القانونية):</strong> يقر المستأجر بتحمله المسؤولية الجنائية والمدنية والمخالفات المرورية كاملة طوال فترة الحيازة، وإعادة السيارة بحالتها الفنية الممتازة.</p>
  <p><strong>البند الرابع:</strong> تختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر أي نزاع.</p>
</div>
    `.trim(),
    created_at: '2026-09-03T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 4. عقد بيع شقة سكنية نهائي مع حصة في الأرض
  {
    id: 'tmpl-sale-apartment',
    name: 'عقد بيع نهائي لشقة سكنية مع حصة شائعة في الأرض',
    name_en: 'Final Apartment Sale Contract with Land Share',
    description: 'صيغة بيع شقة ملكية تامة وخالصة الثمن مع تسلسل الملكية وحصة شائعة في الأرض والمنافع المشتركة والتنازل عن العدادات.',
    category: 'sales',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'first_party_address',
      'second_party_name',
      'second_party_id',
      'second_party_address',
      'property_address',
      'unit_number',
      'property_area_sqm',
      'ownership_document',
      'contract_value',
      'payment_method',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد بيع نهائي لوحدة سكنية مع حصة في الأرض</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم الموافق <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> اتفق كل من:</p>

  <p><strong>الطرف الأول (البائع):</strong> السيد/ <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span>، والمقيم في: <span data-variable-id="first_party_address" class="siyaq-variable-chip">{{first_party_address}}</span>.</p>
  <p><strong>الطرف الثاني (المشتري):</strong> السيد/ <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>، والمقيم في: <span data-variable-id="second_party_address" class="siyaq-variable-chip">{{second_party_address}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">تمهيد وبنود البيع</h3>
  <p>يمتلك البائع الوحدة السكنية موضوع هذا العقد بموجب: <span data-variable-id="ownership_document" class="siyaq-variable-chip">{{ownership_document}}</span>، وحيث يرغب الطرف الثاني في شرائها، فقد تم الاتفاق على الآتي:</p>

  <p><strong>البند الأول (موضوع البيع):</strong> باع وأسقط وتنازل البائع بكافة الضمانات القانونية والفعلية إلى المشتري الشقة الكائنة في: <span data-variable-id="property_address" class="siyaq-variable-chip">{{property_address}}</span>، رقم: <span data-variable-id="unit_number" class="siyaq-variable-chip">{{unit_number}}</span>، والبالغ مساحتها الإجمالية: <span data-variable-id="property_area_sqm" class="siyaq-variable-chip">{{property_area_sqm}}</span> متراً مربعاً، شاملة حصة شائعة في الأرض والمنافع المشتركة تعادل نسبة مساحة الوحدة.</p>

  <p><strong>البند الثاني (الثمن والمخالصة):</strong> تم هذا البيع نظير ثمن إجمالي قدره <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً مصرياً، سددت بالكامل من المشتري للبائع بموجب: <span data-variable-id="payment_method" class="siyaq-variable-chip">{{payment_method}}</span> ويعتبر توقيع البائع على هذا العقد مخالصة تامة ونهائية بالثمن.</p>

  <p><strong>البند الثالث (التسليم والمرافق):</strong> استلم المشتري الوحدة بالفعل وعاينها المعاينة التامة النافية للجهالة شرعاً وقانوناً، ويلتزم البائع بالتنازل عن عدادات الكهرباء والمياه والغاز لصالح المشتري والحضور للشهر العقاري لصحة التعاقد والتسجيل.</p>
  <p><strong>البند الرابع:</strong> تختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر أي نزاع.</p>
</div>
    `.trim(),
    created_at: '2026-09-04T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 5. عقد بيع سيارة نهائي مع توكيل
  {
    id: 'tmpl-sale-car',
    name: 'عقد بيع سيارة نهائي مع مخالصة والتزام بالتوكيل الرسمي',
    name_en: 'Vehicle Sale Contract with Full Clearance & POA',
    description: 'عقد بيع سيارة نهائي يثبت استلام كامل الثمن والمعاينة ونقل المسؤولية الجنائية وتحديد موعد عمل التوكيل بالشهر العقاري.',
    category: 'sales',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'second_party_name',
      'second_party_id',
      'car_brand_model',
      'car_plate_number',
      'car_chassis_number',
      'car_motor_number',
      'car_traffic_dept',
      'contract_value',
      'payment_method',
      'notary_office',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد بيع سيارة نهائي ومخالصة استلام</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> اتفق كل من:</p>

  <p><strong>الطرف الأول (البائع):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، رقم قومي: <span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span>.</p>
  <p><strong>الطرف الثاني (المشتري):</strong> <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، رقم قومي: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">المبيع والثمن والمسؤولية</h3>
  <p><strong>البند الأول:</strong> باع البائع للمشتري السيارة: <span data-variable-id="car_brand_model" class="siyaq-variable-chip">{{car_brand_model}}</span>، لوحات: <span data-variable-id="car_plate_number" class="siyaq-variable-chip">{{car_plate_number}}</span>، شاسيه: <span data-variable-id="car_chassis_number" class="siyaq-variable-chip">{{car_chassis_number}}</span>، موتور: <span data-variable-id="car_motor_number" class="siyaq-variable-chip">{{car_motor_number}}</span>، مرور: <span data-variable-id="car_traffic_dept" class="siyaq-variable-chip">{{car_traffic_dept}}</span>.</p>

  <p><strong>البند الثاني (الثمن):</strong> تم البيع نظير ثمن إجمالي قدره <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً مصرياً تم استلامه كاملاً نقداً وعُدَّ بموجب: <span data-variable-id="payment_method" class="siyaq-variable-chip">{{payment_method}}</span> ويعتبر هذا العقد إبراء ذمة تام.</p>

  <p><strong>البند الثالث (التسليم والتوكيل):</strong> تسلم المشتري السيارة بحالتها مع رخصتها ومفاتيحها، وأصبح مسؤولاً عنها مسؤولية مدنية وجنائية من تاريخ وساعة تحرير هذا العقد. ويلتزم البائع بعمل توكيل بيع لنفسه وللغير بمكتب توثيق: <span data-variable-id="notary_office" class="siyaq-variable-chip">{{notary_office}}</span>.</p>
  <p><strong>البند الرابع:</strong> تختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بأي نزاع.</p>
</div>
    `.trim(),
    created_at: '2026-09-05T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 6. عقد بيع قطعة أرض فضاء
  {
    id: 'tmpl-sale-land',
    name: 'عقد بيع قطعة أرض فضاء (مبانٍ / زراعية)',
    name_en: 'Vacant Land Sale Agreement',
    description: 'عقد بيع أرض فضاء محدد المساحة والحدود والمعالم الأربعة وسند الملكية والتسليم وخلوها من الحقوق العينية.',
    category: 'sales',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'second_party_name',
      'second_party_id',
      'property_address',
      'property_area_sqm',
      'land_borders',
      'ownership_document',
      'contract_value',
      'payment_method',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد بيع قطعة أرض فضاء</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> تم الاتفاق بين كل من:</p>

  <p><strong>الطرف الأول (البائع):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، رقم قومي: <span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span>.</p>
  <p><strong>الطرف الثاني (المشتري):</strong> <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، رقم قومي: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">الأرض المبيعة والحدود</h3>
  <p><strong>البند الأول:</strong> باع البائع للمشتري قطعة الأرض الفضاء الكائنة في: <span data-variable-id="property_address" class="siyaq-variable-chip">{{property_address}}</span>، والبالغ مساحتها: <span data-variable-id="property_area_sqm" class="siyaq-variable-chip">{{property_area_sqm}}</span> متراً مربعاً، وحدودها ومعالمها كالتالي: <span data-variable-id="land_borders" class="siyaq-variable-chip">{{land_borders}}</span>.</p>

  <p><strong>البند الثاني (سند الملكية والثمن):</strong> آلت ملكية الأرض للبائع بموجب: <span data-variable-id="ownership_document" class="siyaq-variable-chip">{{ownership_document}}</span>، وتم هذا البيع بإجمالي ثمن قدره <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً سدد بالكامل بطريقة: <span data-variable-id="payment_method" class="siyaq-variable-chip">{{payment_method}}</span>.</p>

  <p><strong>البند الثالث (ضمان عدم التعرض):</strong> يضمن البائع خلو الأرض من كافة الديون والرهون وحقوق الامتياز، ويلتزم بالحضور لتوثيق عقد البيع النهائي.</p>
  <p><strong>البند الرابع:</strong> تختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر أي نزاع.</p>
</div>
    `.trim(),
    created_at: '2026-09-06T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 7. عقد بيع ابتدائي بالتقسيط مع احتفاظ بالملكية وشرط جزائي
  {
    id: 'tmpl-sale-installment',
    name: 'عقد بيع ابتدائي بالتقسيط مع احتفاظ بالملكية وشرط جزائي',
    name_en: 'Installment Sale Contract with Title Retention & Penalty',
    description: 'عقد بيع بالتقسيط لحفظ حقوق البائع عبر احتفاظه بالملكية حتى السداد التام، مع شرط الفسخ والتعويض الاتفاقي.',
    category: 'sales',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'second_party_name',
      'second_party_id',
      'contract_value',
      'down_payment',
      'installment_amount',
      'installments_count',
      'penalty_clause_amount',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد بيع بالتقسيط مع احتفاظ بحق الملكية</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">حرر في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> بين البائع: <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span> والمشتري: <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">شروط وجدولة الأقساط</h3>
  <p><strong>البند الأول (الثمن والمقدم):</strong> إجمالي الثمن المتفق عليه هو مبلغ <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً، سدد منه المشتري مقدماً نقدياً قدره <span data-variable-id="down_payment" class="siyaq-variable-chip">{{down_payment}}</span> جنيهاً بمجلس العقد.</p>

  <p><strong>البند الثاني (الأقساط):</strong> يسدد باقي الثمن على <span data-variable-id="installments_count" class="siyaq-variable-chip">{{installments_count}}</span> قسطاً شهرياً متتالياً، قيمة كل قسط <span data-variable-id="installment_amount" class="siyaq-variable-chip">{{installment_amount}}</span> جنيهاً مصرياً.</p>

  <p><strong>البند الثالث (احتفاظ بالملكية والشرط الجزائي):</strong> تظل ملكية المبيع معلقة ومملوكة للبائع ولا تنتقل للمشتري إلا بعد سداد كامل الأقساط. وإذا تخلف المشتري عن سداد قسطين متتاليين، يعتبر العقد مفسوخاً من تلقاء نفسه دون حاجة لإنذار، مع التزام المشتري بسداد شرط جزائي قدره <span data-variable-id="penalty_clause_amount" class="siyaq-variable-chip">{{penalty_clause_amount}}</span> جنيهاً.</p>

  <p><strong>البند الرابع:</strong> تختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر المنازعات.</p>
</div>
    `.trim(),
    created_at: '2026-09-07T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 8. عقد عمل فردي محدد المدة
  {
    id: 'tmpl-employment-fixed',
    name: 'عقد عمل فردي محدد المدة (وفقاً لقانون العمل 12 لسنة 2003)',
    name_en: 'Individual Fixed-Term Employment Contract',
    description: 'صيغة عقد عمل رسمي طبقا لقانون العمل المصري، يتضمن فترة الاختبار، الراتب، مهام الوظيفة، الإجازات، والسرية المهنية.',
    category: 'employment',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_address',
      'second_party_name',
      'second_party_id',
      'second_party_address',
      'contract_duration',
      'start_date',
      'end_date',
      'probation_period',
      'monthly_rent',
      'notice_period',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد عمل فردي محدد المدة</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">وفقاً لأحكام قانون العمل المصري رقم 12 لسنة 2003 وتعديلاته، اتفق في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> كل من:</p>

  <p><strong>الطرف الأول (صاحب العمل / الشركة):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، ومقرها: <span data-variable-id="first_party_address" class="siyaq-variable-chip">{{first_party_address}}</span>.</p>
  <p><strong>الطرف الثاني (العامل / الموظف):</strong> السيد/ <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>، والمقيم في: <span data-variable-id="second_party_address" class="siyaq-variable-chip">{{second_party_address}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">شروط وضوابط العمل</h3>
  <p><strong>البند الأول (الوظيفة والمدة):</strong> يعمل الطرف الثاني لدى الطرف الأول بوظيفة تخصصية لمدة: <span data-variable-id="contract_duration" class="siyaq-variable-chip">{{contract_duration}}</span>، تبدأ من: <span data-variable-id="start_date" class="siyaq-variable-chip">{{start_date}}</span> وتنتهي في: <span data-variable-id="end_date" class="siyaq-variable-chip">{{end_date}}</span> قابلة للتجديد باتفاق كتابي صريح.</p>

  <p><strong>البند الثاني (فترة الاختبار):</strong> يخضع الموظف لفترة اختبار مدتها <span data-variable-id="probation_period" class="siyaq-variable-chip">{{probation_period}}</span> يحق لصاحب العمل خلالها إنهاء العقد إذا ثبت عدم صلاحيته للعمل.</p>

  <p><strong>البند الثالث (الأجر الشهري):</strong> يتقاضى الموظف راتباً شهرياً إجمالياً قدره <span data-variable-id="monthly_rent" class="siyaq-variable-chip">{{monthly_rent}}</span> جنيهاً مصرياً، يستحق في نهاية كل شهر ميلادي بعد خصم الاستقطاعات القانونية المقررة.</p>

  <p><strong>البند الرابع (الإنهاء والإخطار):</strong> في حال رغبة أحد الطرفين بعدم التجديد، يلتزم بإخطار الطرف الآخر كتابياً بمهلة لا تقل عن <span data-variable-id="notice_period" class="siyaq-variable-chip">{{notice_period}}</span>. وتختص المحكمة العمالية بـ <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر المنازعات.</p>
</div>
    `.trim(),
    created_at: '2026-09-08T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 9. عقد تقديم خدمات استشارية ومهنية مستقلة (Freelance)
  {
    id: 'tmpl-services-freelance',
    name: 'عقد تقديم خدمات استشارية ومهنية مستقلة (Freelance)',
    name_en: 'Independent Professional Services Agreement',
    description: 'عقد تقديم خدمات مهنية حرة بدون علاقة تبعية وظيفية، مع تحديد المخرجات، الدفعات، والملكية الفكرية.',
    category: 'services',
    variables: [
      'contract_date',
      'first_party_name',
      'second_party_name',
      'second_party_id',
      'contract_duration',
      'contract_value',
      'down_payment',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد تقديم خدمات استشارية مستقلة</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> اتفق كل من:</p>

  <p><strong>الطرف الأول (العميل):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>.</p>
  <p><strong>الطرف الثاني (الاستشاري / مقدم الخدمة):</strong> <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، رقم قومي: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">طبيعة الخدمات والمقابل المالي</h3>
  <p><strong>البند الأول (الاستقلالية):</strong> يقدم الطرف الثاني خدمات مهنية واستشارية متخصصة بصفته متعاقداً مستقلاً، ولا ينشأ عن هذا العقد أي علاقة عمل أو تبعية أو شراكة.</p>

  <p><strong>البند الثاني (المدة والأتعاب):</strong> مدة تنفيذ المهام هي <span data-variable-id="contract_duration" class="siyaq-variable-chip">{{contract_duration}}</span>، نظير أتعاب إجمالية قدرها <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً، سدد منها دفعة مقدمة قدرها <span data-variable-id="down_payment" class="siyaq-variable-chip">{{down_payment}}</span> جنيهاً عند التوقيع والباقي عند تسليم المخرجات النهائية.</p>

  <p><strong>البند الثالث (الملكية الفكرية والسرية):</strong> تؤول ملكية كافة المخرجات والتصاميم المنجزة حصرياً للطرف الأول فور سداد أتعابها، ويلتزم الاستشاري بكتمان كافة أسرار العميل.</p>
  <p><strong>البند الرابع:</strong> تختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر المنازعات.</p>
</div>
    `.trim(),
    created_at: '2026-09-09T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 10. عقد تأسيس شركة تضامن
  {
    id: 'tmpl-partnership-general',
    name: 'عقد تأسيس شركة تضامن (وفقاً لقانون التجارة)',
    name_en: 'General Partnership Company Incorporation Contract',
    description: 'عقد تأسيس شركة أشخاص وتضامن، يشمل السمة التجارية، الغرض، الحصص، الإدارة والتوقيع، وتوزيع الأرباح والخسائر.',
    category: 'commercial',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'first_party_address',
      'second_party_name',
      'second_party_id',
      'second_party_address',
      'property_address',
      'contract_duration',
      'contract_value',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد تأسيس شركة تضامن</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> اتفق كل من الشركاء المتضامنين:</p>

  <p><strong>الطرف الأول (شريك متضامن):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span>.</p>
  <p><strong>الطرف الثاني (شريك متضامن):</strong> <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">عناصر الشركة ورأس المال</h3>
  <p><strong>البند الأول (الاسم والمقر):</strong> اتفق الطرفان على تأسيس شركة تضامن تجارية عنوانها ومقرها الرئيسي في: <span data-variable-id="property_address" class="siyaq-variable-chip">{{property_address}}</span>، ومدتها: <span data-variable-id="contract_duration" class="siyaq-variable-chip">{{contract_duration}}</span> تبدأ من تاريخ القيد بالسجل التجاري.</p>

  <p><strong>البند الثاني (رأس المال والحصص):</strong> حدد رأس مال الشركة الإجمالي بمبلغ <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً مصرياً، موزعاً بين الشريكين بنسبة 50% لكل شريك دفع كل منهما حصته كاملة.</p>

  <p><strong>البند الثالث (الإدارة والأرباح):</strong> يتولى الشريكان مجتمعين أو منفردين حق الإدارة والتوقيع باسم الشركة في المعاملات التجارية المعتادة، وتوزع الأرباح الصافية والخسائر وفقاً لنسبة مساهمة كل شريك برأس المال.</p>
  <p><strong>البند الرابع:</strong> تختص المحكمة الاقتصادية التابعة لـ <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر المنازعات.</p>
</div>
    `.trim(),
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 11. عقد اتفاق شراكة ومحاصة في مشروع تجاري
  {
    id: 'tmpl-partnership-joint',
    name: 'عقد اتفاق شراكة ومحاصة في مشروع تجاري',
    name_en: 'Joint Venture & Profit Sharing Agreement',
    description: 'عقد شراكة بين شريك ممول وشريك فني/مدير، مع تحديد نسب الأرباح، الالتزامات التشغيلية، ومحاسبة الشركاء.',
    category: 'commercial',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'second_party_name',
      'second_party_id',
      'contract_value',
      'down_payment',
      'contract_duration',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد اتفاق شراكة ومحاصة تجارية</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">حرر في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> بين كل من:</p>

  <p><strong>الطرف الأول (الشريك الممول بالمال):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، بطاقة: <span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span>.</p>
  <p><strong>الطرف الثاني (الشريك القائم بالإدارة والتشغيل):</strong> <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، بطاقة: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">بنود الشراكة والأرباح</h3>
  <p><strong>البند الأول (رأس المال):</strong> يساهم الطرف الأول برأس مال تشغيلي للمشروع قدره <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً، سدد منه فعلياً كدفعة أولى: <span data-variable-id="down_payment" class="siyaq-variable-chip">{{down_payment}}</span> جنيهاً، بينما يقدم الطرف الثاني جهده وخبرته وإدارته اليومية للمشروع.</p>

  <p><strong>البند الثاني (مدة الشراكة):</strong> مدة هذه الشراكة هي <span data-variable-id="contract_duration" class="siyaq-variable-chip">{{contract_duration}}</span>، ويتم عمل ميزانية وجرد حسابي ربع سنوي بحضور الطرفين.</p>

  <p><strong>البند الثالث (توزيع الأرباح):</strong> تقتسم الأرباح الصافية بعد خصم المصاريف التشغيلية بنسبة 50% للطرف الأول الممول و50% للطرف الثاني القائم بالعمل.</p>
  <p><strong>البند الرابع:</strong> تختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر المنازعات.</p>
</div>
    `.trim(),
    created_at: '2026-09-11T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 12. اتفاقية سرية وعدم إفشاء (NDA)
  {
    id: 'tmpl-nda-confidentiality',
    name: 'اتفاقية سرية وعدم إفشاء معلومات تجارية وحماية الأسرار (NDA)',
    name_en: 'Non-Disclosure Agreement (NDA)',
    description: 'اتفاقية سرية وحماية ملكية فكرية وأسرار تجارية وقواعد بيانات العملاء مع شرط جزائي رادع عند الإخلال.',
    category: 'nda',
    variables: [
      'contract_date',
      'first_party_name',
      'second_party_name',
      'contract_duration',
      'penalty_clause_amount',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">اتفاقية حماية سرية المعلومات والبيانات التجارية (NDA)</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">حررت هذه الاتفاقية في تاريخ: <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> بين كل من:</p>

  <p><strong>الطرف الأول (الجهة المفصحة):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>.</p>
  <p><strong>الطرف الثاني (الجهة المتلقية):</strong> <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">الشروط والأحكام</h3>
  <p>1. يلتزم الطرف الثاني بالمحافظة التامة على سرية كافة المعلومات والبيانات الفنية والتقنية والمالية التي يطلع عليها بموجب التعاون المشترك بين الطرفين وعدم استغلالها أو إفشائها لأي طرف ثالث.</p>
  <p>2. مدة الالتزام بالسرية هي <span data-variable-id="contract_duration" class="siyaq-variable-chip">{{contract_duration}}</span> تبدأ من تاريخ توقيع هذه الاتفاقية وتظل سارية المفعول حتى بعد انتهاء أي تعاقدات فرعية.</p>
  <p>3. في حالة إخلال الطرف الثاني بأي التزام ناشئ عن هذه الاتفاقية، يلتزم بسداد تعويض اتفاقي غير خاضع لرقابة القضاء قدره <span data-variable-id="penalty_clause_amount" class="siyaq-variable-chip">{{penalty_clause_amount}}</span> جنيهاً مصرياً، وذلك دون الإخلال بحق الطرف الأول في المطالبة بالتعويض الكامل عن أي أضرار فعلية لحقت به.</p>
  <p>4. تختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر أي نزاع.</p>
</div>
    `.trim(),
    created_at: '2026-09-12T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 13. عقد توريد بضائع وسلع تجارية
  {
    id: 'tmpl-supply-goods',
    name: 'عقد توريد بضائع وسلع تجارية',
    name_en: 'Commercial Goods Supply Contract',
    description: 'عقد توريد تجاري رسمي، يحدد جدول التوريدات، المواصفات الفنية، شروط الفحص والاستلام، وغرامة التأخير اليومية.',
    category: 'commercial',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'second_party_name',
      'second_party_id',
      'contract_value',
      'down_payment',
      'contract_duration',
      'late_penalty_daily',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد توريد بضائع وسلع تجارية</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> اتفق كل من:</p>

  <p><strong>الطرف الأول (المشتري / الجهة الطالبة):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، بطاقة/سجل: <span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span>.</p>
  <p><strong>الطرف الثاني (المورد):</strong> <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، بطاقة/سجل: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">بنود التوريد والمواصفات</h3>
  <p><strong>البند الأول (التوريد والقيمة):</strong> يلتزم المورد بتوريد البضائع والسلع المتفق عليها مطابقة للمواصفات الفنية المعتمدة، بإجمالي قيمة قدرها <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً، سدد منها كدفعة أولى: <span data-variable-id="down_payment" class="siyaq-variable-chip">{{down_payment}}</span> جنيهاً.</p>

  <p><strong>البند الثاني (الجدول الزمني وغرامة التأخير):</strong> يلتزم المورد بإنهاء كافة التوريدات خلال مدة أقصاها: <span data-variable-id="contract_duration" class="siyaq-variable-chip">{{contract_duration}}</span>، وفي حال تأخره عن أي موعد محدد يلتزم بسداد غرامة تأخير اتفاقية قدرها <span data-variable-id="late_penalty_daily" class="siyaq-variable-chip">{{late_penalty_daily}}</span> جنيهاً عن كل يوم تأخير تخصم من مستحقاته دون حاجة لإنذار.</p>

  <p><strong>البند الثالث (الفحص والاستلام):</strong> يتم استلام البضائع بموجب محاضر فحص واستلام رسمية بمخازن المشتري للتأكد من سلامتها وخلوها من العيوب.</p>
  <p><strong>البند الرابع:</strong> تختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر المنازعات.</p>
</div>
    `.trim(),
    created_at: '2026-09-13T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 14. عقد مقاولة وتشطيبات وديكورات
  {
    id: 'tmpl-contracting-decor',
    name: 'عقد مقاولة وتنفيذ أعمال وتشطيبات وديكورات داخلية',
    name_en: 'Turnkey Contracting & Interior Finishing Contract',
    description: 'عقد مقاولات وتشطيب شقق وفلل ومقار إدارية يشمل المقايسة، جدول مراحل التسليم، الدفعات، وفترة الضمان للأعمال.',
    category: 'services',
    variables: [
      'contract_date',
      'first_party_name',
      'second_party_name',
      'property_address',
      'contract_value',
      'down_payment',
      'contract_duration',
      'late_penalty_daily',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد مقاولة وتنفيذ تشطيبات وديكورات</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> اتفق كل من:</p>

  <p><strong>الطرف الأول (رب العمل / المالك):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>.</p>
  <p><strong>الطرف الثاني (المقاول المنفذ):</strong> <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">نطاق الأعمال والمواعيد</h3>
  <p><strong>البند الأول (موقع الأعمال):</strong> عهد الطرف الأول للطرف الثاني بتنفيذ أعمال المقاولة والتشطيبات المتفق عليها للوحدة الكائنة في: <span data-variable-id="property_address" class="siyaq-variable-chip">{{property_address}}</span> وفقاً للمقايسة الفنية والتصميمات المعتمدة.</p>

  <p><strong>البند الثاني (التكلفة والدفعات):</strong> التكلفة الإجمالية للأعمال هي <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً، سدد منها كدفعة مقدمة لشراء الخامات: <span data-variable-id="down_payment" class="siyaq-variable-chip">{{down_payment}}</span> جنيهاً وتسدد البواقي على دفعات مرتبطة بانتهاء كل مرحلة.</p>

  <p><strong>البند الثالث (مدة التنفيذ وغرامة التأخير):</strong> يلتزم المقاول بإنهاء كافة الأعمال وتسليم الوحدة خلال مدة: <span data-variable-id="contract_duration" class="siyaq-variable-chip">{{contract_duration}}</span>، ويلتزم بغرامة تأخير قدرها <span data-variable-id="late_penalty_daily" class="siyaq-variable-chip">{{late_penalty_daily}}</span> جنيهاً عن كل يوم تأخير، مع ضمان الأعمال لمدة سنة من تاريخ التسليم الابتدائي.</p>
  <p><strong>البند الرابع:</strong> تختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر المنازعات.</p>
</div>
    `.trim(),
    created_at: '2026-09-14T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 15. عقد تقديم خدمات تسويق رقمي وإعلانات وبرمجيات
  {
    id: 'tmpl-services-marketing',
    name: 'عقد تقديم خدمات تسويق رقمي وإعلانات وبرمجيات (SaaS)',
    name_en: 'Digital Marketing & Software Services Agreement',
    description: 'عقد إدارة حملات إعلانية وتطوير برمجيات، يحدد مؤشرات الأداء، الميزانيات، الملكية الفكرية، وسرية البيانات.',
    category: 'services',
    variables: [
      'contract_date',
      'first_party_name',
      'second_party_name',
      'contract_duration',
      'monthly_rent',
      'contract_value',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد تقديم خدمات تسويق رقمي وبرمجيات</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> اتفق كل من العميل: <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span> ومقدم الخدمة التقنية: <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">الخدمات والمقابل</h3>
  <p><strong>البند الأول (الخدمات والمدة):</strong> يقدم الطرف الثاني خدمات التسويق وإدارة المنصات والحملات الإعلانية وتطوير البرمجيات لمدة: <span data-variable-id="contract_duration" class="siyaq-variable-chip">{{contract_duration}}</span>.</p>

  <p><strong>البند الثاني (المقابل الشهري):</strong> يلتزم العميل بسداد مقابل خدمة شهري قدره <span data-variable-id="monthly_rent" class="siyaq-variable-chip">{{monthly_rent}}</span> جنيهاً، وبإجمالي تعاقد قدره <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً.</p>

  <p><strong>البند الثالث (حسابات الإعلانات والبيانات):</strong> كافة الحسابات والبيانات وقواعد عملاء الحملات الإعلانية هي ملك خالص للعميل ولا يجوز لمقدم الخدمة حجبها أو مشاركتها.</p>
  <p><strong>البند الرابع:</strong> تختص المحكمة الاقتصادية بـ <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر النزاع.</p>
</div>
    `.trim(),
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 16. عقد أتعاب محاماة واستشارات قانونية ووكالة قضائية
  {
    id: 'tmpl-retainer-lawyer',
    name: 'عقد اتفاق وتحديد أتعاب محاماة واستشارات قانونية ووكالة قضائية',
    name_en: 'Legal Retainer & Representation Agreement',
    description: 'عقد رسمي لتحديد أتعاب المحاماة ونطاق الوكالة القضائية والمصروفات والمسؤولية المهنية طبقا لقانون المحاماة رقم 17 لسنة 1983.',
    category: 'litigation',
    variables: [
      'contract_date',
      'second_party_name',
      'second_party_id',
      'second_party_address',
      'lawyer_name',
      'poa_number',
      'case_number',
      'contract_value',
      'down_payment',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد اتفاق وتحديد أتعاب محاماة ووكالة قضائية</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم الموافق <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> اتفق كل من:</p>

  <p><strong>أولاً (الموكل):</strong> السيد/ <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، رقم قومي: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>، والمقيم في: <span data-variable-id="second_party_address" class="siyaq-variable-chip">{{second_party_address}}</span>.</p>
  <p><strong>ثانياً (المحامي الوكيل):</strong> <span data-variable-id="lawyer_name" class="siyaq-variable-chip">{{lawyer_name}}</span>، بموجب التوكيل الرسمي رقم: <span data-variable-id="poa_number" class="siyaq-variable-chip">{{poa_number}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">نطاق الوكالة والأتعاب</h3>
  <p><strong>البند الأول (الموضوع):</strong> وكل الطرف الأول الطرف الثاني في مباشرة الدفاع والترافع في الدعوى / القضية رقم: <span data-variable-id="case_number" class="siyaq-variable-chip">{{case_number}}</span> أمام المحاكم وجهات التحقيق المختصة حتى صدور حكم نهائي وبات.</p>

  <p><strong>البند الثاني (الأتعاب والدفعات):</strong> تم الاتفاق على أن تكون أتعاب المحاماة الإجمالية مبلغ وقدره <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً مصرياً، سدد منها الموكل مقدماً نقدياً قدره <span data-variable-id="down_payment" class="siyaq-variable-chip">{{down_payment}}</span> جنيهاً عند التوقيع، على أن يسدد الباقي على دفعات مرتبطة بمراحل سير الدعوى.</p>

  <p><strong>البند الثالث (الرسوم والمصروفات):</strong> يتحمل الموكل كافة الرسوم القضائية ومصروفات الخبراء والانتقالات والإعلانات، وتعتبر منفصلة تماماً عن أتعاب المحاماة المتفق عليها.</p>
  <p><strong>البند الرابع:</strong> يخضع هذا العقد لأحكام قانون المحاماة وتختص <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر المنازعات.</p>
</div>
    `.trim(),
    created_at: '2026-09-16T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 17. إقرار تصالح وتنازل نهائي عن جنحة / دعوى
  {
    id: 'tmpl-settlement-court',
    name: 'إقرار تصالح وتنازل نهائي عن جنحة / دعوى قضائية',
    name_en: 'Court / Criminal Case Settlement & Waiver Declaration',
    description: 'صيغة إقرار رسمي بالتصالح الجنائي والمدني والتنازل التام الذي لا رجعة فيه والمقدم للنيابة العامة وهيئة المحكمة.',
    category: 'settlements',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'first_party_address',
      'second_party_name',
      'second_party_id',
      'case_number',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">إقرار وتنازل وتصالح نهائي أمام القضاء</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">حرر هذا الإقرار في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span></p>

  <p>أقر أنا الموقع أدناه السيد/ <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span>، والمقيم في: <span data-variable-id="first_party_address" class="siyaq-variable-chip">{{first_party_address}}</span> (بصفتي الشاكي / المجني عليه).</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">نص الإقرار والتنازل</h3>
  <p>بأني أقر وأشهد وأنا بكامل قواي العقلية وإرادتي الحرة الخالية من أي إكراه، بأني قد تصالحت وتنازلت تنازلاً نهائياً وباتاً لا رجعة فيه مطلقاً لصالح المشكو في حقه السيد/ <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>، وذلك في القضية / المحضر المقيد برقم: <span data-variable-id="case_number" class="siyaq-variable-chip">{{case_number}}</span> والمنظور أمام: <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span>.</p>

  <p>ويشمل هذا التصالح والتنازل كافة الحقوق الجنائية والمدنية والتعويضات، ولا يحق لي مستقبلاً الرجوع عليه أو تحريك أي دعوى قضائية ضده عن ذات الواقعة، ويعد هذا الإقرار سنداً رسمياً لإثبات انقضاء الدعوى الجنائية بالتصالح أمام هيئة المحكمة الموقرة والنيابة العامة.</p>

  <div style="margin-top: 45px; text-align: left; padding-left: 20px;">
    <p><strong>المقر بما فيه (المتنازل):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span></p>
    <p style="margin-top: 35px; color: #94a3b8;">التوقيع: ................................................</p>
    <p style="color: #94a3b8;">بصمة الإبهام: ..........................................</p>
  </div>
</div>
    `.trim(),
    created_at: '2026-09-17T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 18. إقرار ومخالصة مالية نهائية وإبراء ذمة شامل
  {
    id: 'tmpl-clearance-financial',
    name: 'إقرار ومخالصة مالية نهائية وإبراء ذمة شامل',
    name_en: 'Final Financial Clearance & Full Release Declaration',
    description: 'صيغة مخالصة نهائية لاستلام مستحقات مالية أو مستحقات نهاية خدمة وإبراء ذمة تامة مانعة لأي نزاع.',
    category: 'settlements',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'second_party_name',
      'second_party_id',
      'contract_value',
      'payment_method',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">إقرار ومخالصة مالية وإبراء ذمة شامل</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">حرر هذا الإقرار في تاريخ: <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span></p>

  <p>أقر أنا الموقع أدناه السيد/ <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">نص المخالصة والاستلام</h3>
  <p>بأني قد استلمت من السيد/ <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، بطاقة رقم قومي: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>، مبلغاً وقدره <span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span> جنيهاً مصرياً، سددت بالكامل بموجب: <span data-variable-id="payment_method" class="siyaq-variable-chip">{{payment_method}}</span>، وذلك سداداً شاملاً لكافة مستحقاتي المالية عن كافة التعاملات السابقة بيننا.</p>

  <p>وبموجب هذا الاستلام، أقر بإبراء ذمته إبراءً شاملاً ومانعاً من أي حق أو مطالبة حالية أو مستقبلية، ولا يحق لي أو لورثتي من بعدي الرجوع عليه بأي دعوى أو مطالبة، وهذا إقرار مني بذلك.</p>

  <div style="margin-top: 45px; text-align: left; padding-left: 20px;">
    <p><strong>المقر بما فيه:</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span></p>
    <p style="margin-top: 35px; color: #94a3b8;">التوقيع: ................................................</p>
  </div>
</div>
    `.trim(),
    created_at: '2026-09-17T12:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 19. عقد اتفاق وقسمة رضائية لتركة وتوزيع أموال الورثة
  {
    id: 'tmpl-inheritance-division',
    name: 'عقد اتفاق وقسمة رضائية لتركة وتوزيع أموال الورثة',
    name_en: 'Consensual Estate & Inheritance Division Agreement',
    description: 'عقد قسمة رضائية موثقة بين الورثة الشرعيين لحصر وتجنيب وتوزيع أعيان التركة والعقارات والمنقولات بالتراضي.',
    category: 'civil',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'second_party_name',
      'second_party_id',
      'property_address',
      'ownership_document',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد اتفاق وقسمة رضائية لتركة شرعية</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">إنه في يوم <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span> اتفق الورثة الشرعيون:</p>

  <p><strong>الطرف الأول (وارث):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span>، بطاقة: <span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span>.</p>
  <p><strong>الطرف الثاني (وارث):</strong> <span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span>، بطاقة: <span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span>.</p>

  <h3 style="font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">حصر التركة والفرز والتجنيب الرضائي</h3>
  <p><strong>التمهيد:</strong> حيث توفي مورث الأطراف وانحصر إرثه الشرعي في الأطراف بموجب إعلام الوراثة: <span data-variable-id="ownership_document" class="siyaq-variable-chip">{{ownership_document}}</span>، وحيث رغب الجميع في قسمة أعيان التركة الكائنة في: <span data-variable-id="property_address" class="siyaq-variable-chip">{{property_address}}</span> قسمة رضائية قطعية ونهائية، فقد اتفقوا على الآتي:</p>

  <p><strong>البند الأول (الاختصاص بالأنصبة):</strong> اختص كل طرف بنصيبه المفرز المحدد بالاتفاق والمطابق للشرع والقانون دون أي غبن أو إكراه، وسقط حق أي طرف في الاعتراض على قسمة الطرف الآخر.</p>

  <p><strong>البند الثاني (الحيازة والالتزام):</strong> تسلم كل طرف نصيبه واضعاً يده عليه حيازة هادئة ومستقرة، ويلتزم الجميع بتسهيل كافة إجراءات التسجيل ونقل الملكية الفردية بالشهر العقاري.</p>
  <p><strong>البند الثالث:</strong> تختص محكمة الأسرة والمدني بـ <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بأي نزاع.</p>
</div>
    `.trim(),
    created_at: '2026-09-17T14:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },

  // 20. إيصال أمانة قانوني مكتمل الأركان (وفقا للمادة 341 عقوبات)
  {
    id: 'tmpl-trust-receipt',
    name: 'إيصال أمانة قانوني مكتمل الأركان (وفقاً للمادة 341 عقوبات)',
    name_en: 'Legal Trust Receipt (Fiduciary Duty)',
    description: 'صيغة سند وإيصال أمانة ثلاثي الأطراف معتمد ومطابق لأحكام المادة 341 من قانون العقوبات المصري ومستقر عليه قضاءً.',
    category: 'settlements',
    variables: [
      'contract_date',
      'first_party_name',
      'first_party_id',
      'first_party_address',
      'second_party_name',
      'second_party_id',
      'third_party_name',
      'third_party_id',
      'contract_value',
      'competent_court',
    ],
    html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">إيصال أمانة قانوني مكتمل الأركان</h2>
  <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #475569;">خاضع للمادة 341 من قانون العقوبات المصري - تحريراً في: <span data-variable-id="contract_date" class="siyaq-variable-chip">{{contract_date}}</span></p>

  <div style="border: 2px solid #334155; padding: 24px; border-radius: 12px; background-color: #fafaf9; margin-top: 15px;">
    <p style="font-size: 15px; line-height: 2.2;">
      استلمت أنا الموقع أدناه/ <strong><span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span></strong>،
      بطاقة رقم قومي: <strong><span data-variable-id="first_party_id" class="siyaq-variable-chip">{{first_party_id}}</span></strong>،
      والمقيم في: <strong><span data-variable-id="first_party_address" class="siyaq-variable-chip">{{first_party_address}}</span></strong>.
    </p>

    <p style="font-size: 15px; line-height: 2.2; margin-top: 12px;">
      من السيد/ <strong><span data-variable-id="second_party_name" class="siyaq-variable-chip">{{second_party_name}}</span></strong>،
      بطاقة رقم قومي: <strong><span data-variable-id="second_party_id" class="siyaq-variable-chip">{{second_party_id}}</span></strong>.
    </p>

    <p style="font-size: 15px; line-height: 2.2; margin-top: 12px;">
      مبلغاً وقدره <strong><span data-variable-id="contract_value" class="siyaq-variable-chip">{{contract_value}}</span></strong> جنيهاً مصرياً لا غير (نقداً وعداً).
    </p>

    <p style="font-size: 15px; line-height: 2.2; margin-top: 12px;">
      وذلك <strong>على سبيل الأمانة</strong> لتسليمه إلى السيد/ <strong><span data-variable-id="third_party_name" class="siyaq-variable-chip">{{third_party_name}}</span></strong>،
      بطاقة رقم قومي: <strong><span data-variable-id="third_party_id" class="siyaq-variable-chip">{{third_party_id}}</span></strong>.
    </p>

    <p style="font-size: 15px; line-height: 2.2; margin-top: 12px;">
      وإذا لم أقم بتسليم هذا المبلغ عند طلبه، أكون مبدداً وخائناً للأمانة وأتحمل المسؤولية الجنائية والمدنية المنصوص عليها بالمادة 341 من قانون العقوبات وما يترتب عليها من عقوبات الحبس والغرامة، وتختص محكمة الجنح بـ <span data-variable-id="competent_court" class="siyaq-variable-chip">{{competent_court}}</span> بنظر الدعوى. وهذا إيصال أمانة صادر مني بالاستلام.
    </p>

    <div style="margin-top: 40px; display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px dashed #cbd5e1;">
      <div style="width: 50%;">
        <p><strong>المستلم بما فيه (المقر بالأمانة):</strong> <span data-variable-id="first_party_name" class="siyaq-variable-chip">{{first_party_name}}</span></p>
        <p style="margin-top: 25px; color: #94a3b8;">التوقيع: ................................................</p>
      </div>
      <div style="width: 40%; text-align: left;">
        <p><strong>بصمة الإبهام:</strong></p>
        <div style="width: 90px; height: 110px; border: 2px dashed #94a3b8; border-radius: 8px; margin-top: 8px; margin-left: auto; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px;">
          (البصمة)
        </div>
      </div>
    </div>
  </div>
</div>
    `.trim(),
    created_at: '2026-09-17T16:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
    is_active: true,
  },
];
