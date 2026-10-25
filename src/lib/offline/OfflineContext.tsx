/**
 * React Offline & Local-First Context Provider
 * Legal SaaS "Siyaq" - Capacitor v6
 *
 * Bridges the SQLite database, Native Network status, and Sync Engine
 * to provide a unified reactive interface for React components.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useCapacitorNetwork } from './useCapacitorNetwork';
import { syncEngine } from './syncEngine';
import { localDb } from './db';
import { showOfflineToast } from './offlineToast';
import { LocalCase, LocalClient, SyncEngineStats } from './types';

interface OfflineContextType {
  isOnline: boolean;
  connectionType: string;
  isSyncing: boolean;
  pendingCount: number;
  failedCount: number;
  lastSyncTime: string | null;
  syncNow: () => Promise<void>;
  createCaseOffline: (caseData: Partial<LocalCase>) => Promise<LocalCase>;
  createClientOffline: (clientData: Partial<LocalClient>) => Promise<LocalClient>;
  localCases: LocalCase[];
  localClients: LocalClient[];
  refreshLocalData: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | null>(null);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected, connectionType } = useCapacitorNetwork();
  const [engineStats, setEngineStats] = useState<SyncEngineStats>(syncEngine.getStats());
  const [localCases, setLocalCases] = useState<LocalCase[]>([]);
  const [localClients, setLocalClients] = useState<LocalClient[]>([]);

  // Refresh cases and clients from local SQLite
  const refreshLocalData = useCallback(async () => {
    try {
      const cases = await localDb.getAllCases();
      const clients = await localDb.getAllClients();
      setLocalCases(cases);
      setLocalClients(clients);
    } catch (e) {
      console.error('[OfflineProvider] Error fetching local records:', e);
    }
  }, []);

  // Initialize DB and start Sync Engine once on mount
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const bootstrap = async () => {
      await localDb.init();
      await refreshLocalData();
      await syncEngine.start();

      unsubscribe = syncEngine.subscribe((stats) => {
        setEngineStats(stats);
        // If sync just completed, refresh local records
        refreshLocalData();
      });
    };

    bootstrap();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [refreshLocalData]);

  // Trigger manual sync
  const syncNow = useCallback(async () => {
    await syncEngine.syncNow();
    await refreshLocalData();
  }, [refreshLocalData]);

  /**
   * Saves a new case locally into SQLite and enqueues API mutation if offline
   */
  const createCaseOffline = useCallback(
    async (caseData: Partial<LocalCase>): Promise<LocalCase> => {
      const now = new Date().toISOString();
      const newId = caseData.id || `case_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const isOfflineAction = !isConnected;

      const newCase: LocalCase = {
        id: newId,
        case_number: caseData.case_number || `قضية-${Math.floor(1000 + Math.random() * 9000)}/2026`,
        title: caseData.title || 'قضية جديدة',
        client_id: caseData.client_id,
        client_name: caseData.client_name,
        court: caseData.court || 'محكمة استئناف القاهرة',
        circuit: caseData.circuit || 'الدائرة 5 مدني',
        stage: caseData.stage || 'ابتدائي',
        status: caseData.status || 'active',
        type: caseData.type || 'civil',
        fees: caseData.fees || 0,
        paid_amount: caseData.paid_amount || 0,
        synced: isOfflineAction ? 0 : 1,
        created_at: caseData.created_at || now,
        updated_at: now,
      };

      // 1. Save to local SQLite database (Local-First Guarantee)
      await localDb.insertCase(newCase);

      // 2. If offline, enqueue into sync_queue
      if (isOfflineAction) {
        await localDb.addToSyncQueue({
          id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          endpoint: '/api/cases',
          method: 'POST',
          payload: JSON.stringify(newCase),
          created_at: now,
          updated_at: now,
        });

        await syncEngine.refreshStats();

        // 3. Trigger native Capacitor Toast notification
        await showOfflineToast('Saved offline. Will sync when connected.');
      }

      await refreshLocalData();
      return newCase;
    },
    [isConnected, refreshLocalData]
  );

  /**
   * Saves a new client locally into SQLite and enqueues API mutation if offline
   */
  const createClientOffline = useCallback(
    async (clientData: Partial<LocalClient>): Promise<LocalClient> => {
      const now = new Date().toISOString();
      const newId = clientData.id || `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const isOfflineAction = !isConnected;

      const newClient: LocalClient = {
        id: newId,
        name: clientData.name || 'موكل جديد',
        phone: clientData.phone,
        email: clientData.email,
        national_id: clientData.national_id,
        type: clientData.type || 'individual',
        address: clientData.address,
        notes: clientData.notes,
        synced: isOfflineAction ? 0 : 1,
        created_at: clientData.created_at || now,
        updated_at: now,
      };

      // 1. Save to local SQLite database
      await localDb.insertClient(newClient);

      // 2. If offline, enqueue into sync_queue
      if (isOfflineAction) {
        await localDb.addToSyncQueue({
          id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          endpoint: '/api/clients',
          method: 'POST',
          payload: JSON.stringify(newClient),
          created_at: now,
          updated_at: now,
        });

        await syncEngine.refreshStats();

        // 3. Trigger native Capacitor Toast notification
        await showOfflineToast('Saved offline. Will sync when connected.');
      }

      await refreshLocalData();
      return newClient;
    },
    [isConnected, refreshLocalData]
  );

  return (
    <OfflineContext.Provider
      value={{
        isOnline: isConnected,
        connectionType,
        isSyncing: engineStats.isSyncing,
        pendingCount: engineStats.pendingCount,
        failedCount: engineStats.failedCount,
        lastSyncTime: engineStats.lastSyncTime,
        syncNow,
        createCaseOffline,
        createClientOffline,
        localCases,
        localClients,
        refreshLocalData,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
