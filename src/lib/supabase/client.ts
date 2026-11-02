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
 * Provides full bi-directional CRUD, cloud hydration, connection testing, and offline fallback
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
  // Auth Helpers
  // ============================================================================
  async getCurrentUser() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
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
  // CASES (Full CRUD)
  // ============================================================================
  async fetchCases(): Promise<Case[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('[Supabase] Failed to fetch cases:', error.message);
        return null;
      }
      return data as Case[];
    } catch (err) {
      console.warn('[Supabase] fetchCases exception:', err);
      return null;
    }
  },

  async insertCase(newCase: any): Promise<Case | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('cases')
        .insert([newCase])
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
  // CLIENTS (Full CRUD)
  // ============================================================================
  async fetchClients(): Promise<Client[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('[Supabase] Failed to fetch clients:', error.message);
        return null;
      }
      return data as Client[];
    } catch (err) {
      console.warn('[Supabase] fetchClients exception:', err);
      return null;
    }
  },

  async insertClient(newClient: any): Promise<Client | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
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
  // SESSIONS (Full CRUD)
  // ============================================================================
  async fetchSessions(): Promise<CourtSession[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('case_sessions')
        .select('*')
        .order('session_date', { ascending: true });
      if (error) {
        console.warn('[Supabase] Failed to fetch sessions:', error.message);
        return null;
      }
      return data as CourtSession[];
    } catch (err) {
      console.warn('[Supabase] fetchSessions exception:', err);
      return null;
    }
  },

  async insertSession(newSession: any): Promise<CourtSession | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('case_sessions')
        .insert([newSession])
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
  // DEADLINES (Full CRUD)
  // ============================================================================
  async fetchDeadlines(): Promise<LegalDeadline[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('legal_deadlines')
        .select('*')
        .order('deadline_date', { ascending: true });
      if (error) {
        console.warn('[Supabase] Failed to fetch deadlines:', error.message);
        return null;
      }
      return data as LegalDeadline[];
    } catch (err) {
      console.warn('[Supabase] fetchDeadlines exception:', err);
      return null;
    }
  },

  async insertDeadline(newDeadline: any): Promise<LegalDeadline | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('legal_deadlines')
        .insert([newDeadline])
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
  // TASKS (Full CRUD)
  // ============================================================================
  async fetchTasks(): Promise<Task[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });
      if (error) {
        console.warn('[Supabase] Failed to fetch tasks:', error.message);
        return null;
      }
      return data as Task[];
    } catch (err) {
      console.warn('[Supabase] fetchTasks exception:', err);
      return null;
    }
  },

  async insertTask(newTask: any): Promise<Task | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
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
  // POLICE REPORTS (Full CRUD)
  // ============================================================================
  async fetchPoliceReports(): Promise<PoliceReport[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('police_reports')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('[Supabase] Failed to fetch police reports:', error.message);
        return null;
      }
      return data as PoliceReport[];
    } catch (err) {
      console.warn('[Supabase] fetchPoliceReports exception:', err);
      return null;
    }
  },

  async insertPoliceReport(newReport: any): Promise<PoliceReport | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('police_reports')
        .insert([newReport])
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
  async fetchPoas(clientId?: string): Promise<PowerOfAttorney[] | null> {
    if (!supabase) return null;
    try {
      let query = supabase.from('power_of_attorney').select('*').order('poa_date', { ascending: false });
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[Supabase] Failed to fetch POAs:', error.message);
        return null;
      }
      return data as PowerOfAttorney[];
    } catch (err) {
      console.warn('[Supabase] fetchPoas exception:', err);
      return null;
    }
  },

  async insertPoa(newPoa: any): Promise<PowerOfAttorney | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('power_of_attorney')
        .insert([newPoa])
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
  // Full Cloud Hydration (Sync Supabase -> Local Store)
  // ============================================================================
  async syncAllFromCloud(): Promise<{ success: boolean; syncedCount: number; error?: string }> {
    if (!supabase) {
      return { success: false, syncedCount: 0, error: 'Supabase is not configured' };
    }

    try {
      const [cases, clients, sessions, deadlines, tasks, reports, poas] = await Promise.all([
        this.fetchCases(),
        this.fetchClients(),
        this.fetchSessions(),
        this.fetchDeadlines(),
        this.fetchTasks(),
        this.fetchPoliceReports(),
        this.fetchPoas(),
      ]);

      let totalSynced = 0;

      if (cases && cases.length > 0) {
        appStore.setCases(cases);
        totalSynced += cases.length;
      }
      if (clients && clients.length > 0) {
        appStore.setClients(clients);
        totalSynced += clients.length;
      }
      if (sessions && sessions.length > 0) {
        appStore.setSessions(sessions);
        totalSynced += sessions.length;
      }
      if (deadlines && deadlines.length > 0) {
        appStore.setDeadlines(deadlines);
        totalSynced += deadlines.length;
      }
      if (tasks && tasks.length > 0) {
        appStore.setTasks(tasks);
        totalSynced += tasks.length;
      }
      if (reports && reports.length > 0) {
        appStore.setPoliceReports(reports);
        totalSynced += reports.length;
      }
      if (poas && poas.length > 0) {
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
  // Seed Demo Data into Cloud (When database is empty)
  // ============================================================================
  async seedCloudData(): Promise<{ success: boolean; count: number; error?: string }> {
    if (!supabase) {
      return { success: false, count: 0, error: 'Supabase is not configured' };
    }

    try {
      const firmId = '01a08460-df3a-70c0-9a46-f3497eced7c7';

      // 1. Insert Firm
      await supabase.from('firms').upsert({
        id: firmId,
        name: 'مكتب محمد السيد للمحاماة والاستشارات القانونية',
        logo_url: '/logo.webp',
        phone: '01012345678',
        email: 'elezabybode375@gmail.com',
        address: '14 شارع مصطفى النحاس، مدينة نصر، القاهرة',
        subscription_status: 'active',
        subscription_plan: 'enterprise',
      });

      // 2. Insert Sample Clients
      const sampleClients = [
        {
          id: 'client-101',
          firm_id: firmId,
          full_name: 'أحمد مصطفى كامل',
          client_type: 'individual',
          national_id: '29008150102432',
          occupation: 'مهندس مدني حر',
          phone: '01098765432',
          email: 'ahmed.mostafa@gmail.com',
          address: 'حي السفارات، مدينة نصر، القاهرة',
          notes: 'موكل دائم للمكتب منذ 2024',
        },
        {
          id: 'client-102',
          firm_id: firmId,
          full_name: 'شركة النيل للتجارة والمقاولات (ش.م.م)',
          client_type: 'company',
          company_reg: 'س.ت 104928 استثمار القاهرة',
          occupation: 'مقاولات عامة وتوريدات',
          phone: '0226789123',
          email: 'legal@niletrade.com',
          address: 'المحور المركزي، التجمع الخامس، القاهرة الجديدة',
          notes: 'عقد استشارات سنوي سارٍ',
        },
        {
          id: 'client-103',
          firm_id: firmId,
          full_name: 'فاطمة عبد الرحمن الصاوي',
          client_type: 'individual',
          national_id: '29403210108921',
          occupation: 'سيدة أعمال',
          phone: '01223344556',
          email: 'fatma.sawi@outlook.com',
          address: 'شارع مصدق، الدقي، الجيزة',
          notes: 'دعوى بطلان عقد بيع وميراث',
        },
      ];
      await supabase.from('clients').upsert(sampleClients);

      // 3. Insert Sample Cases
      const sampleCases = [
        {
          id: 'case-201',
          firm_id: firmId,
          client_id: 'client-101',
          client_name: 'أحمد مصطفى كامل',
          court_name: 'محكمة شمال القاهرة الابتدائية',
          court_governorate: 'القاهرة',
          case_type_name: 'مدني كلي',
          title: 'دعوى إلزام بتعويض عن إخلال بالتزامات تعاقدية',
          case_number: '1842',
          case_year: 2026,
          circuit: 'الدائرة 7 مدني كلي',
          opponent_name: 'محمود الشناوي عبد ربه',
          opponent_lawyer: 'أ. حسام فوزي',
          client_role: 'plaintiff',
          filing_date: '2026-01-15',
          status: 'active',
          total_fees: 25000,
          total_paid: 15000,
        },
        {
          id: 'case-202',
          firm_id: firmId,
          client_id: 'client-102',
          client_name: 'شركة النيل للتجارة والمقاولات (ش.م.م)',
          court_name: 'محكمة استئناف القاهرة (الدائرة التجارية)',
          court_governorate: 'القاهرة',
          case_type_name: 'تجاري استئناف',
          title: 'استئناف حكم تظلم أمر أداء شيك بنكي',
          case_number: '394',
          case_year: 2026,
          circuit: 'الدائرة 14 تجاري استئناف',
          opponent_name: 'البنك الأهلي المصري (فرع النيل)',
          opponent_lawyer: 'الشؤون القانونية للبنك الأهلي',
          client_role: 'appellant',
          filing_date: '2026-02-01',
          status: 'active',
          total_fees: 40000,
          total_paid: 30000,
        },
        {
          id: 'case-203',
          firm_id: firmId,
          client_id: 'client-103',
          client_name: 'فاطمة عبد الرحمن الصاوي',
          court_name: 'محكمة جنوب الجيزة الابتدائية',
          court_governorate: 'الجيزة',
          case_type_name: 'مدني عقاري',
          title: 'دعوى صحة ونفاذ عقد بيع وحدة سكنية بالشيخ زايد',
          case_number: '920',
          case_year: 2026,
          circuit: 'الدائرة 3 مدني مساكن',
          opponent_name: 'طارق ممدوح النحاس',
          opponent_lawyer: 'أ. عماد عبد الحليم',
          client_role: 'plaintiff',
          filing_date: '2026-02-14',
          status: 'reserved_for_ruling',
          total_fees: 18000,
          total_paid: 18000,
        },
      ];
      await supabase.from('cases').upsert(sampleCases);

      // 4. Re-sync to store
      await this.syncAllFromCloud();

      return { success: true, count: sampleClients.length + sampleCases.length };
    } catch (err: any) {
      console.warn('[Supabase] seedCloudData error:', err);
      return { success: false, count: 0, error: err.message };
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
