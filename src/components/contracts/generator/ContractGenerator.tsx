import React, { useState, useMemo, useEffect } from 'react';
import {
  Printer,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Eye,
  RotateCcw,
  Check,
  FileCheck,
  Palette,
  Edit3,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import {
  ContractTemplate,
  ContractInstance,
  ScannedVariableSummary,
  ContractDesignSettings,
} from '../../../types/contract';
import {
  scanVariablesFromHtml,
  interpolateHtml,
  generateFinalCleanHtml,
} from './InterpolationEngine';
import {
  ContractPrintView,
  defaultContractDesignSettings,
} from './ContractPrintView';
import { ContractDesignSettingsModal } from './ContractDesignSettingsModal';
import { SAMPLE_CONTRACT_TEMPLATES } from '../mockData';
import { useToast } from '../../common/Toast';

interface ContractGeneratorProps {
  templateId?: string;
  template?: ContractTemplate;
  onSaveInstance?: (instance: ContractInstance) => void;
  onBack?: () => void;
}

export const ContractGenerator: React.FC<ContractGeneratorProps> = ({
  templateId,
  template: propTemplate,
  onSaveInstance,
  onBack,
}) => {
  const { showToast } = useToast();

  // Resolve active template
  const activeTemplate = useMemo(() => {
    if (propTemplate) return propTemplate;
    if (templateId) {
      const found = SAMPLE_CONTRACT_TEMPLATES.find((t) => t.id === templateId);
      if (found) return found;
    }
    return SAMPLE_CONTRACT_TEMPLATES[0];
  }, [propTemplate, templateId]);

  // Form State: key-value dictionary for dynamic inputs
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [highlightFilled, setHighlightFilled] = useState(true);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [isSaved, setIsSaved] = useState(false);

  // Direct Paper Editing States ("العقد الاخير قادرين نشتغل عليه ونخليه احسن")
  const [isDirectEditing, setIsDirectEditing] = useState(false);
  const [manualEditedHtml, setManualEditedHtml] = useState<string | null>(null);

  // Design & Logo Customization State ("شكل العقد واختيار اللوجو")
  const [designModalOpen, setDesignModalOpen] = useState(false);
  const [designSettings, setDesignSettings] = useState<ContractDesignSettings>(() => {
    try {
      const saved = localStorage.getItem('siyaq_contract_design_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback to default
    }
    return defaultContractDesignSettings;
  });

  // Save design settings to localStorage for persistence
  const handleSaveDesignSettings = (updated: ContractDesignSettings) => {
    setDesignSettings(updated);
    try {
      localStorage.setItem('siyaq_contract_design_settings', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    showToast('تم تطبيق وحفظ مظهر العقد واللوجو بنجاح', 'success');
  };

  // Scan variables from the template's HTML content
  const scannedVariables = useMemo<ScannedVariableSummary[]>(() => {
    if (!activeTemplate?.html_content) return [];
    return scanVariablesFromHtml(activeTemplate.html_content);
  }, [activeTemplate]);

  // Calculate filled stats
  const totalVars = scannedVariables.length;
  const filledCount = scannedVariables.filter((v) => {
    const val = formData[v.key];
    return val !== undefined && val.trim() !== '';
  }).length;
  const allFilled = totalVars > 0 && filledCount === totalVars;

  // Real-time interpolated HTML for live preview
  const liveInterpolatedHtml = useMemo(() => {
    return interpolateHtml(activeTemplate?.html_content || '', formData, {
      highlight: highlightFilled,
      renderUnfilledAsBadge: true,
    });
  }, [activeTemplate, formData, highlightFilled]);

  // Effective HTML displayed in preview: if manually edited, use that, else use live interpolated
  const displayedHtml = manualEditedHtml !== null ? manualEditedHtml : liveInterpolatedHtml;

  // Handle input update
  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setIsSaved(false);
    // If manual edits existed, notify that form input updates the underlying template
    if (manualEditedHtml !== null) {
      setManualEditedHtml(null);
    }
  };

  // Handle direct manual edit on the paper
  const handleDirectHtmlChange = (newHtml: string) => {
    setManualEditedHtml(newHtml);
    setIsSaved(false);
  };

  // Reset direct manual edits back to the interpolated template
  const handleResetToInterpolated = () => {
    setManualEditedHtml(null);
    showToast('تمت استعادة صياغة العقد الأصلية', 'info');
  };

  // 1-Click "Fill Demo Data" helper
  const handleFillDemoData = () => {
    const demo: Record<string, string> = {};
    scannedVariables.forEach((v) => {
      if (v.key === 'contract_date') demo[v.key] = new Date().toISOString().split('T')[0];
      else if (v.key === 'start_date') demo[v.key] = '2026-10-01';
      else if (v.key === 'end_date') demo[v.key] = '2027-09-30';
      else if (v.key === 'first_party_name') demo[v.key] = 'شركة الأمل للتطوير العقاري';
      else if (v.key === 'first_party_id') demo[v.key] = '29001010101234';
      else if (v.key === 'first_party_address') demo[v.key] = 'القاهرة، مدينة نصر، شارع الطيران 15';
      else if (v.key === 'second_party_name') demo[v.key] = 'أحمد محمود السعيد إبراهيم';
      else if (v.key === 'second_party_id') demo[v.key] = '29505051203456';
      else if (v.key === 'second_party_address') demo[v.key] = 'الجيزة، الدقي، شارع مصدق عمارة 4';
      else if (v.key === 'property_address') demo[v.key] = 'عمارة 12 شارع عباس العقاد، مدينة نصر';
      else if (v.key === 'unit_number') demo[v.key] = 'شقة رقم 5 بالدور الثالث';
      else if (v.key === 'unit_purpose') demo[v.key] = 'سكن عائلي خاص';
      else if (v.key === 'contract_duration') demo[v.key] = 'سنة ميلادية واحدة';
      else if (v.key === 'monthly_rent') demo[v.key] = '12,500';
      else if (v.key === 'security_deposit') demo[v.key] = '25,000';
      else if (v.key === 'contract_value') demo[v.key] = '150,000';
      else if (v.key === 'down_payment') demo[v.key] = '30,000';
      else if (v.key === 'competent_court') demo[v.key] = 'محكمة شمال القاهرة الابتدائية';
      else if (v.key === 'lawyer_name') demo[v.key] = 'الأستاذ / عبد الرحمن العزبي';
      else if (v.key === 'poa_number') demo[v.key] = 'توكيل رسمي رقم 4821 لسنة 2025';
      else demo[v.key] = `بيانات (${v.label})`;
    });
    setFormData(demo);
    setManualEditedHtml(null);
    showToast(`تم ملء بيانات تجريبية للتوضيح (${scannedVariables.length} خانة)`, 'success');
  };

  // Clear Form
  const handleClearForm = () => {
    setFormData({});
    setManualEditedHtml(null);
    showToast('تم مسح جميع الخانات للبدء من جديد', 'info');
  };

  // Trigger Native Print / Save to PDF
  const handlePrint = () => {
    window.print();
  };

  // Save Final Contract Instance
  const handleSaveContract = () => {
    // If lawyer made direct custom edits to the paper, preserve that final text!
    const finalCleanHtml = manualEditedHtml !== null
      ? manualEditedHtml
      : generateFinalCleanHtml(activeTemplate.html_content, formData);

    const instance: ContractInstance = {
      id: `instance-${Date.now()}`,
      template_id: activeTemplate.id,
      template_name: activeTemplate.name,
      client_name: formData['second_party_name'] || formData['client_name'] || 'عميل بدون اسم',
      final_html: finalCleanHtml,
      filled_data: formData,
      status: allFilled ? 'finalized' : 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by_name: designSettings.lawyerName || 'المحامي المسئول',
    };

    if (onSaveInstance) {
      onSaveInstance(instance);
    }

    setIsSaved(true);
    showToast(`تم حفظ نسخة العقد باسم "${instance.client_name}" بنجاح`, 'success');
  };

  return (
    <div className="flex flex-col h-full bg-neutral text-primary overflow-hidden" dir="rtl">
      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden bg-white border-b border-border p-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMobileTab('form')}
          className={`flex-1 py-1.5 rounded-md text-center ${
            mobileTab === 'form' ? 'bg-primary text-white' : 'text-muted-foreground'
          }`}
        >
          البيانات ({filledCount}/{totalVars})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 rounded-md text-center ${
            mobileTab === 'preview' ? 'bg-primary text-white' : 'text-muted-foreground'
          }`}
        >
          معاينة الورقة
        </button>
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* PANE 1: Clean Form (360px) */}
        <div
          className={`w-full md:w-80 lg:w-96 flex flex-col bg-white border-l border-border h-full shrink-0 overflow-hidden ${
            mobileTab === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Streamlined Form Header with inline quick utilities */}
          <div className="p-3 border-b border-border bg-slate-50/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">بيانات العقد</span>
              <span className="text-[11px] font-mono font-semibold text-muted-foreground bg-slate-200/70 px-2 py-0.5 rounded-full">
                {filledCount}/{totalVars}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFillDemoData}
                className="text-amber-700 hover:text-amber-800 text-[11px] font-semibold flex items-center gap-1 px-2 py-1 rounded hover:bg-amber-50 transition-colors"
                title="تعبئة بيانات تجريبية سريعة"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>تعبئة تجريبية</span>
              </button>

              {filledCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="text-muted-foreground hover:text-destructive text-[11px] px-1.5 py-1 rounded hover:bg-destructive/10 transition-colors"
                  title="مسح جميع الخانات"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Form Inputs List */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
            {scannedVariables.map((v) => {
              return (
                <div key={v.key} className="space-y-1">
                  <Label
                    htmlFor={`field-${v.key}`}
                    className="text-xs font-semibold text-primary block cursor-pointer"
                  >
                    {v.label}
                  </Label>

                  {/* Render Input Based on Type */}
                  {v.type === 'textarea' ? (
                    <Textarea
                      id={`field-${v.key}`}
                      value={formData[v.key] || ''}
                      onChange={(e) => handleInputChange(v.key, e.target.value)}
                      placeholder={`اكتب ${v.label}...`}
                      rows={2}
                      className="text-xs bg-white resize-none"
                    />
                  ) : v.type === 'date' ? (
                    <Input
                      id={`field-${v.key}`}
                      type="date"
                      value={formData[v.key] || ''}
                      onChange={(e) => handleInputChange(v.key, e.target.value)}
                      className="text-xs bg-white h-9"
                    />
                  ) : (
                    <Input
                      id={`field-${v.key}`}
                      type={v.type === 'number' ? 'number' : 'text'}
                      value={formData[v.key] || ''}
                      onChange={(e) => handleInputChange(v.key, e.target.value)}
                      placeholder={`أدخل ${v.label}...`}
                      className="text-xs bg-white h-9"
                    />
                  )}
                </div>
              );
            })}

            {scannedVariables.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground">
                لا توجد خانات متغيرة في هذا العقد.
              </div>
            )}
          </div>

          {/* Form Footer with Single Clean Print CTA */}
          <div className="p-2.5 border-t border-border bg-slate-50/50">
            <Button
              type="button"
              onClick={handlePrint}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة العقد (A4)</span>
            </Button>
          </div>
        </div>

        {/* PANE 2: Real-time Paper Preview with Direct Editing */}
        <div
          className={`flex-1 bg-neutral/90 overflow-y-auto p-4 sm:p-8 flex flex-col items-center ${
            mobileTab === 'form' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Paper View Container */}
          <ContractPrintView
            title={activeTemplate.name}
            interpolatedHtml={displayedHtml}
            settings={designSettings}
            isDirectEditing={isDirectEditing}
            onToggleDirectEditing={() => setIsDirectEditing(!isDirectEditing)}
            onDirectHtmlChange={handleDirectHtmlChange}
            onResetToInterpolated={handleResetToInterpolated}
            hasManualEdits={manualEditedHtml !== null}
            onOpenDesignModal={() => setDesignModalOpen(true)}
            onPrint={handlePrint}
            onSave={handleSaveContract}
            isSaved={isSaved}
          />
        </div>
      </div>

      {/* Design Settings & Logo Customization Modal */}
      <ContractDesignSettingsModal
        open={designModalOpen}
        onOpenChange={setDesignModalOpen}
        settings={designSettings}
        onSaveSettings={handleSaveDesignSettings}
      />
    </div>
  );
};
