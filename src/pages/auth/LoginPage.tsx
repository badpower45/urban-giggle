import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, Database, CheckCircle2, User, Building2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Logo } from "../../components/common/Logo";
import { supabaseService } from "../../lib/supabase/client";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"login" | "register">(
    location.pathname === "/register" ? "register" : "login"
  );

  // Login Form
  const [loginEmail, setLoginEmail] = useState("elezabybode375@gmail.com");
  const [loginPassword, setLoginPassword] = useState("password123");

  // Register Form
  const [regFullName, setRegFullName] = useState("");
  const [regFirmName, setRegFirmName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isCloud = supabaseService.isConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isCloud) {
        const { error } = await supabaseService.signIn(loginEmail, loginPassword);
        if (error) {
          setErrorMsg(error.message || "فشل تسجيل الدخول. تحقق من البريد وكلمة المرور.");
          setLoading(false);
          return;
        }
      }
      navigate("/firm/dashboard");
    } catch (err: any) {
      console.warn("Auth fallback:", err);
      navigate("/firm/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!regFullName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg("يرجى ملء جميع الحقول المطلوبة للتسجيل.");
      return;
    }

    setLoading(true);
    try {
      if (isCloud) {
        const { data, error } = await supabaseService.signUp(regEmail.trim(), regPassword, {
          full_name: regFullName.trim(),
          firm_name: regFirmName.trim() || `مكتب ${regFullName.trim()} للمحاماة`,
        });

        if (error) {
          setErrorMsg(error.message || "حدث خطأ أثناء إنشاء الحساب في السحابة.");
          setLoading(false);
          return;
        }

        setSuccessMsg("تم إنشاء الحساب بنجاح! جاري تحويلك إلى لوحة التحكم...");
        setTimeout(() => navigate("/firm/dashboard"), 1200);
      } else {
        // Local mode demo registration
        setSuccessMsg("تم إنشاء الحساب بنجاح في وضع العمل السريع.");
        setTimeout(() => navigate("/firm/dashboard"), 800);
      }
    } catch (err: any) {
      console.warn("Register exception:", err);
      navigate("/firm/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#1a2b3c] to-slate-950 p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-md space-y-5">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center justify-center space-y-2">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <Logo iconSize={48} showText={true} textColor="text-white" subtextColor="text-slate-300" />
          </div>
          <p className="text-xs text-slate-300/80 pt-1 max-w-xs">
            النظام المتكامل لإدارة مكاتب المحاماة والقضايا والموكلين والجلسات
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-2xl border-white/15 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          {/* Database Connection Pill */}
          <div className="px-6 pt-5 pb-2">
            {isCloud ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>قاعدة بيانات Supabase متصلة ومربوطة سحابياً بنجاح</span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/90 border border-blue-200 text-blue-900 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>وضع المعاينة والتخزين المحلي السريع</span>
                </div>
                <span className="text-[10px] bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded-md font-mono">SQLite / Mock</span>
              </div>
            )}
          </div>

          {/* Switcher Tabs */}
          <div className="flex border-b border-slate-200 px-6 pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === "login"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === "register"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>

          <CardContent className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: LOGIN */}
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-tertiary" />
                    <Input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="ps-9 h-10"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-primary">
                      كلمة المرور
                    </label>
                    <a href="#" className="text-[11px] text-secondary hover:underline">
                      نسيت كلمة المرور؟
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-tertiary" />
                    <Input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="ps-9 h-10"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 font-bold shadow-md bg-primary hover:bg-primary/90 text-white rounded-xl"
                >
                  {loading ? "جارٍ تسجيل الدخول..." : "دخول إلى لوحة التحكم"}
                </Button>
              </form>
            ) : (
              /* TAB 2: REGISTER */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    اسم المحامي / المدير المسؤول <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-tertiary" />
                    <Input
                      type="text"
                      placeholder="أ. محمد السيد"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="ps-9 h-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    اسم مكتب المحاماة / الكيان القانوني
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-tertiary" />
                    <Input
                      type="text"
                      placeholder="مكتب محمد السيد للمحاماة"
                      value={regFirmName}
                      onChange={(e) => setRegFirmName(e.target.value)}
                      className="ps-9 h-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-tertiary" />
                    <Input
                      type="email"
                      placeholder="lawyer@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="ps-9 h-10"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    كلمة المرور (6 أحرف على الأقل) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-tertiary" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="ps-9 h-10"
                      dir="ltr"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 font-bold shadow-md bg-secondary hover:bg-secondary/90 text-white rounded-xl gap-2 mt-1"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? "جارٍ إنشاء الحساب وقيد المكتب..." : "إنشاء حساب وقيد المكتب"}
                </Button>
              </form>
            )}

            <div className="relative text-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-2 text-[11px] text-muted-foreground">
                أو الدخول المباشر
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/firm/dashboard")}
              className="w-full h-10 gap-2 text-xs bg-white border-slate-200 hover:bg-slate-50 text-primary font-semibold rounded-xl"
            >
              <ShieldCheck className="w-4 h-4 text-secondary" />
              الدخول كضيف للمعاينة التجريبية
            </Button>
          </CardContent>
        </Card>

        {/* Super Admin Distinct Gateway Link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 transition-colors font-medium hover:underline bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-amber-500/20"
          >
            <span>هل أنت أحد مسؤولي المنصة؟ تسجيل دخول الإدارة المركزية (Super Admin)</span>
            <ArrowRight className="w-3 h-3 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
