import React, { useState, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Save,
  Play,
  FileText,
  Check,
  AlertCircle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { VariableNode } from './VariableNode';
import { EditorToolbar } from './EditorToolbar';
import { VariableSidebar } from './VariableSidebar';
import { CustomVariableDialog } from './CustomVariableDialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  ContractTemplate,
  TemplateCategory,
  TemplateVariable,
  ScannedVariableSummary,
} from '../../../types/contract';
import { scanVariablesFromHtml } from '../generator/InterpolationEngine';
import { SAMPLE_CONTRACT_TEMPLATES, PREDEFINED_VARIABLES_MAP } from '../mockData';
import { useToast } from '../../common/Toast';

interface ContractTemplateEditorProps {
  initialTemplate?: ContractTemplate;
  onSave?: (template: ContractTemplate) => void;
  onGenerateContract?: (template: ContractTemplate) => void;
  onBack?: () => void;
}

export const ContractTemplateEditor: React.FC<ContractTemplateEditorProps> = ({
  initialTemplate,
  onSave,
  onGenerateContract,
  onBack,
}) => {
  const { showToast } = useToast();

  // Template Metadata State
  const [templateId] = useState(
    initialTemplate?.id || `tmpl-${Date.now()}`
  );
  const [templateName, setTemplateName] = useState(
    initialTemplate?.name || 'عقد جديد'
  );
  const [templateCategory, setTemplateCategory] = useState<TemplateCategory>(
    initialTemplate?.category || 'real_estate'
  );
  const [isSaved, setIsSaved] = useState(true);
  const [customVariableDialogOpen, setCustomVariableDialogOpen] = useState(false);
  const [customVariables, setCustomVariables] = useState<TemplateVariable[]>([]);

  // Initialize TipTap Editor Instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'right',
      }),
      Placeholder.configure({
        placeholder: 'اكتب نص العقد هنا بشكل طبيعي.. واضغط على "+ إضافة خانة" لإضافة مكان اسم العميل أو المبلغ...',
      }),
      VariableNode,
    ],
    content: initialTemplate?.html_content || SAMPLE_CONTRACT_TEMPLATES[0].html_content,
    editorProps: {
      attributes: {
        class:
          'prose max-w-none focus:outline-none min-h-[550px] p-6 sm:p-12 text-primary font-sans leading-8 text-justify',
        dir: 'rtl',
      },
    },
    onUpdate: () => {
      setIsSaved(false);
    },
  });

  // Calculate live statistics
  const editorHtml = editor ? editor.getHTML() : '';
  const usedVariables = useMemo<ScannedVariableSummary[]>(() => {
    return scanVariablesFromHtml(editorHtml);
  }, [editorHtml]);

  // Insert Variable helper
  const handleInsertVariable = (v: TemplateVariable | { id: string; label: string; fallback?: string }) => {
    if (!editor) return;

    const id = 'key' in v ? v.key : v.id;
    const label = v.label || id;
    const fallback = 'defaultValue' in v ? v.defaultValue : (v as { fallback?: string }).fallback;

    editor.chain().focus().insertVariable({ id, label, fallback }).run();
  };

  // Add custom variable
  const handleAddCustomVariable = (newVar: TemplateVariable) => {
    setCustomVariables((prev) => [newVar, ...prev]);
    handleInsertVariable(newVar);
    showToast(`تمت إضافة خانة "${newVar.label}" بنجاح`, 'success');
  };

  // Save Template
  const handleSave = () => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    const currentJson = editor.getJSON();
    const variableKeys = usedVariables.map((v) => v.key);

    const savedTemplate: ContractTemplate = {
      id: templateId,
      name: templateName.trim() || 'عقد بدون عنوان',
      category: templateCategory,
      html_content: currentHtml,
      json_content: currentJson,
      variables: variableKeys,
      created_at: initialTemplate?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };

    if (onSave) {
      onSave(savedTemplate);
    }

    setIsSaved(true);
    showToast(`تم حفظ تعديلات "${savedTemplate.name}" بنجاح`, 'success');
  };

  // Generate Contract Trigger
  const handleGenerate = () => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    const variableKeys = usedVariables.map((v) => v.key);

    const templateToGenerate: ContractTemplate = {
      id: templateId,
      name: templateName,
      category: templateCategory,
      html_content: currentHtml,
      variables: variableKeys,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (onGenerateContract) {
      onGenerateContract(templateToGenerate);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral text-primary overflow-hidden" dir="rtl">
      {/* 1. Header Area: Template Title & Quick Actions */}
      <header className="bg-white border-b border-border px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">اسم النموذج:</span>
          <div className="flex-1 max-w-md">
            <Input
              value={templateName}
              onChange={(e) => {
                setTemplateName(e.target.value);
                setIsSaved(false);
              }}
              placeholder="اكتب اسم أو نوع العقد..."
              className="font-bold text-xs sm:text-sm h-8 text-right bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Status Saved Badge */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold">
            {isSaved ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <Check className="w-3.5 h-3.5" />
                محفوظ
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="w-3.5 h-3.5" />
                غير محفوظ
              </span>
            )}
          </div>

          {/* Save Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="text-xs h-8 px-2.5 gap-1 font-semibold"
          >
            <Save className="w-3.5 h-3.5 text-primary" />
            <span>حفظ</span>
          </Button>

          {/* Generate Contract CTA */}
          <Button
            type="button"
            size="sm"
            onClick={handleGenerate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3 gap-1.5 shadow-xs font-bold"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>معاينة وملء العقد</span>
          </Button>
        </div>
      </header>

      {/* 2. Main Workspace (Editor Canvas + Variables Sidebar) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Central Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral/60">
          {/* Streamlined Formatting Toolbar */}
          <EditorToolbar
            editor={editor}
            onOpenCustomVariableDialog={() => setCustomVariableDialogOpen(true)}
            onInsertVariable={handleInsertVariable}
          />

          {/* Document Paper Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
            <div className="w-full max-w-[210mm] min-h-[297mm] bg-white rounded-lg shadow-card border border-border transition-all duration-200">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* 3. Predefined Variables Sidebar */}
        <VariableSidebar
          onInsertVariable={handleInsertVariable}
          onOpenCustomVariableDialog={() => setCustomVariableDialogOpen(true)}
          usedVariables={usedVariables}
          customVariables={customVariables}
        />
      </div>

      {/* Custom Variable Dialog Modal */}
      <CustomVariableDialog
        open={customVariableDialogOpen}
        onOpenChange={setCustomVariableDialogOpen}
        onInsertVariable={handleAddCustomVariable}
      />
    </div>
  );
};
