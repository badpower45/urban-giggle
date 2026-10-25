import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  ContractDesignSettings,
  ContractLogoPreset,
  ContractBorderStyle,
} from '../../../types/contract';
import { ContractLogoEmblem } from './ContractLogoEmblem';
import { Upload, Check, Sparkles, Palette, Trash2 } from 'lucide-react';

interface ContractDesignSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: ContractDesignSettings;
  onSaveSettings: (settings: ContractDesignSettings) => void;
}

export const ContractDesignSettingsModal: React.FC<ContractDesignSettingsModalProps> = ({
  open,
  onOpenChange,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = React.useState<ContractDesignSettings>(settings);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, open]);

  // Handle Logo Image Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLocalSettings((prev) => ({
            ...prev,
            logoType: 'custom',
            customLogoUrl: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const logoPresets: Array<{ id: ContractLogoPreset; name: string }> = [
    { id: 'scales_gold', name: 'ميزان ذهبي' },
    { id: 'shield_navy', name: 'درع المحاماة' },
    { id: 'notary_seal', name: 'ختم التوثيق' },
    { id: 'court_pillars', name: 'صرح القضاء' },
    { id: 'siyaq_default', name: 'شعار سياق' },
  ];

  const borderStyles: Array<{ id: ContractBorderStyle; name: string; desc: string }> = [
    { id: 'royal_double', name: 'إطار ملكي مزدوج', desc: 'خطان متوازيان مع زوايا كلاسيكية أنيقة' },
    { id: 'court_formal', name: 'إطار المحاكم الرسمي', desc: 'إطار رسمي إداري بنمط محاضر الجلسات' },
    { id: 'classic_single', name: 'إطار كلاسيكي مفرد', desc: 'خط محيطي هادئ وبسيط' },
    { id: 'none', name: 'بدون إطار', desc: 'تصميم أبيض عصري خفيف' },
  ];

  const handleSave = () => {
    onSaveSettings(localSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto p-6 text-primary" dir="rtl">
        <DialogHeader className="space-y-1.5 text-right border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
              <Palette className="w-4 h-4" />
            </span>
            <DialogTitle className="text-base sm:text-lg font-bold">
              تخصيص شكل العقد واللوجو والترويسة الرسمية
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            اضبط ترويسة وشعار مكتبك ليظهر أعلى جميع العقود والاتفاقيات المطبوعة.
          </p>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Section 1: Logo Picker */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-primary">
              ١. شعار المكتب (اللوجو):
            </Label>
            
            {/* Logo Presets Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {logoPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    setLocalSettings((prev) => ({ ...prev, logoType: preset.id }))
                  }
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center ${
                    localSettings.logoType === preset.id
                      ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-300 ring-offset-1 font-bold'
                      : 'border-border hover:bg-neutral'
                  }`}
                >
                  <ContractLogoEmblem preset={preset.id} size={36} />
                  <span className="text-[11px] text-primary truncate w-full">
                    {preset.name}
                  </span>
                </button>
              ))}

              {/* Upload Custom Logo Button */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-dashed cursor-pointer transition-all text-center ${
                  localSettings.logoType === 'custom' && localSettings.customLogoUrl
                    ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-300'
                    : 'border-border hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                {localSettings.customLogoUrl ? (
                  <img
                    src={localSettings.customLogoUrl}
                    alt="Custom"
                    className="w-8 h-8 object-contain rounded"
                  />
                ) : (
                  <Upload className="w-5 h-5 text-amber-700" />
                )}
                <span className="text-[10px] text-amber-900 font-bold truncate">
                  {localSettings.customLogoUrl ? 'تغيير صورتك' : 'رفع لوجو خاص'}
                </span>
              </div>
            </div>

            {localSettings.customLogoUrl && (
              <div className="flex items-center justify-between text-xs bg-neutral/80 px-3 py-1.5 rounded-lg border border-border">
                <span className="text-emerald-700 font-medium">تم رفع صورة لوجو مخصصة بنجاح</span>
                <button
                  type="button"
                  onClick={() =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      logoType: 'scales_gold',
                      customLogoUrl: undefined,
                    }))
                  }
                  className="text-destructive hover:underline text-[11px] flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  حذف الصورة
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Letterhead Details */}
          <div className="space-y-3 border-t border-border pt-3">
            <Label className="text-xs font-bold text-primary">
              ٢. بيانات ترويسة المكتب القانوني:
            </Label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="firm-name" className="text-[11px] text-muted-foreground font-semibold">
                  اسم المكتب
                </Label>
                <Input
                  id="firm-name"
                  value={localSettings.firmName}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, firmName: e.target.value }))
                  }
                  placeholder="مثال: مكتب الأمل للمحاماة"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="lawyer-title" className="text-[11px] text-muted-foreground font-semibold">
                  درجة القيد والصفة القانونية
                </Label>
                <Input
                  id="lawyer-title"
                  value={localSettings.lawyerTitle}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, lawyerTitle: e.target.value }))
                  }
                  placeholder="مثال: محامٍ بالنقض والدستورية العليا"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="bar-number" className="text-[11px] text-muted-foreground font-semibold">
                  رقم القيد بنقابة المحامين
                </Label>
                <Input
                  id="bar-number"
                  value={localSettings.barNumber || ''}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, barNumber: e.target.value }))
                  }
                  placeholder="مثال: قيد رقم 48921"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="firm-phone" className="text-[11px] text-muted-foreground font-semibold">
                  العنوان ورقم الهاتف
                </Label>
                <Input
                  id="firm-phone"
                  value={localSettings.address || ''}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="مثال: القاهرة - ت: 01012345678"
                  className="text-xs h-9"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Border Style */}
          <div className="space-y-2 border-t border-border pt-3">
            <Label className="text-xs font-bold text-primary">
              ٣. شكل إطار الورقة:
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {borderStyles.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() =>
                    setLocalSettings((prev) => ({ ...prev, borderStyle: b.id }))
                  }
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-right transition-all ${
                    localSettings.borderStyle === b.id
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-300'
                      : 'border-border hover:bg-neutral'
                  }`}
                >
                  <span className="font-bold text-xs text-primary">{b.name}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{b.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Extra Options */}
          <div className="space-y-2 border-t border-border pt-3">
            <Label className="text-xs font-bold text-primary">
              ٤. خيارات إضافية للطباعة:
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg border border-border cursor-pointer select-none hover:bg-neutral">
                <input
                  type="checkbox"
                  checked={localSettings.showBasmala}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, showBasmala: e.target.checked }))
                  }
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span className="font-medium">إظهار "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-border cursor-pointer select-none hover:bg-neutral">
                <input
                  type="checkbox"
                  checked={localSettings.showWatermark}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, showWatermark: e.target.checked }))
                  }
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span className="font-medium">علامة مائية خفيفة للمكتب بخلفية الورقة</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-border cursor-pointer select-none hover:bg-neutral">
                <input
                  type="checkbox"
                  checked={localSettings.showWitnesses}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, showWitnesses: e.target.checked }))
                  }
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span className="font-medium">إظهار خانة الشهود وتوثيق المكتب</span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 text-xs"
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-primary hover:bg-primary-hover text-white h-9 text-xs font-bold gap-1.5"
          >
            <Check className="w-4 h-4" />
            تطبيق وحفظ المظهر
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
