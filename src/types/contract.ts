/**
 * Contract Builder & Legal Templates System - TypeScript Definitions
 * System: Siyaq Legal OS
 */

export type VariableDataType = 'text' | 'date' | 'number' | 'currency' | 'textarea';

export type ContractStatus = 'draft' | 'under_review' | 'finalized' | 'signed' | 'archived';

export type ContractBorderStyle = 'royal_double' | 'court_formal' | 'classic_single' | 'none';

export type ContractLogoPreset =
  | 'scales_gold'
  | 'shield_navy'
  | 'notary_seal'
  | 'court_pillars'
  | 'siyaq_default'
  | 'custom';

export interface ContractDesignSettings {
  firmName: string;
  lawyerName: string;
  lawyerTitle: string;
  barNumber?: string;
  phone?: string;
  address?: string;
  logoType: ContractLogoPreset;
  customLogoUrl?: string;
  borderStyle: ContractBorderStyle;
  showBasmala: boolean;
  showWatermark: boolean;
  watermarkText?: string;
  showSignatures: boolean;
  showWitnesses: boolean;
}

export type TemplateCategory =
  | 'real_estate'      // عقارات وإيجارات
  | 'sales'            // عقود بيوع ونقل ملكية
  | 'commercial'       // شركات ومعاملات تجارية
  | 'employment'       // عمل وموارد بشرية
  | 'services'         // خدمات ومقاولات
  | 'settlements'      // إقرارات ومصالحات ومخالصات
  | 'nda'              // سرية وعدم إفشاء
  | 'litigation'       // مرافعات وتوكيلات قضائية
  | 'civil'            // مدني وقسمة تركات
  | 'custom';          // نماذج مخصصة

/**
 * Metadata definition for a variable/placeholder in a legal contract
 */
export interface TemplateVariable {
  /** The unique key used in placeholders, e.g. "client_name" in {{client_name}} */
  key: string;
  /** Human-readable Arabic label, e.g. "اسم الموكل / الطرف الأول" */
  label: string;
  /** English label for dual-language templates */
  labelEn?: string;
  /** Category to group variables in the UI */
  category: 'parties' | 'financial' | 'dates' | 'litigation' | 'property' | 'custom';
  /** Data type for form input rendering */
  type: VariableDataType;
  /** Sample default or fallback value */
  defaultValue?: string;
  /** Optional placeholder description for lawyers */
  description?: string;
  /** Whether filling this variable is mandatory before final generation */
  required?: boolean;
}

/**
 * A group of related predefined variables for organization in the sidebar & dropdowns
 */
export interface PredefinedVariableGroup {
  id: string;
  label: string;
  labelEn?: string;
  iconName?: string;
  variables: TemplateVariable[];
}

/**
 * Represents a stored Document Template (e.g. "Lease Agreement", "NDA")
 */
export interface ContractTemplate {
  /** Unique ID of the template */
  id: string;
  /** Organization / firm ID */
  firm_id?: string;
  /** Template Title, e.g. "عقد إيجار وحدة سكنية" */
  name: string;
  /** English title if applicable */
  name_en?: string;
  /** Brief description or legal notes */
  description?: string;
  /** Template legal category */
  category: TemplateCategory;
  /** Raw HTML content containing dynamic variable nodes or {{placeholders}} */
  html_content: string;
  /** Optional TipTap Prosemirror JSON structure for high-fidelity restoring */
  json_content?: Record<string, any>;
  /** Array of required variable keys extracted from or assigned to the template */
  variables: string[];
  /** Optional extended variable definitions mapped by key */
  variable_definitions?: Record<string, TemplateVariable>;
  /** User who created the template */
  created_by?: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  /** Template version */
  version?: number;
  /** Whether the template is currently active or archived */
  is_active?: boolean;
}

/**
 * Represents a concrete instance of a contract generated for a specific client/case
 */
export interface ContractInstance {
  /** Unique ID of the contract instance */
  id: string;
  /** Organization / firm ID */
  firm_id?: string;
  /** Reference to the original template used */
  template_id: string;
  /** Name of the template at generation time */
  template_name: string;
  /** Client ID in Siyaq for whom the contract is prepared */
  client_id?: string;
  /** Associated client full name */
  client_name?: string;
  /** Associated case ID if contract relates to an active case */
  case_id?: string;
  case_title?: string;
  /** Final interpolated HTML with all variables replaced with typed values */
  final_html: string;
  /** Key-value dictionary containing the actual filled data, e.g. { client_name: "أحمد محمود", contract_value: "50000" } */
  filled_data: Record<string, any>;
  /** Current status of the generated contract */
  status: ContractStatus;
  /** Notes or remarks by the drafting lawyer */
  notes?: string;
  /** Date and time of generation */
  created_at: string;
  updated_at: string;
  created_by?: string;
  created_by_name?: string;
}

/**
 * Variable scanning result summary
 */
export interface ScannedVariableSummary {
  key: string;
  label: string;
  occurrences: number;
  type: VariableDataType;
  category: string;
  isFilled: boolean;
  currentValue?: any;
}
