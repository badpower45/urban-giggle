/**
 * Offline Sync Engine
 * Legal SaaS "Siyaq" - Capacitor v6 Mobile Architecture
 *
 * Automatically synchronizes queued offline mutations when:
 * 1. Network connectivity is restored (@capacitor/network)
 * 2. App returns to the foreground (@capacitor/app)
 *
 * Implements non-blocking queue processing with 3-retry threshold.
 */

import { Network } from '@capacitor/network';
import { App, AppState } from '@capacitor/app';
import { localDb } from './db';
import { SyncQueueItem, SyncEngineStats } from './types';

// API Base URL - reads from environment or defaults to current origin / api
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

type SyncListener = (stats: SyncEngineStats) => void;

class SyncEngineService {
  private isSyncing = false;
  private isStarted = false;
  private listeners: Set<SyncListener> = new Set();
  private stats: SyncEngineStats = {
    isSyncing: false,
    pendingCount: 0,
    failedCount: 0,
    lastSyncTime: null,
    lastError: null,
  };

  /**
   * Initializes the Sync Engine and attaches native listeners:
   * 1. @capacitor/network (networkStatusChange)
   * 2. @capacitor/app (appStateChange)
   */
  async start(): Promise<void> {
    if (this.isStarted) return;
    this.isStarted = true;

    console.log('[SyncEngine] Starting offline sync engine...');
    await this.refreshStats();

    // Trigger 1: Network Connection Restored
    try {
      await Network.addListener('networkStatusChange', async (status) => {
        console.log(`[SyncEngine] Network status changed: connected=${status.connected}`);
        if (status.connected) {
          console.log('[SyncEngine] Connection restored! Triggering sync queue...');
          await this.syncNow();
        }
      });
    } catch (e) {
      console.warn('[SyncEngine] Network listener error, falling back to window events:', e);
      window.addEventListener('online', () => {
        console.log('[SyncEngine] Browser online event detected. Triggering sync...');
        this.syncNow();
      });
    }

    // Trigger 2: App Returned to Foreground
    try {
      await App.addListener('appStateChange', async (state: AppState) => {
        console.log(`[SyncEngine] App state changed: isActive=${state.isActive}`);
        if (state.isActive) {
          const net = await Network.getStatus();
          if (net.connected) {
            console.log('[SyncEngine] App active and connected. Triggering background sync...');
            await this.syncNow();
          }
        }
      });
    } catch (e) {
      console.warn('[SyncEngine] App state listener error, falling back to visibilitychange:', e);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && navigator.onLine) {
          this.syncNow();
        }
      });
    }

    // Initial sync check if already online
    const initialNetwork = await Network.getStatus().catch(() => ({ connected: navigator.onLine }));
    if (initialNetwork.connected) {
      this.syncNow();
    }
  }

  /**
   * Main sync function: Iterates through pending queue items and pushes them to remote API
   */
  async syncNow(): Promise<void> {
    if (this.isSyncing) {
      console.log('[SyncEngine] Sync already in progress, skipping duplicate call.');
      return;
    }

    try {
      const net = await Network.getStatus().catch(() => ({ connected: navigator.onLine }));
      if (!net.connected) {
        console.log('[SyncEngine] Device is offline. Sync postponed.');
        return;
      }

      this.isSyncing = true;
      this.notifyListeners({ isSyncing: true });

      const pendingItems = await localDb.getPendingQueueItems();
      console.log(`[SyncEngine] Found ${pendingItems.length} pending items to sync.`);

      for (const item of pendingItems) {
        await this.processQueueItem(item);
      }

      const now = new Date().toISOString();
      await this.refreshStats();
      this.notifyListeners({
        isSyncing: false,
        lastSyncTime: now,
      });
    } catch (error: any) {
      console.error('[SyncEngine] Fatal error during sync cycle:', error);
      this.notifyListeners({
        isSyncing: false,
        lastError: error?.message || 'Sync failed',
      });
    } finally {
      this.isSyncing = false;
      this.notifyListeners({ isSyncing: false });
    }
  }

  /**
   * Executes a single queued API mutation against the remote backend
   */
  private async processQueueItem(item: SyncQueueItem): Promise<void> {
    console.log(`[SyncEngine] Syncing item ${item.id}: ${item.method} ${item.endpoint}`);

    // Mark status as syncing
    await localDb.updateQueueItem(item.id, { status: 'syncing' });

    try {
      // Build request
      const url = item.endpoint.startsWith('http')
        ? item.endpoint
        : `${API_BASE_URL}${item.endpoint}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      if (item.headers) {
        try {
          Object.assign(headers, JSON.parse(item.headers));
        } catch {
          // ignore parsing error
        }
      }

      let responseStatus = 200;
      let isSuccess = true;
      let responseBodyText = '';

      // Execute HTTP request
      try {
        const response = await fetch(url, {
          method: item.method,
          headers,
          body: item.method !== 'GET' ? item.payload : undefined,
        });
        responseStatus = response.status;
        isSuccess = response.ok;
        responseBodyText = await response.text();
      } catch (fetchError: any) {
        // Network connection dropped or DNS failure during transmission
        isSuccess = false;
        responseStatus = 0;
        responseBodyText = fetchError?.message || 'Network transport failure';
      }

      if (isSuccess) {
        console.log(`[SyncEngine] Successfully pushed ${item.id} (${item.endpoint})`);

        // If this mutation belongs to a case or client, update its synced flag to 1
        try {
          const parsedPayload = JSON.parse(item.payload);
          if (parsedPayload?.id) {
            if (item.endpoint.includes('/cases')) {
              await localDb.markCaseSynced(parsedPayload.id);
            } else if (item.endpoint.includes('/clients')) {
              await localDb.markClientSynced(parsedPayload.id);
            }
          }
        } catch {
          // payload was not JSON object with id
        }

        // Delete completed item from queue
        await localDb.deleteQueueItem(item.id);
      } else {
        // Error handling & retry policy
        const newRetryCount = item.retry_count + 1;
        const errorMsg = `HTTP ${responseStatus}: ${responseBodyText.slice(0, 120)}`;

        console.warn(
          `[SyncEngine] Mutation ${item.id} failed (attempt ${newRetryCount}/3): ${errorMsg}`
        );

        if (newRetryCount >= 3) {
          // Max retries reached: Mark as permanently 'failed' but DO NOT block subsequent items
          console.error(
            `[SyncEngine] Item ${item.id} exceeded 3 retries. Marking as 'failed'. Queue will continue.`
          );
          await localDb.updateQueueItem(item.id, {
            status: 'failed',
            retry_count: newRetryCount,
            last_error: errorMsg,
          });
        } else {
          // Reset to 'pending' with incremented retry count for next sync attempt
          await localDb.updateQueueItem(item.id, {
            status: 'pending',
            retry_count: newRetryCount,
            last_error: errorMsg,
          });
        }
      }
    } catch (unexpectedError: any) {
      console.error(`[SyncEngine] Unexpected failure on item ${item.id}:`, unexpectedError);
      const newRetryCount = item.retry_count + 1;
      await localDb.updateQueueItem(item.id, {
        status: newRetryCount >= 3 ? 'failed' : 'pending',
        retry_count: newRetryCount,
        last_error: unexpectedError?.message || 'Unexpected processing error',
      });
    }
  }

  /**
   * Refreshes internal stats (pending and failed counts)
   */
  async refreshStats(): Promise<SyncEngineStats> {
    const counts = await localDb.getQueueCounts();
    this.stats = {
      ...this.stats,
      pendingCount: counts.pending,
      failedCount: counts.failed,
    };
    this.notifyListeners();
    return this.stats;
  }

  /**
   * Subscribe to sync engine status updates
   */
  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.stats);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getStats(): SyncEngineStats {
    return { ...this.stats };
  }

  private notifyListeners(partial?: Partial<SyncEngineStats>) {
    if (partial) {
      this.stats = { ...this.stats, ...partial };
    }
    this.listeners.forEach((listener) => {
      try {
        listener(this.stats);
      } catch (e) {
        console.error('[SyncEngine] Listener notification error:', e);
      }
    });
  }
}

export const syncEngine = new SyncEngineService();
