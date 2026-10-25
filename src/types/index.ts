export type ClientType = 'individual' | 'company' | 'government';
export type CaseStatus = 'active' | 'archived' | 'closed' | 'on_hold' | 'reserved_for_ruling';
export type ClientRole = 'plaintiff' | 'defendant' | 'appellant' | 'respondent' | 'third_party';
export type SessionOutcomeType = 'adjourned' | 'final_ruling' | 'reserved_for_ruling' | 'primary_ruling' | 'postponed' | '';
export type RulingOutcome = 'in_favor' | 'against' | 'partial' | '';
export type DeadlineUrgency = 'critical' | 'high' | 'medium' | 'normal';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type PoliceReportType = 'admin' | 'ahwal' | 'awared' | 'junhah' | 'jinaya' | 'mukhalafa' | 'econ_junhah' | 'juvenile';
export type PoliceReportStatus = 'under_investigation' | 'archived' | 'referred_to_court' | 'struck_off';

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role?: string;
  member_since?: string;
  auth_provider?: string;
  two_fa_enabled?: boolean;
}

export interface Firm {
  id: string;
  name: string;
  logo_url?: string;
  created_at: string;
}

export interface FirmMember {
  user_id: string;
  full_name: string;
  email?: string;
  avatar_url?: string;
  role_id?: string;
  role_name?: string;
  role_slug?: string;
  joined_at?: string;
}

export interface FirmRole {
  id: string;
  name: string;
  slug: string;
  permissions: string[];
  is_system: boolean;
  members_count: number;
}

export interface Client {
  id: string;
  firm_id: string;
  full_name: string;
  client_type: ClientType;
  occupation?: string;
  national_id?: string;
  company_reg?: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  custom_fields?: Record<string, any>;
  created_by?: string;
  active_cases: number;
  case_count: number;
  report_count: number;
  created_at: string;
  updated_at: string;
}

export interface PowerOfAttorney {
  id: string;
  firm_id: string;
  client_id: string;
  poa_number: string;
  poa_date: string;
  poa_type: 'general' | 'special';
  poa_notary_type: string;
  poa_notary_office: string;
  poa_scope: string;
  status: 'active' | 'expired' | 'revoked';
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface Case {
  id: string;
  firm_id: string;
  client_id: string;
  client_name: string;
  litigation_chain?: Array<{
    id: string;
    title: string;
    case_number: string;
    case_year: number;
    status: CaseStatus;
  }>;
  court_id: string;
  court_name: string;
  court_governorate: string;
  case_type_id: string;
  case_type_name: string;
  title: string;
  case_number: string;
  case_year: number;
  circuit: string;
  description?: string;
  opponent_name: string;
  opponent_lawyer?: string;
  client_role: ClientRole;
  filing_date: string;
  status: CaseStatus;
  closed_at?: string | null;
  assigned_to?: string;
  assigned_to_name?: string;
  assigned_lawyers?: string[];
  custom_fields?: Record<string, any>;
  next_session_date?: string | null;
  nearest_deadline_date?: string | null;
  sessions_count: number;
  pending_deadlines_count: number;
  total_fees: number;
  total_paid: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CourtSession {
  id: string;
  case_id: string;
  case_title?: string;
  case_court?: string;
  case_client?: string;
  client_name?: string;
  opponent_name?: string;
  circuit?: string;
  roll_number?: string;
  decision?: string;
  session_date: string;
  outcome_type?: SessionOutcomeType;
  ruling_outcome?: RulingOutcome;
  notes?: string;
  next_session_date?: string | null;
  adjournment_reason?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LegalDeadline {
  id: string;
  case_id: string;
  case_title?: string;
  deadline_date: string;
  type: string; // appeal, cassation, memo, opposition, etc.
  urgency: DeadlineUrgency;
  is_suggested?: boolean;
  is_confirmed?: boolean;
  description?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  firm_id: string;
  case_id?: string | null;
  case_title?: string | null;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_to?: string | null;
  assigned_to_name?: string | null;
  due_date: string;
  created_by?: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface PoliceReport {
  id: string;
  firm_id: string;
  client_id: string;
  client_name?: string;
  report_number: string;
  report_year: number;
  report_type: PoliceReportType;
  security_directorate: string;
  police_station: string;
  police_point?: string;
  general_prosecution: string;
  district_prosecution: string;
  status: PoliceReportStatus;
  subject: string;
  incident_summary?: string;
  incident_location?: string;
  dispatch_number?: string;
  intake_number?: string;
  investigating_prosecutor?: string;
  archive_number?: string;
  appeal_number?: string;
  appeal_date?: string;
  appeal_authority?: string;
  appeal_decision?: string;
  total_fees: number;
  total_expenses: number;
  linked_case_id?: string | null;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BillingCaseSummary {
  case_id: string;
  case_title: string;
  client_name: string;
  total_fees: number;
  total_paid: number;
  outstanding_balance: number;
  total_expenses_firm: number;
  net_revenue: number;
  entity_type: 'case' | 'police-report';
}

export interface BillingReport {
  cases: BillingCaseSummary[];
  total_fees: number;
  total_paid: number;
  outstanding_balance: number;
  total_expenses_firm: number;
  net_revenue: number;
}

export interface PlanFeature {
  key_name: string;
  type: 'boolean' | 'quota';
  limit_value: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  billing_cycle: 'monthly' | 'annual';
  price: string;
  currency: string;
  interval_days: number;
  features: PlanFeature[];
}

export interface DashboardData {
  owner_stats: {
    active_cases: number;
    new_clients_month: number;
    revenue_month: number;
    pending_revenue: number;
    revenue_prev_month: number;
    new_clients_prev_month: number;
  };
  upcoming_sessions: CourtSession[];
  critical_deadlines: LegalDeadline[];
  task_summary: {
    pending: number;
    in_progress: number;
    overdue: number;
  };
  recent_tasks: Task[];
  active_cases?: Partial<Case>[];
}

export * from './ocr';
export * from './contract';
export * from './admin';
