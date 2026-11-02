import React, { useState } from 'react';
import {
  Search,
  Plus,
  Users,
  CircleDollarSign,
  Calendar,
  Home,
  Scale,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  MousePointerClick,
} from 'lucide-react';
import { PREDEFINED_VARIABLE_GROUPS } from '../mockData';
import { TemplateVariable, ScannedVariableSummary } from '../../../types/contract';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface VariableSidebarProps {
  onInsertVariable: (v: TemplateVariable) => void;
  onOpenCustomVariableDialog: () => void;
  usedVariables: ScannedVariableSummary[];
  customVariables?: TemplateVariable[];
}

export const VariableSidebar: React.FC<VariableSidebarProps> = ({
  onInsertVariable,
  onOpenCustomVariableDialog,
  usedVariables,
  customVariables = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    parties: true,
    financial: true,
    dates: true,
    property: false,
    litigation: false,
    custom: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const isVariableUsed = (key: string) => {
    return usedVariables.some((uv) => uv.key === key);
  };

  const getGroupIcon = (id: string) => {
    switch (id) {
      case 'parties':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'financial':
        return <CircleDollarSign className="w-4 h-4 text-emerald-600" />;
      case 'dates':
        return <Calendar className="w-4 h-4 text-sky-600" />;
      case 'property':
        return <Home className="w-4 h-4 text-purple-600" />;
      case 'litigation':
        return <Scale className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-primary" />;
    }
  };

  const filteredGroups = PREDEFINED_VARIABLE_GROUPS.map((group) => {
    const filteredVars = group.variables.filter(
      (v) =>
        v.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.key.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...group,
      variables: filteredVars,
    };
  }).filter((group) => group.variables.length > 0);

  const filteredCustom = customVariables.filter(
    (v) =>
      v.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className="w-72 sm:w-80 flex flex-col h-full bg-white border-l border-border text-primary shadow-xs overflow-hidden"
      dir="rtl"
    >
      {/* Header with clear search & quick add */}
      <div className="p-3 border-b border-border bg-neutral/50 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-primary">
            <span>الخانات المتاحة</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              ({usedVariables.length} بالعقد)
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onOpenCustomVariableDialog}
            className="text-[11px] h-7 px-2 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Plus className="w-3 h-3" />
            <span>خانة جديدة</span>
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن خانة..."
            className="text-xs h-7.5 pr-8 pl-3 bg-white text-right"
          />
        </div>
      </div>

      {/* Variables List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* Custom Variables if any */}
        {filteredCustom.length > 0 && (
          <div className="border border-purple-200 rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => toggleGroup('custom')}
              className="w-full flex items-center justify-between p-2.5 bg-purple-50 text-xs font-bold text-purple-900"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>خانات مخصصة أضفتها أنت ({filteredCustom.length})</span>
              </div>
              {openGroups['custom'] ? (
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5 opacity-60" />
              )}
            </button>

            {openGroups['custom'] && (
              <div className="p-1.5 space-y-1 bg-white">
                {filteredCustom.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => onInsertVariable(v)}
                    className="w-full text-right flex items-center justify-between p-2 rounded-md border border-border/80 hover:border-blue-400 hover:bg-blue-50/60 text-xs transition-colors"
                  >
                    <span className="font-semibold text-primary">{v.label}</span>
                    <span className="text-[10px] text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded font-semibold">
                      إدراج +
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Predefined Categories */}
        {filteredGroups.map((group) => {
          const isOpen = openGroups[group.id] ?? false;

          return (
            <div
              key={group.id}
              className="border border-border rounded-lg overflow-hidden bg-white shadow-2xs"
            >
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between p-2.5 bg-neutral/50 hover:bg-neutral text-xs font-bold text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  {getGroupIcon(group.id)}
                  <span>{group.label}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 opacity-60" />
                )}
              </button>

              {isOpen && (
                <div className="p-1.5 space-y-1 bg-white">
                  {group.variables.map((v) => {
                    const used = isVariableUsed(v.key);
                    return (
                      <button
                        key={v.key}
                        type="button"
                        onClick={() => onInsertVariable(v)}
                        className={`w-full text-right flex items-center justify-between p-2 rounded-md border text-xs transition-all ${
                          used
                            ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50'
                            : 'border-border/70 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="flex flex-col text-right">
                          <span className="font-semibold text-primary">
                            {v.label}
                          </span>
                          {v.defaultValue && (
                            <span className="text-[10px] text-muted-foreground mt-0.5">
                              مثال: {v.defaultValue}
                            </span>
                          )}
                        </div>

                        {used ? (
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            مدرجة
                          </span>
                        ) : (
                          <span className="text-[10px] text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded font-bold">
                            إضافة +
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
