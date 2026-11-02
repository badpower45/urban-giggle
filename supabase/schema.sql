-- ==============================================================================
-- بَـصِـيـرَة (Baseera Legal SaaS) - Multi-Tenant PostgreSQL Production Schema
-- Designed for Egyptian Law Firms & Case Management Architecture
-- Multi-Tenancy Architecture: Strict Row-Level Security (RLS) + Super Admin Governance
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. Utility Functions & Triggers
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. TABLE: firms (مكاتب وشركات المحاماة - الكيانات المشتركة في الـ SaaS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.firms (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT DEFAULT 'القاهرة',
  governorate TEXT DEFAULT 'القاهرة',
  tax_number TEXT,
  commercial_reg TEXT,
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'past_due', 'suspended', 'cancelled')),
  subscription_plan TEXT DEFAULT 'office' CHECK (subscription_plan IN ('individual', 'office', 'enterprise', 'custom')),
  subscription_cycle TEXT DEFAULT 'monthly' CHECK (subscription_cycle IN ('monthly', 'yearly')),
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  max_users INTEGER DEFAULT 10,
  max_storage_gb INTEGER DEFAULT 50,
  max_cases INTEGER DEFAULT 10000,
  is_verified BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_firms_slug ON public.firms(slug);
CREATE INDEX IF NOT EXISTS idx_firms_status ON public.firms(subscription_status);

DROP TRIGGER IF EXISTS update_firms_updated_at ON public.firms;
CREATE TRIGGER update_firms_updated_at
BEFORE UPDATE ON public.firms
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 4. TABLE: profiles (الملف الشخصي للمحامي / المستخدم / المشرف العام)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  firm_id TEXT REFERENCES public.firms(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'senior' CHECK (role IN ('owner', 'senior', 'junior', 'clerk', 'admin')),
  is_super_admin BOOLEAN DEFAULT FALSE, -- Platform Owners & Super Admins
  bar_number TEXT,
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_firm ON public.profiles(firm_id);
CREATE INDEX IF NOT EXISTS idx_profiles_super_admin ON public.profiles(is_super_admin);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper function to get firm_id for RLS
CREATE OR REPLACE FUNCTION public.get_auth_firm_id()
RETURNS TEXT AS $$
  SELECT firm_id FROM public.profiles WHERE id = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function to check if current user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT is_super_admin FROM public.profiles WHERE id = auth.uid()::text LIMIT 1), FALSE);
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ==============================================================================
-- 5. TABLE: firm_roles (الأدوار والصلاحيات المخصصة داخل كل مكتب)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.firm_roles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_firm_roles_updated_at ON public.firm_roles;
CREATE TRIGGER update_firm_roles_updated_at
BEFORE UPDATE ON public.firm_roles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 6. TABLE: firm_members (أعضاء وفريق عمل المكتب)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.firm_members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role_id TEXT REFERENCES public.firm_roles(id) ON DELETE SET NULL,
  role_name TEXT,
  role_slug TEXT DEFAULT 'senior',
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_firm_members_firm ON public.firm_members(firm_id);
CREATE INDEX IF NOT EXISTS idx_firm_members_user ON public.firm_members(user_id);

-- ==============================================================================
-- 7. TABLE: clients (دليل الموكلين لكل مكتب)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  client_type TEXT NOT NULL CHECK (client_type IN ('individual', 'company', 'government')),
  national_id TEXT,
  company_reg TEXT,
  occupation TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  notes TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_firm ON public.clients(firm_id);
CREATE INDEX IF NOT EXISTS idx_clients_search ON public.clients(firm_id, full_name, phone);

DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 8. TABLE: power_of_attorney (التوكيلات الرسمية بالشهر العقاري)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.power_of_attorney (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  poa_number TEXT NOT NULL,
  poa_date DATE NOT NULL,
  poa_type TEXT NOT NULL CHECK (poa_type IN ('general', 'special')),
  poa_notary_type TEXT DEFAULT 'شهر عقاري',
  poa_notary_office TEXT NOT NULL,
  poa_scope TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_poa_client ON public.power_of_attorney(client_id);
CREATE INDEX IF NOT EXISTS idx_poa_firm ON public.power_of_attorney(firm_id);

DROP TRIGGER IF EXISTS update_poa_updated_at ON public.power_of_attorney;
CREATE TRIGGER update_poa_updated_at
BEFORE UPDATE ON public.power_of_attorney
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 9. TABLE: cases (سجل القضايا والدعاوى القضائية)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cases (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  court_id TEXT DEFAULT 'c-1',
  court_name TEXT NOT NULL,
  court_governorate TEXT DEFAULT 'القاهرة',
  case_type_id TEXT DEFAULT 'ct-1',
  case_type_name TEXT NOT NULL,
  title TEXT NOT NULL,
  case_number TEXT NOT NULL,
  case_year INTEGER NOT NULL,
  circuit TEXT NOT NULL,
  description TEXT,
  opponent_name TEXT NOT NULL,
  opponent_lawyer TEXT,
  client_role TEXT NOT NULL CHECK (client_role IN ('plaintiff', 'defendant', 'appellant', 'respondent', 'third_party')),
  filing_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed', 'on_hold', 'reserved_for_ruling')),
  closed_at TIMESTAMPTZ,
  assigned_to TEXT,
  assigned_to_name TEXT,
  total_fees NUMERIC(12, 2) DEFAULT 0,
  total_paid NUMERIC(12, 2) DEFAULT 0,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cases_firm ON public.cases(firm_id);
CREATE INDEX IF NOT EXISTS idx_cases_client ON public.cases(client_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(firm_id, status);
CREATE INDEX IF NOT EXISTS idx_cases_number_year ON public.cases(case_number, case_year);

DROP TRIGGER IF EXISTS update_cases_updated_at ON public.cases;
CREATE TRIGGER update_cases_updated_at
BEFORE UPDATE ON public.cases
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 10. TABLE: case_sessions (رول الجلسات وقرارات المحكمة)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.case_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  case_title TEXT,
  case_court TEXT,
  case_client TEXT,
  session_date DATE NOT NULL,
  roll_number TEXT,
  circuit TEXT,
  outcome_type TEXT DEFAULT 'adjourned',
  ruling_outcome TEXT DEFAULT '',
  decision TEXT,
  adjournment_reason TEXT,
  next_session_date DATE,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_case ON public.case_sessions(case_id);
CREATE INDEX IF NOT EXISTS idx_sessions_firm_date ON public.case_sessions(firm_id, session_date);

DROP TRIGGER IF EXISTS update_sessions_updated_at ON public.case_sessions;
CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON public.case_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 11. TABLE: legal_deadlines (المواعيد والمدد القانونية والطعون)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.legal_deadlines (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  case_title TEXT,
  deadline_date DATE NOT NULL,
  type TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'medium' CHECK (urgency IN ('critical', 'high', 'medium', 'normal')),
  is_confirmed BOOLEAN DEFAULT TRUE,
  is_suggested BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deadlines_case ON public.legal_deadlines(case_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_firm_date ON public.legal_deadlines(firm_id, deadline_date);

DROP TRIGGER IF EXISTS update_deadlines_updated_at ON public.legal_deadlines;
CREATE TRIGGER update_deadlines_updated_at
BEFORE UPDATE ON public.legal_deadlines
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 12. TABLE: tasks (إدارة مهام وتكليفات المكتب)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  case_id TEXT REFERENCES public.cases(id) ON DELETE SET NULL,
  case_title TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_to TEXT,
  assigned_to_name TEXT,
  due_date DATE NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_firm_status ON public.tasks(firm_id, status);

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 13. TABLE: police_reports (محاضر الشرطة والنيابات العامة)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.police_reports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_name TEXT,
  report_number TEXT NOT NULL,
  report_year INTEGER NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('admin', 'ahwal', 'awared', 'junhah', 'jinaya', 'mukhalafa', 'econ_junhah', 'juvenile')),
  security_directorate TEXT NOT NULL,
  police_station TEXT NOT NULL,
  police_point TEXT,
  general_prosecution TEXT NOT NULL,
  district_prosecution TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'under_investigation' CHECK (status IN ('under_investigation', 'archived', 'referred_to_court', 'struck_off')),
  subject TEXT NOT NULL,
  incident_summary TEXT,
  incident_location TEXT,
  dispatch_number TEXT,
  intake_number TEXT,
  investigating_prosecutor TEXT,
  archive_number TEXT,
  appeal_number TEXT,
  appeal_date DATE,
  appeal_authority TEXT,
  appeal_decision TEXT,
  total_fees NUMERIC(12, 2) DEFAULT 0,
  total_expenses NUMERIC(12, 2) DEFAULT 0,
  linked_case_id TEXT REFERENCES public.cases(id) ON DELETE SET NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_police_reports_firm ON public.police_reports(firm_id);
CREATE INDEX IF NOT EXISTS idx_police_reports_client ON public.police_reports(client_id);

DROP TRIGGER IF EXISTS update_police_reports_updated_at ON public.police_reports;
CREATE TRIGGER update_police_reports_updated_at
BEFORE UPDATE ON public.police_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 14. TABLE: contracts (منشئ العقود الذكية)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contracts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  template_id TEXT,
  client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
  case_id TEXT REFERENCES public.cases(id) ON DELETE SET NULL,
  variables JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'signed', 'archived')),
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_firm ON public.contracts(firm_id);

-- ==============================================================================
-- 15. TABLE: documents (المستندات والماسح الضوئي الذكي)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  case_id TEXT REFERENCES public.cases(id) ON DELETE CASCADE,
  client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
  police_report_id TEXT REFERENCES public.police_reports(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  ocr_extracted_text TEXT,
  ocr_metadata JSONB DEFAULT '{}'::jsonb,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_firm ON public.documents(firm_id);

-- ==============================================================================
-- 16. TABLE: billing_payments (المدفوعات والمصروفات المالية للمكتب)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.billing_payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  case_id TEXT REFERENCES public.cases(id) ON DELETE CASCADE,
  police_report_id TEXT REFERENCES public.police_reports(id) ON DELETE CASCADE,
  client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  payment_type TEXT NOT NULL DEFAULT 'fee_payment',
  direction TEXT NOT NULL DEFAULT 'income' CHECK (direction IN ('income', 'expense')),
  payment_method TEXT DEFAULT 'cash',
  reference_number TEXT,
  receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_firm ON public.billing_payments(firm_id);

-- ==============================================================================
-- 17. TABLE: platform_invoices (فواتير واشتراكات المنصة المحصلة من المكاتب - SaaS Billing)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.platform_invoices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  invoice_number TEXT NOT NULL UNIQUE,
  firm_id TEXT NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'ج.م',
  billing_cycle TEXT DEFAULT 'yearly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  payment_method TEXT DEFAULT 'instapay',
  status TEXT DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_invoices_firm ON public.platform_invoices(firm_id);

-- ==============================================================================
-- 18. TABLE: contact_requests (طلبات التواصل والديمو من صفحة الهبوط - Leads)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  full_name TEXT NOT NULL,
  firm_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  team_size TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'demo_scheduled', 'converted', 'archived')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON public.contact_requests(status);

-- ==============================================================================
-- 19. TABLE: support_tickets (الشكاوى والتواصل مع الدعم الفني للمنصة)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ticket_number TEXT NOT NULL UNIQUE,
  firm_id TEXT REFERENCES public.firms(id) ON DELETE SET NULL,
  firm_name TEXT,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  subject TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'billing', 'inquiry', 'feature_request')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);

