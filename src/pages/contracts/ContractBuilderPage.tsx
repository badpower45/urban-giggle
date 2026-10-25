import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  Plus,
  CheckCircle2,
  Printer,
  Search,
  Building2,
  Car,
  Briefcase,
  Users,
  ShieldCheck,
  Scale,
  Handshake,
  FileSpreadsheet,
} from 'lucide-react';
import { ContractTemplateEditor } from '../../components/contracts/editor/ContractTemplateEditor';
import { ContractGenerator } from '../../components/contracts/generator/ContractGenerator';
import { SAMPLE_CONTRACT_TEMPLATES } from '../../components/contracts/mockData';
import { ContractTemplate, ContractInstance, TemplateCategory } from '../../types/contract';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useToast } from '../../components/common/Toast';

type ViewMode = 'generator' | 'editor' | 'templates_list';

interface CategoryFilterItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

const CONTRACT_CATEGORIES: CategoryFilterItem[] = [
  { id: 'all', label: 'كافة النماذج' },
  { id: 'real_estate', label: 'عقارات وإيجار' },
  { id: 'sales', label: 'بيوع ونقل ملكية' },
  { id: 'commercial', label: 'شركات وتجارة' },
  { id: 'employment', label: 'عمل وتوظيف' },
  { id: 'services', label: 'خدمات ومقاولات' },
  { id: 'settlements', label: 'إقرارات ومصالحات' },
  { id: 'litigation', label: 'أتعاب ومحاماة' },
  { id: 'civil', label: 'مدني وقسمة تركات' },
  { id: 'nda', label: 'سرية وتعهدات' },
];

