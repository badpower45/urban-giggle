import React, { useState } from 'react';
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
} from 'lucide-react';
import { usePlatformStore } from '../../lib/platformStore';
import {
  LeadStatus,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  AdminSubscriptionPlan,
} from '../../types/admin';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../components/common/Toast';
import { Link } from 'react-router-dom';

type AdminTab = 'leads' | 'complaints' | 'pricing' | 'branding';

export const SuperAdminDashboardPage: React.FC = () => {
  const { showToast } = useToast();
  const {
    settings,
    plans,
    leads,
    complaints,
    stats,
    updateSettings,
    updatePlans,
    updatePlanPrice,
    updateLeadStatus,
    updateComplaintStatus,
  } = usePlatformStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('leads');

  // Search & Filter States
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsStatusFilter, setLeadsStatusFilter] = useState<string>('all');

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

  // Filter Leads
  const filteredLeads = leads.filter((l) => {
    const matchesQuery =
      l.full_name.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.firm_name.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.phone.includes(leadsSearch);
    const matchesStatus =
      leadsStatusFilter === 'all' || l.status === leadsStatusFilter;
    return matchesQuery && matchesStatus;
  });

  // Filter Tickets
  const filteredTickets = complaints.filter((t) => {
    const matchesQuery =
      t.subject.toLowerCase().includes(ticketsSearch.toLowerCase()) ||
      t.firm_name.toLowerCase().includes(ticketsSearch.toLowerCase()) ||
      t.user_name.toLowerCase().includes(ticketsSearch.toLowerCase()) ||
      t.ticket_number.toLowerCase().includes(ticketsSearch.toLowerCase());
    const matchesStatus =
      ticketsStatusFilter === 'all' || t.status === ticketsStatusFilter;
    const matchesCategory =
      ticketsCategoryFilter === 'all' || t.category === ticketsCategoryFilter;
    return matchesQuery && matchesStatus && matchesCategory;
  });

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

  const getPriorityBadge = (p: TicketPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">طارئ وعاجل ⚡</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">أولوية عالية</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">متوسطة</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral text-muted-foreground">عادية</span>;
    }
  };

  const getStatusBadge = (s: TicketStatus | LeadStatus) => {
    switch (s) {
      case 'new':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">جديد</span>;
      case 'in_progress':
      case 'contacted':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">قيد المتابعة</span>;
      case 'demo_scheduled':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">تم حجز ديمو</span>;
      case 'resolved':
      case 'converted':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">مكتمل / مشترك ✓</span>;
      case 'closed':
      case 'archived':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral text-muted-foreground">مغلق</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-primary flex flex-col" dir="rtl">
      {/* Top Admin Navigation Header */}
      <header className="bg-primary text-white border-b border-primary-hover px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-secondary text-primary font-black text-lg">
            ⚖️
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black font-headline tracking-tight">
                لوحة الإدارة العليا والتحكم المركزي
              </h1>
              <span className="bg-secondary/20 text-secondary border border-secondary/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-white/70">
              إدارة طلبات صفحة الهبوط، الشكاوى والاستفسارات، وتعديل أسعار الاشتراكات واسم المنصة ({brandForm.systemName})
            </p>
          </div>
        </div>

        {/* Quick Switch Links */}
        <div className="flex items-center gap-2">
          <Link
            to="/firm/dashboard"
            className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>لوحة تحكم المكتب</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/"
            className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-primary hover:bg-amber-400 font-bold transition-colors"
          >
            زيارة صفحة الهبوط (Landing)
          </Link>
        </div>
      </header>

      {/* KPI Overview Cards */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Leads */}
        <div className="bg-white p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold">طلبات تواصل الهبوط (جديدة)</p>
            <p className="text-2xl font-black text-primary font-headline mt-1">
              {stats.newLeadsCount}{' '}
              <span className="text-xs text-muted-foreground font-normal">من {stats.totalLeads}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Open Tickets */}
        <div className="bg-white p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold">تذاكر وشكاوى تحتاج رد</p>
            <p className="text-2xl font-black text-amber-600 font-headline mt-1">
              {stats.openTicketsCount}{' '}
              {stats.urgentTicketsCount > 0 && (
                <span className="text-xs text-rose-600 font-bold">({stats.urgentTicketsCount} عاجل)</span>
              )}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Active Firms */}
        <div className="bg-white p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold">المكاتب المشتركة النشطة</p>
            <p className="text-2xl font-black text-emerald-700 font-headline mt-1">
              {stats.totalSubscribedFirms}{' '}
              <span className="text-xs text-muted-foreground font-normal">مكتب</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Estimated MRR */}
        <div className="bg-white p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold">الإيراد الشهري التقريبي</p>
            <p className="text-2xl font-black text-primary font-headline mt-1" dir="ltr">
              {stats.monthlyRevenueEstimate.toLocaleString('ar-EG')}{' '}
              <span className="text-xs text-muted-foreground font-semibold">ج.م</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        <div className="flex border-b border-border bg-white px-4 rounded-t-xl gap-2 sm:gap-4 overflow-x-auto">
          {/* Tab 1: Leads */}
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'leads'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>طلبات التواصل من صفحة الهبوط</span>
            {stats.newLeadsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold">
                {stats.newLeadsCount}
              </span>
            )}
          </button>

          {/* Tab 2: Complaints & Tickets */}
          <button
            type="button"
            onClick={() => setActiveTab('complaints')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'complaints'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>الشكاوى والاستفسارات والدعم الفني</span>
            {stats.openTicketsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px] font-mono font-bold">
                {stats.openTicketsCount}
              </span>
            )}
          </button>

          {/* Tab 3: Pricing Management */}
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>إدارة أسعار وباقات الاشتراكات</span>
          </button>

          {/* Tab 4: System Branding */}
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'branding'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>تغيير اسم وهوية النظام</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        {/* TAB 1: LANDING PAGE CONTACT REQUESTS (LEADS) */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-border flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={leadsSearch}
                  onChange={(e: any) => setLeadsSearch(e.target.value)}
                  placeholder="ابحث بالاسم، اسم المكتب، أو رقم الهاتف..."
                  className="pr-9 text-xs h-9"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold">تصفية الحالة:</span>
                <select
                  value={leadsStatusFilter}
                  onChange={(e) => setLeadsStatusFilter(e.target.value)}
                  className="text-xs h-9 px-3 rounded-lg border border-border bg-white text-primary focus:outline-none"
                >
                  <option value="all">جميع الحالات ({leads.length})</option>
                  <option value="new">طلبات جديدة فقط</option>
                  <option value="contacted">تم التواصل معهم</option>
                  <option value="demo_scheduled">تم حجز ديمو</option>
                  <option value="converted">تم التحويل لاشتراك</option>
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-xl border border-border overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-neutral/60 border-b border-border text-primary font-bold">
                    <tr>
                      <th className="p-3.5">المحامي / المكتب</th>
                      <th className="p-3.5">بيانات التواصل</th>
                      <th className="p-3.5">المحافظة / الحجم</th>
                      <th className="p-3.5">تفاصيل الاستفسار</th>
                      <th className="p-3.5">تاريخ الطلب</th>
                      <th className="p-3.5">الحالة</th>
                      <th className="p-3.5 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-neutral/30 transition-colors">
                        <td className="p-3.5">
                          <p className="font-bold text-primary text-sm">{lead.full_name}</p>
                          <p className="text-muted-foreground text-[11px] mt-0.5">{lead.firm_name}</p>
                        </td>
                        <td className="p-3.5 space-y-1">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline flex items-center gap-1 font-mono font-bold"
                          >
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </a>
                          <p className="text-muted-foreground text-[10px] font-mono">{lead.email}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-semibold">{lead.city}</p>
                          <span className="text-[10px] text-muted-foreground bg-neutral px-2 py-0.5 rounded">
                            فريق: {lead.team_size} محامين
                          </span>
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <p className="line-clamp-2 text-muted-foreground text-[11px] leading-relaxed">
                            {lead.message}
                          </p>
                          {lead.internal_notes && (
                            <p className="text-[10px] text-amber-800 bg-amber-50 p-1 rounded mt-1 border border-amber-200">
                              📌 ملاحظة: {lead.internal_notes}
                            </p>
                          )}
                        </td>
                        <td className="p-3.5 text-muted-foreground font-mono text-[11px]">
                          {new Date(lead.created_at).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="p-3.5">
                          {getStatusBadge(lead.status)}
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <select
                              value={lead.status}
                              onChange={(e) =>
                                handleLeadStatusChange(lead.id, e.target.value as LeadStatus)
                              }
                              className="text-[11px] h-7 px-2 rounded border border-border bg-white"
                            >
                              <option value="new">جديد</option>
                              <option value="contacted">تم التواصل</option>
                              <option value="demo_scheduled">حجز ديمو</option>
                              <option value="converted">مشترك مفعّل</option>
                              <option value="archived">أرشفة</option>
                            </select>

                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `أهلاً بك أستاذ ${lead.full_name}، نتواصل معك بخصوص طلبك لنظام ${brandForm.systemName} لإدارة مكاتب المحاماة.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                              title="محادثة واتساب سريعة"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">
                          لا توجد طلبات تواصل مطابقة لبحثك.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUPPORT TICKETS & COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-border flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={ticketsSearch}
                  onChange={(e: any) => setTicketsSearch(e.target.value)}
                  placeholder="ابحث برقم التذكرة، العنوان، أو اسم المكتب..."
                  className="pr-9 text-xs h-9"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={ticketsCategoryFilter}
                  onChange={(e) => setTicketsCategoryFilter(e.target.value)}
                  className="text-xs h-9 px-3 rounded-lg border border-border bg-white"
                >
                  <option value="all">جميع التصنيفات</option>
                  <option value="technical">مشاكل فنية وتقنية</option>
                  <option value="billing">فواتير واشتراكات</option>
                  <option value="inquiry">استفسارات عامة</option>
                  <option value="feature_request">اقتراحات ميزات</option>
                </select>

                <select
                  value={ticketsStatusFilter}
                  onChange={(e) => setTicketsStatusFilter(e.target.value)}
                  className="text-xs h-9 px-3 rounded-lg border border-border bg-white"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="new">جديد فقط</option>
                  <option value="in_progress">قيد المعالجة</option>
                  <option value="resolved">تم الحل</option>
                  <option value="closed">مغلقة</option>
                </select>
              </div>
            </div>

            {/* Complaints Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                    ticket.priority === 'urgent' && ticket.status !== 'resolved'
                      ? 'border-rose-300 ring-1 ring-rose-200'
                      : 'border-border'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header: Ticket Number & Priority */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary bg-neutral px-2 py-0.5 rounded border border-border">
                          {ticket.ticket_number}
                        </span>
                        {getPriorityBadge(ticket.priority)}
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>

                    {/* Subject */}
                    <h3 className="font-bold text-sm text-primary leading-snug">
                      {ticket.subject}
                    </h3>

                    {/* Details Info */}
                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-border/50">
                      <span>🏛️ {ticket.firm_name}</span>
                      <span>👤 {ticket.user_name}</span>
                      <span className="font-mono" dir="ltr">📞 {ticket.user_phone}</span>
                    </div>

                    {/* Message Body */}
                    <p className="text-xs text-primary/80 bg-neutral/40 p-3 rounded-lg border border-border/60 leading-relaxed">
                      {ticket.message}
                    </p>

                    {/* Resolution Note if present */}
                    {ticket.resolution_notes && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                        <p className="font-bold">✓ رد مسؤول الدعم / الإدارة:</p>
                        <p className="mt-0.5">{ticket.resolution_notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {new Date(ticket.created_at).toLocaleDateString('ar-EG')}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTicketId(ticket.id);
                          setResolutionText(ticket.resolution_notes || '');
                        }}
                        className="text-xs h-8 px-3 gap-1 border-primary/20"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>الرد والمعالجة</span>
                      </Button>

                      {ticket.status !== 'resolved' && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleResolveTicket(ticket.id, 'resolved')}
                          className="text-xs h-8 px-3 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>إغلاق كتم الحل</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredTickets.length === 0 && (
                <div className="col-span-2 bg-white p-12 text-center rounded-xl border border-border text-muted-foreground text-xs">
                  لا توجد تذاكر أو شكاوى مطابقة.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIPTION PLANS & PRICING MANAGEMENT */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-border flex items-center justify-between shadow-xs">
              <div>
                <h2 className="text-base font-bold text-primary font-headline">
                  إدارة أسعار وخطط الاشتراكات بالنظام
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  أي تعديل في الأسعار هنا سينعكس فوراً وتلقائياً على صفحة الأسعار بالهبوط وصفحة ترقية الاشتراك للمكاتب.
                </p>
              </div>
            </div>

            {/* Plans Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between space-y-6 relative transition-all ${
                    plan.isPopular
                      ? 'border-secondary ring-2 ring-secondary/20 shadow-md'
                      : 'border-border'
                  }`}
                >
                  {plan.badgeText && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-primary font-bold text-[11px] px-3 py-0.5 rounded-full shadow-xs">
                      {plan.badgeText}
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-primary font-headline">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price Display */}
                    <div className="bg-neutral/50 p-4 rounded-xl border border-border text-center space-y-1">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-black text-primary font-headline">
                          {plan.monthlyPrice.toLocaleString('ar-EG')}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">
                          {brandForm.currency} / شهرياً
                        </span>
                      </div>

                      <p className="text-xs text-emerald-700 font-semibold">
                        أو {plan.annualPrice.toLocaleString('ar-EG')} {brandForm.currency} عند السداد السنوي
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <p className="text-xs font-bold text-primary">المزايا والحدود:</p>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <Button
                    type="button"
                    onClick={() => handleStartEditPlan(plan)}
                    className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold h-10 gap-2 shadow-xs"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>تعديل سعر وبنود {plan.name}</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM BRANDING & SETTINGS */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-black text-primary font-headline">
                تغيير اسم وهوية المنصة المركزية
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                يمكنك من هنا تخصيص اسم النظام، العملة الرسمية، وأرقام التواصل التي تظهر لجميع المحامين والزوار.
              </p>
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* System Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="sys-name" className="text-xs font-bold text-primary">
                    اسم النظام / المنصة *
                  </Label>
                  <Input
                    id="sys-name"
                    value={brandForm.systemName}
                    onChange={(e: any) =>
                      setBrandForm((prev) => ({ ...prev, systemName: e.target.value }))
                    }
                    placeholder="مثال: سِـيَـاق، ميزان، عدل..."
                    required
                    className="text-sm font-bold h-10"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    هذا الاسم يظهر في الترويسة، العقود، شاشة الدخول، وصفحة الهبوط.
                  </p>
                </div>

                {/* Subtitle */}
                <div className="space-y-1.5">
                  <Label htmlFor="sys-sub" className="text-xs font-bold text-primary">
                    الشعار الوصفي المختصر
                  </Label>
                  <Input
                    id="sys-sub"
                    value={brandForm.systemSubtitle}
                    onChange={(e: any) =>
                      setBrandForm((prev) => ({ ...prev, systemSubtitle: e.target.value }))
                    }
                    placeholder="مثال: نظام إدارة مكاتب وشركات المحاماة"
                    className="text-xs h-10"
                  />
                </div>

                {/* Currency */}
                <div className="space-y-1.5">
                  <Label htmlFor="sys-curr" className="text-xs font-bold text-primary">
                    رمز العملة المعتمدة
                  </Label>
                  <Input
                    id="sys-curr"
                    value={brandForm.currency}
                    onChange={(e: any) =>
                      setBrandForm((prev) => ({ ...prev, currency: e.target.value }))
                    }
                    placeholder="مثال: ج.م أو EGP أو ر.س"
                    className="text-xs h-10 font-bold"
                  />
                </div>

                {/* Trial Days */}
                <div className="space-y-1.5">
                  <Label htmlFor="sys-trial" className="text-xs font-bold text-primary">
                    فترة التجربة المجانية (بالأيام)
                  </Label>
                  <Input
                    id="sys-trial"
                    type="number"
                    value={brandForm.trialDays}
                    onChange={(e: any) =>
                      setBrandForm((prev) => ({ ...prev, trialDays: Number(e.target.value) }))
                    }
                    className="text-xs h-10"
                  />
                </div>

                {/* Support Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="sys-email" className="text-xs font-bold text-primary">
                    بريد الدعم الفني والمراسلات
                  </Label>
                  <Input
                    id="sys-email"
                    type="email"
                    value={brandForm.contactEmail}
                    onChange={(e: any) =>
                      setBrandForm((prev) => ({ ...prev, contactEmail: e.target.value }))
                    }
                    className="text-xs h-10 font-mono"
                    dir="ltr"
                  />
                </div>

                {/* WhatsApp Support Number */}
                <div className="space-y-1.5">
                  <Label htmlFor="sys-whatsapp" className="text-xs font-bold text-primary">
                    رقم واتساب المعتمد للمنصة
                  </Label>
                  <Input
                    id="sys-whatsapp"
                    value={brandForm.whatsappNumber}
                    onChange={(e: any) =>
                      setBrandForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                    }
                    className="text-xs h-10 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <Label htmlFor="sys-tagline" className="text-xs font-bold text-primary">
                  الوصف الكامل والشعار الرئيسي
                </Label>
                <Textarea
                  id="sys-tagline"
                  value={brandForm.tagline}
                  onChange={(e: any) =>
                    setBrandForm((prev) => ({ ...prev, tagline: e.target.value }))
                  }
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold h-10 px-6 gap-2 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ إعدادات واسم النظام</span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Edit Plan Price Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-border text-right" dir="rtl">
            <h3 className="text-base font-bold text-primary font-headline">
              تعديل أسعار {editingPlan.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              حدد السعر الشهري والسنوي الجديد وسيتم تفعيله مباشرة على النظام.
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold">السعر الشهري ({brandForm.currency})</Label>
                <Input
                  type="number"
                  value={monthlyPriceInput}
                  onChange={(e: any) => setMonthlyPriceInput(Number(e.target.value))}
                  className="text-sm font-bold h-10"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">السعر السنوي ({brandForm.currency})</Label>
                <Input
                  type="number"
                  value={annualPriceInput}
                  onChange={(e: any) => setAnnualPriceInput(Number(e.target.value))}
                  className="text-sm font-bold h-10"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingPlan(null)}
                className="text-xs h-9"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={handleSavePlanPrice}
                className="bg-primary text-white text-xs font-bold h-9 px-4 gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>تحديث الأسعار الآن</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Reply Modal */}
      {selectedTicketId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-border text-right" dir="rtl">
            <h3 className="text-base font-bold text-primary font-headline">
              تسجيل رد وملاحظات معالجة التذكرة
            </h3>
            <p className="text-xs text-muted-foreground">
              اكتب الإجراء الذي تم اتخاذه مع المحامي أو التوجيهات الفنية.
            </p>

            <div className="space-y-2 pt-1">
              <Label className="text-xs font-bold">نص الرد / الإجراء المتخذ:</Label>
              <Textarea
                value={resolutionText}
                onChange={(e: any) => setResolutionText(e.target.value)}
                placeholder="اكتب تفاصيل الحل أو ما تم التواصل بشأنه..."
                rows={4}
                className="text-xs resize-none"
              />
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedTicketId(null)}
                className="text-xs h-9"
              >
                إلغاء
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleResolveTicket(selectedTicketId, 'in_progress')}
                  className="text-xs h-9 border-amber-300 text-amber-900 bg-amber-50 font-semibold"
                >
                  حفظ كـ "قيد المعالجة"
                </Button>
                <Button
                  type="button"
                  onClick={() => handleResolveTicket(selectedTicketId, 'resolved')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9 px-4"
                >
                  حفظ واعتماد كـ "تم الحل ✓"
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
