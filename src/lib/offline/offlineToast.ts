/**
 * Native Capacitor Toast Helper
 * Legal SaaS "Siyaq" - Capacitor v6
 *
 * Utilizes @capacitor/toast on iOS/Android devices with automatic
 * graceful fallback to DOM toast in Web environments.
 */

import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

export async function showOfflineToast(
  message: string = 'Saved offline. Will sync when connected.',
  duration: 'short' | 'long' = 'long'
): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Toast.show({
        text: message,
        duration: duration,
        position: 'bottom',
      });
    } else {
      // In web browser or preview mode, display native toast or dispatch custom event
      await Toast.show({
        text: message,
        duration: duration,
        position: 'bottom',
      }).catch(() => {
        // Fallback alert/notification in browser console or DOM if plugin not available
        console.log(`[Toast] ${message}`);
      });
    }
  } catch (error) {
    console.warn('[showOfflineToast] Falling back to standard notification:', error);
  }
}
