import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Mail,
  Shield,
  Key,
  Save,
  Check,
  Smartphone,
  Laptop,
  Camera,
  QrCode,
  Lock,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { User } from "../../types";
import { formatDate } from "../../lib/utils";

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "devices">("profile");
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("01012345678");
  const [saved, setSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const u = await apiClient.getProfile();
      setUser(u);
      setFullName(u.full_name);
      setEmail(u.email);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  if (!user) {
    return (
      <div className="p-12 text-center text-xs text-tertiary">
        جارٍ تحميل الملف الشخصي...
      </div>
    );
  }

  const tabs = [
    { id: "profile" as const, label: "البيانات الشخصية", icon: UserIcon },
    { id: "security" as const, label: "الأمان وكلمة المرور", icon: Shield },
    { id: "devices" as const, label: "الأجهزة والجلسات النشطة", icon: Smartphone },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="font-headline text-primary text-xl sm:text-2xl font-semibold">
          الملف الشخصي وإعدادات الحساب
        </h1>
        <p className="text-xs sm:text-sm text-tertiary mt-0.5">
          إدارة بياناتك الشخصية، إعدادات الدخول، وتوثيق الحساب
        </p>
      </div>

      {/* Tabs */}
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
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === "profile" && (
        <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-border">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border bg-primary text-white flex items-center justify-center font-bold text-xl shrink-0">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
              ) : (
                user.full_name.charAt(0)
              )}
            </div>

            <div className="space-y-1 flex-1">
              <h3 className="font-headline font-bold text-base text-primary">{user.full_name}</h3>
              <p className="text-xs text-tertiary font-mono" dir="ltr">{user.email}</p>
              <span className="inline-block px-2 py-0.5 rounded bg-neutral border border-border text-[10px] text-tertiary font-semibold">
                عضو منذ {formatDate(user.member_since)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">الاسم بالكامل</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">رقم الهاتف الشخصي</label>
                <input
                  type="text"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">الصفة الوظيفية</label>
                <input
                  type="text"
                  readOnly
                  value="مالك المكتب / محامي نقض"
                  className="w-full h-9 px-3 rounded-md border border-border bg-neutral text-xs text-tertiary focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              {saved ? (
                <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> تم حفظ التعديلات بنجاح
                </span>
              ) : <div />}

              <button
                type="submit"
                className="h-9 px-5 rounded-md bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security */}
      {activeTab === "security" && (
        <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-headline font-bold text-sm text-primary">تغيير كلمة المرور</h3>
            <p className="text-xs text-tertiary mt-0.5">
              احرص على استخدام كلمة مرور قوية تحتوي على أحرف وأرقام ورموز
            </p>
          </div>

          <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">كلمة المرور الحالية</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">كلمة المرور الجديدة</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {passwordSaved ? (
                <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> تم تحديث كلمة المرور!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="h-9 px-4 rounded-md bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                تحديث كلمة المرور
              </button>
            </div>
          </form>

          {/* 2FA Section */}
          <div className="pt-6 border-t border-border space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-headline font-bold text-sm text-primary">
                  التحقق بخطوتين (Two-Factor Authentication)
                </h4>
                <p className="text-xs text-tertiary mt-0.5">
                  حماية إضافية لحسابك عن طريق تطبيق المصادقة (Google Authenticator)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-700">
                مفعل
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Devices */}
      {activeTab === "devices" && (
        <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-headline font-bold text-sm text-primary">الأجهزة والجلسات المسجلة</h3>
            <p className="text-xs text-tertiary mt-0.5">
              قائمة بجميع المتصفحات والأجهزة النشطة المسجلة بحسابك حالياً
            </p>
          </div>

          <div className="divide-y divide-border pt-2">
            <div className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-primary">MacBook Pro — Chrome 128</span>
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.2 rounded">
                      الجلسة الحالية
                    </span>
                  </div>
                  <p className="text-[10px] text-tertiary">القاهرة، مصر • IP: 197.34.120.45</p>
                </div>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral text-tertiary flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-primary">iPhone 15 Pro — Safari Mobile</span>
                  <p className="text-[10px] text-tertiary">القاهرة، مصر • آخر نشاط: منذ 3 ساعات</p>
                </div>
              </div>
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
              >
                إنهاء الجلسة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfilePage;
