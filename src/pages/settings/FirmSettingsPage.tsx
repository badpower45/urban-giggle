import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  ShieldCheck,
  Link as LinkIcon,
  Copy,
  Check,
  Plus,
  Mail,
  Edit2,
  Trash2,
  UserPlus,
  Lock,
  Upload,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { Firm, FirmMember, FirmRole } from "../../types";
import { CountBadge } from "../../components/common/CountBadge";
import { ViewToggle } from "../../components/common/ViewToggle";

export const FirmSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"general" | "members" | "roles" | "invites">("general");
  const [firm, setFirm] = useState<Firm | null>(null);
  const [members, setMembers] = useState<FirmMember[]>([]);
  const [roles, setRoles] = useState<FirmRole[]>([]);
  const [copied, setCopied] = useState(false);
  const [memberViewMode, setMemberViewMode] = useState<"grid" | "table">("table");

  // Firm Edit State
  const [firmName, setFirmName] = useState("");
  const [firmPhone, setFirmPhone] = useState("01012345678");
  const [firmAddress, setFirmAddress] = useState("مدينة نصر، القاهرة");

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

  const inviteLink = "https://app.siyaq.legal/join?token=862621c64756a53000b91dbd2d5d051e";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "general" as const, label: "بيانات المكتب العامة", icon: Building2 },
    { id: "members" as const, label: "فريق العمل والأعضاء", icon: Users },
    { id: "roles" as const, label: "الأدوار والصلاحيات", icon: ShieldCheck },
    { id: "invites" as const, label: "روابط الدعوة", icon: LinkIcon },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="font-headline text-primary text-xl sm:text-2xl font-semibold">
          إعدادات المكتب وفريق العمل
        </h1>
        <p className="text-xs sm:text-sm text-tertiary mt-0.5">
          إدارة هوية الكيان القانوني، صلاحيات المحامين والمساعدين، ودعوة الكوادر
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
              <label className="text-xs font-semibold text-primary block mb-1">العنوان والمقر الرئيسي</label>
              <input
                type="text"
                value={firmAddress}
                onChange={(e) => setFirmAddress(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="button"
              className="h-9 px-4 rounded-md bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              حفظ التعديلات
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Members */}
      {activeTab === "members" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-headline font-semibold text-sm text-primary">أعضاء الفريق والباحثين</h2>
              <CountBadge count={members.length} />
            </div>

            <div className="flex items-center gap-2">
              <ViewToggle viewMode={memberViewMode} onChange={setMemberViewMode} />
              <button
                type="button"
                onClick={() => setActiveTab("invites")}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>دعوة عضو جديد</span>
              </button>
            </div>
          </div>

          {memberViewMode === "table" ? (
            <div className="rounded-xl border border-border bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-neutral/60 text-tertiary text-[11px] font-semibold uppercase tracking-wider">
                      <th className="px-4 py-3 text-start">الاسم</th>
                      <th className="px-4 py-3 text-start">البريد الإلكتروني</th>
                      <th className="px-4 py-3 text-start">الدور الوظيفي</th>
                      <th className="px-4 py-3 text-start">الحالة</th>
                      <th className="px-4 py-3 text-end w-20">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.map((m) => (
                      <tr key={m.user_id} className="hover:bg-neutral/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {m.full_name.charAt(0)}
                            </div>
                            <span className="font-semibold text-primary">{m.full_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-tertiary font-mono" dir="ltr">
                          {m.email}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 rounded bg-neutral border border-border text-[11px] font-medium text-primary">
                            {m.role_name}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                            نشط
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <button
                            type="button"
                            className="p-1 text-tertiary hover:text-primary rounded"
                            title="تعديل الدور"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {members.map((m) => (
                <div
                  key={m.user_id}
                  className="rounded-xl border border-border bg-white p-4 shadow-xs hover:border-slate-300 transition-colors space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {m.full_name.charAt(0)}
                    </div>
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
              شارك هذا الرابط مع المحامين والباحثين وسكرتارية المكتب للانضمام لحسابك في سياق:
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
    </div>
  );
};
export default FirmSettingsPage;