export const ContractBuilderPage: React.FC = () => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Default mode to 'generator' (fill & print) for non-tech users
  const initialMode = (searchParams.get('mode') as ViewMode) || 'generator';
  const initialTemplateId = searchParams.get('templateId') || SAMPLE_CONTRACT_TEMPLATES[0].id;

  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [templates, setTemplates] = useState<ContractTemplate[]>(SAMPLE_CONTRACT_TEMPLATES);
  const [savedInstances, setSavedInstances] = useState<ContractInstance[]>([]);

  // Template Library Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Selected template
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate>(() => {
    return (
      SAMPLE_CONTRACT_TEMPLATES.find((t) => t.id === initialTemplateId) ||
      SAMPLE_CONTRACT_TEMPLATES[0]
    );
  });

  // Filtered Templates for the Library View
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.name_en && t.name_en.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  // Handle template selection
  const handleSelectTemplate = (tmpl: ContractTemplate, targetMode: ViewMode = viewMode) => {
    setSelectedTemplate(tmpl);
    setViewMode(targetMode);
    setSearchParams({ templateId: tmpl.id, mode: targetMode });
  };

  // Handle saving modified template
  const handleSaveTemplate = (updated: ContractTemplate) => {
    setTemplates((prev) => {
      const idx = prev.findIndex((t) => t.id === updated.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
    setSelectedTemplate(updated);
  };

  // Handle transition to generator
  const handleGenerateContract = (tmpl: ContractTemplate) => {
    setSelectedTemplate(tmpl);
    setViewMode('generator');
    setSearchParams({ templateId: tmpl.id, mode: 'generator' });
  };

  // Handle saving generated contract instance
  const handleSaveInstance = (instance: ContractInstance) => {
    setSavedInstances((prev) => [instance, ...prev]);
  };

  // Handle create new blank template
  const handleCreateNewTemplate = () => {
    const newTmpl: ContractTemplate = {
      id: `tmpl-${Date.now()}`,
      name: 'عقد جديد بدون عنوان',
      category: 'custom',
      variables: [],
      html_content: `
<div class="legal-contract" dir="rtl">
  <h2 style="text-align: center; margin-bottom: 24px; font-weight: 800; font-size: 22px;">عقد اتفاق قانوني</h2>
  <p style="text-align: center; color: #475569;">إنه في يوم الموافق تم الاتفاق والتراضي بين كل من:</p>
  <p><strong>أولاً:</strong> اكتب بيانات الطرف الأول هنا...</p>
  <p><strong>ثانياً:</strong> اكتب بيانات الطرف الثاني هنا...</p>
</div>
      `.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };

    setTemplates((prev) => [newTmpl, ...prev]);
    setSelectedTemplate(newTmpl);
    setViewMode('editor');
    setSearchParams({ templateId: newTmpl.id, mode: 'editor' });
    showToast('تم فتح صفحة كتابة نموذج جديد', 'info');
  };

  // Helper to get category badge style and label
  const getCategoryBadge = (cat: TemplateCategory) => {
    switch (cat) {
      case 'real_estate':
        return { label: 'عقارات وإيجار', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'sales':
        return { label: 'بيوع ونقل ملكية', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'commercial':
        return { label: 'شركات وتجارة', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'employment':
        return { label: 'عمل وتوظيف', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'services':
        return { label: 'خدمات ومقاولات', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' };
      case 'settlements':
        return { label: 'إقرارات ومصالحات', color: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'litigation':
        return { label: 'محاماة وتوكيلات', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'civil':
        return { label: 'مدني وقسمة تركات', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'nda':
        return { label: 'سرية وتعهدات', color: 'bg-slate-100 text-slate-800 border-slate-200' };
      default:
        return { label: 'نموذج مخصص', color: 'bg-neutral text-primary border-border' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral text-primary overflow-hidden" dir="rtl">
      {/* Streamlined Top Bar */}
      <div className="bg-white border-b border-border px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        {/* Right: Grouped Contract Switcher */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm text-primary font-headline">العقد:</span>
            <select
              value={selectedTemplate.id}
              onChange={(e) => {
                const found = templates.find((t) => t.id === e.target.value);
                if (found) handleSelectTemplate(found, viewMode);
              }}
              className="text-xs font-bold text-primary bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer max-w-[260px] sm:max-w-md truncate"
            >
              {CONTRACT_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const groupTemplates = templates.filter((t) => t.category === cat.id);
                if (groupTemplates.length === 0) return null;
                return (
                  <optgroup key={cat.id} label={`── ${cat.label} ──`}>
                    {groupTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
              {/* Custom / Other */}
              {templates.filter((t) => t.category === 'custom').length > 0 && (
                <optgroup label="── نماذج مخصصة ──">
                  {templates
                    .filter((t) => t.category === 'custom')
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {/* Center: Clean Segmented Mode Control */}
        <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              setViewMode('generator');
              setSearchParams({ templateId: selectedTemplate.id, mode: 'generator' });
            }}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              viewMode === 'generator'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            ملء وطباعة
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('editor');
              setSearchParams({ templateId: selectedTemplate.id, mode: 'editor' });
            }}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              viewMode === 'editor'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            تعديل الصياغة
          </button>

          <button
            type="button"
            onClick={() => setViewMode('templates_list')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              viewMode === 'templates_list'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            مكتبة النماذج ({templates.length})
          </button>
        </div>

        {/* Left: Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleCreateNewTemplate}
            className="text-xs h-8 px-2.5 gap-1 bg-primary text-white font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ عقد جديد</span>
          </Button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'generator' && (
          <ContractGenerator
            key={selectedTemplate.id}
            template={selectedTemplate}
            onSaveInstance={handleSaveInstance}
            onBack={() => setViewMode('templates_list')}
          />
        )}

        {viewMode === 'editor' && (
          <ContractTemplateEditor
            key={selectedTemplate.id}
            initialTemplate={selectedTemplate}
            onSave={handleSaveTemplate}
            onGenerateContract={handleGenerateContract}
            onBack={() => setViewMode('templates_list')}
          />
        )}

        {viewMode === 'templates_list' && (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto overflow-y-auto h-full space-y-6">
            {/* Header with Title & Stats */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-primary font-headline">
                    مكتبة العقود والنماذج القانونية المعتمدة
                  </h1>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {templates.length} صيغة معتمدة
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  صيغ قانونية محكمة ومحدثة وفقاً للقوانين المصرية والعربية، جاهزة للملء الذكي والطباعة فوراً.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleCreateNewTemplate}
                className="gap-1.5 bg-primary text-white text-xs h-9 font-bold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء صيغة عقد مخصصة</span>
              </Button>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="space-y-3 bg-white p-3.5 rounded-xl border border-border shadow-xs">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في النماذج (مثال: إيجار، بيع سيارة، مقاولة، أمانة، عمل، شركة)..."
                  className="pr-9 pl-4 text-xs h-9 bg-slate-50 border-slate-200 focus:bg-white text-right"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {CONTRACT_CATEGORIES.map((cat) => {
                  const count =
                    cat.id === 'all'
                      ? templates.length
                      : templates.filter((t) => t.category === cat.id).length;

                  if (count === 0 && cat.id !== 'all') return null;

                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-primary text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200/60'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700 font-mono'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((tmpl) => {
                const badge = getCategoryBadge(tmpl.category);

                return (
                  <div
                    key={tmpl.id}
                    className="bg-white rounded-xl border border-border p-5 shadow-xs hover:shadow-card transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-semibold">
                          {tmpl.variables.length} خانات ذكية
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-primary leading-snug group-hover:text-amber-800 transition-colors">
                        {tmpl.name}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {tmpl.description || 'صيغة قانونية معتمدة مع خانات ملء آلية تفاعلية.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSelectTemplate(tmpl, 'generator')}
                        className="text-xs h-9 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>ملء وطباعة</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectTemplate(tmpl, 'editor')}
                        className="text-xs h-9 flex-1 font-semibold hover:bg-slate-50"
                      >
                        <FileText className="w-3.5 h-3.5 ml-1" />
                        <span>تعديل الصيغة</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State when Search has no results */}
            {filteredTemplates.length === 0 && (
              <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 space-y-3">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-sm text-primary">لا توجد صيغ عقود تطابق بحثك</h3>
                <p className="text-xs text-muted-foreground">
                  جرب البحث بكلمة أخرى أو اختر "كافة النماذج" لعرض جميع الصيغ القانونية.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs"
                >
                  إعادة ضبط البحث
                </Button>
              </div>
            )}

            {/* Saved Instances Section */}
            {savedInstances.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border space-y-3">
                <h2 className="text-sm sm:text-base font-bold text-primary">
                  العقود التي قمت بتجهيزها مؤخراً ({savedInstances.length})
                </h2>
                <div className="bg-white rounded-xl border border-border divide-y divide-border">
                  {savedInstances.map((ins) => (
                    <div
                      key={ins.id}
                      className="p-3.5 flex items-center justify-between text-xs hover:bg-neutral/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold text-primary">{ins.template_name}</p>
                          <p className="text-muted-foreground text-[11px]">
                            الموكل: {ins.client_name} • التاريخ:{' '}
                            {new Date(ins.created_at).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        نسخة محفوظة
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
