import {
  Case,
  Client,
  CourtSession,
  LegalDeadline,
  Task,
  PoliceReport,
  BillingReport,
  User,
  Firm,
  FirmMember,
  FirmRole,
  SubscriptionPlan,
  PowerOfAttorney
} from '../../types';
import { ContractInstance } from '../../types/contract';

const STORAGE_KEY = 'baseera_clean_v2';

const now = new Date();
const addDays = (d: Date, days: number) => {
  const res = new Date(d);
  res.setDate(res.getDate() + days);
  return res.toISOString().split('T')[0];
};

export const INITIAL_USER: User = {
  id: '01a08460-b523-7667-b6cd-7863e99c38c7',
  full_name: 'محمد السيد',
  email: 'elezabybode375@gmail.com',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  member_since: '2026-09-09',
  auth_provider: 'google',
  two_fa_enabled: false,
};

export const INITIAL_FIRM: Firm = {
  id: '01a08460-df3a-70c0-9a46-f3497eced7c7',
  name: 'مكتب محمد السيد للمحاماة والاستشارات القانونية',
  logo_url: '/logo.svg',
  created_at: '2026-09-09T00:00:00Z',
};

export const INITIAL_ROLES: FirmRole[] = [
  {
    id: '019e413f-f4b3-7e2c-adc4-599d10397216',
    name: 'مالك المكتب',
    slug: 'owner',
    permissions: ['*'],
    is_system: true,
    members_count: 1,
  },
  {
    id: '019e413f-f4b4-7bb5-98d8-524f44e15cd4',
    name: 'محامٍ أساسي',
    slug: 'senior',
    permissions: ['cases.create', 'cases.edit', 'cases.view', 'sessions.create', 'sessions.edit', 'clients.view', 'clients.create', 'billing.manage'],
    is_system: true,
    members_count: 1,
  },
  {
    id: '019e413f-f4b5-7856-abc3-76500ed100c4',
    name: 'مساعد قانوني',
    slug: 'junior',
    permissions: ['cases.view', 'clients.view', 'sessions.create', 'tasks.view'],
    is_system: true,
    members_count: 1,
  },
];

export const INITIAL_MEMBERS: FirmMember[] = [
  {
    user_id: INITIAL_USER.id,
    full_name: INITIAL_USER.full_name,
    email: INITIAL_USER.email,
    avatar_url: INITIAL_USER.avatar_url,
    role_id: '019e413f-f4b3-7e2c-adc4-599d10397216',
    role_name: 'مالك المكتب',
    role_slug: 'owner',
    joined_at: '2026-09-09T00:00:00Z',
  },
  {
    user_id: 'user-2',
    full_name: 'خالد السعيد',
    email: 'khaled@baseera.legal',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role_id: '019e413f-f4b4-7bb5-98d8-524f44e15cd4',
    role_name: 'محامٍ أساسي',
    role_slug: 'senior',
    joined_at: '2026-08-20T00:00:00Z',
  },
  {
    user_id: 'user-3',
    full_name: 'منى إبراهيم',
    email: 'mona@baseera.legal',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role_id: '019e413f-f4b5-7856-abc3-76500ed100c4',
    role_name: 'مساعد قانوني',
    role_slug: 'junior',
    joined_at: '2026-08-28T00:00:00Z',
  },
];

