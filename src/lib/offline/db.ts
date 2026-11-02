/**
 * Native Local Database Setup (Capacitor SQLite)
 * Database Manager for Legal SaaS "Siyaq"
 *
 * Implements "Local-First" architecture where React UI interacts
 * with this local database. Supports both Capacitor native SQLite
 * (iOS/Android) and resilient Web fallback (IndexedDB / memory).
 */

import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { LocalCase, LocalClient, SyncQueueItem } from './types';

const DB_NAME = 'baseera_offline_db';
const DB_VERSION = 1;

// Schema DDL Statements
const INIT_SCHEMA_SQL = `
-- Cases Table
CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY NOT NULL,
  case_number TEXT NOT NULL,
  title TEXT NOT NULL,
  client_id TEXT,
  client_name TEXT,
  court TEXT,
  circuit TEXT,
  stage TEXT,
  status TEXT,
  type TEXT,
  fees REAL DEFAULT 0,
  paid_amount REAL DEFAULT 0,
  synced INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cases_synced ON cases(synced);

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  national_id TEXT,
  type TEXT,
  address TEXT,
  notes TEXT,
  synced INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_clients_synced ON clients(synced);

-- Sync Queue Table for Offline API Mutations
CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  payload TEXT NOT NULL,
  headers TEXT,
  retry_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_created ON sync_queue(created_at);
`;

class DatabaseService {
  private sqliteConnection: SQLiteConnection | null = null;
  private dbConnection: SQLiteDBConnection | null = null;
  private isInitialized = false;
  private isNative = false;

