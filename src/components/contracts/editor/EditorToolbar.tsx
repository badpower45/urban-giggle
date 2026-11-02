import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Underline as UnderlineIcon,
  AlignRight,
  AlignCenter,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  PlusCircle,
  ChevronDown,
  Sparkles,
  Heading,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../../ui/dropdown-menu';
import { Button } from '../../ui/button';
import { PREDEFINED_VARIABLE_GROUPS } from '../mockData';
import { TemplateVariable } from '../../../types/contract';

interface EditorToolbarProps {
  editor: Editor | null;
  onOpenCustomVariableDialog: () => void;
  onInsertVariable: (v: TemplateVariable | { id: string; label: string; fallback?: string }) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onOpenCustomVariableDialog,
  onInsertVariable,
}) => {
  if (!editor) return null;

  const isActive = (name: string, attributes?: Record<string, any>) => {
    return editor.isActive(name, attributes);
  };

  const isTextAlign = (align: string) => {
    return editor.isActive({ textAlign: align });
  };

  // Quick common variables for 1-click insertion without submenu friction
  const quickCommonVars = [
    { id: 'first_party_name', label: 'اسم الطرف الأول (المؤجر/الموكل)' },
    { id: 'second_party_name', label: 'اسم الطرف الثاني (المستأجر/المشتري)' },
    { id: 'first_party_id', label: 'الرقم القومي للطرف الأول' },
    { id: 'second_party_id', label: 'الرقم القومي للطرف الثاني' },
    { id: 'contract_value', label: 'قيمة العقد المالية' },
    { id: 'monthly_rent', label: 'مبلغ الإيجار الشهري' },
    { id: 'contract_date', label: 'تاريخ تحرير العقد' },
    { id: 'start_date', label: 'تاريخ بدء السريان' },
    { id: 'property_address', label: 'عنوان ومكان العقار' },
    { id: 'competent_court', label: 'المحكمة المختصة' },
  ];

  return (
    <div
      className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white border-b border-border shadow-xs rounded-t-xl"
      dir="rtl"
    >
      {/* Left: Essential Formatting Tools */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        {/* Undo / Redo */}
        <div className="flex items-center bg-neutral/80 p-0.5 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="تراجع عن آخر خطوة"
            className="p-1.5 rounded text-primary hover:bg-white disabled:opacity-30 transition-colors"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="إعادة الخطوة"
            className="p-1.5 rounded text-primary hover:bg-white disabled:opacity-30 transition-colors"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Text Style: Heading or Normal */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-neutral/40 hover:bg-neutral transition-colors text-primary"
            >
              <Heading className="w-3.5 h-3.5 text-muted-foreground" />
              <span>
                {isActive('heading', { level: 1 })
                  ? 'عنوان كبير'
                  : isActive('heading', { level: 2 })
                  ? 'عنوان بند'
                  : 'نص عادي'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40 text-right p-1">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className="text-xs py-2 cursor-pointer font-medium"
            >
              نص عادي (فقرة)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="text-xs py-2 cursor-pointer font-bold"
            >
              عنوان كبير (رئيسي)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="text-xs py-2 cursor-pointer font-semibold"
            >
              عنوان بند فرعي
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Bold & Underline */}
        <div className="flex items-center bg-neutral/80 p-0.5 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="خط عريض وواضح"
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
              isActive('bold')
                ? 'bg-primary text-white shadow-2xs'
                : 'text-primary hover:bg-white'
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
            <span>عريض</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="خط تحت الكلام"
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              isActive('underline')
                ? 'bg-primary text-white shadow-2xs'
                : 'text-primary hover:bg-white'
            }`}
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
            <span>تسطير</span>
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center bg-neutral/80 p-0.5 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="محاذاة لليمين"
            className={`p-1.5 rounded transition-colors ${
              isTextAlign('right') ? 'bg-primary text-white' : 'hover:bg-white text-primary'
            }`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="توسيط في المنتصف"
            className={`p-1.5 rounded transition-colors ${
              isTextAlign('center') ? 'bg-primary text-white' : 'hover:bg-white text-primary'
            }`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            title="ضبط أطراف السطور"
            className={`p-1.5 rounded transition-colors ${
              isTextAlign('justify') ? 'bg-primary text-white' : 'hover:bg-white text-primary'
            }`}
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="ترقيم البنود (١، ٢، ٣...)"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            isActive('orderedList')
              ? 'bg-primary text-white border-primary'
              : 'border-border text-primary hover:bg-neutral'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ترقيم البنود</span>
        </button>
      </div>

      {/* Right: Big, Clear, Prominent "Add Fill-in Blank" Button */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm h-10 px-4 gap-2 shadow-sm shadow-blue-500/20 rounded-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ إضافة خانة تملأ لاحقاً</span>
              <ChevronDown className="w-4 h-4 opacity-80" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 max-h-96 overflow-y-auto p-1.5 text-right">
            <DropdownMenuLabel className="text-xs font-bold text-primary px-3 py-2 bg-neutral/50 rounded-md mb-1">
              اختر الخانة التي ترغب بإضافتها في مكان المؤشر:
            </DropdownMenuLabel>

            {/* Quick list of most common legal variables */}
            <div className="space-y-0.5">
              {quickCommonVars.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() =>
                    onInsertVariable({
                      id: item.id,
                      label: item.label,
                    })
                  }
                  className="text-xs py-2.5 px-3 cursor-pointer rounded-md hover:bg-blue-50 hover:text-blue-900 font-semibold flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                    إدراج +
                  </span>
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="my-1.5" />

            {/* Custom Variable Dialog Button */}
            <DropdownMenuItem
              onClick={onOpenCustomVariableDialog}
              className="text-xs py-2.5 px-3 cursor-pointer text-blue-700 font-bold hover:bg-blue-50 rounded-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>خانة مخصصة باسم مختلف...</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
