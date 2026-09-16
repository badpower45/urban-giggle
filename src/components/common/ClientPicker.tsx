import React, { useState, useEffect, useRef } from "react";
import { User, Building, Plus, Search, Check, ChevronDown, Phone } from "lucide-react";
import { Client, ClientType } from "../../types";
import { apiClient } from "../../lib/api/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

interface ClientPickerProps {
  value?: string;
  onChange: (clientId: string, clientName: string) => void;
  error?: string;
}

export const ClientPicker: React.FC<ClientPickerProps> = ({
  value,
  onChange,
  error,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Quick Add Form state
  const [fullName, setFullName] = useState("");
  const [clientType, setClientType] = useState<ClientType>("individual");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [address, setAddress] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await apiClient.getClients();
      setClients(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedClient = clients.find((c) => c.id === value);

  const filteredClients = clients.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.national_id && c.national_id.includes(search))
  );

  const handleSelect = (client: Client) => {
    onChange(client.id, client.full_name);
    setIsOpen(false);
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError("اسم الموكل مطلوب");
      return;
    }
    if (!phone.trim()) {
      setFormError("رقم الهاتف مطلوب");
      return;
    }

    setIsSubmitting(true);
    try {
      const newClient = await apiClient.createClient({
        full_name: fullName.trim(),
        client_type: clientType,
        phone: phone.trim(),
        national_id: nationalId.trim() || undefined,
        address: address.trim() || undefined,
      });

      await loadClients();
      onChange(newClient.id, newClient.full_name);
      setIsQuickAddOpen(false);

      // Reset form
      setFullName("");
      setPhone("");
      setNationalId("");
      setAddress("");
      setFormError("");
    } catch (err) {
      setFormError("حدث خطأ أثناء حفظ الموكل");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-sm font-semibold text-primary mb-1.5">
        الموكل <span className="text-destructive">*</span>
      </label>

      {/* Main Select Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full h-11 px-3.5 py-2 rounded-xl border bg-white cursor-pointer transition-all duration-150 ${
          isOpen ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-slate-400"
        } ${error ? "border-destructive ring-2 ring-destructive/10" : ""}`}
      >
        {selectedClient ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary shrink-0">
              {selectedClient.client_type === "company" ? (
                <Building className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="truncate text-start">
              <span className="font-medium text-foreground text-sm">
                {selectedClient.full_name}
              </span>
              <span className="text-xs text-muted-foreground mr-2 font-mono">
                {selectedClient.phone}
              </span>
            </div>
            <Badge
              variant={selectedClient.client_type === "company" ? "secondary" : "outline"}
              className="text-[10px] mr-auto shrink-0"
            >
              {selectedClient.client_type === "company" ? "شركة" : "فرد"}
            </Badge>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">اختر الموكل من القائمة...</span>
        )}

        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-border bg-white shadow-floating overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Search Bar & Quick Add Trigger */}
          <div className="p-2.5 border-b border-border space-y-2 bg-slate-50/70">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو الهاتف أو الرقم القومي..."
                className="w-full h-9 ps-9 pe-3 text-xs bg-white rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setIsQuickAddOpen(true);
              }}
              className="w-full justify-center text-xs h-8 bg-white text-secondary border-dashed border-secondary/40 hover:bg-secondary/10 hover:text-secondary-hover"
            >
              <Plus className="w-3.5 h-3.5 ml-1" />
              إضافة موكل جديد سريعاً
            </Button>
          </div>

          {/* List of Clients */}
          <div className="max-h-60 overflow-y-auto p-1.5 divide-y divide-slate-100">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => {
                const isSelected = client.id === value;
                return (
                  <div
                    key={client.id}
                    onClick={() => handleSelect(client)}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/5 text-primary" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                        {client.client_type === "company" ? (
                          <Building className="w-3.5 h-3.5" />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {client.full_name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {client.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-[10px]">
                        {client.client_type === "company" ? "شركة" : "فرد"}
                      </Badge>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground">
                لا توجد نتائج مطابقة لبحثك
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Add Dialog */}
      <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة موكل جديد سريعاً</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleQuickAdd} className="space-y-4 py-2">
            {formError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                نوع الموكل
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setClientType("individual")}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    clientType === "individual"
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border hover:bg-slate-50 text-muted-foreground"
                  }`}
                >
                  <User className="w-4 h-4" />
                  شخص طبيعي (فرد)
                </button>
                <button
                  type="button"
                  onClick={() => setClientType("company")}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    clientType === "company"
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border hover:bg-slate-50 text-muted-foreground"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  شخص اعتباري (شركة)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                الاسم بالكامل <span className="text-destructive">*</span>
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={clientType === "company" ? "مثال: شركة النيل للتجارة" : "مثال: أحمد محمود إبراهيم"}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  رقم الهاتف <span className="text-destructive">*</span>
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  {clientType === "company" ? "السجل التجاري" : "الرقم القومي (14 رقم)"}
                </label>
                <Input
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder={clientType === "company" ? "رقم السجل" : "28501011234567"}
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                العنوان
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="العنوان التفصيلي للموكل أو مقر الشركة"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQuickAddOpen(false)}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "جارٍ الحفظ..." : "حفظ الموكل وتحديده"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