  // Web Fallback Stores (active when running in browser dev environment)
  private webStorage = {
    cases: new Map<string, LocalCase>(),
    clients: new Map<string, LocalClient>(),
    sync_queue: new Map<string, SyncQueueItem>(),
  };

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  /**
   * Initializes the database connection and creates required tables
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (this.isNative) {
        this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);

        // Check if database connection is already established
        const isConsistent = (
          await this.sqliteConnection.checkConnectionsConsistency()
        ).result;
        const isConnected = (
          await this.sqliteConnection.isConnection(DB_NAME, false)
        ).result;

        if (isConsistent && isConnected) {
          this.dbConnection = await this.sqliteConnection.retrieveConnection(
            DB_NAME,
            false
          );
        } else {
          this.dbConnection = await this.sqliteConnection.createConnection(
            DB_NAME,
            false,
            'no-encryption',
            DB_VERSION,
            false
          );
        }

        await this.dbConnection.open();

        // Run DDL migrations
        await this.dbConnection.execute(INIT_SCHEMA_SQL);
        console.log('[SQLite] Native database initialized successfully.');
      } else {
        // Web platform fallback using IndexedDB persistence or LocalStorage
        this.initWebStorage();
        console.log('[SQLite] Web fallback storage initialized.');
      }

      this.isInitialized = true;
    } catch (error) {
      console.warn(
        '[SQLite] Native init error, falling back to Web Storage:',
        error
      );
      this.initWebStorage();
      this.isInitialized = true;
    }
  }

  private initWebStorage() {
    try {
      const storedCases = localStorage.getItem('baseera_sqlite_cases') || localStorage.getItem('siyaq_sqlite_cases');
      if (storedCases) {
        const parsed: LocalCase[] = JSON.parse(storedCases);
        parsed.forEach((c) => this.webStorage.cases.set(c.id, c));
      }
      const storedClients = localStorage.getItem('baseera_sqlite_clients') || localStorage.getItem('siyaq_sqlite_clients');
      if (storedClients) {
        const parsed: LocalClient[] = JSON.parse(storedClients);
        parsed.forEach((cl) => this.webStorage.clients.set(cl.id, cl));
      }
      const storedQueue = localStorage.getItem('baseera_sqlite_queue') || localStorage.getItem('siyaq_sqlite_queue');
      if (storedQueue) {
        const parsed: SyncQueueItem[] = JSON.parse(storedQueue);
        parsed.forEach((q) => this.webStorage.sync_queue.set(q.id, q));
      }
    } catch (e) {
      console.error('[SQLite] Error reading web storage fallback:', e);
    }
  }

  private persistWebStorage(
    store: 'cases' | 'clients' | 'sync_queue'
  ) {
    if (this.isNative) return;
    try {
      if (store === 'cases') {
        const list = Array.from(this.webStorage.cases.values());
        localStorage.setItem('baseera_sqlite_cases', JSON.stringify(list));
      } else if (store === 'clients') {
        const list = Array.from(this.webStorage.clients.values());
        localStorage.setItem('baseera_sqlite_clients', JSON.stringify(list));
      } else if (store === 'sync_queue') {
        const list = Array.from(this.webStorage.sync_queue.values());
        localStorage.setItem('baseera_sqlite_queue', JSON.stringify(list));
      }
    } catch (e) {
      console.error('[SQLite] Error persisting web storage:', e);
    }
  }

  // ==========================================
  // CASES REPOSITORY (LOCAL-FIRST)
  // ==========================================

  async getAllCases(): Promise<LocalCase[]> {
    await this.init();
    if (this.isNative && this.dbConnection) {
      const res = await this.dbConnection.query(
        'SELECT * FROM cases ORDER BY created_at DESC;'
      );
      return (res.values as LocalCase[]) || [];
    }
    return Array.from(this.webStorage.cases.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getCaseById(id: string): Promise<LocalCase | null> {
    await this.init();
    if (this.isNative && this.dbConnection) {
      const res = await this.dbConnection.query(
        'SELECT * FROM cases WHERE id = ?;',
        [id]
      );
      return (res.values && res.values[0] as LocalCase) || null;
    }
    return this.webStorage.cases.get(id) || null;
  }

  async insertCase(item: LocalCase): Promise<void> {
    await this.init();
    if (this.isNative && this.dbConnection) {
      const sql = `
        INSERT OR REPLACE INTO cases (
          id, case_number, title, client_id, client_name, court, circuit, stage, status, type, fees, paid_amount, synced, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await this.dbConnection.run(sql, [
        item.id,
        item.case_number,
        item.title,
        item.client_id || null,
        item.client_name || null,
        item.court || null,
        item.circuit || null,
        item.stage || null,
        item.status || 'active',
        item.type || 'civil',
        item.fees || 0,
        item.paid_amount || 0,
        item.synced,
        item.created_at,
        item.updated_at,
      ]);
    } else {
      this.webStorage.cases.set(item.id, item);
      this.persistWebStorage('cases');
    }
  }

  async markCaseSynced(id: string): Promise<void> {
    await this.init();
    const now = new Date().toISOString();
    if (this.isNative && this.dbConnection) {
      await this.dbConnection.run(
        'UPDATE cases SET synced = 1, updated_at = ? WHERE id = ?;',
        [now, id]
      );
    } else {
      const existing = this.webStorage.cases.get(id);
      if (existing) {
        existing.synced = 1;
        existing.updated_at = now;
        this.persistWebStorage('cases');
      }
    }
  }

  // ==========================================
  // CLIENTS REPOSITORY (LOCAL-FIRST)
  // ==========================================

  async getAllClients(): Promise<LocalClient[]> {
    await this.init();
    if (this.isNative && this.dbConnection) {
      const res = await this.dbConnection.query(
        'SELECT * FROM clients ORDER BY name ASC;'
      );
      return (res.values as LocalClient[]) || [];
    }
    return Array.from(this.webStorage.clients.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  async insertClient(item: LocalClient): Promise<void> {
    await this.init();
    if (this.isNative && this.dbConnection) {
      const sql = `
        INSERT OR REPLACE INTO clients (
          id, name, phone, email, national_id, type, address, notes, synced, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await this.dbConnection.run(sql, [
        item.id,
        item.name,
        item.phone || null,
        item.email || null,
        item.national_id || null,
        item.type || 'individual',
        item.address || null,
        item.notes || null,
        item.synced,
        item.created_at,
        item.updated_at,
      ]);
    } else {
      this.webStorage.clients.set(item.id, item);
      this.persistWebStorage('clients');
    }
  }

  async markClientSynced(id: string): Promise<void> {
    await this.init();
    const now = new Date().toISOString();
    if (this.isNative && this.dbConnection) {
      await this.dbConnection.run(
        'UPDATE clients SET synced = 1, updated_at = ? WHERE id = ?;',
        [now, id]
      );
    } else {
      const existing = this.webStorage.clients.get(id);
      if (existing) {
        existing.synced = 1;
        existing.updated_at = now;
        this.persistWebStorage('clients');
      }
    }
  }

  // ==========================================
  // SYNC QUEUE OPERATIONS
  // ==========================================

  /**
   * Enqueues a remote API mutation to be synced when connected
   */
  async addToSyncQueue(item: Omit<SyncQueueItem, 'retry_count' | 'status'>): Promise<SyncQueueItem> {
    await this.init();
    const queueItem: SyncQueueItem = {
      ...item,
      retry_count: 0,
      status: 'pending',
      updated_at: item.created_at,
    };

    if (this.isNative && this.dbConnection) {
      const sql = `
        INSERT INTO sync_queue (
          id, endpoint, method, payload, headers, retry_count, status, last_error, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await this.dbConnection.run(sql, [
        queueItem.id,
        queueItem.endpoint,
        queueItem.method,
        queueItem.payload,
        queueItem.headers || null,
        queueItem.retry_count,
        queueItem.status,
        queueItem.last_error || null,
        queueItem.created_at,
        queueItem.updated_at,
      ]);
    } else {
      this.webStorage.sync_queue.set(queueItem.id, queueItem);
      this.persistWebStorage('sync_queue');
    }

    return queueItem;
  }

  /**
   * Retrieves pending items ready to be synced (status = pending and retry_count < 3)
   */
  async getPendingQueueItems(): Promise<SyncQueueItem[]> {
    await this.init();
    if (this.isNative && this.dbConnection) {
      const res = await this.dbConnection.query(
        "SELECT * FROM sync_queue WHERE status = 'pending' AND retry_count < 3 ORDER BY created_at ASC;"
      );
      return (res.values as SyncQueueItem[]) || [];
    }
    return Array.from(this.webStorage.sync_queue.values())
      .filter((item) => item.status === 'pending' && item.retry_count < 3)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  }

  /**
   * Updates an item's status, retry count, or error message
   */
  async updateQueueItem(
    id: string,
    updates: Partial<Pick<SyncQueueItem, 'status' | 'retry_count' | 'last_error'>>
  ): Promise<void> {
    await this.init();
    const now = new Date().toISOString();

    if (this.isNative && this.dbConnection) {
      const clauses: string[] = ['updated_at = ?'];
      const values: any[] = [now];

      if (updates.status !== undefined) {
        clauses.push('status = ?');
        values.push(updates.status);
      }
      if (updates.retry_count !== undefined) {
        clauses.push('retry_count = ?');
        values.push(updates.retry_count);
      }
      if (updates.last_error !== undefined) {
        clauses.push('last_error = ?');
        values.push(updates.last_error);
      }
      values.push(id);

      await this.dbConnection.run(
        `UPDATE sync_queue SET ${clauses.join(', ')} WHERE id = ?;`,
        values
      );
    } else {
      const existing = this.webStorage.sync_queue.get(id);
      if (existing) {
        if (updates.status !== undefined) existing.status = updates.status;
        if (updates.retry_count !== undefined)
          existing.retry_count = updates.retry_count;
        if (updates.last_error !== undefined)
          existing.last_error = updates.last_error;
        existing.updated_at = now;
        this.persistWebStorage('sync_queue');
      }
    }
  }

  /**
   * Deletes a completed queue item
   */
  async deleteQueueItem(id: string): Promise<void> {
    await this.init();
    if (this.isNative && this.dbConnection) {
      await this.dbConnection.run('DELETE FROM sync_queue WHERE id = ?;', [id]);
    } else {
      this.webStorage.sync_queue.delete(id);
      this.persistWebStorage('sync_queue');
    }
  }

  /**
   * Gets counts of pending and failed items
   */
  async getQueueCounts(): Promise<{ pending: number; failed: number }> {
    await this.init();
    if (this.isNative && this.dbConnection) {
      const pRes = await this.dbConnection.query(
        "SELECT COUNT(*) as count FROM sync_queue WHERE status = 'pending' AND retry_count < 3;"
      );
      const fRes = await this.dbConnection.query(
        "SELECT COUNT(*) as count FROM sync_queue WHERE status = 'failed' OR retry_count >= 3;"
      );
      return {
        pending: pRes.values ? pRes.values[0].count : 0,
        failed: fRes.values ? fRes.values[0].count : 0,
      };
    }

    let pending = 0;
    let failed = 0;
    this.webStorage.sync_queue.forEach((item) => {
      if (item.status === 'pending' && item.retry_count < 3) pending++;
      if (item.status === 'failed' || item.retry_count >= 3) failed++;
    });
    return { pending, failed };
  }
}

// Export singleton database instance
export const localDb = new DatabaseService();