export const INITIAL_CLIENTS: Client[] = [];
export const INITIAL_CASES: Case[] = [];
export const INITIAL_SESSIONS: CourtSession[] = [];
export const INITIAL_DEADLINES: LegalDeadline[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_POAS: PowerOfAttorney[] = [];
export const INITIAL_POLICE_REPORTS: PoliceReport[] = [];

export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: '019e413f-f467-74c7-8a8d-7c1551adea8d',
    name: 'المحامي الفردي',
    slug: 'individual-monthly',
    billing_cycle: 'monthly',
    price: '500.00',
    currency: 'EGP',
    interval_days: 30,
    features: [
      { key_name: 'max_members', type: 'quota', limit_value: 2 },
      { key_name: 'max_clients', type: 'quota', limit_value: 0 },
      { key_name: 'max_cases', type: 'quota', limit_value: 0 },
      { key_name: 'calendar_export', type: 'boolean', limit_value: 1 },
      { key_name: 'storage_bytes', type: 'quota', limit_value: 5368709120 },
    ],
  },
  {
    id: '019e413f-f46e-7970-a147-f9d7993eba29',
    name: 'المكاتب المتوسطة',
    slug: 'office-monthly',
    billing_cycle: 'monthly',
    price: '1400.00',
    currency: 'EGP',
    interval_days: 30,
    features: [
      { key_name: 'max_members', type: 'quota', limit_value: 10 },
      { key_name: 'max_clients', type: 'quota', limit_value: 0 },
      { key_name: 'max_cases', type: 'quota', limit_value: 0 },
      { key_name: 'calendar_export', type: 'boolean', limit_value: 1 },
      { key_name: 'storage_bytes', type: 'quota', limit_value: 53687091200 },
    ],
  },
  {
    id: '019e413f-f473-7a87-99ce-21d2f484c400',
    name: 'المكاتب الكبيرة',
    slug: 'enterprise-monthly',
    billing_cycle: 'monthly',
    price: '3700.00',
    currency: 'EGP',
    interval_days: 30,
    features: [
      { key_name: 'max_members', type: 'quota', limit_value: 30 },
      { key_name: 'max_clients', type: 'quota', limit_value: 0 },
      { key_name: 'max_cases', type: 'quota', limit_value: 0 },
      { key_name: 'calendar_export', type: 'boolean', limit_value: 1 },
      { key_name: 'storage_bytes', type: 'quota', limit_value: 161061273600 },
    ],
  },
];

// App Data Model
export interface AppData {
  user: User;
  firm: Firm;
  members: FirmMember[];
  roles: FirmRole[];
  clients: Client[];
  cases: Case[];
  sessions: CourtSession[];
  deadlines: LegalDeadline[];
  tasks: Task[];
  poas: PowerOfAttorney[];
  policeReports: PoliceReport[];
  plans: SubscriptionPlan[];
  expenses: Array<{ id: string; title: string; amount: number; date: string; case_id?: string }>;
  contracts: ContractInstance[];
}

