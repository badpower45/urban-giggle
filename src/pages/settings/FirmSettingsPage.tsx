import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  ShieldCheck,
  Link as LinkIcon,
  Copy,
  Check,
  Database,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { Firm, FirmMember, FirmRole } from "../../types";
import { CountBadge } from "../../components/common/CountBadge";
import { ViewToggle } from "../../components/common/ViewToggle";
import { useToast } from "../../components/common/Toast";

export const FirmSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"general" | "members" | "roles" | "invites" | "database">("general");
  const [firm, setFirm] = useState<Firm | null>(null);
  const [members, setMembers] = useState<FirmMember[]>([]);
  const [roles, setRoles] = useState<FirmRole[]>([]);
  const [copied, setCopied] = useState(false);
  const [memberViewMode, setMemberViewMode] = useState<"grid" | "table">("table");

  // Firm Edit State
  const [firmName, setFirmName] = useState("");
  const [firmPhone, setFirmPhone] = useState("01012345678");
  const [firmAddress, setFirmAddress] = useState("مدينة نصر، القاهرة");

  // Database Tab State
  const [testingDb, setTestingDb] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; latencyMs: number; error?: string; tables?: any } | null>(null);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [seedingCloud, setSeedingCloud] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const f = await apiClient.getFirm();
      setFirm(f);
      if (f) setFirmName(f.name);
      const m = await apiClient.getFirmMembers();
      setMembers(m);
      const r = await apiClient.getFirmRoles();
      setRoles(r);
    } catch (err) {
      console.error(err);
    }
  };

  const inviteLink = "https://app.baseera.legal/join?token=862621c64756a53000b91dbd2d5d051e";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestDatabase = async () => {
    setTestingDb(true);
    try {
      const res = await apiClient.testDatabaseConnection();
      setTestResult(res);
      if (res.ok) {
        showToast(`تم الاتصال بنجاح بـ Supabase (${res.latencyMs}ms)`, "success");
      } else {
        showToast(res.error || "فشل الاتصال بقاعدة البيانات", "error");
      }
    } catch (err: any) {
      setTestResult({ ok: false, latencyMs: 0, error: err.message });
      showToast("خطأ أثناء اختبار الاتصال", "error");
    } finally {
      setTestingDb(false);
    }
  };

  const handleSyncCloud = async () => {
    setSyncingCloud(true);
    try {
      const res = await apiClient.syncWithCloud();
      if (res.success) {
        showToast(`تمت مزامنة البيانات السحابية بنجاح (${res.syncedCount} عنصر)`, "success");
      } else {
        showToast(res.error || "فشلت المزامنة السحابية", "error");
      }
    } catch (err: any) {
      showToast(err.message || "حدث خطأ أثناء المزامنة", "error");
    } finally {
      setSyncingCloud(false);
    }
  };

  const handleSeedCloud = async () => {
    setSeedingCloud(true);
    try {
      const res = await apiClient.seedCloudData();
      if (res.success) {
        showToast(`تم زرع البيانات التجريبية في السحابة بنجاح (${res.count} عنصر)`, "success");
      } else {
        showToast(res.error || "فشل زرع البيانات في السحابة", "error");
      }
    } catch (err: any) {
      showToast(err.message || "حدث خطأ أثناء زرع البيانات", "error");
    } finally {
      setSeedingCloud(false);
    }
  };

  const tabs = [
    { id: "general" as const, label: "بيانات المكتب العامة", icon: Building2 },
    { id: "members" as const, label: "فريق العمل والأعضاء", icon: Users },
    { id: "roles" as const, label: "الأدوار والصلاحيات", icon: ShieldCheck },
    { id: "invites" as const, label: "روابط الدعوة", icon: LinkIcon },
    { id: "database" as const, label: "قاعدة البيانات والسحابة", icon: Database },
  ];

  const isCloud = apiClient.isCloudConfigured();

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="font-headline text-primary text-xl sm:text-2xl font-semibold">
          إعدادات المكتب وفريق العمل
        </h1>
        <p className="text-xs sm:text-sm text-tertiary mt-0.5">
          إدارة هوية الكيان القانوني، صلاحيات المحامين، وربط قاعدة البيانات السحابية (Supabase)
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-tertiary hover:text-primary hover:border-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === "members" && <CountBadge count={members.length} />}
              {tab.id === "database" && (
                <span className={`w-2 h-2 rounded-full ${isCloud ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: General */}
      {activeTab === "general" && (
        <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border bg-neutral p-1 flex items-center justify-center shrink-0">
              <img src="/logo.webp" alt="logo" className="h-full w-full object-contain" />
            </div>
            <div className="space-y-1">
              <h3 className="font-headline font-bold text-base text-primary">
                {firmName || "مكتب المحاماة"}
              </h3>
              <p className="text-xs text-tertiary">
                كود تعريف المكتب: <span className="font-mono text-primary font-bold">{firm?.id || "01a08460"}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">اسم المكتب / الكيان القانوني</label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">رقم الهاتف الرسمي</label>
              <input
                type="text"
                value={firmPhone}
                onChange={(e) => setFirmPhone(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-primary block mb-1">عنوان المقر الرئيسي</label>
              <input
                type="text"
                value={firmAddress}
                onChange={(e) => setFirmAddress(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Members */}
      {activeTab === "members" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-semibold text-sm text-primary">المحامون وفريق العمل</h2>
            <ViewToggle viewMode={memberViewMode} onChange={setMemberViewMode} />
          </div>

          {memberViewMode === "table" ? (
            <div className="rounded-xl border border-border bg-white overflow-hidden shadow-xs">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-neutral/60 text-tertiary text-[11px] font-semibold uppercase">
                    <th className="px-4 py-3 text-start">المحامي / العضو</th>
                    <th className="px-4 py-3 text-start">البريد الإلكتروني</th>
                    <th className="px-4 py-3 text-start">الدور الوظيفي</th>
                    <th className="px-4 py-3 text-start">تاريخ الانضمام</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {members.map((m) => (
                    <tr key={m.user_id} className="hover:bg-neutral/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={m.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                            alt={m.full_name}
                            className="w-7 h-7 rounded-full object-cover border border-border"
                          />
                          <span className="font-bold text-primary">{m.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-tertiary" dir="ltr">{m.email}</td>
                      <td className="px-4 py-3 font-medium text-secondary">{m.role_name}</td>
                      <td className="px-4 py-3 text-tertiary font-mono">{m.joined_at?.split("T")[0] || "2026-09-09"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {members.map((m) => (
                <div key={m.user_id} className="rounded-xl border border-border bg-white p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                      alt={m.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-border"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-primary truncate leading-tight">
                        {m.full_name}
                      </p>
                      <p className="text-[11px] text-tertiary truncate">{m.role_name}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border text-xs text-tertiary">
                    <span dir="ltr" className="font-mono block truncate">{m.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Roles */}
      {activeTab === "roles" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-semibold text-sm text-primary">الأدوار المخصصة وصلاحيات النظام</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roles.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-border bg-white p-4 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-primary">{r.name}</span>
                  {r.is_system && (
                    <span className="text-[10px] bg-neutral border border-border text-tertiary px-2 py-0.5 rounded font-semibold">
                      دور نظام ثابت
                    </span>
                  )}
                </div>
                <p className="text-xs text-tertiary leading-relaxed">
                  يحتوي على {r.permissions.length} صلاحية تشمل إدارة القضايا، الجلسات، وكشوف الحسابات.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Invites */}
      {activeTab === "invites" && (
        <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="font-headline font-bold text-sm text-primary">
              رابط دعوة الزملاء المباشر للانضمام
            </h3>
            <p className="text-xs text-tertiary">
              شارك هذا الرابط مع المحامين والباحثين وسكرتارية المكتب للانضمام لحسابك في بصيرة:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 h-9 px-3 rounded-md border border-border bg-neutral text-xs text-primary font-mono select-all focus:outline-none"
              dir="ltr"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "تم النسخ!" : "نسخ الرابط"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Database & Cloud */}
      {activeTab === "database" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-secondary" />
                  <h3 className="font-headline font-bold text-base text-primary">
                    حالة قاعدة البيانات السحابية (Supabase PostgreSQL)
                  </h3>
                </div>
                <p className="text-xs text-tertiary">
                  ربط المنظومة بقاعدة بيانات PostgreSQL السحابية ودعم المزامنة المزدوجة والتخزين المحلي.
                </p>
              </div>

              <div>
                {isCloud ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    متصل بالسحابة
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    وضع العمل المحلي (Offline / Demo)
                  </span>
                )}
              </div>
            </div>

            {/* Connection Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral border border-border space-y-1">
                <span className="text-tertiary block font-medium">عنوان السيرفر (Supabase URL):</span>
                <span className="font-mono text-primary font-bold block truncate" dir="ltr">
                  {apiClient.getCloudUrl() || "غير معين (راجع ملف .env أو إعدادات Vercel)"}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-neutral border border-border space-y-1">
                <span className="text-tertiary block font-medium">وضع الحفظ والمزامنة:</span>
                <span className="font-bold text-primary block">
                  {isCloud ? "حفظ سحابي فوري + كاش محلي سريع" : "تخزين محلي آمن في المتصفح و SQLite"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestDatabase}
                disabled={testingDb}
                className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs disabled:opacity-50"
              >
                <Server className="w-4 h-4" />
                <span>{testingDb ? "جارٍ اختبار الاتصال..." : "اختبار الاتصال بقاعدة البيانات"}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncCloud}
                disabled={syncingCloud || !isCloud}
                className="flex items-center gap-2 h-9 px-4 rounded-lg border border-border bg-white text-primary text-xs font-semibold hover:bg-neutral transition-colors shadow-2xs disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${syncingCloud ? "animate-spin text-primary" : "text-tertiary"}`} />
                <span>{syncingCloud ? "جارٍ المزامنة..." : "مزامنة البيانات السحابية الآن"}</span>
              </button>

              <button
                type="button"
                onClick={handleSeedCloud}
                disabled={seedingCloud || !isCloud}
                className="flex items-center gap-2 h-9 px-4 rounded-lg border border-amber-200 bg-amber-50/80 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-2xs disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{seedingCloud ? "جارٍ زرع البيانات..." : "زرع بيانات تجريبية في السحابة"}</span>
              </button>
            </div>

            {/* Test Diagnostics Panel */}
            {testResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  testResult.ok
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-2">
                    {testResult.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>{testResult.ok ? "الاتصال ناجح وقاعدة البيانات تستجيب بشكل سليم" : "تعذر الاتصال بقاعدة البيانات"}</span>
                  </div>
                  {testResult.ok && <span className="font-mono text-[11px]">{testResult.latencyMs}ms</span>}
                </div>

                {testResult.error && <p className="text-[11px] font-mono">{testResult.error}</p>}

                {testResult.tables && (
                  <div className="grid grid-cols-4 gap-2 pt-2 text-center font-mono">
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 block">القضايا</span>
                      <span className="font-bold text-sm">{testResult.tables.cases}</span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 block">الموكلين</span>
                      <span className="font-bold text-sm">{testResult.tables.clients}</span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 block">الجلسات</span>
                      <span className="font-bold text-sm">{testResult.tables.sessions}</span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 block">المدد القانونية</span>
                      <span className="font-bold text-sm">{testResult.tables.deadlines}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Setup Guide Card */}
          <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-xs space-y-3">
            <h4 className="font-headline font-bold text-sm text-primary flex items-center gap-2">
              <Zap className="w-4 h-4 text-secondary" />
              <span>خطوات تجهيز وربط Supabase السحابي ونشره على Vercel</span>
            </h4>
            <ol className="list-decimal list-inside text-xs text-tertiary space-y-2 leading-relaxed">
              <li>
                قم بفتح حساب على <strong className="text-primary">Supabase.com</strong> وأنشئ مشروعاً جديداً.
              </li>
              <li>
                افتح تبويب <strong className="text-primary">SQL Editor</strong> وانسخ محتوى الملف المجهز <code className="bg-neutral px-1.5 py-0.5 rounded text-primary font-mono font-bold">supabase/schema.sql</code> ثم اضغط <strong>Run</strong>.
              </li>
              <li>
                (اختياري) انسخ محتوى الملف <code className="bg-neutral px-1.5 py-0.5 rounded text-primary font-mono font-bold">supabase/seed.sql</code> واضغط <strong>Run</strong> لتعبئة بيانات القضايا المصرية النموذجية.
              </li>
              <li>
                انسخ مفاتيح المشروع من <strong>Project Settings &rarr; API</strong> وضعها في <code className="bg-neutral px-1.5 py-0.5 rounded text-primary font-mono font-bold">.env</code> أو في إعدادات البيئة بـ <strong>Vercel (Environment Variables)</strong>:
                <div className="mt-1.5 p-2.5 rounded-lg bg-neutral border border-border font-mono text-[11px] text-primary" dir="ltr">
                  VITE_SUPABASE_URL=https://your-project.supabase.co<br />
                  VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
                </div>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirmSettingsPage;
