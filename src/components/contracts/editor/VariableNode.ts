import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { VariableChipView } from './VariableChipView';
import { PREDEFINED_VARIABLES_MAP } from '../mockData';

export interface VariableNodeOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      /**
       * Insert a legal variable placeholder node at the current selection
       */
      insertVariable: (attributes: {
        id: string;
        label?: string;
        fallback?: string;
      }) => ReturnType;
    };
  }
}

/**
 * Custom TipTap Node: VariableNode
 * 
 * Specifically designed for Enterprise Legal SaaS (Siyaq).
 * Renders placeholders like {{client_name}} as styled, non-editable inline chips
 * within the legal document template editor.
 */
export const VariableNode = Node.create<VariableNodeOptions>({
  name: 'variable',

  group: 'inline',

  inline: true,

  atom: true, // Treated as a single atomic unit, cannot type inside

  selectable: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: 'variable',
        parseHTML: (element) =>
          element.getAttribute('data-variable-id') ||
          element.getAttribute('data-id') ||
          'variable',
        renderHTML: (attributes) => ({
          'data-variable-id': attributes.id,
        }),
      },
      label: {
        default: '',
        parseHTML: (element) =>
          element.getAttribute('data-variable-label') ||
          element.getAttribute('data-label') ||
          '',
        renderHTML: (attributes) => ({
          'data-variable-label': attributes.label,
        }),
      },
      fallback: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-fallback') || '',
        renderHTML: (attributes) => ({
          'data-fallback': attributes.fallback,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-variable-id]',
        getAttrs: (node) => {
          if (typeof node === 'string') return false;
          const element = node as HTMLElement;
          const id = element.getAttribute('data-variable-id') || '';
          const label = element.getAttribute('data-variable-label') || '';
          const fallback = element.getAttribute('data-fallback') || '';
          return { id, label, fallback };
        },
      },
      {
        tag: 'span.siyaq-variable-chip',
        getAttrs: (node) => {
          if (typeof node === 'string') return false;
          const element = node as HTMLElement;
          const text = element.textContent || '';
          const match = text.match(/^\{\{([a-zA-Z0-9_-]+)\}\}$/);
          const id = element.getAttribute('data-variable-id') || (match ? match[1] : 'variable');
          return { id };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const id = node.attrs.id;
    const label = node.attrs.label || PREDEFINED_VARIABLES_MAP[id]?.label || id;
    const fallback = node.attrs.fallback || '';

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'siyaq-variable-chip',
        'data-variable-id': id,
        'data-variable-label': label,
        'data-fallback': fallback,
      }),
      `{{${id}}}`,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableChipView);
  },

  addCommands() {
    return {
      insertVariable:
        (attributes) =>
        ({ commands }) => {
          const meta = PREDEFINED_VARIABLES_MAP[attributes.id];
          const resolvedLabel = attributes.label || meta?.label || attributes.id;
          const resolvedFallback = attributes.fallback || meta?.defaultValue || '';

          return commands.insertContent({
            type: this.name,
            attrs: {
              id: attributes.id,
              label: resolvedLabel,
              fallback: resolvedFallback,
            },
          });
        },
    };
  },

  addInputRules() {
    // Automatically turn typed {{var_name}} into a VariableNode chip
    return [
      nodeInputRule({
        find: /(?:^|\s)\{\{([a-zA-Z0-9_-]+)\}\}$/,
        type: this.type,
        getAttributes: (match) => {
          const id = match[1];
          const meta = PREDEFINED_VARIABLES_MAP[id];
          return {
            id,
            label: meta?.label || id,
            fallback: meta?.defaultValue || '',
          };
        },
      }),
    ];
  },
});
