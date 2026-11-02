import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  CreditCard,
  Settings,
  MessageSquare,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Phone,
  Mail,
  Edit2,
  Save,
  Plus,
  ArrowRight,
  HelpCircle,
  Building2,
  DollarSign,
  Briefcase,
  TrendingUp,
  Server,
  ShieldCheck,
  Calendar,
  Layers,
  Database,
  Lock,
  LogOut,
  RefreshCw,
  Trash2,
  UserPlus,
  FileText,
  BadgeCheck,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { usePlatformStore } from '../../lib/platformStore';
import {
  LeadStatus,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  AdminSubscriptionPlan,
  TenantFirm,
  PlatformInvoice,
  FirmSubscriptionStatus,
} from '../../types/admin';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../components/common/Toast';

type AdminTab = 'overview' | 'firms' | 'invoices' | 'leads' | 'complaints' | 'pricing' | 'branding';

export const SuperAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    adminSession,
    logoutSuperAdmin,
    settings,
    plans,
    firms,
    invoices,
    leads,
    complaints,
    stats,
    updateSettings,
    updatePlanPrice,
    syncFirmsFromSupabase,
    addFirm,
    updateFirm,
    extendFirmTrial,
    toggleFirmStatus,
    updateFirmPlan,
    deleteFirm,
    addInvoice,
    updateInvoiceStatus,
    updateLeadStatus,
    updateComplaintStatus,
  } = usePlatformStore();

  useEffect(() => {
    syncFirmsFromSupabase();
  }, []);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search & Filter States for Firms
  const [firmsSearch, setFirmsSearch] = useState('');
  const [firmsStatusFilter, setFirmsStatusFilter] = useState<string>('all');
  const [firmsPlanFilter, setFirmsPlanFilter] = useState<string>('all');

  // Add Firm Modal State
  const [showAddFirmModal, setShowAddFirmModal] = useState(false);
  const [newFirmName, setNewFirmName] = useState('');
  const [newFirmOwner, setNewFirmOwner] = useState('');
  const [newFirmEmail, setNewFirmEmail] = useState('');
  const [newFirmPhone, setNewFirmPhone] = useState('');
  const [newFirmCity, setNewFirmCity] = useState('القاهرة');
  const [newFirmAddress, setNewFirmAddress] = useState('');
  const [newFirmPlan, setNewFirmPlan] = useState<'individual' | 'office' | 'enterprise'>('office');
  const [newFirmStatus, setNewFirmStatus] = useState<FirmSubscriptionStatus>('active');
  const [newFirmCycle, setNewFirmCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Inspect / Edit Firm Modal State
  const [selectedFirm, setSelectedFirm] = useState<TenantFirm | null>(null);
  const [editingQuotasFirm, setEditingQuotasFirm] = useState<TenantFirm | null>(null);
  const [customMaxUsers, setCustomMaxUsers] = useState<number>(10);
  const [customMaxStorage, setCustomMaxStorage] = useState<number>(50);

  // Search & Filter States for Leads
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsStatusFilter, setLeadsStatusFilter] = useState<string>('all');

  // Search & Filter States for Complaints
  const [ticketsSearch, setTicketsSearch] = useState('');
  const [ticketsStatusFilter, setTicketsStatusFilter] = useState<string>('all');
  const [ticketsCategoryFilter, setTicketsCategoryFilter] = useState<string>('all');

  // Plan Editing State
  const [editingPlan, setEditingPlan] = useState<AdminSubscriptionPlan | null>(null);
  const [monthlyPriceInput, setMonthlyPriceInput] = useState<number>(0);
  const [annualPriceInput, setAnnualPriceInput] = useState<number>(0);

  // Platform Branding Form State
  const [brandForm, setBrandForm] = useState(settings);

  // Ticket Response Modal State
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Lead Note Modal State
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leadNoteText, setLeadNoteText] = useState('');

  // Add Invoice Modal State
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [invFirmId, setInvFirmId] = useState('');
  const [invAmount, setInvAmount] = useState<number>(14000);
  const [invPlanName, setInvPlanName] = useState('باقة المكاتب المتوسطة (سنوي)');
  const [invMethod, setInvMethod] = useState<'instapay' | 'credit_card' | 'bank_transfer' | 'vodafone_cash'>('instapay');

  // Handle Logout
  const handleLogout = () => {
    logoutSuperAdmin();
    showToast('تم تسجيل خروج المشرف بنجاح.', 'info');
    navigate('/admin/login');
  };

  // Filter Firms
  const filteredFirms = firms.filter((f) => {
    const matchesQuery =
      f.name.toLowerCase().includes(firmsSearch.toLowerCase()) ||
      f.ownerName.toLowerCase().includes(firmsSearch.toLowerCase()) ||
      f.ownerEmail.toLowerCase().includes(firmsSearch.toLowerCase()) ||
      f.city.toLowerCase().includes(firmsSearch.toLowerCase()) ||
      f.ownerPhone.includes(firmsSearch);
    const matchesStatus = firmsStatusFilter === 'all' || f.subscriptionStatus === firmsStatusFilter;
    const matchesPlan = firmsPlanFilter === 'all' || f.subscriptionPlan === firmsPlanFilter;
    return matchesQuery && matchesStatus && matchesPlan;
  });

  // Filter Leads
  const filteredLeads = leads.filter((l) => {
    const matchesQuery =
      l.full_name.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.firm_name.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.phone.includes(leadsSearch);
    const matchesStatus = leadsStatusFilter === 'all' || l.status === leadsStatusFilter;
    return matchesQuery && matchesStatus;
  });

  // Filter Tickets
  const filteredTickets = complaints.filter((t) => {
    const matchesQuery =
      t.subject.toLowerCase().includes(ticketsSearch.toLowerCase()) ||
      t.firm_name.toLowerCase().includes(ticketsSearch.toLowerCase()) ||
      t.user_name.toLowerCase().includes(ticketsSearch.toLowerCase()) ||
      t.ticket_number.toLowerCase().includes(ticketsSearch.toLowerCase());
    const matchesStatus = ticketsStatusFilter === 'all' || t.status === ticketsStatusFilter;
    const matchesCategory = ticketsCategoryFilter === 'all' || t.category === ticketsCategoryFilter;
    return matchesQuery && matchesStatus && matchesCategory;
  });

  // Add New Firm Handler
  const handleCreateFirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirmName.trim() || !newFirmOwner.trim() || !newFirmEmail.trim()) {
      showToast('يرجى ملء اسم المكتب واسم المالك والبريد الإلكتروني.', 'error');
      return;
    }

    const quotas = {
      individual: { maxUsers: 2, maxStorageGb: 5 },
      office: { maxUsers: 10, maxStorageGb: 50 },
      enterprise: { maxUsers: 30, maxStorageGb: 150 },
    }[newFirmPlan];

    const slug = newFirmName
      .toLowerCase()
      .replace(/[^a-z0-9\u0621-\u064A]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `firm-${Date.now()}`;

    addFirm({
      name: newFirmName.trim(),
      slug,
      ownerName: newFirmOwner.trim(),
      ownerEmail: newFirmEmail.trim(),
      ownerPhone: newFirmPhone.trim() || '01000000000',
      city: newFirmCity,
      address: newFirmAddress.trim() || 'جمهورية مصر العربية',
      subscriptionPlan: newFirmPlan,
      subscriptionStatus: newFirmStatus,
      billingCycle: newFirmCycle,
      trialEndsAt:
        newFirmStatus === 'trial'
          ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      subscriptionEndsAt:
        newFirmStatus === 'active'
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      maxUsers: quotas.maxUsers,
      maxStorageGb: quotas.maxStorageGb,
      isVerified: true,
      notes: 'تم التسجيل يدوياً بواسطة الإدارة المركزية للمنصة.',
    });

    setShowAddFirmModal(false);
    setNewFirmName('');
    setNewFirmOwner('');
    setNewFirmEmail('');
    setNewFirmPhone('');
    showToast(`تم قيد مكتب "${newFirmName}" بنجاح في قاعدة بيانات مكاتب المنصة`, 'success');
  };

  // Convert Lead To Firm
  const handleConvertLeadToFirm = (lead: any) => {
    addFirm({
      name: lead.firm_name || `مكتب ${lead.full_name} للمحاماة`,
      slug: `firm-${Date.now()}`,
      ownerName: lead.full_name,
      ownerEmail: lead.email && lead.email !== 'لم يُحدد' ? lead.email : `lawyer${Date.now()}@baseera.legal`,
      ownerPhone: lead.phone,
      city: lead.city || 'القاهرة',
      address: 'القاهرة، مصر',
      subscriptionPlan: 'office',
      subscriptionStatus: 'trial',
      billingCycle: 'monthly',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      maxUsers: 10,
      maxStorageGb: 50,
      isVerified: true,
      notes: `تم تحويله من طلب تواصل برقم: ${lead.id}`,
    });

    updateLeadStatus(lead.id, 'converted', 'تم تحويله بنجاح إلى مكتب مشترك بالمنصة.');
    showToast(`تم تحويل ${lead.full_name} إلى مكتب مشترك ومفعل تجريبياً لمدة 14 يوماً!`, 'success');
  };

  // Save Branding Settings
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(brandForm);
    showToast(`تم حفظ اسم وهوية النظام "${brandForm.systemName}" بنجاح`, 'success');
  };

  // Open Edit Plan
  const handleStartEditPlan = (plan: AdminSubscriptionPlan) => {
    setEditingPlan(plan);
    setMonthlyPriceInput(plan.monthlyPrice);
    setAnnualPriceInput(plan.annualPrice);
  };

  // Save Plan Price
  const handleSavePlanPrice = () => {
    if (!editingPlan) return;
    updatePlanPrice(editingPlan.id, Number(monthlyPriceInput), Number(annualPriceInput));
    setEditingPlan(null);
    showToast(`تم تحديث سعر اشتراك "${editingPlan.name}" بنجاح`, 'success');
  };

  // Resolve Ticket
  const handleResolveTicket = (ticketId: string, newStatus: TicketStatus) => {
    updateComplaintStatus(ticketId, newStatus, resolutionText.trim() || undefined);
    setSelectedTicketId(null);
    setResolutionText('');
    showToast('تم تحديث حالة التذكرة وحفظ الرد بنجاح', 'success');
  };

  // Update Lead Status
  const handleLeadStatusChange = (leadId: string, newStatus: LeadStatus) => {
    updateLeadStatus(leadId, newStatus, leadNoteText.trim() || undefined);
    setSelectedLeadId(null);
    setLeadNoteText('');
    showToast('تم تحديث حالة طلب التواصل بنجاح', 'success');
  };

  // Add Invoice
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const firm = firms.find((f) => f.id === invFirmId) || firms[0];
    if (!firm) return;

    addInvoice({
      invoiceNumber: `INV-BAS-2026-${Math.floor(200 + Math.random() * 800)}`,
      firmId: firm.id,
      firmName: firm.name,
      planName: invPlanName,
      amount: Number(invAmount),
      currency: 'ج.م',
      billingCycle: invAmount > 5000 ? 'yearly' : 'monthly',
      paymentMethod: invMethod,
      status: 'paid',
      paidAt: new Date().toISOString(),
    });

    setShowAddInvoiceModal(false);
    showToast(`تم تسجيل وتوثيق فاتورة جديدة لمكتب "${firm.name}" بقيمة ${invAmount.toLocaleString('ar-EG')} ج.م`, 'success');
  };

  const getPriorityBadge = (p: TicketPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">عاجل ⚡</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">أولوية عالية</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800 border border-blue-200">متوسطة</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">عادية</span>;
    }
  };

  const getFirmStatusBadge = (s: FirmSubscriptionStatus) => {
    switch (s) {
      case 'active':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />نشط ومسدد</span>;
      case 'trial':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1 w-fit"><Clock className="w-3 h-3" />فترة تجريبية</span>;
      case 'past_due':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" />متأخر السداد</span>;
      case 'suspended':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 w-fit"><X className="w-3 h-3" />معلق / موقوف</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 w-fit">ملغى</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col" dir="rtl">
      {/* Top Super Admin Executive Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            ⚖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black font-headline text-white tracking-tight">
                لوحة الإدارة المركزية والتحكم في منصة {settings.systemName} SaaS
              </h1>
              <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">
              إدارة مكاتب المحاماة المشتركة ({firms.length} مكتب)، الاشتراكات السنوية، والتحكم السحابي الكامل
            </p>
          </div>
        </div>

        {/* User Info & Quick Action Links */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-end">
            <span className="text-xs font-bold text-white">
              {adminSession?.fullName || 'المشرف العام للمنصة'}
            </span>
            <span className="text-[10px] text-amber-400 font-mono">
              {adminSession?.email || 'admin@baseera.legal'}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <Link
            to="/firm/dashboard"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <span>معاينة تطبيق المكتب</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          </Link>

          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <span>صفحة الهبوط</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </Link>

          <Button
            type="button"
            onClick={handleLogout}
            variant="outline"
            className="h-9 px-3 gap-1.5 text-xs bg-rose-950/40 text-rose-300 border-rose-800/60 hover:bg-rose-900/60 hover:text-white rounded-xl"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-x-auto shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>لوحة النمو والمؤشرات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('firms')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'firms'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>مكاتب المحاماة المشتركة</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-200 border border-slate-700">
              {firms.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'invoices'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>الاشتراكات والتحصيل المالي</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-200 border border-slate-700">
              {invoices.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'leads'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>طلبات الانضمام والديمو</span>
            {stats.newLeadsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-600 text-white font-bold">
                {stats.newLeadsCount} جديد
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'complaints'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>تذاكر الدعم والشكاوى</span>
            {stats.urgentTicketsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-600 text-white font-bold animate-pulse">
                {stats.urgentTicketsCount} عاجل
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'pricing'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>الباقات والتسعير والحصص</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'branding'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات وهوية المنصة</span>
          </button>
        </nav>

        {/* =================================================================== */}
        {/* TAB 1: OVERVIEW & GROWTH DASHBOARD */}
        {/* =================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-semibold">المكاتب المشتركة</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-headline">
                    {stats.totalSubscribedFirms}
                  </span>
                  <span className="text-xs text-slate-400">مكتب محاماة</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">{stats.activeFirmsCount} نشط مدفوع</span>
                  <span className="text-purple-400 font-medium">{stats.trialFirmsCount} فترة تجريبية</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-semibold">الإيراد الشهري المقدر (MRR)</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-400 font-headline">
                    {stats.monthlyRevenueEstimate.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-xs text-slate-400">ج.م / شهر</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>المعدل السنوي (ARR):</span>
                  <span className="font-bold text-white font-mono">
                    {stats.annualRunRate.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-semibold">المحامون والمستخدمون</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-headline">
                    {stats.totalUsersCount}
                  </span>
                  <span className="text-xs text-slate-400">محامٍ ومساعد</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>القضايا النشطة بالمنصة:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {stats.totalCasesCount} قضية
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-semibold">حالة البنية السحابية</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Server className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-base font-bold text-emerald-400">مستقرة 100%</span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>عزل المكاتب RLS:</span>
                  <span className="font-bold text-white">مُفعل وآمن</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Law Firms */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Quick Actions & System Status */}
              <div className="space-y-4">
                <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>إجراءات المشرف السريعة</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    <Button
                      type="button"
                      onClick={() => {
                        setActiveTab('firms');
                        setShowAddFirmModal(true);
                      }}
                      className="w-full justify-start h-10 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl gap-2 shadow-md shadow-amber-500/10"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>قيد مكتب محاماة جديد يدوياً</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setActiveTab('invoices');
                        setShowAddInvoiceModal(true);
                      }}
                      variant="outline"
                      className="w-full justify-start h-10 text-xs bg-slate-800 border-slate-700 text-slate-200 hover:text-white rounded-xl gap-2"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>توثيق اشتراك وفاتورة جديدة</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab('pricing')}
                      variant="outline"
                      className="w-full justify-start h-10 text-xs bg-slate-800 border-slate-700 text-slate-200 hover:text-white rounded-xl gap-2"
                    >
                      <Edit2 className="w-4 h-4 text-blue-400" />
                      <span>تعديل أسعار باقات المحامين</span>
                    </Button>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span>جاهزية بنية الـ SaaS</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400">عزل قواعد البيانات (RLS):</span>
                      <span className="text-emerald-400 font-semibold font-mono">ENFORCED</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400">النسخ الاحتياطي السحابي:</span>
                      <span className="text-emerald-400 font-semibold font-mono">AUTOMATED</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400">محرك رول المحكمة أوفلاين:</span>
                      <span className="text-blue-400 font-semibold font-mono">READY</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Law Firms Directory Preview */}
              <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span>أحدث مكاتب المحاماة المقيدة على المنصة</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      قائمة المكاتب المسجلة وحالات اشتراكاتها في النظام
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setActiveTab('firms')}
                    variant="outline"
                    className="h-8 text-xs bg-slate-800 border-slate-700 text-slate-300 hover:text-white rounded-xl gap-1"
                  >
                    <span>عرض الكل ({firms.length})</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </Button>
                </div>

                <div className="divide-y divide-slate-800 overflow-hidden">
                  {firms.slice(0, 5).map((firm) => (
                    <div
                      key={firm.id}
                      className="py-3 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                          ⚖️
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{firm.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                              {firm.city}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            المالك: {firm.ownerName} • هاتف: {firm.ownerPhone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getFirmStatusBadge(firm.subscriptionStatus)}
                        <Button
                          type="button"
                          onClick={() => {
                            setSelectedFirm(firm);
                            setActiveTab('firms');
                          }}
                          variant="ghost"
                          className="h-8 px-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg"
                        >
                          إدارة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: LAW FIRMS / TENANTS DIRECTORY */}
        {/* =================================================================== */}
        {activeTab === 'firms' && (
          <div className="space-y-4">
            {/* Header with Search, Filter & Add Button */}
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <span>دليل مكاتب المحاماة المشتركة (Tenants Management)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    إدارة شاملة لجميع مكاتب وشركات المحاماة، تفعيل الحسابات، تمديد الفترات التجريبية، وتعديل الحصص.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      await syncFirmsFromSupabase();
                      showToast('تمت المزامنة اللحظية مع مكاتب المحاماة في سحابة Supabase بنجاح', 'success');
                    }}
                    className="h-10 text-xs bg-slate-800 border-slate-700 text-slate-300 hover:text-white rounded-xl gap-2 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>مزامنة سحابية</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowAddFirmModal(true)}
                    className="h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl gap-2 shadow-lg shadow-amber-500/10"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة مكتب محاماة جديد</span>
                  </Button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="text"
                    value={firmsSearch}
                    onChange={(e) => setFirmsSearch(e.target.value)}
                    placeholder="ابحث باسم المكتب، المالك، الهاتف، المحافظة..."
                    className="h-10 ps-9 bg-slate-950/70 border-slate-800 text-xs rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 shrink-0">حالة الاشتراك:</span>
                  <select
                    value={firmsStatusFilter}
                    onChange={(e) => setFirmsStatusFilter(e.target.value)}
                    className="h-10 flex-1 px-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">جميع الحالات ({firms.length})</option>
                    <option value="active">نشط ومسدد</option>
                    <option value="trial">فترة تجريبية</option>
                    <option value="past_due">متأخر السداد</option>
                    <option value="suspended">معلق / موقوف</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 shrink-0">الباقة:</span>
                  <select
                    value={firmsPlanFilter}
                    onChange={(e) => setFirmsPlanFilter(e.target.value)}
                    className="h-10 flex-1 px-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">جميع الباقات</option>
                    <option value="individual">باقة المحامي الفردي</option>
                    <option value="office">باقة المكاتب المتوسطة</option>
                    <option value="enterprise">باقة المكاتب الكبرى</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Firms Table */}
            <div className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 font-bold text-start">مكتب المحاماة</th>
                      <th className="py-3.5 px-4 font-bold text-start">المالك وبيانات التواصل</th>
                      <th className="py-3.5 px-4 font-bold text-center">الباقة الحالية</th>
                      <th className="py-3.5 px-4 font-bold text-center">حالة الاشتراك</th>
                      <th className="py-3.5 px-4 font-bold text-center">النشاط (قضايا / مستخدمين)</th>
                      <th className="py-3.5 px-4 font-bold text-center">إجراءات الإدارة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {filteredFirms.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          لا توجد نتائج تطابق معايير البحث الحالية
                        </td>
                      </tr>
                    ) : (
                      filteredFirms.map((firm) => (
                        <tr key={firm.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-bold text-white text-xs">{firm.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                              <span>{firm.city}</span>
                              <span>•</span>
                              <span className="font-mono text-slate-500">{firm.slug}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-200">{firm.ownerName}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                              <span className="font-mono">{firm.ownerPhone}</span>
                              <a
                                href={`https://wa.me/2${firm.ownerPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 hover:underline text-[10px] font-bold"
                              >
                                واتساب
                              </a>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {firm.ownerEmail}
                            </div>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                              {firm.subscriptionPlan === 'enterprise'
                                ? 'المكاتب الكبرى'
                                : firm.subscriptionPlan === 'office'
                                ? 'المكاتب المتوسطة'
                                : 'المحامي الفردي'}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-1">
                              {firm.billingCycle === 'yearly' ? 'سداد سنوي' : 'سداد شهري'}
                            </div>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <div className="flex justify-center">
                              {getFirmStatusBadge(firm.subscriptionStatus)}
                            </div>
                            {firm.subscriptionStatus === 'trial' && firm.trialEndsAt && (
                              <div className="text-[10px] text-purple-300 mt-1">
                                ينتهي: {new Date(firm.trialEndsAt).toLocaleDateString('ar-EG')}
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <div className="font-mono font-bold text-slate-200">
                              {firm.casesCount} قضية • {firm.usersCount} مستخدم
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              تخزين: {Math.round(firm.storageUsedMb / 1024)} جيجابايت / {firm.maxStorageGb} GB
                            </div>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {firm.subscriptionStatus === 'trial' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    extendFirmTrial(firm.id, 14);
                                    showToast(`تم تمديد تجربة مكتب "${firm.name}" لمدة 14 يوماً إضافية`, 'success');
                                  }}
                                  className="px-2 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-800 text-purple-200 text-[10px] font-bold transition-all"
                                  title="تمديد التجربة 14 يوماً"
                                >
                                  +14 يوم تجربة
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  const nextStatus: FirmSubscriptionStatus =
                                    firm.subscriptionStatus === 'active' ? 'suspended' : 'active';
                                  toggleFirmStatus(firm.id, nextStatus);
                                  showToast(
                                    `تم ${nextStatus === 'active' ? 'تنشيط' : 'تجميد'} حساب مكتب ${firm.name}`,
                                    'info'
                                  );
                                }}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                  firm.subscriptionStatus === 'active'
                                    ? 'bg-rose-950/50 hover:bg-rose-900 border-rose-800 text-rose-300'
                                    : 'bg-emerald-950/50 hover:bg-emerald-900 border-emerald-800 text-emerald-300'
                                }`}
                              >
                                {firm.subscriptionStatus === 'active' ? 'تجميد' : 'تنشيط'}
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedFirm(firm)}
                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-bold transition-all"
                              >
                                تفاصيل
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: PLATFORM INVOICES & BILLING */}
        {/* =================================================================== */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span>سجل الاشتراكات والتحصيل المالي للمنصة</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  متابعة فواتير الاشتراكات الشهرية والسنوية المحصلة من مكاتب المحاماة
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setShowAddInvoiceModal(true)}
                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>إصدار وتوثيق فاتورة جديدة</span>
              </Button>
            </div>

            {/* Invoices List */}
            <div className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 font-bold text-start">رقم الفاتورة</th>
                      <th className="py-3.5 px-4 font-bold text-start">مكتب المحاماة</th>
                      <th className="py-3.5 px-4 font-bold text-start">الباقة</th>
                      <th className="py-3.5 px-4 font-bold text-center">المبلغ المحصل</th>
                      <th className="py-3.5 px-4 font-bold text-center">طريقة السداد</th>
                      <th className="py-3.5 px-4 font-bold text-center">الحالة والتاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-amber-400">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-4 px-4 font-bold text-white">
                          {inv.firmName}
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          {inv.planName}
                        </td>
                        <td className="py-4 px-4 text-center font-mono font-black text-emerald-400 text-sm">
                          {inv.amount.toLocaleString('ar-EG')} {inv.currency}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                            {inv.paymentMethod}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            مدفوع ومسدد ✓
                          </span>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {new Date(inv.paidAt || inv.createdAt).toLocaleDateString('ar-EG')}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: LEADS & DEMO REQUESTS */}
        {/* =================================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span>طلبات الانضمام والتواصل من صفحة الهبوط ({leads.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    المحامون والمستشارون الذين طلبوا عروضاً توضيحية أو استفسروا عن النظام
                  </p>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="text"
                    value={leadsSearch}
                    onChange={(e) => setLeadsSearch(e.target.value)}
                    placeholder="ابحث بالاسم، المكتب، رقم الهاتف..."
                    className="h-10 ps-9 bg-slate-950/70 border-slate-800 text-xs rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 shrink-0">حالة الطلب:</span>
                  <select
                    value={leadsStatusFilter}
                    onChange={(e) => setLeadsStatusFilter(e.target.value)}
                    className="h-10 flex-1 px-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">جميع الحالات ({leads.length})</option>
                    <option value="new">طلبات جديدة</option>
                    <option value="contacted">تم التواصل</option>
                    <option value="demo_scheduled">تم حجز ديمو</option>
                    <option value="converted">تم الاشتراك بنجاح</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 font-bold text-start">المحامي والمكتب</th>
                      <th className="py-3.5 px-4 font-bold text-start">بيانات الاتصال</th>
                      <th className="py-3.5 px-4 font-bold text-start">تفاصيل الرسالة والاهتمام</th>
                      <th className="py-3.5 px-4 font-bold text-center">الحالة</th>
                      <th className="py-3.5 px-4 font-bold text-center">إجراءات التحويل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-white text-xs">{lead.full_name}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{lead.firm_name}</div>
                          <div className="text-[10px] text-amber-400 mt-0.5">
                            {lead.city} • فريق: {lead.team_size}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-mono font-bold text-slate-200">{lead.phone}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{lead.email}</div>
                          <div className="pt-1 flex items-center gap-2">
                            <a
                              href={`https://wa.me/2${lead.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-emerald-400 hover:underline"
                            >
                              محادثة واتساب ↗
                            </a>
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-[10px] font-bold text-blue-400 hover:underline"
                            >
                              اتصال هاتف
                            </a>
                          </div>
                        </td>

                        <td className="py-4 px-4 max-w-xs">
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {lead.message}
                          </p>
                          {lead.internal_notes && (
                            <div className="mt-1.5 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300">
                              ملاحظات الإدارة: {lead.internal_notes}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <select
                            value={lead.status}
                            onChange={(e) => handleLeadStatusChange(lead.id, e.target.value as LeadStatus)}
                            className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
                          >
                            <option value="new">جديد</option>
                            <option value="contacted">تم التواصل</option>
                            <option value="demo_scheduled">حجز ديمو</option>
                            <option value="converted">تم الاشتراك ✓</option>
                            <option value="archived">مغلق</option>
                          </select>
                        </td>

                        <td className="py-4 px-4 text-center">
                          {lead.status !== 'converted' ? (
                            <Button
                              type="button"
                              onClick={() => handleConvertLeadToFirm(lead)}
                              className="h-8 px-2.5 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>تحويل لمكتب مشترك</span>
                            </Button>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-bold">
                              تم قيده كمكتب مشترك ✓
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: COMPLAINTS & SUPPORT DESK */}
        {/* =================================================================== */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                    <span>مركز الدعم الفني وشكاوى مكاتب المحاماة ({complaints.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    متابعة التذاكر الفنية والمالية المقدمة من المحامين والرد عليها
                  </p>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="text"
                    value={ticketsSearch}
                    onChange={(e) => setTicketsSearch(e.target.value)}
                    placeholder="ابحث برقم التذكرة، اسم المحامي، الموضوع..."
                    className="h-10 ps-9 bg-slate-950/70 border-slate-800 text-xs rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 shrink-0">حالة التذكرة:</span>
                  <select
                    value={ticketsStatusFilter}
                    onChange={(e) => setTicketsStatusFilter(e.target.value)}
                    className="h-10 flex-1 px-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="new">جديدة</option>
                    <option value="in_progress">قيد المتابعة</option>
                    <option value="resolved">تم الحل ✓</option>
                    <option value="closed">مغلقة</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Complaints List */}
            <div className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 font-bold text-start">رقم التذكرة والأولوية</th>
                      <th className="py-3.5 px-4 font-bold text-start">مكتب المحاماة والمقدم</th>
                      <th className="py-3.5 px-4 font-bold text-start">الموضوع وتفاصيل التذكرة</th>
                      <th className="py-3.5 px-4 font-bold text-center">الحالة</th>
                      <th className="py-3.5 px-4 font-bold text-center">إجراءات الرد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {filteredTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-mono font-bold text-amber-400">{t.ticket_number}</div>
                          <div className="mt-1">{getPriorityBadge(t.priority)}</div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-white text-xs">{t.firm_name}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{t.user_name}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.user_phone}</div>
                        </td>

                        <td className="py-4 px-4 max-w-sm">
                          <div className="font-bold text-slate-200">{t.subject}</div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                            {t.message}
                          </p>
                          {t.resolution_notes && (
                            <div className="mt-1.5 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300">
                              رد الإدارة: {t.resolution_notes}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <select
                            value={t.status}
                            onChange={(e) => handleResolveTicket(t.id, e.target.value as TicketStatus)}
                            className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
                          >
                            <option value="new">جديدة</option>
                            <option value="in_progress">قيد المتابعة</option>
                            <option value="resolved">تم الحل ✓</option>
                            <option value="closed">مغلقة</option>
                          </select>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <Button
                            type="button"
                            onClick={() => {
                              setSelectedTicketId(t.id);
                              setResolutionText(t.resolution_notes || '');
                            }}
                            variant="outline"
                            className="h-8 px-2.5 text-[10px] bg-slate-800 border-slate-700 text-slate-200 hover:text-white rounded-lg"
                          >
                            الرد والحل
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: PRICING PLANS & QUOTAS */}
        {/* =================================================================== */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>إدارة خطط الاشتراكات وتسعير باقات المحامين</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                تعديل أسعار الباقات وحصص الاستخدام ينعكس فوراً ولحظياً على صفحة الهبوط وبوابة السداد
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{plan.name}</h3>
                      {plan.isPopular && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                          الأكثر طلباً
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                      {plan.description}
                    </p>

                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-400">السعر الشهري:</span>
                        <span className="text-lg font-black text-amber-400 font-mono">
                          {plan.monthlyPrice.toLocaleString('ar-EG')} ج.م
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-400">السعر السنوي:</span>
                        <span className="text-sm font-black text-white font-mono">
                          {plan.annualPrice.toLocaleString('ar-EG')} ج.م
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>أقصى عدد مستخدمين:</span>
                        <span className="font-bold text-white">{plan.maxUsers} مستخدمين</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>مساحة التخزين السحابي:</span>
                        <span className="font-bold text-white">{plan.maxStorageGb || plan.storageGb} جيجابايت</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 mb-2">مميزات الباقة:</p>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="text-[11px]">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleStartEditPlan(plan)}
                    className="w-full h-10 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>تعديل سعر الباقة</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 7: PLATFORM SETTINGS & BRANDING */}
        {/* =================================================================== */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <span>إعدادات وهوية المنصة السحابية</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                تخصيص الاسم التجاري، شعار المنصة، أرقام التواصل والدعم الفني، ومدة التجربة المجانية
              </p>
            </div>

            <form
              onSubmit={handleSaveBranding}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-300">اسم المنصة الرسمي</Label>
                  <Input
                    type="text"
                    value={brandForm.systemName}
                    onChange={(e) => setBrandForm({ ...brandForm, systemName: e.target.value })}
                    className="h-10 mt-1 bg-slate-950/70 border-slate-800 text-xs rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-xs text-slate-300">الوصف والتعريف الرئيسي</Label>
                  <Input
                    type="text"
                    value={brandForm.systemSubtitle}
                    onChange={(e) => setBrandForm({ ...brandForm, systemSubtitle: e.target.value })}
                    className="h-10 mt-1 bg-slate-950/70 border-slate-800 text-xs rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-xs text-slate-300">بريد الإدارة والتواصل الرسمي</Label>
                  <Input
                    type="email"
                    value={brandForm.contactEmail}
                    onChange={(e) => setBrandForm({ ...brandForm, contactEmail: e.target.value })}
                    className="h-10 mt-1 bg-slate-950/70 border-slate-800 text-xs rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-xs text-slate-300">رقم واتساب الدعم الفني المباشر</Label>
                  <Input
                    type="text"
                    value={brandForm.whatsappNumber}
                    onChange={(e) => setBrandForm({ ...brandForm, whatsappNumber: e.target.value })}
                    className="h-10 mt-1 bg-slate-950/70 border-slate-800 text-xs rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-xs text-slate-300">مدة الفترة التجريبية الافتراضية (أيام)</Label>
                  <Input
                    type="number"
                    value={brandForm.trialDays}
                    onChange={(e) => setBrandForm({ ...brandForm, trialDays: Number(e.target.value) })}
                    className="h-10 mt-1 bg-slate-950/70 border-slate-800 text-xs rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-xs text-slate-300">العملة الافتراضية</Label>
                  <Input
                    type="text"
                    value={brandForm.currency}
                    onChange={(e) => setBrandForm({ ...brandForm, currency: e.target.value })}
                    className="h-10 mt-1 bg-slate-950/70 border-slate-800 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <Button
                  type="submit"
                  className="h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl px-6 gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ إعدادات وهوية المنصة</span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* MODAL: ADD LAW FIRM */}
      {/* =================================================================== */}
      {showAddFirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>قيد مكتب محاماة جديد في المنصة</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddFirmModal(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFirm} className="space-y-3.5">
              <div>
                <Label className="text-xs text-slate-300">اسم مكتب أو شركة المحاماة *</Label>
                <Input
                  type="text"
                  value={newFirmName}
                  onChange={(e) => setNewFirmName(e.target.value)}
                  placeholder="مثال: مكتب المستشار أحمد خليل للمحاماة"
                  required
                  className="h-10 mt-1 bg-slate-950 border-slate-800 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-300">اسم المالك / المحامي الرئيسي *</Label>
                  <Input
                    type="text"
                    value={newFirmOwner}
                    onChange={(e) => setNewFirmOwner(e.target.value)}
                    placeholder="المستشار / أحمد خليل"
                    required
                    className="h-10 mt-1 bg-slate-950 border-slate-800 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-300">رقم الهاتف / واتساب *</Label>
                  <Input
                    type="text"
                    value={newFirmPhone}
                    onChange={(e) => setNewFirmPhone(e.target.value)}
                    placeholder="01012345678"
                    required
                    className="h-10 mt-1 bg-slate-950 border-slate-800 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-300">البريد الإلكتروني للإدارة *</Label>
                  <Input
                    type="email"
                    value={newFirmEmail}
                    onChange={(e) => setNewFirmEmail(e.target.value)}
                    placeholder="ahmed@khalil-law.com"
                    required
                    className="h-10 mt-1 bg-slate-950 border-slate-800 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-300">المحافظة / المدينة</Label>
                  <Input
                    type="text"
                    value={newFirmCity}
                    onChange={(e) => setNewFirmCity(e.target.value)}
                    placeholder="القاهرة (مدينة نصر)"
                    className="h-10 mt-1 bg-slate-950 border-slate-800 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-300">باقة الاشتراك</Label>
                  <select
                    value={newFirmPlan}
                    onChange={(e) => setNewFirmPlan(e.target.value as any)}
                    className="h-10 w-full mt-1 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    <option value="individual">باقة المحامي الفردي</option>
                    <option value="office">باقة المكاتب المتوسطة</option>
                    <option value="enterprise">باقة المكاتب الكبرى</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-slate-300">حالة الحساب</Label>
                  <select
                    value={newFirmStatus}
                    onChange={(e) => setNewFirmStatus(e.target.value as any)}
                    className="h-10 w-full mt-1 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    <option value="active">نشط ومسدد</option>
                    <option value="trial">فترة تجريبية (14 يوماً)</option>
                    <option value="suspended">معلق</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddFirmModal(false)}
                  className="h-10 text-xs bg-slate-800 border-slate-700 text-slate-300 rounded-xl"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl px-5"
                >
                  قيد وتفعيل المكتب الآن
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: EDIT PLAN PRICING */}
      {/* =================================================================== */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>تعديل سعر {editingPlan.name}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <Label className="text-xs text-slate-300">السعر الشهري (ج.م)</Label>
                <Input
                  type="number"
                  value={monthlyPriceInput}
                  onChange={(e) => setMonthlyPriceInput(Number(e.target.value))}
                  className="h-10 mt-1 bg-slate-950 border-slate-800 text-xs rounded-xl"
                />
              </div>

              <div>
                <Label className="text-xs text-slate-300">السعر السنوي (ج.م)</Label>
                <Input
                  type="number"
                  value={annualPriceInput}
                  onChange={(e) => setAnnualPriceInput(Number(e.target.value))}
                  className="h-10 mt-1 bg-slate-950 border-slate-800 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingPlan(null)}
                className="h-10 text-xs bg-slate-800 border-slate-700 text-slate-300 rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={handleSavePlanPrice}
                className="h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl px-5"
              >
                حفظ السعر الجديد
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: FIRM DETAILS */}
      {/* =================================================================== */}
      {selectedFirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>ملف مكتب {selectedFirm.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedFirm(null)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">المالك:</span>
                  <span className="font-bold text-white">{selectedFirm.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">البريد الإلكتروني:</span>
                  <span className="font-mono text-slate-300">{selectedFirm.ownerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">الهاتف:</span>
                  <span className="font-mono text-slate-300">{selectedFirm.ownerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">المقر:</span>
                  <span className="text-slate-300">{selectedFirm.address || selectedFirm.city}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">القضايا</span>
                  <span className="text-base font-bold text-amber-400">{selectedFirm.casesCount}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">الموكلون</span>
                  <span className="text-base font-bold text-blue-400">{selectedFirm.clientsCount}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">المستخدمون</span>
                  <span className="text-base font-bold text-emerald-400">{selectedFirm.usersCount}</span>
                </div>
              </div>

              {selectedFirm.notes && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400">
                  <span className="font-bold text-slate-300 block mb-1">ملاحظات المكتب:</span>
                  {selectedFirm.notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between">
              <Button
                type="button"
                onClick={() => {
                  deleteFirm(selectedFirm.id);
                  setSelectedFirm(null);
                  showToast(`تم حذف مكتب "${selectedFirm.name}" من النظام`, 'info');
                }}
                variant="outline"
                className="h-9 text-xs bg-rose-950/40 text-rose-300 border-rose-800 hover:bg-rose-900 rounded-xl"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف المكتب</span>
              </Button>

              <Button
                type="button"
                onClick={() => setSelectedFirm(null)}
                className="h-9 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: ADD INVOICE */}
      {/* =================================================================== */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>إصدار وتوثيق فاتورة اشتراك</span>
            </h3>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5">
              <div>
                <Label className="text-xs text-slate-300">مكتب المحاماة</Label>
                <select
                  value={invFirmId}
                  onChange={(e) => setInvFirmId(e.target.value)}
                  className="h-10 w-full mt-1 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                >
                  <option value="">اختر المكتب...</option>
                  {firms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.ownerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs text-slate-300">وصف الباقة والفاتورة</Label>
                <Input
                  type="text"
                  value={invPlanName}
                  onChange={(e) => setInvPlanName(e.target.value)}
                  className="h-10 mt-1 bg-slate-950 border-slate-800 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-300">المبلغ المسدد (ج.م)</Label>
                  <Input
                    type="number"
                    value={invAmount}
                    onChange={(e) => setInvAmount(Number(e.target.value))}
                    className="h-10 mt-1 bg-slate-950 border-slate-800 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-300">طريقة الدفع</Label>
                  <select
                    value={invMethod}
                    onChange={(e) => setInvMethod(e.target.value as any)}
                    className="h-10 w-full mt-1 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    <option value="instapay">انستا باي (InstaPay)</option>
                    <option value="bank_transfer">تحويل بنكي</option>
                    <option value="credit_card">بطاقة ائتمان</option>
                    <option value="vodafone_cash">فودافون كاش</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddInvoiceModal(false)}
                  className="h-10 text-xs bg-slate-800 border-slate-700 text-slate-300 rounded-xl"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-5"
                >
                  تسجيل الفاتورة
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: TICKET RESOLUTION */}
      {/* =================================================================== */}
      {selectedTicketId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <span>كتابة رد وحل التذكرة</span>
            </h3>

            <div>
              <Label className="text-xs text-slate-300">ملاحظات الحل والرد على المحامي</Label>
              <Textarea
                rows={4}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="اكتب تفاصيل الحل الذي تم اتخاذه..."
                className="mt-1 bg-slate-950 border-slate-800 text-xs rounded-xl"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedTicketId(null)}
                className="h-10 text-xs bg-slate-800 border-slate-700 text-slate-300 rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={() => handleResolveTicket(selectedTicketId, 'resolved')}
                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-5"
              >
                تأكيد الحل وحفظ الرد
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboardPage;
