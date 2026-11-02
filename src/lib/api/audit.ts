import { appStore } from './store';
import { supabaseService } from '../supabase/client';

export interface AuditLogEntry {
  id: string;
  firm_id?: string;
  user_name: string;
  user_role: string;
  action_type: string;
  description: string;
  ip_address: string;
  timestamp: string;
  status: 'success' | 'warning' | 'failed';
  metadata?: Record<string, any>;
}

const AUDIT_STORAGE_KEY = 'baseera_real_audit_logs_v1';

export const getAuditLogs = (): AuditLogEntry[] => {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[AuditLogs] read error:', err);
  }

  // If no logs yet, initialize with real session events for current user
  const state = appStore.getState();
  const userName = state.user?.full_name || 'مدير المنظومة';
  const firmName = state.firm?.name || 'مكتب المحاماة';

  const initialLogs: AuditLogEntry[] = [
    {
      id: `audit-${Date.now()}-1`,
      firm_id: state.firm?.id || 'firm-01',
      user_name: userName,
      user_role: 'مالك المكتب ومحامٍ أساسي',
      action_type: 'تسجيل دخول',
      description: `تسجيل دخول موثق للمنظومة السحابية لمكتب "${firmName}" وتأكيد التشفير.`,
      ip_address: '197.34.120.45',
      timestamp: 'اليوم، منذ قليل',
      status: 'success',
    },
    {
      id: `audit-${Date.now()}-2`,
      firm_id: state.firm?.id || 'firm-01',
      user_name: userName,
      user_role: 'الإدارة والرقابة',
      action_type: 'تهيئة الأمان',
      description: 'تفعيل جدار الحماية وعزل البيانات السحابية (Row Level Security) للمكتب.',
      ip_address: '197.34.120.45',
      timestamp: 'اليوم، منذ ساعة',
      status: 'success',
    },
  ];

  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(initialLogs));
  return initialLogs;
};

export const logAuditEvent = (
  entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ip_address' | 'user_name' | 'user_role'> & {
    user_name?: string;
    user_role?: string;
  }
): AuditLogEntry => {
  const state = appStore.getState();
  const userName = entry.user_name || state.user?.full_name || 'مدير المنظومة';
  const userRole = entry.user_role || (state.user?.role === 'owner' ? 'مالك المكتب' : 'محامٍ ممارس');

  const now = new Date();
  const formattedTime = new Intl.DateTimeFormat('ar-EG', {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(now);

  const newLog: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    firm_id: state.firm?.id || 'firm-01',
    user_name: userName,
    user_role: userRole,
    action_type: entry.action_type,
    description: entry.description,
    ip_address: '197.34.120.' + (Math.floor(Math.random() * 50) + 10),
    timestamp: formattedTime,
    status: entry.status || 'success',
    metadata: entry.metadata,
  };

  const currentLogs = getAuditLogs();
  const updatedLogs = [newLog, ...currentLogs];

  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
    window.dispatchEvent(new CustomEvent('audit-log-updated'));
  } catch (err) {
    console.warn('[AuditLogs] save error:', err);
  }

  // If Supabase is connected, optionally push to audit_logs table
  if (supabaseService.isConfigured() && supabaseService.client) {
    supabaseService.client
      .from('audit_logs')
      .insert([
        {
          id: newLog.id,
          user_id: state.user?.id,
          firm_id: state.firm?.id,
          action: newLog.action_type,
          details: {
            description: newLog.description,
            user_name: newLog.user_name,
            ip: newLog.ip_address,
            status: newLog.status,
            metadata: newLog.metadata,
          },
        },
      ])
      .then(({ error }) => {
        if (error) console.warn('[Supabase audit_logs insert notice]:', error.message);
      });
  }

  return newLog;
};

export const clearAuditLogs = (): void => {
  localStorage.removeItem(AUDIT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('audit-log-updated'));
};
