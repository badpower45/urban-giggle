import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Server,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { usePlatformStore } from '../../lib/platformStore';
import { useToast } from '../../components/common/Toast';
import { supabaseService } from '../../lib/supabase/client';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loginSuperAdmin, settings } = usePlatformStore();

  const [email, setEmail] = useState('admin@baseera.legal');
  const [password, setPassword] = useState('superadmin2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني للمشرف وكلمة المرور الرئيسية.');
      return;
    }

    setLoading(true);

    try {
      // 1. Try Supabase Auth check first
      if (supabaseService.isConfigured() && supabaseService.client) {
        const { data, error } = await supabaseService.signIn(email.trim(), password);
        if (!error && data.user) {
          const { data: profile } = await supabaseService.client
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profile?.is_super_admin) {
            loginSuperAdmin(email, password, rememberMe);
            setLoading(false);
            showToast(`مرحباً بك مجدداً ${profile.full_name || 'سعادة المستشار المشرف'}! جاري فتح لوحة الإدارة المركزية...`, 'success');
            navigate('/super-admin');
            return;
          }
        }
      }

      // 2. Standard platform credentials check
      const res = loginSuperAdmin(email, password, rememberMe);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'بيانات الدخول غير صحيحة أو ليس لديك صلاحيات المشرف العام.');
        showToast('تعذر التحقق من صلاحيات المشرف', 'error');
        return;
      }

      showToast(`مرحباً بك مجدداً ${res.user?.fullName}! جاري فتح لوحة الإدارة...`, 'success');
      navigate('/super-admin');
    } catch (err: any) {
      const res = loginSuperAdmin(email, password, rememberMe);
      setLoading(false);
      if (res.success) {
        showToast(`مرحباً بك مجدداً ${res.user?.fullName}! جاري فتح لوحة الإدارة...`, 'success');
        navigate('/super-admin');
      } else {
        setErrorMsg('حدث خطأ أثناء التحقق من بيانات الدخول.');
        showToast('تعذر التحقق من صلاحيات المشرف', 'error');
      }
    }
  };

  const setCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div
      className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none"
      dir="rtl"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            ⚖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white font-headline tracking-wide">
                {settings.systemName}
              </span>
              <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                SaaS Central
              </span>
            </div>
            <p className="text-[11px] text-slate-400">بوابة الإدارة المركزية للمنصة</p>
          </div>
        </Link>

        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>بوابة مكاتب المحامين</span>
          <ArrowRight className="w-3 h-3 rotate-180 text-slate-500" />
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3 shadow-inner">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>وصول مخصص للمشرفين وملاك المنصة فقط</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-headline tracking-tight">
              تسجيل دخول الإدارة العليا
            </h1>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              تحكم كامل في مكاتب المحاماة المشتركة، الاشتراكات السنوية، تراخيص النظام، وحسابات المنصة.
            </p>
          </div>

          {/* Form Container */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative">
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in-50">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  البريد الإلكتروني للإدارة المركزية
                </label>
                <div className="relative">
                  <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@baseera.legal"
                    required
                    className="h-11 ps-10 bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-600 focus:border-amber-500 focus:ring-amber-500/20 text-xs sm:text-sm rounded-xl"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    كلمة المرور الرئيسية (Master Key)
                  </label>
                  <span className="text-[10px] text-amber-400/80 font-mono">Restricted Access</span>
                </div>
                <div className="relative">
                  <KeyRound className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="h-11 ps-10 pe-10 bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-600 focus:border-amber-500 focus:ring-amber-500/20 text-xs sm:text-sm rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/20 w-3.5 h-3.5"
                  />
                  <span className="text-xs text-slate-400">تذكر جلسة المشرف على هذا المتصفح</span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>جاري التحقق من الصلاحيات...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>دخول لوحة التحكم المركزية</span>
                  </span>
                )}
              </Button>
            </form>

            {/* Quick Demo Access Pills */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400 mb-2 font-medium flex items-center justify-between">
                <span>بيانات الدخول السريع للاختبار:</span>
                <span className="text-emerald-400 font-mono text-[10px]">جاهز للاستخدام</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCredentials('admin@baseera.legal', 'superadmin2026')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-[10px] text-slate-300 transition-all text-start"
                >
                  <span className="font-bold text-amber-400 block">حساب المشرف العام</span>
                  <span className="text-slate-500 font-mono">admin@baseera.legal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCredentials('elezabybode375@gmail.com', 'password123')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-[10px] text-slate-300 transition-all text-start"
                >
                  <span className="font-bold text-amber-400 block">حساب المالك التنفيذي</span>
                  <span className="text-slate-500 font-mono truncate block">elezabybode375</span>
                </button>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>اتصال مشفر 256-bit SSL</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-500" />
                <span>عزل سحابي للمكاتب</span>
              </span>
            </div>
          </div>

          {/* Bottom Back Link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <span>العودة لصفحة بصيرة الرئيسية</span>
              <ArrowRight className="w-3 h-3 rotate-180" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500">
        منظومة {settings.systemName} القانونية • لوحة التحكم المركزية بالسحابة وإدارة مكاتب المحاماة SaaS © 2026
      </footer>
    </div>
  );
};