-- ==============================================================================
-- 20. Automatic Trigger on auth.users (When User Signs Up via Supabase Auth)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_firm_id TEXT;
  firm_slug TEXT;
BEGIN
  firm_slug := 'firm-' || substr(md5(random()::text), 1, 8);

  -- 1. Create a Default Law Firm for the new user
  INSERT INTO public.firms (name, slug, subscription_status, subscription_plan)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'firm_name', 'مكتب ' || COALESCE(NEW.raw_user_meta_data->>'full_name', 'المحاماة والاستشارات القانونية')),
    firm_slug,
    'trial',
    'office'
  )
  RETURNING id INTO new_firm_id;

  -- 2. Create the user's profile linked to the firm as Owner
  INSERT INTO public.profiles (id, firm_id, full_name, email, role, avatar_url)
  VALUES (
    NEW.id::text,
    new_firm_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'owner',
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

  -- 3. Register member entry
  INSERT INTO public.firm_members (firm_id, user_id, role_name, role_slug)
  VALUES (new_firm_id, NEW.id::text, 'مالك المكتب', 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 21. ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-tenant isolation for authenticated users + Super Admin Master Access
-- ==============================================================================
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firm_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firm_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.power_of_attorney ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.police_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- FIRMS RLS
DROP POLICY IF EXISTS "firms_access_policy" ON public.firms;
CREATE POLICY "firms_access_policy" ON public.firms FOR ALL TO public
USING (
  public.is_super_admin()
  OR id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
  OR id = '01a08460-df3a-70c0-9a46-f3497eced7c7'
);

-- PROFILES RLS
DROP POLICY IF EXISTS "profiles_access_policy" ON public.profiles;
CREATE POLICY "profiles_access_policy" ON public.profiles FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR id = auth.uid()::text
  OR auth.uid() IS NULL
);

-- CLIENTS RLS
DROP POLICY IF EXISTS "clients_access_policy" ON public.clients;
CREATE POLICY "clients_access_policy" ON public.clients FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
  OR firm_id = '01a08460-df3a-70c0-9a46-f3497eced7c7'
);

