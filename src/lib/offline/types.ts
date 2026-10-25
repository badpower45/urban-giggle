/**
 * Offline-First & Sync Engine Type Definitions
 * Legal SaaS "Siyaq" - Capacitor v6 Mobile Architecture
 */

export type SyncItemStatus = 'pending' | 'syncing' | 'completed' | 'failed';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface LocalCase {
  id: string;
  case_number: string;
  title: string;
  client_id?: string;
  client_name?: string;
  court?: string;
  circuit?: string;
  stage?: string;
  status?: string;
  type?: string;
  fees?: number;
  paid_amount?: number;
  synced: number; // 0 = not synced, 1 = synced
  created_at: string;
  updated_at: string;
}

export interface LocalClient {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  national_id?: string;
  type?: 'individual' | 'company';
  address?: string;
  notes?: string;
  synced: number; // 0 = not synced, 1 = synced
  created_at: string;
  updated_at: string;
}

export interface SyncQueueItem {
  id: string;
  endpoint: string;
  method: HttpMethod;
  payload: string; // JSON stringified data
  headers?: string; // JSON stringified headers
  retry_count: number;
  status: SyncItemStatus;
  last_error?: string;
  created_at: string;
  updated_at: string;
}

export interface NetworkConnectionState {
  isConnected: boolean;
  connectionType: 'wifi' | 'cellular' | 'none' | 'unknown';
}

export interface SyncEngineStats {
  isSyncing: boolean;
  pendingCount: number;
  failedCount: number;
  lastSyncTime: string | null;
  lastError: string | null;
}
