import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Briefcase,
  Users,
  Gavel,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import { appStore } from "../../lib/api/store";
import { Badge } from "../ui/badge";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearchDialog: React.FC<GlobalSearchDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [state, setState] = useState(appStore.getState());

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        cases: state.cases.slice(0, 4),
        clients: state.clients.slice(0, 3),
        sessions: state.sessions.slice(0, 2),
      };
    }

    return {
      cases: state.cases.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.case_number.toLowerCase().includes(q) ||
          c.court_name.toLowerCase().includes(q) ||
          c.client_name.toLowerCase().includes(q)
      ),
      clients: state.clients.filter(
        (cl) =>
          (cl.full_name || "").toLowerCase().includes(q) ||
          (cl.phone && cl.phone.includes(q)) ||
          (cl.national_id && cl.national_id.includes(q))
      ),
      sessions: state.sessions.filter(
        (s) =>
          (s.case_title || "").toLowerCase().includes(q) ||
          (s.case_court || "").toLowerCase().includes(q) ||
          (s.roll_number && s.roll_number.includes(q))
      ),
    };
  }, [query, state]);

  const handleSelect = (url: string) => {
    onOpenChange(false);
    navigate(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-border shadow-2xl rounded-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 border-b border-border bg-slate-50/50">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن أي قضية، موكل، جلسة، محكمة، أو رقم رول..."
            className="w-full h-14 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground bg-white border border-border rounded">
            ESC
          </kbd>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Cases */}
          {results.cases.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 pb-1.5 text-[11px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  القضايا ({results.cases.length})
                </span>
              </div>
              <div className="space-y-1">
                {results.cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(`/firm/cases/${c.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-start group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary truncate group-hover:text-secondary transition-colors">
                          {c.title}
                        </span>
                        <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                          {c.case_number}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-3">
                        <span>المحكمة: {c.court_name}</span>
                        <span>الموكل: {c.client_name}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary rotate-180 transition-transform group-hover:-translate-x-1 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {results.clients.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 pb-1.5 text-[11px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-secondary" />
                  الموكلين ({results.clients.length})
                </span>
              </div>
              <div className="space-y-1">
                {results.clients.map((cl) => (
                  <button
                    key={cl.id}
                    onClick={() => handleSelect(`/firm/clients/${cl.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-start group"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-primary block truncate group-hover:text-secondary">
                        {cl.full_name}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-0.5 block">
                        {cl.phone || "لا يوجد هاتف"} · {cl.active_cases} قضايا نشطة
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary rotate-180 transition-transform group-hover:-translate-x-1 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sessions */}
          {results.sessions.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 pb-1.5 text-[11px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5 text-amber-600" />
                  الجلسات القادمة
                </span>
              </div>
              <div className="space-y-1">
                {results.sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect("/firm/sessions")}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-start group"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-primary block truncate">
                        {s.case_title}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-0.5 block">
                        {s.case_court} · تاريخ الجلسة: {s.session_date} {s.roll_number && `· رول ${s.roll_number}`}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary rotate-180 transition-transform group-hover:-translate-x-1 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.cases.length === 0 && results.clients.length === 0 && results.sessions.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">لم يتم العثور على نتائج تطابق "{query}"</p>
              <p className="text-xs mt-1 text-slate-400">جرّب البحث بكلمة أخرى أو اسم المحكمة</p>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-border text-[11px] text-muted-foreground">
          <span>نظام البحث السريع لملفات المكتب</span>
          <div className="flex items-center gap-2">
            <span>اضغط</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-border rounded font-mono text-[10px]">↵</kbd>
            <span>للانتقال السريع</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