-- POWER OF ATTORNEY RLS
DROP POLICY IF EXISTS "poa_access_policy" ON public.power_of_attorney;
CREATE POLICY "poa_access_policy" ON public.power_of_attorney FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
  OR firm_id = '01a08460-df3a-70c0-9a46-f3497eced7c7'
);

-- CASES RLS
DROP POLICY IF EXISTS "cases_access_policy" ON public.cases;
CREATE POLICY "cases_access_policy" ON public.cases FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
  OR firm_id = '01a08460-df3a-70c0-9a46-f3497eced7c7'
);

-- SESSIONS RLS
DROP POLICY IF EXISTS "sessions_access_policy" ON public.case_sessions;
CREATE POLICY "sessions_access_policy" ON public.case_sessions FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
  OR firm_id = '01a08460-df3a-70c0-9a46-f3497eced7c7'
);

-- DEADLINES RLS
DROP POLICY IF EXISTS "deadlines_access_policy" ON public.legal_deadlines;
CREATE POLICY "deadlines_access_policy" ON public.legal_deadlines FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
  OR firm_id = '01a08460-df3a-70c0-9a46-f3497eced7c7'
);

-- TASKS RLS
DROP POLICY IF EXISTS "tasks_access_policy" ON public.tasks;
CREATE POLICY "tasks_access_policy" ON public.tasks FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
  OR firm_id = '01a08460-df3a-70c0-9a46-f3497eced7c7'
);

-- POLICE REPORTS RLS
DROP POLICY IF EXISTS "police_reports_access_policy" ON public.police_reports;
CREATE POLICY "police_reports_access_policy" ON public.police_reports FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
  OR firm_id = '01a08460-df3a-70c0-9a46-f3497eced7c7'
);

-- CONTRACTS RLS
DROP POLICY IF EXISTS "contracts_access_policy" ON public.contracts;
CREATE POLICY "contracts_access_policy" ON public.contracts FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
  OR firm_id = '01a08460-df3a-70c0-9a46-f3497eced7c7'
);

-- DOCUMENTS RLS
DROP POLICY IF EXISTS "documents_access_policy" ON public.documents;
CREATE POLICY "documents_access_policy" ON public.documents FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
  OR firm_id = '01a08460-df3a-70c0-9a46-f3497eced7c7'
);

-- BILLING PAYMENTS RLS
DROP POLICY IF EXISTS "billing_payments_access_policy" ON public.billing_payments;
CREATE POLICY "billing_payments_access_policy" ON public.billing_payments FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
  OR firm_id = '01a08460-df3a-70c0-9a46-f3497eced7c7'
);

-- PLATFORM INVOICES RLS
DROP POLICY IF EXISTS "platform_invoices_access_policy" ON public.platform_invoices;
CREATE POLICY "platform_invoices_access_policy" ON public.platform_invoices FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
);

-- CONTACT REQUESTS RLS (Allow public submissions, restrict viewing to super admins)
DROP POLICY IF EXISTS "contact_requests_access_policy" ON public.contact_requests;
CREATE POLICY "contact_requests_access_policy" ON public.contact_requests FOR ALL TO public
USING (public.is_super_admin() OR auth.uid() IS NULL);

-- SUPPORT TICKETS RLS
DROP POLICY IF EXISTS "support_tickets_access_policy" ON public.support_tickets;
CREATE POLICY "support_tickets_access_policy" ON public.support_tickets FOR ALL TO public
USING (
  public.is_super_admin()
  OR firm_id = public.get_auth_firm_id()
  OR auth.uid() IS NULL
);

-- ==============================================================================
-- End of Schema
-- ==============================================================================
