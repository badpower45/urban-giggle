import React from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { PenTool, X } from 'lucide-react';
import { PREDEFINED_VARIABLES_MAP } from '../mockData';

/**
 * Custom React NodeView for the TipTap VariableNode.
 * Redesigned for non-tech-savvy lawyers:
 * - Shows a friendly legal fill-in chip: [ ✍️ اسم الطرف ]
 * - No technical braces or code keys ({{key}}) to avoid confusing users.
 * - Simple, soft legal styling resembling highlighted form blanks.
 */
export const VariableChipView: React.FC<NodeViewProps> = ({
  node,
  selected,
  deleteNode,
}) => {
  const { id, label, fallback } = node.attrs;

  // Retrieve friendly Arabic title from predefined map if available
  const meta = PREDEFINED_VARIABLES_MAP[id];
  const displayLabel = label || meta?.label || id;

  return (
    <NodeViewWrapper
      as="span"
      className="inline-block align-middle mx-1 my-0.5 select-none"
    >
      <span
        contentEditable={false}
        data-variable-id={id}
        data-variable-label={displayLabel}
        title={`خانة متغيرة تُملأ عند تجهيز العقد: ${displayLabel}`}
        className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs border ${
          selected
            ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300 shadow-sm'
            : 'bg-blue-50 text-blue-900 border-blue-200/90 hover:bg-blue-100/80 hover:border-blue-300'
        }`}
      >
        {/* Friendly Pen / Fill-in icon */}
        <span
          className={`flex items-center justify-center w-4 h-4 rounded text-[10px] ${
            selected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
          }`}
        >
          <PenTool className="w-2.5 h-2.5" />
        </span>

        {/* Human-readable Arabic label */}
        <span className="tracking-tight whitespace-nowrap">
          {displayLabel}
        </span>

        {/* Quick Clear Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            deleteNode();
          }}
          title="حذف هذه الخانة"
          className={`rounded p-0.5 transition-colors ${
            selected
              ? 'hover:bg-white/30 text-white'
              : 'hover:bg-blue-200/70 text-blue-700 opacity-60 group-hover:opacity-100'
          }`}
        >
          <X className="w-3 h-3" />
        </button>
      </span>
    </NodeViewWrapper>
  );
};
