/**
 * Native Network Monitoring Custom Hook (`useCapacitorNetwork`)
 * Legal SaaS "Siyaq" - Capacitor v6
 *
 * Utilizes @capacitor/network to accurately detect real-time
 * connectivity transitions (Online/Offline, WiFi, Cellular)
 * across iOS, Android, and Web platforms.
 */

import { useState, useEffect, useCallback } from 'react';
import { Network, ConnectionStatus, ConnectionType } from '@capacitor/network';

export interface CapacitorNetworkState {
  isConnected: boolean;
  connectionType: ConnectionType;
  isLoading: boolean;
  checkStatus: () => Promise<ConnectionStatus>;
}

export function useCapacitorNetwork(): CapacitorNetworkState {
  const [isConnected, setIsConnected] = useState<boolean>(navigator.onLine ?? true);
  const [connectionType, setConnectionType] = useState<ConnectionType>('unknown');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch current connectivity status
  const checkStatus = useCallback(async (): Promise<ConnectionStatus> => {
    try {
      const status = await Network.getStatus();
      setIsConnected(status.connected);
      setConnectionType(status.connectionType);
      setIsLoading(false);
      return status;
    } catch (error) {
      console.warn('[useCapacitorNetwork] Failed to get network status, using browser fallback:', error);
      const fallbackStatus: ConnectionStatus = {
        connected: navigator.onLine,
        connectionType: 'unknown',
      };
      setIsConnected(fallbackStatus.connected);
      setConnectionType(fallbackStatus.connectionType);
      setIsLoading(false);
      return fallbackStatus;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let listenerHandle: { remove: () => Promise<void> } | null = null;

    const setupListener = async () => {
      // 1. Get initial status
      await checkStatus();

      // 2. Register native network listener
      try {
        const handle = await Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
          if (!isMounted) return;
          console.log(`[useCapacitorNetwork] Network changed: connected=${status.connected}, type=${status.connectionType}`);
          setIsConnected(status.connected);
          setConnectionType(status.connectionType);
        });
        listenerHandle = handle;
      } catch (error) {
        console.warn('[useCapacitorNetwork] Error registering Network listener:', error);

        // Fallback for plain browser events
        const handleOnline = () => {
          if (isMounted) {
            setIsConnected(true);
            setConnectionType('wifi');
          }
        };
        const handleOffline = () => {
          if (isMounted) {
            setIsConnected(false);
            setConnectionType('none');
          }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    };

    setupListener();

    return () => {
      isMounted = false;
      if (listenerHandle) {
        listenerHandle.remove().catch((err) => {
          console.error('[useCapacitorNetwork] Cleanup error:', err);
        });
      }
    };
  }, [checkStatus]);

  return {
    isConnected,
    connectionType,
    isLoading,
    checkStatus,
  };
}
