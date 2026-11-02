import React, { useRef } from 'react';
import { ContractDesignSettings } from '../../../types/contract';
import { ContractLogoEmblem } from './ContractLogoEmblem';
import { Plus, RotateCcw, Edit3, Check, Palette, Printer } from 'lucide-react';
import { Button } from '../../ui/button';

interface ContractPrintViewProps {
  title: string;
  interpolatedHtml: string;
  settings?: ContractDesignSettings;
  isDirectEditing?: boolean;
  onToggleDirectEditing?: () => void;
  onDirectHtmlChange?: (newHtml: string) => void;
  onResetToInterpolated?: () => void;
  hasManualEdits?: boolean;
  onOpenDesignModal?: () => void;
  onPrint?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export const defaultContractDesignSettings: ContractDesignSettings = {
  firmName: 'مكتب الأستاذ / عبد الرحمن العزبي',
  lawyerName: 'عبد الرحمن العزبي',
  lawyerTitle: 'محامٍ بالنقض والدستورية العليا',
  barNumber: 'قيد رقم: ٤٨١٩٢ نقابة المحامين',
  phone: '٠١٠١٢٣٤٥٦٧٨',
  address: 'القاهرة، مدينة نصر، شارع الطيران عمارة ١٥',
  logoType: 'scales_gold',
  borderStyle: 'royal_double',
  showBasmala: true,
  showWatermark: true,
  watermarkText: 'صيغة قانونية معتمدة',
  showSignatures: true,
  showWitnesses: true,
};

export const ContractPrintView: React.FC<ContractPrintViewProps> = ({
  title,
  interpolatedHtml,
  settings = defaultContractDesignSettings,
  isDirectEditing = false,
  onToggleDirectEditing,
  onDirectHtmlChange,
  onResetToInterpolated,
  hasManualEdits = false,
  onOpenDesignModal,
  onPrint,
  onSave,
  isSaved = false,
}) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // Handle direct typing on the contract paper
  const handleInput = () => {
    if (contentEditableRef.current && onDirectHtmlChange) {
      onDirectHtmlChange(contentEditableRef.current.innerHTML);
    }
  };

  // Quick helper to append a new legal clause
  const handleAddClause = () => {
    if (!contentEditableRef.current || !onDirectHtmlChange) return;
    const clauseHtml = `
      <p style="margin-top: 16px;"><strong>بند إضافي:</strong> اتفق الطرفان أيضاً وبكافة الشروط القانونية على أن ............................................................................................</p>
    `;
    const newHtml = contentEditableRef.current.innerHTML + clauseHtml;
    contentEditableRef.current.innerHTML = newHtml;
    onDirectHtmlChange(newHtml);
  };

  // Determine paper border style
  const getBorderClasses = () => {
    switch (settings.borderStyle) {
      case 'royal_double':
        return 'border-[6px] border-double border-blue-600/80 shadow-md';
      case 'court_formal':
        return 'border-[3px] border-solid border-primary/70 shadow-md';
      case 'classic_single':
        return 'border-2 border-primary/30 shadow-md';
      case 'none':
      default:
        return 'border border-border/80 shadow-sm';
    }
  };