class Store {
  private data: AppData;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.data = this.load();
  }

  private load(): AppData {
    if (typeof window === 'undefined') return this.getInitialData();
    try {
      if (localStorage.getItem('baseera_mock_purged_v2') !== 'true') {
        localStorage.removeItem('baseera_app_data_v1');
        localStorage.removeItem('siyaq_app_data_v1');
        localStorage.removeItem('baseera_clean_v2');
        localStorage.setItem('baseera_mock_purged_v2', 'true');
        return this.getInitialData();
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.cases) parsed.cases = [];
        if (!parsed.clients) parsed.clients = [];
        if (!parsed.contracts) parsed.contracts = [];
        if (!parsed.deadlines) parsed.deadlines = [];
        if (!parsed.sessions) parsed.sessions = [];
        if (!parsed.tasks) parsed.tasks = [];
        if (!parsed.policeReports) parsed.policeReports = [];
        if (!parsed.expenses) parsed.expenses = [];
        if (!parsed.poas) parsed.poas = [];
        return parsed;
      }
    } catch {
      // ignore
    }
    const initial = this.getInitialData();
    this.persist(initial);
    return initial;
  }

  private persist(data: AppData) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }
    }
  }

  private getInitialData(): AppData {
    return {
      user: INITIAL_USER,
      firm: INITIAL_FIRM,
      members: INITIAL_MEMBERS,
      roles: INITIAL_ROLES,
      clients: INITIAL_CLIENTS,
      cases: INITIAL_CASES,
      sessions: INITIAL_SESSIONS,
      deadlines: INITIAL_DEADLINES,
      tasks: INITIAL_TASKS,
      poas: INITIAL_POAS,
      policeReports: INITIAL_POLICE_REPORTS,
      plans: INITIAL_PLANS,
      expenses: [],
      contracts: [],
    };
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.persist(this.data);
    this.listeners.forEach((l) => l());
  }

  public getState(): AppData {
    return this.data;
  }

  // CASES
  public getCases(): Case[] {
    return this.data.cases;
  }

  public setCases(cases: Case[]) {
    const incomingIds = new Set(cases.map((c) => c.id));
    const localOnly = this.data.cases.filter((c) => !incomingIds.has(c.id));
    this.data.cases = [...cases, ...localOnly];
    this.notify();
  }

  public getCaseById(id: string): Case | undefined {
    return this.data.cases.find((c) => c.id === id);
  }

  public addCase(newCase: Omit<Case, 'id' | 'created_at' | 'updated_at' | 'sessions_count' | 'pending_deadlines_count'> & { id?: string }): Case {
    const id = newCase.id || `case-${Date.now()}`;
    const created: Case = {
      ...newCase,
      id,
      sessions_count: 0,
      pending_deadlines_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.cases.unshift(created);

    // Update client active cases
    const client = this.data.clients.find((c) => c.id === newCase.client_id);
    if (client) {
      client.active_cases += 1;
      client.case_count += 1;
    }

    this.notify();
    return created;
  }

  public updateCase(id: string, updates: Partial<Case>): Case | null {
    const idx = this.data.cases.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.cases[idx] = {
      ...this.data.cases[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.notify();
    return this.data.cases[idx];
  }

  public deleteCase(id: string): boolean {
    const idx = this.data.cases.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    const removed = this.data.cases.splice(idx, 1)[0];
    const client = this.data.clients.find((c) => c.id === removed.client_id);
    if (client && client.active_cases > 0) {
      client.active_cases -= 1;
    }
    this.notify();
    return true;
  }

  // CLIENTS
  public getClients(): Client[] {
    return this.data.clients;
  }

  public setClients(clients: Client[]) {
    this.data.clients = clients;
    this.notify();
  }

  public getClientById(id: string): Client | undefined {
    return this.data.clients.find((c) => c.id === id);
  }

  public addClient(newClient: Omit<Client, 'id' | 'firm_id' | 'active_cases' | 'case_count' | 'report_count' | 'created_at' | 'updated_at'> & { id?: string }): Client {
    const id = newClient.id || `client-${Date.now()}`;
    const created: Client = {
      ...newClient,
      id,
      firm_id: this.data.firm.id,
      active_cases: 0,
      case_count: 0,
      report_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.clients.unshift(created);
    this.notify();
    return created;
  }

  public updateClient(id: string, updates: Partial<Client>): Client | null {
    const idx = this.data.clients.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.clients[idx] = {
      ...this.data.clients[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.notify();
    return this.data.clients[idx];
  }

  public deleteClient(id: string): boolean {
    const idx = this.data.clients.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.data.clients.splice(idx, 1);
    this.notify();
    return true;
  }

  // SESSIONS
  public getSessions(): CourtSession[] {
    return this.data.sessions;
  }

  public setSessions(sessions: CourtSession[]) {
    const incomingIds = new Set(sessions.map((s) => s.id));
    const localOnly = this.data.sessions.filter((s) => !incomingIds.has(s.id));
    this.data.sessions = [...sessions, ...localOnly];
    this.notify();
  }

  public getSessionsByCase(caseId: string): CourtSession[] {
    return this.data.sessions.filter((s) => s.case_id === caseId);
  }

  public addSession(session: Omit<CourtSession, 'id' | 'created_at'> & { id?: string }): CourtSession {
    const id = session.id || `session-${Date.now()}`;
    const created: CourtSession = {
      ...session,
      id,
      created_at: new Date().toISOString(),
    };
    this.data.sessions.unshift(created);

    // Update case next session date
    const c = this.data.cases.find((item) => item.id === session.case_id);
    if (c) {
      c.sessions_count += 1;
      if (session.next_session_date) {
        c.next_session_date = session.next_session_date;
      }
    }

    this.notify();
    return created;
  }

  public updateSession(id: string, updates: Partial<CourtSession>): CourtSession | null {
    const idx = this.data.sessions.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.sessions[idx] = {
      ...this.data.sessions[idx],
      ...updates,
    };
    this.notify();
    return this.data.sessions[idx];
  }

  public deleteSession(id: string): boolean {
    const idx = this.data.sessions.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.data.sessions.splice(idx, 1);
    this.notify();
    return true;
  }

  // DEADLINES
  public getDeadlines(): LegalDeadline[] {
    return this.data.deadlines;
  }

  public setDeadlines(deadlines: LegalDeadline[]) {
    const incomingIds = new Set(deadlines.map((d) => d.id));
    const localOnly = this.data.deadlines.filter((d) => !incomingIds.has(d.id));
    this.data.deadlines = [...deadlines, ...localOnly];
    this.notify();
  }

  public addDeadline(deadline: Omit<LegalDeadline, 'id' | 'created_at'> & { id?: string }): LegalDeadline {
    const id = deadline.id || `dl-${Date.now()}`;
    const created: LegalDeadline = {
      ...deadline,
      id,
      created_at: new Date().toISOString(),
    };
    this.data.deadlines.unshift(created);

    const c = this.data.cases.find((item) => item.id === deadline.case_id);
    if (c) {
      c.pending_deadlines_count += 1;
      c.nearest_deadline_date = deadline.deadline_date;
    }

    this.notify();
    return created;
  }

  public updateDeadline(id: string, updates: Partial<LegalDeadline>): LegalDeadline | null {
    const idx = this.data.deadlines.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.data.deadlines[idx] = {
      ...this.data.deadlines[idx],
      ...updates,
    };
    this.notify();
    return this.data.deadlines[idx];
  }

  public deleteDeadline(id: string): boolean {
    const idx = this.data.deadlines.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    this.data.deadlines.splice(idx, 1);
    this.notify();
    return true;
  }

  // TASKS
  public getTasks(): Task[] {
    return this.data.tasks;
  }

  public setTasks(tasks: Task[]) {
    const incomingIds = new Set(tasks.map((t) => t.id));
    const localOnly = this.data.tasks.filter((t) => !incomingIds.has(t.id));
    this.data.tasks = [...tasks, ...localOnly];
    this.notify();
  }

  public addTask(task: Omit<Task, 'id' | 'firm_id' | 'created_at' | 'updated_at'> & { id?: string }): Task {
    const id = task.id || `task-${Date.now()}`;
    const created: Task = {
      ...task,
      id,
      firm_id: this.data.firm.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.tasks.unshift(created);
    this.notify();
    return created;
  }

  public updateTask(id: string, updates: Partial<Task>): Task | null {
    const idx = this.data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.data.tasks[idx] = {
      ...this.data.tasks[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.notify();
    return this.data.tasks[idx];
  }

  public deleteTask(id: string): boolean {
    const idx = this.data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.data.tasks.splice(idx, 1);
    this.notify();
    return true;
  }

  // POLICE REPORTS
  public getPoliceReports(): PoliceReport[] {
    return this.data.policeReports;
  }

  public setPoliceReports(reports: PoliceReport[]) {
    const incomingIds = new Set(reports.map((r) => r.id));
    const localOnly = this.data.policeReports.filter((r) => !incomingIds.has(r.id));
    this.data.policeReports = [...reports, ...localOnly];
    this.notify();
  }

  public getPoliceReportsByCase(caseId: string): PoliceReport[] {
    return this.data.policeReports.filter((r) => r.linked_case_id === caseId);
  }

  // CONTRACTS
  public getContracts(caseId?: string): ContractInstance[] {
    if (!this.data.contracts) this.data.contracts = [];
    if (caseId) {
      return this.data.contracts.filter((c) => c.case_id === caseId);
    }
    return this.data.contracts;
  }

  public addContract(contract: Omit<ContractInstance, 'id' | 'created_at' | 'updated_at'> & { id?: string }): ContractInstance {
    if (!this.data.contracts) this.data.contracts = [];
    const id = contract.id || `ci-${Date.now()}`;
    const created: ContractInstance = {
      ...contract,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.contracts.unshift(created);
    this.notify();
    return created;
  }

  public deleteContract(id: string): boolean {
    if (!this.data.contracts) return false;
    const idx = this.data.contracts.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.data.contracts.splice(idx, 1);
    this.notify();
    return true;
  }

  // EXPENSES
  public getExpenses(caseId?: string) {
    if (!this.data.expenses) this.data.expenses = [];
    if (caseId) {
      return this.data.expenses.filter((e) => e.case_id === caseId);
    }
    return this.data.expenses;
  }

  public addExpense(expense: { title: string; amount: number; date: string; case_id?: string }) {
    if (!this.data.expenses) this.data.expenses = [];
    const id = `exp-${Date.now()}`;
    const created = { id, ...expense };
    this.data.expenses.unshift(created);
    this.notify();
    return created;
  }

  public getPoliceReportById(id: string): PoliceReport | undefined {
    return this.data.policeReports.find((r) => r.id === id);
  }

  public addPoliceReport(report: Omit<PoliceReport, 'id' | 'firm_id' | 'created_at' | 'updated_at'> & { id?: string }): PoliceReport {
    const id = report.id || `pr-${Date.now()}`;
    const created: PoliceReport = {
      ...report,
      id,
      firm_id: this.data.firm.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.policeReports.unshift(created);
    this.notify();
    return created;
  }

  public updatePoliceReport(id: string, updates: Partial<PoliceReport>): PoliceReport | null {
    const idx = this.data.policeReports.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.policeReports[idx] = {
      ...this.data.policeReports[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.notify();
    return this.data.policeReports[idx];
  }

  public deletePoliceReport(id: string): boolean {
    const idx = this.data.policeReports.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.data.policeReports.splice(idx, 1);
    this.notify();
    return true;
  }

  // POAS
  public getPoas(clientId?: string): PowerOfAttorney[] {
    if (clientId) {
      return this.data.poas.filter((p) => p.client_id === clientId);
    }
    return this.data.poas;
  }

  public setPoas(poas: PowerOfAttorney[]) {
    this.data.poas = poas;
    this.notify();
  }

  public addPoa(poa: Omit<PowerOfAttorney, 'id' | 'firm_id' | 'created_at'>): PowerOfAttorney {
    const id = `poa-${Date.now()}`;
    const created: PowerOfAttorney = {
      ...poa,
      id,
      firm_id: this.data.firm.id,
      created_at: new Date().toISOString(),
    };
    this.data.poas.unshift(created);
    this.notify();
    return created;
  }

  public deletePoa(id: string): boolean {
    const idx = this.data.poas.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.data.poas.splice(idx, 1);
    this.notify();
    return true;
  }

  // BILLING
  public getBillingReport(dateFrom?: string, dateTo?: string): BillingReport {
    let casesList = this.data.cases;
    if (dateFrom) {
      casesList = casesList.filter((c) => c.created_at >= dateFrom);
    }
    if (dateTo) {
      casesList = casesList.filter((c) => c.created_at <= dateTo);
    }

    const casesSummary = casesList.map((c) => {
      const expenses = this.data.expenses
        .filter((e) => e.case_id === c.id)
        .reduce((sum, e) => sum + e.amount, 0);

      const outstanding = Math.max(0, c.total_fees - c.total_paid);
      const net = c.total_paid - expenses;

      return {
        case_id: c.id,
        case_title: c.title,
        client_name: c.client_name,
        total_fees: c.total_fees,
        total_paid: c.total_paid,
        outstanding_balance: outstanding,
        total_expenses_firm: expenses,
        net_revenue: net,
        entity_type: 'case' as const,
      };
    });

    const totalFees = casesSummary.reduce((acc, c) => acc + c.total_fees, 0);
    const totalPaid = casesSummary.reduce((acc, c) => acc + c.total_paid, 0);
    const outstandingTotal = casesSummary.reduce((acc, c) => acc + c.outstanding_balance, 0);
    const expensesTotal = casesSummary.reduce((acc, c) => acc + c.total_expenses_firm, 0);
    const netRevenue = totalPaid - expensesTotal;

    return {
      cases: casesSummary,
      total_fees: totalFees,
      total_paid: totalPaid,
      outstanding_balance: outstandingTotal,
      total_expenses_firm: expensesTotal,
      net_revenue: netRevenue,
    };
  }

  // Reset to initial state
  public getUser(): User {
    return this.data.user;
  }

  public setUser(user: User) {
    this.data.user = user;
    this.persist(this.data);
    this.notify();
  }

  public getFirm(): Firm {
    return this.data.firm;
  }

  public setFirm(firm: Firm) {
    this.data.firm = firm;
    this.persist(this.data);
    this.notify();
  }

  public setMembers(members: FirmMember[]) {
    this.data.members = members;
    this.persist(this.data);
    this.notify();
  }

  public setRoles(roles: FirmRole[]) {
    this.data.roles = roles;
    this.persist(this.data);
    this.notify();
  }

  public setContracts(contracts: ContractInstance[]) {
    this.data.contracts = contracts;
    this.persist(this.data);
    this.notify();
  }

  public setExpenses(expenses: any[]) {
    this.data.expenses = expenses;
    this.persist(this.data);
    this.notify();
  }

  public clearAll() {
    this.reset();
  }

  public reset() {
    this.data = this.getInitialData();
    this.notify();
  }

  public logout() {
    this.reset();
  }
}

export const appStore = new Store();

import { useState, useEffect } from 'react';

export const useAuthStore = () => {
  const [state, setState] = useState(appStore.getState());
  useEffect(() => {
    return appStore.subscribe(() => setState(appStore.getState()));
  }, []);
  return {
    user: state.user,
    firm: state.firm,
    logout: () => appStore.logout(),
  };
};
