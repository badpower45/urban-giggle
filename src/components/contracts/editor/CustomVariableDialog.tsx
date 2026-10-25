import React, { useState } from 'react';
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
import { Plus, Braces, Sparkles } from 'lucide-react';
import { VariableDataType, TemplateVariable } from '../../../types/contract';

interface CustomVariableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertVariable: (variable: TemplateVariable) => void;
}

export const CustomVariableDialog: React.FC<CustomVariableDialogProps> = ({
  open,
  onOpenChange,
  onInsertVariable,
}) => {
  const [label, setLabel] = useState('');
  const [key, setKey] = useState('');
  const [type, setType] = useState<VariableDataType>('text');
  const [defaultValue, setDefaultValue] = useState('');
  const [autoKey, setAutoKey] = useState(true);

  // Auto-generate a clean variable key from English or transliterated input
  const handleLabelChange = (val: string) => {
    setLabel(val);
    if (autoKey) {
      // If user types english, transform to snake_case
      const englishMatch = val.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      if (englishMatch) {
        setKey(englishMatch);
      }
    }
  };

  const handleKeyChange = (val: string) => {
    setAutoKey(false);
    // Sanitize key to valid identifier
    const sanitized = val.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    setKey(sanitized);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    const finalLabel = label.trim() || key.trim();
    const newVariable: TemplateVariable = {
      key: key.trim(),
      label: finalLabel,
      type,
      category: 'custom',
      defaultValue: defaultValue.trim() || undefined,
      required: false,
    };

    onInsertVariable(newVariable);
    onOpenChange(false);

    // Reset form
    setLabel('');
    setKey('');
    setType('text');
    setDefaultValue('');
    setAutoKey(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 text-primary" dir="rtl">
        <DialogHeader className="space-y-2 text-right">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Braces className="w-5 h-5" />
            </span>
            <DialogTitle className="text-lg font-headline">
              إضافة متغير مخصص للنموذج
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            أدخل اسماً دلالياً للمتغير ليتم إدراجه في المستند واستبداله آلياً عند توليد العقد.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Label Field */}
          <div className="space-y-1.5 text-right">
            <Label htmlFor="var-label" className="text-xs font-semibold">
              اسم المتغير في النموذج (العنوان الظاهر للمحامي) *
            </Label>
            <Input
              id="var-label"
              placeholder="مثال: رقم لوحة المركبة أو اسم الضامن"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              required
              className="text-right h-10"
              autoFocus
            />
          </div>

          {/* Key Field (Snake_case) */}
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-mono" dir="ltr">
                {`{{${key || 'variable_key'}}}`}
              </span>
              <Label htmlFor="var-key" className="text-xs font-semibold">
                معرف المتغير التقني (Key) *
              </Label>
            </div>
            <Input
              id="var-key"
              placeholder="e.g. vehicle_plate_number"
              value={key}
              onChange={(e) => handleKeyChange(e.target.value)}
              required
              dir="ltr"
              className="font-mono text-xs h-10"
            />
          </div>

          {/* Data Type */}
          <div className="space-y-1.5 text-right">
            <Label htmlFor="var-type" className="text-xs font-semibold">
              نوع الحقل في نموذج الإدخال
            </Label>
            <select
              id="var-type"
              value={type}
              onChange={(e) => setType(e.target.value as VariableDataType)}
              className="w-full h-10 px-3 rounded-md border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-right"
            >
              <option value="text">نص قياسي (Text)</option>
              <option value="date">تاريخ محدد (Date)</option>
              <option value="currency">مبلغ مالي / عملة (Currency)</option>
              <option value="number">رقم حسابي / عددي (Number)</option>
              <option value="textarea">فقرة تفصيلية متعددة الأسطر (Textarea)</option>
            </select>
          </div>

          {/* Default / Fallback Value */}
          <div className="space-y-1.5 text-right">
            <Label htmlFor="var-default" className="text-xs font-semibold">
              قيمة افتراضية تجريبية (اختياري)
            </Label>
            <Input
              id="var-default"
              placeholder="مثال: س ص ع 1234"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              className="text-right h-10"
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
            <span className="text-xs font-medium text-blue-900">
              شكل الشريحة في المحرر:
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              <Braces className="w-2.5 h-2.5" />
              <span>{label || 'اسم المتغير'}</span>
              <span className="font-mono text-[10px] text-blue-600" dir="ltr">
                {`{{${key || 'key'}}}`}
              </span>
            </span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={!key.trim()}
              className="bg-primary hover:bg-primary-hover text-white h-10 gap-1.5"
            >
              <Plus className="w-4 h-4" />
              إدراج في المستند
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
