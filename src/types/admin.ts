/**
 * Super Admin & Platform Management - TypeScript Definitions
 * System: Central Administration Platform
 */

export type LeadStatus = 'new' | 'contacted' | 'demo_scheduled' | 'converted' | 'archived';

export type TicketCategory = 'technical' | 'billing' | 'inquiry' | 'feature_request';

export type TicketPriority = 'urgent' | 'high' | 'medium' | 'low';

export type TicketStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

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
  storageGb: number;
  features: string[];
  isActive: boolean;
  badgeText?: string;
  badge?: string;
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
  monthlyRevenueEstimate: number;
}
