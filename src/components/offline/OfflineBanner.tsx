/**
 * Offline Mode & Sync Status Top Banner
 * Legal SaaS "Siyaq" - Capacitor v6
 *
 * Displays an elegant visual indicator when the app is offline
 * or when unsynchronized local SQLite mutations are pending sync.
 */

import React from 'react';
import { WifiOff, RefreshCw, AlertCircle, Database, CheckCircle2 } from 'lucide-react';
import { useOffline } from '../../lib/offline';

export const OfflineBanner: React.FC = () => {
  const { isOnline, isSyncing, pendingCount, failedCount, syncNow, connectionType } = useOffline();

  // If online and nothing is pending or failed, hide banner
  if (isOnline && pendingCount === 0 && failedCount === 0 && !isSyncing) {
    return null;
  }

  // 1. Device is completely offline
  if (!isOnline) {
    return (
      <div
        className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-amber-950 text-xs transition-all duration-300 animate-in slide-in-from-top-2 select-none"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>

            <div className="flex items-center gap-1.5 font-bold">
              <WifiOff className="w-3.5 h-3.5 text-amber-700" />
              <span>وضع عدم الاتصال بالإنترنت (Offline Mode)</span>
            </div>

            <span className="hidden sm:inline text-amber-800/80">
              • البيانات تُحفظ محلياً في قاعدة بيانات الجهاز (SQLite)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold text-[11px]">
                <Database className="w-3 h-3" />
                <span>{pendingCount} تغييرات بانتظار المزامنة</span>
              </span>
            )}
            <span className="text-[10px] text-amber-700/70 font-mono">
              نوع الشبكة: {connectionType}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Device is online, but syncing or has pending items
  return (
    <div
      className="w-full bg-slate-900 text-white border-b border-slate-800 px-4 py-1.5 text-xs transition-all duration-300 animate-in slide-in-from-top-1 select-none"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isSyncing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-secondary animate-spin" />
              <span className="font-semibold text-slate-200">
                جاري مزامنة التغييرات المحلية مع الخادم السحابي... ({pendingCount} متبقي)
              </span>
            </>
          ) : pendingCount > 0 ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-slate-300">
                الاتصال متوفر — يوجد {pendingCount} تعديل محلي جاهز للمزامنة.
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium text-amber-200">
                فشلت مزامنة {failedCount} عناصر بعد 3 محاولات.
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isSyncing && (
            <button
              type="button"
              onClick={() => syncNow()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-primary font-bold text-[11px] hover:bg-amber-400 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>مزامنة فورية الآن</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
