import React from "react";
import { Printer, X, Gavel, Calendar, Building2 } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { CourtSession } from "../../types";
import { formatDate } from "../../lib/utils";

interface PrintSessionsRollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: CourtSession[];
  courtName?: string;
  sessionDate?: string;
}

export const PrintSessionsRollModal: React.FC<PrintSessionsRollModalProps> = ({
  open,
  onOpenChange,
  sessions,
  courtName = "كافة المحاكم والدوائر",
  sessionDate = new Date().toISOString().split("T")[0],
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-border rounded-2xl">
        {/* Modal Controls (Not printed) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50 print:hidden">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Gavel className="w-4 h-4 text-secondary" />
            <span>معاينة وطباعة رول الجلسات الرسمي</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              طباعة الرول
            </Button>
            <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
          </div>
        </div>

        {/* Printable Official Paper Area */}
        <div className="p-8 bg-white max-h-[75vh] overflow-y-auto print:p-0 print:max-h-none print:overflow-visible">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div className="text-start">
              <h2 className="text-lg font-bold text-slate-900">مكتب الأستاذ / محمود حسن الشربيني</h2>
              <p className="text-xs text-slate-600 mt-1">المحامي بالنقض والدستورية العليا</p>
              <p className="text-xs text-slate-500 font-mono">هاتف: 01023456789 — بورسعيد / القاهرة</p>
            </div>
            <div className="text-center">
              <div className="border-2 border-slate-900 px-4 py-2 rounded-lg bg-slate-50">
                <span className="block text-xs font-bold text-slate-800">رول جلسات المحكمة</span>
                <span className="block text-sm font-black text-slate-900 mt-0.5">
                  تاريخ: {formatDate(sessionDate)}
                </span>
              </div>
            </div>
            <div className="text-end">
              <p className="text-xs font-semibold text-slate-700">جمهورية مصر العربية</p>
              <p className="text-xs text-slate-600">وزارة العدل</p>
              <p className="text-xs text-secondary font-bold mt-1">{courtName}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-900">
                <th className="border border-slate-300 p-2 text-center w-12 font-bold">م</th>
                <th className="border border-slate-300 p-2 text-center w-14 font-bold">الرول</th>
                <th className="border border-slate-300 p-2 text-start font-bold">رقم الدعوى</th>
                <th className="border border-slate-300 p-2 text-start font-bold">المحكمة والدائرة</th>
                <th className="border border-slate-300 p-2 text-start font-bold">موضوع القضية</th>
                <th className="border border-slate-300 p-2 text-start font-bold">الموكل والصفة</th>
                <th className="border border-slate-300 p-2 text-start font-bold">الخصم</th>
                <th className="border border-slate-300 p-2 text-start font-bold w-36">القرار المتخذ</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="border border-slate-300 p-2 text-center font-bold text-slate-700">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold text-secondary font-mono">
                    {s.roll_number || "—"}
                  </td>
                  <td className="border border-slate-300 p-2 font-mono font-bold text-slate-900">
                    {(s.case_title || "").split(" - ")[0] || "—"}
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-700">
                    <span className="font-semibold block">{s.case_court || "—"}</span>
                    <span className="text-[10px] text-slate-500">{s.circuit || "الدائرة الأولى"}</span>
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-800">
                    {s.case_title || "—"}
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-800">
                    <span className="font-semibold block">{s.client_name || "الموكل الرئيسي"}</span>
                    <span className="text-[10px] text-slate-500">مدعي</span>
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-600">
                    {s.opponent_name || "—"}
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-800 font-semibold bg-slate-50/50">
                    {s.decision || "قيد المداولة بالجلسة"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Notes */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>تم استخراج هذا الرول تلقائياً بواسطة نظام سِـيَـاق لإدارة مكاتب المحاماة</span>
            <span>عدد القضايا المقيدة بالجلسة: {sessions.length} قضية</span>
            <span>توقيع المحامي المسؤول: .........................</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
