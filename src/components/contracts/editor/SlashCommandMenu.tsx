import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Braces, Plus, Search, Heading1, Heading2, List, ListOrdered, Quote } from 'lucide-react';
import { PREDEFINED_VARIABLES_MAP } from '../mockData';
import { TemplateVariable } from '../../../types/contract';

interface SlashCommandMenuProps {
  editor: Editor | null;
  onOpenCustomVariableDialog: () => void;
  onInsertVariable: (variable: { id: string; label: string; fallback?: string }) => void;
}

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  editor,
  onOpenCustomVariableDialog,
  onInsertVariable,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  // Monitor editor text changes for "/" trigger
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;

      // Get text before cursor in current node
      const textBefore = $from.parent.textBetween(
        Math.max(0, $from.parentOffset - 20),
        $from.parentOffset,
        undefined,
        '\ufffc'
      );

      const slashMatch = textBefore.match(/(?:^|\s)\/([a-zA-Z0-9_\u0600-\u06FF]*)$/);

      if (slashMatch) {
        const queryText = slashMatch[1];
        setQuery(queryText);
        setIsOpen(true);
        setSelectedIndex(0);

        // Calculate cursor position coordinates
        try {
          const coords = editor.view.coordsAtPos($from.pos);
          setPosition({
            top: coords.bottom + 6,
            left: coords.left,
          });
        } catch {
          // Fallback if coords fail
        }
      } else {
        setIsOpen(false);
      }
    };

    editor.on('update', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor]);

  // Filter items based on query
  const allVariables = Object.values(PREDEFINED_VARIABLES_MAP);
  const filteredVariables = allVariables.filter(
    (v) =>
      v.label.toLowerCase().includes(query.toLowerCase()) ||
      v.key.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 7);

  const handleSelectVariable = (v: TemplateVariable) => {
    if (!editor) return;

    // Delete the typed "/query" from the editor
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;
    const textBefore = $from.parent.textBetween(
      Math.max(0, $from.parentOffset - 20),
      $from.parentOffset,
      undefined,
      '\ufffc'
    );
    const slashMatch = textBefore.match(/(?:^|\s)\/([a-zA-Z0-9_\u0600-\u06FF]*)$/);
    if (slashMatch) {
      const matchLength = slashMatch[1].length + 1; // +1 for the '/'
      editor
        .chain()
        .deleteRange({ from: $from.pos - matchLength, to: $from.pos })
        .run();
    }

    onInsertVariable({
      id: v.key,
      label: v.label,
      fallback: v.defaultValue,
    });
    setIsOpen(false);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredVariables.length ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredVariables.length
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex === filteredVariables.length) {
          // Custom variable
          setIsOpen(false);
          onOpenCustomVariableDialog();
        } else if (filteredVariables[selectedIndex]) {
          handleSelectVariable(filteredVariables[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, selectedIndex, filteredVariables]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${Math.max(16, Math.min(position.left - 120, window.innerWidth - 320))}px`,
        zIndex: 50,
      }}
      className="w-72 max-h-80 bg-white rounded-xl shadow-floating border border-border/80 overflow-hidden text-primary animate-in fade-in-0 zoom-in-95 duration-100"
      dir="rtl"
    >
      <div className="p-2 border-b border-border/60 bg-neutral/40 flex items-center justify-between text-xs text-muted-foreground font-semibold">
        <span className="flex items-center gap-1.5 text-primary">
          <Braces className="w-3.5 h-3.5 text-blue-600" />
          <span>إدراج متغير ذكي</span>
        </span>
        <span className="text-[10px] bg-neutral px-1.5 py-0.5 rounded font-mono">
          Enter للإدراج
        </span>
      </div>

      <div className="p-1 max-h-64 overflow-y-auto space-y-0.5">
        {filteredVariables.map((v, idx) => (
          <div
            key={v.key}
            onClick={() => handleSelectVariable(v)}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors ${
              idx === selectedIndex
                ? 'bg-blue-50 text-blue-900 font-semibold'
                : 'hover:bg-neutral text-primary'
            }`}
          >
            <div className="flex flex-col min-w-0">
              <span className="truncate">{v.label}</span>
              <span className="font-mono text-[10px] text-blue-600" dir="ltr">
                {`{{${v.key}}}`}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground bg-white px-1.5 py-0.5 rounded border border-border/60 shrink-0">
              {v.type === 'currency' ? 'مبلغ' : v.type === 'date' ? 'تاريخ' : 'نص'}
            </span>
          </div>
        ))}

        {/* Option to create custom variable */}
        <div
          onClick={() => {
            setIsOpen(false);
            onOpenCustomVariableDialog();
          }}
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs text-blue-700 font-semibold transition-colors ${
            selectedIndex === filteredVariables.length
              ? 'bg-blue-100/70'
              : 'hover:bg-blue-50'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إنشاء متغير مخصص جديد...</span>
        </div>
      </div>
    </div>
  );
};
