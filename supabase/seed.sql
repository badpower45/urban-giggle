-- ==============================================================================
-- بَـصِـيـرَة (Baseera Legal SaaS) - Multi-Tenant Seed Data for PostgreSQL / Supabase
-- Realistic Egyptian Law Practice & Multi-Firm SaaS Sample Data
-- ==============================================================================

-- 1. Insert Law Firms (Tenants)
INSERT INTO public.firms (
  id, name, slug, logo_url, phone, email, address, city, governorate, subscription_status, subscription_plan, subscription_cycle, max_users, max_storage_gb
) VALUES 
  (
    '01a08460-df3a-70c0-9a46-f3497eced7c7',
    'مكتب محمد السيد للمحاماة والاستشارات القانونية',
    'sayed-legal',
    '/logo.webp',
    '01012345678',
    'elezabybode375@gmail.com',
    '14 شارع مصطفى النحاس، مدينة نصر، القاهرة',
    'مدينة نصر',
    'القاهرة',
    'active',
    'enterprise',
    'yearly',
    30,
    150
  ),
  (
    'firm-02',
    'مجموعة طارق عبد العزيز للمحاماة والتحكيم الدولي',
    'tarek-firm',
    '/logo.webp',
    '01098765432',
    'tarek.law@gmail.com',
    'مجمع البنوك، التسعين الشمالي، التجمع الخامس',
    'القاهرة الجديدة',
    'القاهرة',
    'active',
    'enterprise',
    'yearly',
    30,
    150
  ),
  (
    'firm-03',
    'مكتب ميادة كمال للمحاماة التجارية والملكية الفكرية',
    'mayada-legal',
    '/logo.webp',
    '01123456789',
    'mayada.legal@outlook.com',
    'أبراج سموحة، شارع فوزي معاذ، الإسكندرية',
    'سموحة',
    'الإسكندرية',
    'active',
    'office',
    'monthly',
    10,
    50
  ),
  (
    'firm-04',
    'الشناوي وشركاه للاستشارات القانونية والضرائب',
    'elshinawy-law',
    '/logo.webp',
    '01234567890',
    'elshinawy.law@yahoo.com',
    'شارع مصدق، الدقي، الجيزة',
    'الدقي',
    'الجيزة',
    'active',
    'office',
    'yearly',
    10,
    50
  ),
  (
    'firm-05',
    'مكتب المستشار حسام الدين للمحاماة الجنائية والنقض',
    'hossam-law',
    '/logo.webp',
    '01511223344',
    'hossam@law.eg',
    'شارع الجيش، أمام مجمع المحاكم، المنصورة',
    'المنصورة',
    'الدقهلية',
    'active',
    'individual',
    'monthly',
    2,
    5
  ),
  (
    'firm-06',
    'مكتب الأستاذ أحمد البدري للمحاماة',
    'elbadry-law',
    '/logo.webp',
    '01065432198',
    'elbadry.law@gmail.com',
    'شارع البحر، طنطا',
    'طنطا',
    'الغربية',
    'trial',
    'office',
    'monthly',
    10,
    50
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subscription_status = EXCLUDED.subscription_status,
  subscription_plan = EXCLUDED.subscription_plan;

-- 2. Insert Super Admin Profile & Lawyer Profiles
INSERT INTO public.profiles (
  id, firm_id, full_name, email, phone, role, is_super_admin, avatar_url, bar_number
) VALUES
  (
    'super-admin-01',
    '01a08460-df3a-70c0-9a46-f3497eced7c7',
    'المدير التنفيذي للمنصة (Super Admin)',
    'admin@baseera.legal',
    '01023456789',
    'admin',
    TRUE,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'SA-001'
  ),
  (
    '01a08460-b523-7667-b6cd-7863e99c38c7',
    '01a08460-df3a-70c0-9a46-f3497eced7c7',
    'محمد السيد',
    'elezabybode375@gmail.com',
    '01012345678',
    'owner',
    TRUE,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    '49281'
  ),
  (
    'user-lawyer-02',
    'firm-02',
    'طارق عبد العزيز',
    'tarek.law@gmail.com',
    '01098765432',
    'owner',
    FALSE,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    '31842'
  ),
  (
    'user-lawyer-03',
    'firm-03',
    'ميادة كمال',
    'mayada.legal@outlook.com',
    '01123456789',
    'owner',
    FALSE,
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    '52890'
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Platform SaaS Subscription Invoices
INSERT INTO public.platform_invoices (
  id, invoice_number, firm_id, plan_name, amount, currency, billing_cycle, payment_method, status, paid_at
) VALUES
  ('inv-2026-001', 'INV-BAS-2026-0089', 'firm-02', 'باقة المكاتب الكبرى (سنوي)', 37000, 'ج.م', 'yearly', 'bank_transfer', 'paid', NOW() - INTERVAL '60 days'),
  ('inv-2026-002', 'INV-BAS-2026-0094', '01a08460-df3a-70c0-9a46-f3497eced7c7', 'باقة المكاتب الكبرى (سنوي)', 37000, 'ج.م', 'yearly', 'instapay', 'paid', NOW() - INTERVAL '45 days'),
  ('inv-2026-003', 'INV-BAS-2026-0105', 'firm-04', 'باقة المكاتب المتوسطة (سنوي)', 14000, 'ج.م', 'yearly', 'credit_card', 'paid', NOW() - INTERVAL '30 days'),
  ('inv-2026-004', 'INV-BAS-2026-0142', 'firm-03', 'باقة المكاتب المتوسطة (شهري)', 1400, 'ج.م', 'monthly', 'instapay', 'paid', NOW() - INTERVAL '10 days'),
  ('inv-2026-005', 'INV-BAS-2026-0158', 'firm-05', 'باقة المحامي الفردي (شهري)', 500, 'ج.م', 'monthly', 'vodafone_cash', 'paid', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Default Firm Roles
INSERT INTO public.firm_roles (id, firm_id, name, slug, permissions, is_system)
VALUES 
  ('019e413f-f4b3-7e2c-adc4-599d10397216', '01a08460-df3a-70c0-9a46-f3497eced7c7', 'مالك المكتب', 'owner', ARRAY['*'], TRUE),
  ('019e413f-f4b4-7bb5-98d8-524f44e15cd4', '01a08460-df3a-70c0-9a46-f3497eced7c7', 'محامٍ أساسي', 'senior', ARRAY['cases.*', 'clients.*', 'sessions.*', 'billing.*'], TRUE),
  ('019e413f-f4b5-7856-abc3-76500ed100c4', '01a08460-df3a-70c0-9a46-f3497eced7c7', 'مساعد قانوني', 'junior', ARRAY['cases.view', 'clients.view', 'sessions.create'], TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Sample Clients
INSERT INTO public.clients (id, firm_id, full_name, client_type, national_id, company_reg, occupation, phone, email, address, notes)
VALUES 
  (
    '01a08461-1234-7000-8000-000000000001',
    '01a08460-df3a-70c0-9a46-f3497eced7c7',
    'أحمد مصطفى كامل',
    'individual',
    '29008150102432',
    NULL,
    'مهندس مدني حر',
    '01098765432',
    'ahmed.mostafa@gmail.com',
    'حي السفارات، مدينة نصر، القاهرة',
    'موكل دائم للمكتب منذ 2024'
  ),
  (
    '01a08461-1234-7000-8000-000000000002',
    '01a08460-df3a-70c0-9a46-f3497eced7c7',
    'شركة النيل للتجارة والمقاولات (ش.م.م)',
    'company',
    NULL,
    'س.ت 104928 استثمار القاهرة',
    'مقاولات عامة وتوريدات',
    '0226789123',
    'legal@niletrade.com',
    'المحور المركزي، التجمع الخامس، القاهرة الجديدة',
    'عقد استشارات سنوي سارٍ'
  ),
  (
    '01a08461-1234-7000-8000-000000000003',
    '01a08460-df3a-70c0-9a46-f3497eced7c7',
    'فاطمة عبد الرحمن الصاوي',
    'individual',
    '29403210108921',
    NULL,
    'سيدة أعمال',
    '01223344556',
    'fatma.sawi@outlook.com',
    'شارع مصدق، الدقي، الجيزة',
    'دعوى بطلان عقد بيع وميراث'
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Sample Cases
INSERT INTO public.cases (
  id, firm_id, client_id, client_name, court_name, court_governorate, case_type_name, title, case_number, case_year, circuit, opponent_name, opponent_lawyer, client_role, filing_date, status, total_fees, total_paid
) VALUES
  (
    '01a08463-2222-7000-8000-000000000001',
    '01a08460-df3a-70c0-9a46-f3497eced7c7',
    '01a08461-1234-7000-8000-000000000001',
    'أحمد مصطفى كامل',
    'محكمة شمال القاهرة الابتدائية',
    'القاهرة',
    'مدني كلي',
    'دعوى إلزام بتعويض عن إخلال بالتزامات تعاقدية',
    '1842',
    2026,
    'الدائرة 7 مدني كلي',
    'محمود الشناوي عبد ربه',
    'أ. حسام فوزي',
    'plaintiff',
    '2026-01-15',
    'active',
    25000,
    15000
  ),
  (
    '01a08463-2222-7000-8000-000000000002',
    '01a08460-df3a-70c0-9a46-f3497eced7c7',
    '01a08461-1234-7000-8000-000000000002',
    'شركة النيل للتجارة والمقاولات (ش.م.م)',
    'محكمة استئناف القاهرة (دار القضاء العالي)',
    'القاهرة',
    'استئناف تجاري',
    'استئناف حكم في منازعة تحكيم وتوريدات خرسانة جاهزة',
    '941',
    143,
    'الدائرة 12 استئناف تجاري',
    'شركة أطلس للإنشاءات الدولية',
    'د. ممدوح العفيفي',
    'appellant',
    '2026-02-01',
    'active',
    60000,
    40000
  )
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Sample Case Sessions
INSERT INTO public.case_sessions (
  id, firm_id, case_id, case_title, case_court, case_client, session_date, roll_number, circuit, outcome_type, decision, adjournment_reason, next_session_date
) VALUES
  (
    '01a08464-3333-7000-8000-000000000001',
    '01a08460-df3a-70c0-9a46-f3497eced7c7',
    '01a08463-2222-7000-8000-000000000001',
    'دعوى إلزام بتعويض عن إخلال بالتزامات تعاقدية',
    'محكمة شمال القاهرة الابتدائية',
    'أحمد مصطفى كامل',
    CURRENT_DATE,
    '14',
    'الدائرة 7 مدني كلي',
    'adjourned',
    'التأجيل لإيداع تقرير مكتب خبراء وزارة العدل وسداد أمانة الخبير',
    'ورود تقرير الخبير',
    CURRENT_DATE + INTERVAL '28 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- End of Seed Data
-- ==============================================================================
