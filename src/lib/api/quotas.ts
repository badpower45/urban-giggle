import { appStore } from './store';
import { platformStorage } from '../platformStore';
import { logAuditEvent } from './audit';

export interface QuotaStatus {
  planId: 'individual' | 'office' | 'enterprise';
  planName: string;
  subscriptionStatus: 'active' | 'trial' | 'past_due' | 'suspended';
  isSuspended: boolean;
  cases: {
    current: number;
    max: number;
    isExceeded: boolean;
    percentage: number;
  };
  users: {
    current: number;
    max: number;
    isExceeded: boolean;
    percentage: number;
  };
  storage: {
    currentMb: number;
    maxMb: number;
    isExceeded: boolean;
    percentage: number;
  };
}

const PLAN_QUOTAS = {
  individual: {
    name: 'باقة المحامي الفردي',
    maxUsers: 2,
    maxCases: 30,
    maxStorageMb: 5 * 1024,
  },
  office: {
    name: 'باقة المكاتب المتوسطة',
    maxUsers: 10,
    maxCases: 250,
    maxStorageMb: 50 * 1024,
  },
  enterprise: {
    name: 'باقة المكاتب الكبرى',
    maxUsers: 30,
    maxCases: 10000,
    maxStorageMb: 150 * 1024,
  },
};

export const getFirmQuotaStatus = (): QuotaStatus => {
  const state = appStore.getState();
  const firms = platformStorage.getFirms();
  const currentFirm =
    firms.find((f) => f.id === state.firm?.id || f.ownerEmail?.toLowerCase() === state.user?.email?.toLowerCase()) ||
    firms[0] || {
      subscriptionPlan: 'office',
      subscriptionStatus: 'active',
      casesCount: state.cases?.length || 0,
      usersCount: 1,
      storageUsedMb: 250,
    };

  const planId = (currentFirm.subscriptionPlan as 'individual' | 'office' | 'enterprise') || 'office';
  const planInfo = PLAN_QUOTAS[planId] || PLAN_QUOTAS.office;
  const subStatus = (currentFirm.subscriptionStatus as any) || 'active';
  const isSuspended = subStatus === 'suspended' || subStatus === 'past_due';

  const casesCount = state.cases?.length || 0;
  const usersCount = currentFirm.usersCount || 1;
  const storageUsedMb = currentFirm.storageUsedMb || 150;

  return {
    planId,
    planName: planInfo.name,
    subscriptionStatus: subStatus,
    isSuspended,
    cases: {
      current: casesCount,
      max: planInfo.maxCases,
      isExceeded: casesCount >= planInfo.maxCases,
      percentage: Math.min(100, Math.round((casesCount / planInfo.maxCases) * 100)),
    },
    users: {
      current: usersCount,
      max: planInfo.maxUsers,
      isExceeded: usersCount >= planInfo.maxUsers,
      percentage: Math.min(100, Math.round((usersCount / planInfo.maxUsers) * 100)),
    },
    storage: {
      currentMb: storageUsedMb,
      maxMb: planInfo.maxStorageMb,
      isExceeded: storageUsedMb >= planInfo.maxStorageMb,
      percentage: Math.min(100, Math.round((storageUsedMb / planInfo.maxStorageMb) * 100)),
    },
  };
};

export const canPerformAction = (
  action: 'create_case' | 'create_user' | 'upload_document'
): { allowed: boolean; reason?: string } => {
  const quota = getFirmQuotaStatus();

  if (quota.isSuspended) {
    return {
      allowed: false,
      reason:
        'حساب المكتب معلق أو متأخر السداد حالياً. يرجى سداد الاشتراك أو التواصل مع الإدارة لإتاحة قيد وتعديل العمليات.',
    };
  }

  if (action === 'create_case' && quota.cases.isExceeded) {
    return {
      allowed: false,
      reason: `لقد وصلت للحد الأقصى المسموح به للقضايا في ${quota.planName} (${quota.cases.current} من ${quota.cases.max} قضية). يرجى ترقية الباقة لإضافة قضايا جديدة.`,
    };
  }

  if (action === 'create_user' && quota.users.isExceeded) {
    return {
      allowed: false,
      reason: `لقد وصلت للحد الأقصى لعدد المستخدمين والمحامين في ${quota.planName} (${quota.users.max} مستخدمين). يرجى الترقية لإضافة أعضاء جدد.`,
    };
  }

  if (action === 'upload_document' && quota.storage.isExceeded) {
    return {
      allowed: false,
      reason: `لقد استنفذت مساحة التخزين السحابي لباقتك (${Math.round(quota.storage.maxMb / 1024)} جيجابايت).`,
    };
  }

  return { allowed: true };
};

export const upgradeFirmPlan = (newPlanId: 'individual' | 'office' | 'enterprise') => {
  const state = appStore.getState();
  const firms = platformStorage.getFirms();
  const targetFirm =
    firms.find((f) => f.id === state.firm?.id || f.ownerEmail?.toLowerCase() === state.user?.email?.toLowerCase()) ||
    firms[0];

  if (targetFirm) {
    platformStorage.updateFirmPlan(targetFirm.id, newPlanId);
    platformStorage.toggleFirmStatus(targetFirm.id, 'active');
  }

  const planInfo = PLAN_QUOTAS[newPlanId];
  logAuditEvent({
    action_type: 'ترقية باقة الاشتراك',
    description: `تمت ترقية باقة اشتراك المكتب بنجاح إلى "${planInfo.name}".`,
    status: 'success',
  });

  window.dispatchEvent(new CustomEvent('firm-subscription-updated'));
  return planInfo;
};
