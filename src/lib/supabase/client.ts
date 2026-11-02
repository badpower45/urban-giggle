import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { appStore } from '../api/store';
import { Case, Client, CourtSession, LegalDeadline, Task, PoliceReport, PowerOfAttorney } from '../../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Cloud / Local Unified Data Service
 * Provides full bi-directional CRUD, cloud hydration, multi-tenant isolation, and real Supabase Auth
 */
export const supabaseService = {
  isConfigured: isSupabaseConfigured,
  client: supabase,
  getUrl: () => supabaseUrl,

  // ============================================================================
  // Connection Tester & Diagnostics
  // ============================================================================
  async testConnection(): Promise<{ ok: boolean; latencyMs: number; error?: string; tables?: { cases: number; clients: number; sessions: number; deadlines: number } }> {
    if (!supabase) {
      return { ok: false, latencyMs: 0, error: 'بيانات اعتماد Supabase غير متوفرة في المتغيرات البيئية (.env)' };
    }
    const start = performance.now();
    try {
      const [casesRes, clientsRes, sessionsRes, deadlinesRes] = await Promise.all([
        supabase.from('cases').select('id', { count: 'exact', head: true }),
        supabase.from('clients').select('id', { count: 'exact', head: true }),
        supabase.from('case_sessions').select('id', { count: 'exact', head: true }),
        supabase.from('legal_deadlines').select('id', { count: 'exact', head: true }),
      ]);

      const latencyMs = Math.round(performance.now() - start);

      if (casesRes.error && !casesRes.error.message.includes('permission')) {
        return { ok: false, latencyMs, error: casesRes.error.message };
      }

      return {
        ok: true,
        latencyMs,
        tables: {
          cases: casesRes.count || 0,
          clients: clientsRes.count || 0,
          sessions: sessionsRes.count || 0,
          deadlines: deadlinesRes.count || 0,
        },
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return { ok: false, latencyMs, error: err.message || 'فشل الاتصال بقاعدة البيانات' };
    }
  },

  // ============================================================================
  // Auth & Multi-Tenancy Profile Helpers
  // ============================================================================
  async getCurrentUser() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getCurrentUserProfile() {
    if (!supabase) return null;
    try {
      const { data: { user }, error: uErr } = await supabase.auth.getUser();
      if (uErr || !user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*, firms(*)')
        .eq('id', user.id)
        .maybeSingle();

      return {
        user,
        profile,
        firm: profile?.firms || null,
      };
    } catch (err) {
      console.warn('[Supabase] getCurrentUserProfile error:', err);
      return null;
    }
  },

  async getCurrentUserFirmId(): Promise<string | null> {
    const localFirm = appStore.getFirm();
    if (localFirm?.id && localFirm.id !== 'firm-default' && !localFirm.id.startsWith('firm-default')) {
      return localFirm.id;
    }
    const up = await this.getCurrentUserProfile();
    return up?.firm?.id || up?.profile?.firm_id || null;
  },

  async syncSessionToStore(): Promise<boolean> {
    if (!supabase) return false;
    try {
      const up = await this.getCurrentUserProfile();
      if (!up || !up.user) return false;

      const { user, profile, firm } = up;

      if (profile) {
        appStore.setUser({
          id: user.id,
          full_name: profile.full_name || user.email?.split('@')[0] || 'المحامي',
          email: user.email || profile.email || '',
          avatar_url: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          member_since: profile.created_at ? profile.created_at.split('T')[0] : '2026-01-01',
          auth_provider: 'email',
          two_fa_enabled: profile.two_fa_enabled || false,
        });
      }

      if (firm) {
        appStore.setFirm({
          id: firm.id,
          name: firm.name,
          logo_url: firm.logo_url || '/logo.svg',
          created_at: firm.created_at || new Date().toISOString(),
        });
      }

      // Fetch tenant data from Supabase for this firm
      await this.syncAllFromCloud(firm?.id || profile?.firm_id);
      return true;
    } catch (err) {
      console.warn('[Supabase] syncSessionToStore error:', err);
      return false;
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) return { unsubscribe: () => {} };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  },

  async signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase is not configured yet');
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string, metadata?: { full_name?: string; firm_name?: string }) {
    if (!supabase) throw new Error('Supabase is not configured yet');
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  },

  async signOut() {
    if (!supabase) return;
    return supabase.auth.signOut();
  },

  // ============================================================================
  // CASES (Full CRUD with Multi-Tenancy)
  // ============================================================================
  async fetchCases(targetFirmId?: string): Promise<Case[] | null> {
    if (!supabase) return null;
    try {
      const firmId = targetFirmId || (await this.getCurrentUserFirmId());
      let query = supabase.from('cases').select('*').order('created_at', { ascending: false });
      if (firmId) {
        query = query.eq('firm_id', firmId);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[Supabase] Failed to fetch cases:', error.message);
        return null;
      }
      return (data || []) as Case[];
    } catch (err) {
      console.warn('[Supabase] fetchCases exception:', err);
      return null;
    }
  },

  async insertCase(newCase: any): Promise<Case | null> {
    if (!supabase) return null;
    try {
      const firmId = newCase.firm_id || (await this.getCurrentUserFirmId());
      const payload = {
        ...newCase,
        ...(firmId ? { firm_id: firmId } : {}),
      };
      const { data, error } = await supabase
        .from('cases')
        .insert([payload])
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to insert case:', error.message);
        return null;
      }
      return data as Case;
    } catch (err) {
      console.warn('[Supabase] insertCase exception:', err);
      return null;
    }
  },

  async updateCase(id: string, updates: Partial<Case>): Promise<Case | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('cases')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to update case:', error.message);
        return null;
      }
      return data as Case;
    } catch (err) {
      console.warn('[Supabase] updateCase exception:', err);
      return null;
    }
  },

  async deleteCase(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('cases').delete().eq('id', id);
      if (error) {
        console.warn('[Supabase] Failed to delete case:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] deleteCase exception:', err);
      return false;
    }
  },

  // ============================================================================
  // CLIENTS (Full CRUD with Multi-Tenancy)
  // ============================================================================
  async fetchClients(targetFirmId?: string): Promise<Client[] | null> {
    if (!supabase) return null;
    try {
      const firmId = targetFirmId || (await this.getCurrentUserFirmId());
      let query = supabase.from('clients').select('*').order('created_at', { ascending: false });
      if (firmId) {
        query = query.eq('firm_id', firmId);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[Supabase] Failed to fetch clients:', error.message);
        return null;
      }
      return (data || []) as Client[];
    } catch (err) {
      console.warn('[Supabase] fetchClients exception:', err);
      return null;
    }
  },

  async insertClient(newClient: any): Promise<Client | null> {
    if (!supabase) return null;
    try {
      const firmId = newClient.firm_id || (await this.getCurrentUserFirmId());
      const payload = {
        ...newClient,
        ...(firmId ? { firm_id: firmId } : {}),
      };
      const { data, error } = await supabase
        .from('clients')
        .insert([payload])
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to insert client:', error.message);
        return null;
      }
      return data as Client;
    } catch (err) {
      console.warn('[Supabase] insertClient exception:', err);
      return null;
    }
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to update client:', error.message);
        return null;
      }
      return data as Client;
    } catch (err) {
      console.warn('[Supabase] updateClient exception:', err);
      return null;
    }
  },

  async deleteClient(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) {
        console.warn('[Supabase] Failed to delete client:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] deleteClient exception:', err);
      return false;
    }
  },

  // ============================================================================
  // SESSIONS (Full CRUD with Multi-Tenancy)
  // ============================================================================
  async fetchSessions(targetFirmId?: string): Promise<CourtSession[] | null> {
    if (!supabase) return null;
    try {
      const firmId = targetFirmId || (await this.getCurrentUserFirmId());
      let query = supabase.from('case_sessions').select('*').order('session_date', { ascending: true });
      if (firmId) {
        query = query.eq('firm_id', firmId);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[Supabase] Failed to fetch sessions:', error.message);
        return null;
      }
      return (data || []) as CourtSession[];
    } catch (err) {
      console.warn('[Supabase] fetchSessions exception:', err);
      return null;
    }
  },

  async insertSession(newSession: any): Promise<CourtSession | null> {
    if (!supabase) return null;
    try {
      const firmId = newSession.firm_id || (await this.getCurrentUserFirmId());
      const payload = {
        ...newSession,
        ...(firmId ? { firm_id: firmId } : {}),
      };
      const { data, error } = await supabase
        .from('case_sessions')
        .insert([payload])
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to insert session:', error.message);
        return null;
      }
      return data as CourtSession;
    } catch (err) {
      console.warn('[Supabase] insertSession exception:', err);
      return null;
    }
  },

  async updateSession(id: string, updates: Partial<CourtSession>): Promise<CourtSession | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('case_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to update session:', error.message);
        return null;
      }
      return data as CourtSession;
    } catch (err) {
      console.warn('[Supabase] updateSession exception:', err);
      return null;
    }
  },

  async deleteSession(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('case_sessions').delete().eq('id', id);
      if (error) {
        console.warn('[Supabase] Failed to delete session:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] deleteSession exception:', err);
      return false;
    }
  },

  // ============================================================================
  // DEADLINES (Full CRUD with Multi-Tenancy)
  // ============================================================================
  async fetchDeadlines(targetFirmId?: string): Promise<LegalDeadline[] | null> {
    if (!supabase) return null;
    try {
      const firmId = targetFirmId || (await this.getCurrentUserFirmId());
      let query = supabase.from('legal_deadlines').select('*').order('deadline_date', { ascending: true });
      if (firmId) {
        query = query.eq('firm_id', firmId);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[Supabase] Failed to fetch deadlines:', error.message);
        return null;
      }
      return (data || []) as LegalDeadline[];
    } catch (err) {
      console.warn('[Supabase] fetchDeadlines exception:', err);
      return null;
    }
  },

  async insertDeadline(newDeadline: any): Promise<LegalDeadline | null> {
    if (!supabase) return null;
    try {
      const firmId = newDeadline.firm_id || (await this.getCurrentUserFirmId());
      const payload = {
        ...newDeadline,
        ...(firmId ? { firm_id: firmId } : {}),
      };
      const { data, error } = await supabase
        .from('legal_deadlines')
        .insert([payload])
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to insert deadline:', error.message);
        return null;
      }
      return data as LegalDeadline;
    } catch (err) {
      console.warn('[Supabase] insertDeadline exception:', err);
      return null;
    }
  },

  async updateDeadline(id: string, updates: Partial<LegalDeadline>): Promise<LegalDeadline | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('legal_deadlines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to update deadline:', error.message);
        return null;
      }
      return data as LegalDeadline;
    } catch (err) {
      console.warn('[Supabase] updateDeadline exception:', err);
      return null;
    }
  },

  async deleteDeadline(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('legal_deadlines').delete().eq('id', id);
      if (error) {
        console.warn('[Supabase] Failed to delete deadline:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] deleteDeadline exception:', err);
      return false;
    }
  },

  // ============================================================================
  // TASKS (Full CRUD with Multi-Tenancy)
  // ============================================================================
  async fetchTasks(targetFirmId?: string): Promise<Task[] | null> {
    if (!supabase) return null;
    try {
      const firmId = targetFirmId || (await this.getCurrentUserFirmId());
      let query = supabase.from('tasks').select('*').order('due_date', { ascending: true });
      if (firmId) {
        query = query.eq('firm_id', firmId);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[Supabase] Failed to fetch tasks:', error.message);
        return null;
      }
      return (data || []) as Task[];
    } catch (err) {
      console.warn('[Supabase] fetchTasks exception:', err);
      return null;
    }
  },

  async insertTask(newTask: any): Promise<Task | null> {
    if (!supabase) return null;
    try {
      const firmId = newTask.firm_id || (await this.getCurrentUserFirmId());
      const payload = {
        ...newTask,
        ...(firmId ? { firm_id: firmId } : {}),
      };
      const { data, error } = await supabase
        .from('tasks')
        .insert([payload])
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to insert task:', error.message);
        return null;
      }
      return data as Task;
    } catch (err) {
      console.warn('[Supabase] insertTask exception:', err);
      return null;
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to update task:', error.message);
        return null;
      }
      return data as Task;
    } catch (err) {
      console.warn('[Supabase] updateTask exception:', err);
      return null;
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) {
        console.warn('[Supabase] Failed to delete task:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] deleteTask exception:', err);
      return false;
    }
  },

  // ============================================================================
  // POLICE REPORTS (Full CRUD with Multi-Tenancy)
  // ============================================================================
  async fetchPoliceReports(targetFirmId?: string): Promise<PoliceReport[] | null> {
    if (!supabase) return null;
    try {
      const firmId = targetFirmId || (await this.getCurrentUserFirmId());
      let query = supabase.from('police_reports').select('*').order('created_at', { ascending: false });
      if (firmId) {
        query = query.eq('firm_id', firmId);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[Supabase] Failed to fetch police reports:', error.message);
        return null;
      }
      return (data || []) as PoliceReport[];
    } catch (err) {
      console.warn('[Supabase] fetchPoliceReports exception:', err);
      return null;
    }
  },

  async insertPoliceReport(newReport: any): Promise<PoliceReport | null> {
    if (!supabase) return null;
    try {
      const firmId = newReport.firm_id || (await this.getCurrentUserFirmId());
      const payload = {
        ...newReport,
        ...(firmId ? { firm_id: firmId } : {}),
      };
      const { data, error } = await supabase
        .from('police_reports')
        .insert([payload])
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to insert police report:', error.message);
        return null;
      }
      return data as PoliceReport;
    } catch (err) {
      console.warn('[Supabase] insertPoliceReport exception:', err);
      return null;
    }
  },

  async updatePoliceReport(id: string, updates: Partial<PoliceReport>): Promise<PoliceReport | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('police_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to update police report:', error.message);
        return null;
      }
      return data as PoliceReport;
    } catch (err) {
      console.warn('[Supabase] updatePoliceReport exception:', err);
      return null;
    }
  },

  async deletePoliceReport(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('police_reports').delete().eq('id', id);
      if (error) {
        console.warn('[Supabase] Failed to delete police report:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] deletePoliceReport exception:', err);
      return false;
    }
  },

  // ============================================================================
  // POWER OF ATTORNEY (POAs)
  // ============================================================================
  async fetchPoas(clientId?: string, targetFirmId?: string): Promise<PowerOfAttorney[] | null> {
    if (!supabase) return null;
    try {
      const firmId = targetFirmId || (await this.getCurrentUserFirmId());
      let query = supabase.from('power_of_attorney').select('*').order('poa_date', { ascending: false });
      if (firmId) {
        query = query.eq('firm_id', firmId);
      }
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[Supabase] Failed to fetch POAs:', error.message);
        return null;
      }
      return (data || []) as PowerOfAttorney[];
    } catch (err) {
      console.warn('[Supabase] fetchPoas exception:', err);
      return null;
    }
  },

  async insertPoa(newPoa: any): Promise<PowerOfAttorney | null> {
    if (!supabase) return null;
    try {
      const firmId = newPoa.firm_id || (await this.getCurrentUserFirmId());
      const payload = {
        ...newPoa,
        ...(firmId ? { firm_id: firmId } : {}),
      };
      const { data, error } = await supabase
        .from('power_of_attorney')
        .insert([payload])
        .select()
        .single();
      if (error) {
        console.warn('[Supabase] Failed to insert POA:', error.message);
        return null;
      }
      return data as PowerOfAttorney;
    } catch (err) {
      console.warn('[Supabase] insertPoa exception:', err);
      return null;
    }
  },

  async deletePoa(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('power_of_attorney').delete().eq('id', id);
      if (error) {
        console.warn('[Supabase] Failed to delete POA:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] deletePoa exception:', err);
      return false;
    }
  },

  // ============================================================================
  // Full Cloud Hydration (Sync Supabase -> Local Store for tenant firm)
  // ============================================================================
  async syncAllFromCloud(targetFirmId?: string): Promise<{ success: boolean; syncedCount: number; error?: string }> {
    if (!supabase) {
      return { success: false, syncedCount: 0, error: 'Supabase is not configured' };
    }

    try {
      const [cases, clients, sessions, deadlines, tasks, reports, poas] = await Promise.all([
        this.fetchCases(targetFirmId),
        this.fetchClients(targetFirmId),
        this.fetchSessions(targetFirmId),
        this.fetchDeadlines(targetFirmId),
        this.fetchTasks(targetFirmId),
        this.fetchPoliceReports(targetFirmId),
        this.fetchPoas(undefined, targetFirmId),
      ]);

      let totalSynced = 0;

      if (cases !== null) {
        appStore.setCases(cases);
        totalSynced += cases.length;
      }
      if (clients !== null) {
        appStore.setClients(clients);
        totalSynced += clients.length;
      }
      if (sessions !== null) {
        appStore.setSessions(sessions);
        totalSynced += sessions.length;
      }
      if (deadlines !== null) {
        appStore.setDeadlines(deadlines);
        totalSynced += deadlines.length;
      }
      if (tasks !== null) {
        appStore.setTasks(tasks);
        totalSynced += tasks.length;
      }
      if (reports !== null) {
        appStore.setPoliceReports(reports);
        totalSynced += reports.length;
      }
      if (poas !== null) {
        appStore.setPoas(poas);
        totalSynced += poas.length;
      }

      return { success: true, syncedCount: totalSynced };
    } catch (err: any) {
      console.warn('[Supabase] syncAllFromCloud error:', err);
      return { success: false, syncedCount: 0, error: err.message };
    }
  },

  // ============================================================================
  // SUPPORT / COMPLAINTS
  // ============================================================================
  async submitTicket(ticket: { user_name: string; user_email: string; subject: string; category: string; message: string }) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([ticket])
      .select()
      .single();
    if (error) {
      console.warn('[Supabase] Failed to submit ticket:', error.message);
      return null;
    }
    return data;
  },
};
