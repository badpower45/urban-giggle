import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Building,
  User,
  Phone,
  Briefcase,
  Eye,
  Edit2,
  FileText,
  UserPlus,
  X,
  Mail,
  MapPin,
} from "lucide-react";
import { apiClient } from "../../lib/api/client";
import { Client, ClientType } from "../../types";
import { CountBadge } from "../../components/common/CountBadge";
import { ViewToggle } from "../../components/common/ViewToggle";
import { EmptyState } from "../../components/common/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";

export const ClientsPage: React.FC = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  // Modal create client
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [clientType, setClientType] = useState<ClientType>("individual");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [occupation, setOccupation] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getClients({
        search: search.trim() || undefined,
      });
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadClients();
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    setSubmitting(true);
    try {
      await apiClient.createClient({
        full_name: fullName.trim(),
        client_type: clientType,
        phone: phone.trim(),
        national_id: clientType === "individual" ? nationalId.trim() || undefined : undefined,
        company_reg: clientType === "company" ? nationalId.trim() || undefined : undefined,
        occupation: occupation.trim() || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      setIsCreateOpen(false);
      setFullName("");
      setPhone("");
      setNationalId("");
      setOccupation("");
      setAddress("");
      setNotes("");
      await loadClients();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Sorted and filtered clients
  const sortedClients = [...clients].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === "most_cases") {
      return (b.case_count || 0) - (a.case_count || 0);
    }
    if (sortBy === "least_cases") {
      return (a.case_count || 0) - (b.case_count || 0);
    }
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-3 sm:space-y-5 sm:p-6">
      {/* Header: Title + CountBadge + Action Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex items-baseline gap-2">
          <h1 className="truncate font-headline text-primary text-xl font-semibold sm:text-2xl">
            دليل الموكلين
          </h1>
          <CountBadge count={clients.length} isLoading={loading} />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-9 shrink-0 hidden sm:flex items-center gap-1.5 border border-border bg-white px-3 text-xs font-semibold text-primary rounded-lg hover:bg-neutral transition-colors shadow-2xs"
          >
            <span>تسجيل سريع</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/firm/clients/new")}
            className="h-9 shrink-0 flex items-center gap-1.5 bg-primary px-3.5 text-xs font-semibold text-white rounded-lg hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>موكل جديد</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Search + Sort Dropdown + View Mode Toggle */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:max-w-xl">
          {/* Search Input */}
          <div className="relative min-w-0 flex-1">
            <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none" />
            <input
              type="text"
              placeholder="بحث بالاسم، رقم الهاتف، أو الرقم القومي..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 ps-9 pe-9 rounded-lg border border-border bg-white text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-primary"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  loadClients();
                }}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-tertiary hover:text-primary rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Select */}
          <div className="w-full sm:w-44 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:border-primary"
            >
              <option value="newest">الأحدث تسجيلاً</option>
              <option value="oldest">الأقدم تسجيلاً</option>
              <option value="most_cases">الأكثر قضايا</option>
              <option value="least_cases">الأقل قضايا</option>
            </select>
          </div>
        </form>

        {/* View Toggle (Grid / Table) */}
        <ViewToggle
          viewMode={viewMode}
          onChange={setViewMode}
          className="self-end sm:self-auto"
        />
      </div>

      {/* Main Content: Table or Grid */}
      {loading ? (
        <div className="p-8 text-center text-tertiary space-y-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">جارٍ تحميل الموكلين...</p>
        </div>
      ) : sortedClients.length === 0 ? (
        <div className="rounded-xl border border-border bg-white py-12 px-4 text-center shadow-xs">
          <EmptyState
            icon={Users}
            title="لم يتم العثور على موكلين"
            description="لم يتم العثور على أي موكلين يطابقون معايير البحث المحددة."
            actionLabel="إضافة موكل جديد"
            onAction={() => setIsCreateOpen(true)}
          />
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="rounded-xl border border-border bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-neutral/60 text-tertiary text-[11px] font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-start">الاسم الكامل</th>
                  <th className="px-4 py-3 text-start hidden sm:table-cell">الهاتف</th>
                  <th className="px-4 py-3 text-start hidden md:table-cell">البريد الإلكتروني</th>
                  <th className="px-4 py-3 text-start hidden lg:table-cell">الرقم القومي / السجل</th>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">عدد القضايا</th>
                  <th className="px-4 py-3 text-end w-20">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedClients.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => navigate(`/firm/clients/${client.id}`)}
                    className="hover:bg-neutral/60 cursor-pointer transition-colors"
                  >
                    {/* Name & Type */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {client.full_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-primary truncate leading-tight">
                            {client.full_name}
                          </p>
                          <p className="text-[10px] text-tertiary truncate">
                            {client.client_type === "company" ? "شركة / كيان" : client.occupation || "فرد"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 text-primary hidden sm:table-cell">
                      {client.phone ? (
                        <span dir="ltr" className="inline-block font-mono">
                          {client.phone}
                        </span>
                      ) : (
                        <span className="text-tertiary">—</span>
                      )}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-primary hidden md:table-cell">
                      {client.email ? (
                        <span dir="ltr" className="inline-block font-mono">
                          {client.email}
                        </span>
                      ) : (
                        <span className="text-tertiary">—</span>
                      )}
                    </td>

                    {/* National ID / Reg */}
                    <td className="px-4 py-3 text-primary hidden lg:table-cell">
                      {client.national_id || client.company_reg ? (
                        <span dir="ltr" className="inline-block font-mono">
                          {client.national_id || client.company_reg}
                        </span>
                      ) : (
                        <span className="text-tertiary">—</span>
                      )}
                    </td>

                    {/* Cases Count Badge */}
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 rounded-md bg-neutral border border-border px-2.5 py-0.5 text-xs font-semibold text-secondary">
                        <Briefcase size={12} className="text-tertiary" />
                        {client.case_count || 0}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-end whitespace-nowrap">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          to={`/firm/clients/${client.id}`}
                          title="عرض الملف"
                          className="p-1 rounded-md text-tertiary hover:text-primary hover:bg-neutral transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/firm/clients/${client.id}/edit`}
                          title="تعديل"
                          className="p-1 rounded-md text-tertiary hover:text-primary hover:bg-neutral transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sortedClients.map((client) => (
            <div
              key={client.id}
              onClick={() => navigate(`/firm/clients/${client.id}`)}
              className="rounded-xl border border-border bg-white p-4 shadow-xs hover:border-slate-300 cursor-pointer transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {client.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-primary leading-tight">
                        {client.full_name}
                      </h3>
                      <p className="text-[11px] text-tertiary">
                        {client.client_type === "company" ? "شركة / مؤسسة" : client.occupation || "فرد"}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-neutral border border-border px-2 py-0.5 text-[11px] font-semibold text-secondary">
                    <Briefcase size={11} className="text-tertiary" />
                    {client.case_count || 0}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-tertiary pt-2 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span dir="ltr" className="font-mono text-primary">{client.phone}</span>
                  </div>
                  {client.address && (
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-tertiary">
                  {client.active_cases ? `${client.active_cases} قضايا متداولة` : "لا توجد قضايا نشطة"}
                </span>
                <Link
                  to={`/firm/clients/${client.id}`}
                  className="font-medium text-secondary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  عرض الملف &larr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Client */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="font-headline text-lg font-bold text-primary">
              إضافة موكل جديد
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateClient} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  نوع الموكل <span className="text-red-500">*</span>
                </label>
                <select
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as ClientType)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                >
                  <option value="individual">فرد / شخص طبيعي</option>
                  <option value="company">شركة / كيان اعتباري</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="010XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">
                الاسم الكامل للموكل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="أدخل الاسم الثلاثي أو اسم الشركة..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  {clientType === "company" ? "رقم السجل التجاري" : "الرقم القومي (14 رقم)"}
                </label>
                <input
                  type="text"
                  placeholder={clientType === "company" ? "السجل التجاري..." : "الرقم القومي..."}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  {clientType === "company" ? "الممثل القانوني" : "المهنة / الوظيفة"}
                </label>
                <input
                  type="text"
                  placeholder={clientType === "company" ? "رئيس مجلس الإدارة..." : "طبيب، مهندس، تاجر..."}
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">العنوان</label>
              <input
                type="text"
                placeholder="المحافظة، المدينة، الشارع..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-primary block mb-1">ملاحظات إضافية</label>
              <textarea
                rows={2}
                placeholder="أي تفاصيل أو ملاحظات خاصة بالموكل..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-md border border-border bg-white text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="h-9 px-4 rounded-md border border-border text-xs font-medium text-tertiary hover:text-primary hover:bg-neutral"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-9 px-4 rounded-md bg-primary text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? "جارٍ الحفظ..." : "حفظ الموكل"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ClientsPage;
