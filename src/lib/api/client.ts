import { appStore } from './store';
import { supabaseService } from '../supabase/client';
import {
  Case,
  Client,
  CourtSession,
  LegalDeadline,
  Task,
  PoliceReport,
  BillingReport,
  DashboardData,
  SubscriptionPlan,
  User,
  Firm,
  FirmMember,
  FirmRole,
  PowerOfAttorney,
} from '../../types';
import { ContractInstance } from '../../types/contract';

// Delay simulation for realistic UX loading states
const delay = (ms: number = 80) => new Promise((res) => setTimeout(res, ms));

export const apiClient = {
  // ============================================================================
  // DATABASE & CLOUD SYNC UTILITIES
  // ============================================================================
  isCloudConfigured(): boolean {
    return supabaseService.isConfigured();
  },

  getCloudUrl(): string {
    return supabaseService.getUrl();
  },

  async testDatabaseConnection() {
    return supabaseService.testConnection();
  },

  async syncWithCloud() {
    return supabaseService.syncAllFromCloud();
  },

  async seedCloudData() {
    return supabaseService.seedCloudData();
  },

  // ============================================================================
  // DASHBOARD
  // ============================================================================
  async getDashboard(): Promise<DashboardData> {
    await delay();

    // If cloud is configured and first load, attempt background sync
    if (supabaseService.isConfigured()) {
      try {
        const [cloudCases, cloudClients, cloudSessions, cloudDeadlines, cloudTasks] = await Promise.all([
          supabaseService.fetchCases(),
          supabaseService.fetchClients(),
          supabaseService.fetchSessions(),
          supabaseService.fetchDeadlines(),
          supabaseService.fetchTasks(),
        ]);

        if (cloudCases && cloudCases.length > 0) appStore.setCases(cloudCases);
        if (cloudClients && cloudClients.length > 0) appStore.setClients(cloudClients);
        if (cloudSessions && cloudSessions.length > 0) appStore.setSessions(cloudSessions);
        if (cloudDeadlines && cloudDeadlines.length > 0) appStore.setDeadlines(cloudDeadlines);
        if (cloudTasks && cloudTasks.length > 0) appStore.setTasks(cloudTasks);
      } catch (err) {
        console.warn('[Dashboard] Cloud sync notice:', err);
      }
    }

    const cases = appStore.getCases();
    const clients = appStore.getClients();
    const sessions = appStore.getSessions();
    const deadlines = appStore.getDeadlines();
    const tasks = appStore.getTasks();

    const activeCasesCount = cases.filter((c) => c.status === 'active').length;
    const totalRevenueMonth = cases.reduce((acc, c) => acc + (c.total_paid || 0), 0);
    const totalPendingRevenue = cases.reduce((acc, c) => acc + Math.max(0, (c.total_fees || 0) - (c.total_paid || 0)), 0);

    return {
      owner_stats: {
        active_cases: activeCasesCount,
        new_clients_month: clients.length,
        revenue_month: totalRevenueMonth,
        pending_revenue: totalPendingRevenue,
        revenue_prev_month: 31000,
        new_clients_prev_month: 2,
      },
      upcoming_sessions: sessions.slice(0, 4),
      critical_deadlines: deadlines.slice(0, 4),
      task_summary: {
        pending: tasks.filter((t) => t.status === 'pending').length,
        in_progress: tasks.filter((t) => t.status === 'in_progress').length,
        overdue: 1,
      },
      recent_tasks: tasks.slice(0, 4),
      active_cases: cases.slice(0, 5),
    };
  },

  // ============================================================================
  // CASES
  // ============================================================================
  async getCases(params?: { search?: string; status?: string; court?: string }): Promise<Case[]> {
    await delay();

    if (supabaseService.isConfigured()) {
      try {
        const cloudCases = await supabaseService.fetchCases();
        if (cloudCases && cloudCases.length > 0) {
          appStore.setCases(cloudCases);
        }
      } catch (err) {
        console.warn('[apiClient.getCases] Falling back to local store:', err);
      }
    }

    let list = appStore.getCases();
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.case_number.toLowerCase().includes(q) ||
          c.client_name.toLowerCase().includes(q) ||
          c.opponent_name.toLowerCase().includes(q)
      );
    }
    if (params?.status && params.status !== 'all') {
      list = list.filter((c) => c.status === params.status);
    }
    if (params?.court && params.court !== 'all') {
      list = list.filter((c) => c.court_name.includes(params.court!));
    }
    return list;
  },

  async getCaseById(id: string): Promise<Case> {
    await delay();
    const found = appStore.getCaseById(id);
    if (!found) throw new Error('Case not found');
    return found;
  },

  async createCase(data: Omit<Case, 'id' | 'created_at' | 'updated_at' | 'sessions_count' | 'pending_deadlines_count'>): Promise<Case> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        const cloudCase = await supabaseService.insertCase(data);
        if (cloudCase?.id) {
          return appStore.addCase({ ...data, id: cloudCase.id });
        }
      } catch (err) {
        console.warn('[Supabase] Failed to write case, using local store:', err);
      }
    }
    return appStore.addCase(data);
  },

  async updateCase(id: string, updates: Partial<Case>): Promise<Case> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.updateCase(id, updates);
      } catch (err) {
        console.warn('[Supabase] updateCase cloud notice:', err);
      }
    }
    const updated = appStore.updateCase(id, updates);
    if (!updated) throw new Error('Failed to update case');
    return updated;
  },

  async deleteCase(id: string): Promise<boolean> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.deleteCase(id);
      } catch (err) {
        console.warn('[Supabase] deleteCase cloud notice:', err);
      }
    }
    return appStore.deleteCase(id);
  },

  // ============================================================================
  // CLIENTS
  // ============================================================================
  async getClients(params?: { search?: string; type?: string }): Promise<Client[]> {
    await delay();

    if (supabaseService.isConfigured()) {
      try {
        const cloudClients = await supabaseService.fetchClients();
        if (cloudClients && cloudClients.length > 0) {
          appStore.setClients(cloudClients);
        }
      } catch (err) {
        console.warn('[apiClient.getClients] Falling back to local store:', err);
      }
    }

    let list = appStore.getClients();
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.full_name.toLowerCase().includes(q) ||
          (c.phone && c.phone.includes(q)) ||
          (c.national_id && c.national_id.includes(q)) ||
          (c.company_reg && c.company_reg.includes(q))
      );
    }
    if (params?.type && params.type !== 'all') {
      list = list.filter((c) => c.client_type === params.type);
    }
    return list;
  },

  async getClientById(id: string): Promise<Client> {
    await delay();
    const found = appStore.getClientById(id);
    if (!found) throw new Error('Client not found');
    return found;
  },

  async createClient(data: Omit<Client, 'id' | 'firm_id' | 'active_cases' | 'case_count' | 'report_count' | 'created_at' | 'updated_at'>): Promise<Client> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        const cloudClient = await supabaseService.insertClient(data);
        if (cloudClient?.id) {
          return appStore.addClient({ ...data, id: cloudClient.id });
        }
      } catch (err) {
        console.warn('[Supabase] Failed to write client, using local store:', err);
      }
    }
    return appStore.addClient(data);
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.updateClient(id, updates);
      } catch (err) {
        console.warn('[Supabase] updateClient cloud notice:', err);
      }
    }
    const updated = appStore.updateClient(id, updates);
    if (!updated) throw new Error('Failed to update client');
    return updated;
  },

  async deleteClient(id: string): Promise<boolean> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.deleteClient(id);
      } catch (err) {
        console.warn('[Supabase] deleteClient cloud notice:', err);
      }
    }
    return appStore.deleteClient(id);
  },

  // ============================================================================
  // SESSIONS
  // ============================================================================
  async getSessions(filter?: 'upcoming' | 'past' | 'all'): Promise<CourtSession[]> {
    await delay();

    if (supabaseService.isConfigured()) {
      try {
        const cloudSessions = await supabaseService.fetchSessions();
        if (cloudSessions && cloudSessions.length > 0) {
          appStore.setSessions(cloudSessions);
        }
      } catch (err) {
        console.warn('[apiClient.getSessions] Falling back to local store:', err);
      }
    }

    const sessions = appStore.getSessions();
    const today = new Date().toISOString().split('T')[0];
    if (filter === 'upcoming') {
      return sessions.filter((s) => s.session_date >= today);
    }
    if (filter === 'past') {
      return sessions.filter((s) => s.session_date < today);
    }
    return sessions;
  },

  async getSessionsByCase(caseId: string): Promise<CourtSession[]> {
    await delay();
    return appStore.getSessionsByCase(caseId);
  },

  async createSession(data: Omit<CourtSession, 'id' | 'created_at'>): Promise<CourtSession> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        const cloudSession = await supabaseService.insertSession(data);
        if (cloudSession?.id) {
          return appStore.addSession({ ...data, id: cloudSession.id });
        }
      } catch (err) {
        console.warn('[Supabase] Failed to write session, using local store:', err);
      }
    }
    return appStore.addSession(data);
  },

  async updateSession(id: string, updates: Partial<CourtSession>): Promise<CourtSession> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.updateSession(id, updates);
      } catch (err) {
        console.warn('[Supabase] updateSession cloud notice:', err);
      }
    }
    const updated = appStore.updateSession(id, updates);
    if (!updated) throw new Error('Failed to update session');
    return updated;
  },

  async deleteSession(id: string): Promise<boolean> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.deleteSession(id);
      } catch (err) {
        console.warn('[Supabase] deleteSession cloud notice:', err);
      }
    }
    return appStore.deleteSession(id);
  },

  // ============================================================================
  // DEADLINES
  // ============================================================================
  async getDeadlines(): Promise<LegalDeadline[]> {
    await delay();

    if (supabaseService.isConfigured()) {
      try {
        const cloudDeadlines = await supabaseService.fetchDeadlines();
        if (cloudDeadlines && cloudDeadlines.length > 0) {
          appStore.setDeadlines(cloudDeadlines);
        }
      } catch (err) {
        console.warn('[apiClient.getDeadlines] Falling back to local store:', err);
      }
    }

    return appStore.getDeadlines();
  },

  async createDeadline(data: Omit<LegalDeadline, 'id' | 'created_at'>): Promise<LegalDeadline> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        const cloudDeadline = await supabaseService.insertDeadline(data);
        if (cloudDeadline?.id) {
          return appStore.addDeadline({ ...data, id: cloudDeadline.id });
        }
      } catch (err) {
        console.warn('[Supabase] Failed to write deadline, using local store:', err);
      }
    }
    return appStore.addDeadline(data);
  },

  async updateDeadline(id: string, updates: Partial<LegalDeadline>): Promise<LegalDeadline> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.updateDeadline(id, updates);
      } catch (err) {
        console.warn('[Supabase] updateDeadline cloud notice:', err);
      }
    }
    const updated = appStore.updateDeadline(id, updates);
    if (!updated) throw new Error('Failed to update deadline');
    return updated;
  },

  async deleteDeadline(id: string): Promise<boolean> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.deleteDeadline(id);
      } catch (err) {
        console.warn('[Supabase] deleteDeadline cloud notice:', err);
      }
    }
    return appStore.deleteDeadline(id);
  },

  // ============================================================================
  // TASKS
  // ============================================================================
  async getTasks(): Promise<Task[]> {
    await delay();

    if (supabaseService.isConfigured()) {
      try {
        const cloudTasks = await supabaseService.fetchTasks();
        if (cloudTasks && cloudTasks.length > 0) {
          appStore.setTasks(cloudTasks);
        }
      } catch (err) {
        console.warn('[apiClient.getTasks] Falling back to local store:', err);
      }
    }

    return appStore.getTasks();
  },

  async createTask(data: Omit<Task, 'id' | 'firm_id' | 'created_at' | 'updated_at'>): Promise<Task> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        const cloudTask = await supabaseService.insertTask(data);
        if (cloudTask?.id) {
          return appStore.addTask({ ...data, id: cloudTask.id });
        }
      } catch (err) {
        console.warn('[Supabase] Failed to write task, using local store:', err);
      }
    }
    return appStore.addTask(data);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.updateTask(id, updates);
      } catch (err) {
        console.warn('[Supabase] updateTask cloud notice:', err);
      }
    }
    const updated = appStore.updateTask(id, updates);
    if (!updated) throw new Error('Failed to update task');
    return updated;
  },

  async deleteTask(id: string): Promise<boolean> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.deleteTask(id);
      } catch (err) {
        console.warn('[Supabase] deleteTask cloud notice:', err);
      }
    }
    return appStore.deleteTask(id);
  },

  // ============================================================================
  // POLICE REPORTS
  // ============================================================================
  async getPoliceReports(): Promise<PoliceReport[]> {
    await delay();

    if (supabaseService.isConfigured()) {
      try {
        const cloudReports = await supabaseService.fetchPoliceReports();
        if (cloudReports && cloudReports.length > 0) {
          appStore.setPoliceReports(cloudReports);
        }
      } catch (err) {
        console.warn('[apiClient.getPoliceReports] Falling back to local store:', err);
      }
    }

    return appStore.getPoliceReports();
  },

  async getPoliceReportById(id: string): Promise<PoliceReport> {
    await delay();
    const found = appStore.getPoliceReportById(id);
    if (!found) throw new Error('Police report not found');
    return found;
  },

  async createPoliceReport(data: Omit<PoliceReport, 'id' | 'firm_id' | 'created_at' | 'updated_at'>): Promise<PoliceReport> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        const cloudReport = await supabaseService.insertPoliceReport(data);
        if (cloudReport?.id) {
          return appStore.addPoliceReport({ ...data, id: cloudReport.id });
        }
      } catch (err) {
        console.warn('[Supabase] Failed to write report, using local store:', err);
      }
    }
    return appStore.addPoliceReport(data);
  },

  async updatePoliceReport(id: string, updates: Partial<PoliceReport>): Promise<PoliceReport> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.updatePoliceReport(id, updates);
      } catch (err) {
        console.warn('[Supabase] updatePoliceReport cloud notice:', err);
      }
    }
    const updated = appStore.updatePoliceReport(id, updates);
    if (!updated) throw new Error('Failed to update police report');
    return updated;
  },

  async deletePoliceReport(id: string): Promise<boolean> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.deletePoliceReport(id);
      } catch (err) {
        console.warn('[Supabase] deletePoliceReport cloud notice:', err);
      }
    }
    return appStore.deletePoliceReport(id);
  },

  // ============================================================================
  // POAS
  // ============================================================================
  async getPoas(clientId?: string): Promise<PowerOfAttorney[]> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        const cloudPoas = await supabaseService.fetchPoas(clientId);
        if (cloudPoas && cloudPoas.length > 0) {
          appStore.setPoas(cloudPoas);
        }
      } catch (err) {
        console.warn('[apiClient.getPoas] Falling back to local store:', err);
      }
    }
    return appStore.getPoas(clientId);
  },

  async createPoa(data: any): Promise<PowerOfAttorney> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        const cloudPoa = await supabaseService.insertPoa(data);
        if (cloudPoa?.id) {
          return appStore.addPoa({ ...data, id: cloudPoa.id });
        }
      } catch (err) {
        console.warn('[Supabase] Failed to write POA, using local store:', err);
      }
    }
    return appStore.addPoa(data);
  },

  async deletePoa(id: string): Promise<boolean> {
    await delay();
    if (supabaseService.isConfigured()) {
      try {
        await supabaseService.deletePoa(id);
      } catch (err) {
        console.warn('[Supabase] deletePoa cloud notice:', err);
      }
    }
    return appStore.deletePoa(id);
  },

  // ============================================================================
  // BILLING
  // ============================================================================
  async getBillingReport(dateFrom?: string, dateTo?: string): Promise<BillingReport> {
    await delay();
    return appStore.getBillingReport(dateFrom, dateTo);
  },

  // ============================================================================
  // FIRM & SUBSCRIPTIONS
  // ============================================================================
  async getFirm(): Promise<Firm> {
    await delay();
    return appStore.getState().firm;
  },

  async getFirmMembers(): Promise<FirmMember[]> {
    await delay();
    return appStore.getState().members;
  },

  async getFirmRoles(): Promise<FirmRole[]> {
    await delay();
    return appStore.getState().roles;
  },

  async getProfile(): Promise<User> {
    await delay();
    return appStore.getState().user;
  },

  async getPlans(): Promise<SubscriptionPlan[]> {
    await delay();
    return appStore.getState().plans;
  },

  // ============================================================================
  // CONTRACTS & CASE AGREEMENTS
  // ============================================================================
  async getContracts(caseId?: string): Promise<ContractInstance[]> {
    await delay();
    return appStore.getContracts(caseId);
  },

  async createContract(data: Omit<ContractInstance, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<ContractInstance> {
    await delay();
    return appStore.addContract(data);
  },

  async deleteContract(id: string): Promise<boolean> {
    await delay();
    return appStore.deleteContract(id);
  },

  // ============================================================================
  // CASE EXPENSES & DISBURSEMENTS
  // ============================================================================
  async getExpenses(caseId?: string) {
    await delay();
    return appStore.getExpenses(caseId);
  },

  async addExpense(data: { title: string; amount: number; date: string; case_id?: string }) {
    await delay();
    return appStore.addExpense(data);
  },

  async getPoliceReportsByCase(caseId: string): Promise<PoliceReport[]> {
    await delay();
    return appStore.getPoliceReportsByCase(caseId);
  },
};