  return (
    <div className="w-full max-w-[210mm] mx-auto my-4 space-y-3" dir="rtl">
      {/* Top Action Bar for Direct Paper Editing & Printing */}
      <div className="no-print bg-white p-2 rounded-xl border border-border/80 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onOpenDesignModal && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenDesignModal}
              className="text-xs font-bold h-8 px-2.5 gap-1.5 border-blue-300 text-blue-900 bg-blue-50 hover:bg-blue-100"
            >
              <Palette className="w-3.5 h-3.5 text-blue-700" />
              <span>المظهر واللوجو</span>
            </Button>
          )}

          {onToggleDirectEditing && (
            <Button
              type="button"
              size="sm"
              onClick={onToggleDirectEditing}
              className={`text-xs font-bold h-8 px-2.5 gap-1.5 transition-all ${
                isDirectEditing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  : 'bg-neutral hover:bg-neutral/80 text-primary border border-border'
              }`}
            >
              {isDirectEditing ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>التعديل مفعل (اضغط واكتب)</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                  <span>تعديل مباشر على الورقة</span>
                </>
              )}
            </Button>
          )}

          {isDirectEditing && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddClause}
              className="text-xs font-semibold h-8 px-2 gap-1 border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ بند إضافي</span>
            </Button>
          )}

          {hasManualEdits && onResetToInterpolated && (
            <button
              type="button"
              onClick={onResetToInterpolated}
              className="text-muted-foreground hover:text-destructive text-[11px] flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-destructive/10"
              title="إعادة النص للأصل"
            >
              <RotateCcw className="w-3 h-3" />
              <span>استعادة الأصل</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onSave && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSave}
              className="text-xs font-semibold h-8 px-2.5 gap-1 border-border"
              title="حفظ نسخة في النظام"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isSaved ? 'محفوظ ✓' : 'حفظ'}</span>
            </Button>
          )}

          {onPrint && (
            <Button
              type="button"
              size="sm"
              onClick={onPrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8 px-3 gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة A4</span>
            </Button>
          )}
        </div>
      </div>

      {/* Printable Sheet (Standard A4 Size) */}
      <div
        id="contract-printable-area"
        className={`relative bg-white w-full min-h-[297mm] p-10 sm:p-14 text-primary leading-relaxed transition-all ${getBorderClasses()}`}
      >
        {/* Subtle Background Watermark */}
        {settings.showWatermark && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="transform -rotate-25 opacity-[0.035] flex flex-col items-center justify-center text-center">
              <ContractLogoEmblem preset={settings.logoType} customLogoUrl={settings.customLogoUrl} size={280} />
              <p className="text-3xl font-bold font-headline mt-4 tracking-widest text-primary">
                {settings.firmName || settings.watermarkText}
              </p>
            </div>
          </div>
        )}

        {/* Content Container on top of Watermark */}
        <div className="relative z-10 flex flex-col justify-between min-h-[265mm]">
          <div>
            {/* Top Basmala */}
            {settings.showBasmala && (
              <div className="text-center mb-6">
                <span className="inline-block font-headline text-sm font-bold text-primary/80 tracking-wider pb-1 border-b border-primary/20 px-6">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>
            )}

            {/* Official Prestigious Firm Letterhead */}
            <header className="pb-5 mb-8 border-b-2 border-primary/20 flex items-center justify-between gap-4">
              {/* Right: Firm & Lawyer Details */}
              <div className="text-right space-y-1 max-w-[65%]">
                <h2 className="text-base sm:text-lg font-bold text-primary font-headline leading-tight">
                  {settings.firmName}
                </h2>
                <p className="text-xs font-semibold text-blue-700">
                  {settings.lawyerTitle}
                </p>
                {settings.barNumber && (
                  <p className="text-[11px] text-muted-foreground">
                    {settings.barNumber}
                  </p>
                )}
                {(settings.address || settings.phone) && (
                  <p className="text-[10px] text-muted-foreground pt-0.5">
                    {settings.address} {settings.phone ? `• هاتف: ${settings.phone}` : ''}
                  </p>
                )}
              </div>

              {/* Left: Chosen Firm Logo / Emblem */}
              <div className="flex flex-col items-center shrink-0">
                <ContractLogoEmblem
                  preset={settings.logoType}
                  customLogoUrl={settings.customLogoUrl}
                  size={58}
                />
                <span className="text-[9px] font-mono text-muted-foreground mt-1 tracking-wider" dir="ltr">
                  LEGAL INSTRUMENT
                </span>
              </div>
            </header>

            {/* Editable or Static Document Body */}
            <main
              ref={contentEditableRef}
              contentEditable={isDirectEditing}
              onInput={handleInput}
              suppressContentEditableWarning
              className={`contract-prose-content text-justify text-sm sm:text-base leading-8 transition-colors ${
                isDirectEditing
                  ? 'p-3 rounded-lg border-2 border-dashed border-blue-400 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  : ''
              }`}
              dangerouslySetInnerHTML={{ __html: interpolatedHtml }}
            />
          </div>

          {/* Official Signatures & Witness Block */}
          {settings.showSignatures && (
            <footer className="mt-14 pt-6 border-t border-border/80">
              {/* Primary Parties Signature Block */}
              <div className="grid grid-cols-2 gap-8 text-center text-xs sm:text-sm font-semibold mb-8">
                <div className="p-3 bg-neutral/30 rounded-lg border border-border/60">
                  <p className="text-primary font-bold">توقيع الطرف الأول (المؤجر / البائع)</p>
                  <p className="mt-8 text-muted-foreground/60 font-mono tracking-widest">
                    ...................................................
                  </p>
                </div>
                <div className="p-3 bg-neutral/30 rounded-lg border border-border/60">
                  <p className="text-primary font-bold">توقيع الطرف الثاني (المستأجر / المشتري)</p>
                  <p className="mt-8 text-muted-foreground/60 font-mono tracking-widest">
                    ...................................................
                  </p>
                </div>
              </div>

              {/* Witnesses & Firm Seal (If enabled) */}
              {settings.showWitnesses && (
                <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground pt-4 border-t border-dashed border-border">
                  <div>
                    <p className="font-bold text-primary text-[11px]">الشاهد الأول</p>
                    <p className="mt-6 text-[10px]">الاسم: ..........................</p>
                    <p className="text-[10px]">الرقم القومي: .................</p>
                  </div>

                  {/* Stamp / Notary Seal Box */}
                  <div className="flex flex-col items-center justify-center p-2 border border-dashed border-blue-500 rounded-lg bg-blue-50/20">
                    <span className="text-[10px] font-bold text-blue-700">
                      خاتم وتوثيق المكتب القانوني
                    </span>
                    <div className="w-12 h-12 rounded-full border border-dashed border-blue-400 mt-1 flex items-center justify-center opacity-40">
                      <span className="text-[8px] font-bold text-blue-700">ختم رسمي</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-bold text-primary text-[11px]">الشاهد الثاني</p>
                    <p className="mt-6 text-[10px]">الاسم: ..........................</p>
                    <p className="text-[10px]">الرقم القومي: .................</p>
                  </div>
                </div>
              )}

              {/* System Verification Tagline */}
              <div className="mt-8 text-center text-[10px] text-muted-foreground flex items-center justify-between border-t border-border/40 pt-2">
                <span>حرر هذا العقد وتمت مراجعته وتوثيقه رسمياً عبر نظام بصيرة القانوني</span>
                <span className="font-mono">صفحة ١ من ١</span>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};
