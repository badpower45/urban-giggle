import { appStore } from './store';
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
  FirmRole
} from '../../types';

// Delay simulation for realistic UX loading states
const delay = (ms: number = 80) => new Promise((res) => setTimeout(res, ms));

export const apiClient = {
  // DASHBOARD
  async getDashboard(): Promise<DashboardData> {
    await delay();
    const cases = appStore.getCases();
    const clients = appStore.getClients();
    const sessions = appStore.getSessions();
    const deadlines = appStore.getDeadlines();
    const tasks = appStore.getTasks();

    const activeCasesCount = cases.filter((c) => c.status === 'active').length;
    const totalRevenueMonth = cases.reduce((acc, c) => acc + c.total_paid, 0);
    const totalPendingRevenue = cases.reduce((acc, c) => acc + Math.max(0, c.total_fees - c.total_paid), 0);

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

  // CASES
  async getCases(params?: { search?: string; status?: string; court?: string }): Promise<Case[]> {
    await delay();
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
    return appStore.addCase(data);
  },

  async updateCase(id: string, updates: Partial<Case>): Promise<Case> {
    await delay();
    const updated = appStore.updateCase(id, updates);
    if (!updated) throw new Error('Failed to update case');
    return updated;
  },

  async deleteCase(id: string): Promise<boolean> {
    await delay();
    return appStore.deleteCase(id);
  },

  // CLIENTS
  async getClients(params?: { search?: string; type?: string }): Promise<Client[]> {
    await delay();
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
    return appStore.addClient(data);
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    await delay();
    const updated = appStore.updateClient(id, updates);
    if (!updated) throw new Error('Failed to update client');
    return updated;
  },

  // SESSIONS
  async getSessions(filter?: 'upcoming' | 'past' | 'all'): Promise<CourtSession[]> {
    await delay();
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
    return appStore.addSession(data);
  },

  // DEADLINES
  async getDeadlines(): Promise<LegalDeadline[]> {
    await delay();
    return appStore.getDeadlines();
  },

  async createDeadline(data: Omit<LegalDeadline, 'id' | 'created_at'>): Promise<LegalDeadline> {
    await delay();
    return appStore.addDeadline(data);
  },

  // TASKS
  async getTasks(): Promise<Task[]> {
    await delay();
    return appStore.getTasks();
  },

  async createTask(data: Omit<Task, 'id' | 'firm_id' | 'created_at' | 'updated_at'>): Promise<Task> {
    await delay();
    return appStore.addTask(data);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await delay();
    const updated = appStore.updateTask(id, updates);
    if (!updated) throw new Error('Failed to update task');
    return updated;
  },

  // POLICE REPORTS
  async getPoliceReports(): Promise<PoliceReport[]> {
    await delay();
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
    return appStore.addPoliceReport(data);
  },

  async updatePoliceReport(id: string, updates: Partial<PoliceReport>): Promise<PoliceReport> {
    await delay();
    const updated = appStore.updatePoliceReport(id, updates);
    if (!updated) throw new Error('Failed to update police report');
    return updated;
  },

  // POAS
  async getPoas(clientId?: string) {
    await delay();
    return appStore.getPoas(clientId);
  },

  async createPoa(data: any) {
    await delay();
    return appStore.addPoa(data);
  },

  // BILLING
  async getBillingReport(dateFrom?: string, dateTo?: string): Promise<BillingReport> {
    await delay();
    return appStore.getBillingReport(dateFrom, dateTo);
  },

  // FIRM & SUBSCRIPTIONS
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
};
