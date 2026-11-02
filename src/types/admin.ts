/**
 * Super Admin & Platform Management - TypeScript Definitions
 * System: Central Administration Platform for Multi-Tenant Law Firm SaaS
 */

export type LeadStatus = 'new' | 'contacted' | 'demo_scheduled' | 'converted' | 'archived';

export type TicketCategory = 'technical' | 'billing' | 'inquiry' | 'feature_request';

export type TicketPriority = 'urgent' | 'high' | 'medium' | 'low';

export type TicketStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

export type FirmSubscriptionStatus = 'active' | 'trial' | 'past_due' | 'suspended' | 'cancelled';

export type FirmBillingCycle = 'monthly' | 'yearly';

export interface PlatformSettings {
  systemName: string;
  systemSubtitle: string;
  tagline: string;
  slogan?: string;
  currency: string;
  contactEmail: string;
  contactPhone: string;
  supportEmail?: string;
  supportPhone?: string;
  whatsappNumber: string;
  trialDays: number;
  maintenanceMode: boolean;
}

export interface AdminSubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  isPopular?: boolean;
  maxUsers: number;
  maxStorageGb: number;
  storageGb?: number;
  features: string[];
  isActive: boolean;
  badgeText?: string;
  badge?: string;
}

export interface TenantFirm {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  city: string;
  address?: string;
  subscriptionPlan: 'individual' | 'office' | 'enterprise';
  subscriptionStatus: FirmSubscriptionStatus;
  billingCycle: FirmBillingCycle;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  createdAt: string;
  casesCount: number;
  clientsCount: number;
  usersCount: number;
  storageUsedMb: number;
  maxUsers: number;
  maxStorageGb: number;
  isVerified: boolean;
  notes?: string;
  initialPassword?: string;
}

export interface PlatformInvoice {
  id: string;
  invoiceNumber: string;
  firmId: string;
  firmName: string;
  planName: string;
  amount: number;
  currency: string;
  billingCycle: FirmBillingCycle;
  paymentMethod: 'credit_card' | 'instapay' | 'bank_transfer' | 'fawry' | 'vodafone_cash';
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paidAt?: string;
  createdAt: string;
  receiptUrl?: string;
}

export interface SuperAdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'platform_support' | 'finance_manager';
  avatarUrl?: string;
  lastLoginAt?: string;
}

export interface ContactRequest {
  id: string;
  full_name: string;
  firm_name: string;
  phone: string;
  email: string;
  city: string;
  team_size: string;
  message: string;
  status: LeadStatus;
  created_at: string;
  internal_notes?: string;
}

export interface SupportComplaint {
  id: string;
  ticket_number: string;
  firm_name: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  message: string;
  status: TicketStatus;
  created_at: string;
  resolution_notes?: string;
  assigned_to?: string;
}

export interface PlatformOverviewStats {
  totalLeads: number;
  newLeadsCount: number;
  openTicketsCount: number;
  urgentTicketsCount: number;
  totalSubscribedFirms: number;
  activeFirmsCount: number;
  trialFirmsCount: number;
  totalUsersCount: number;
  totalCasesCount: number;
  monthlyRevenueEstimate: number;
  annualRunRate: number;
}
