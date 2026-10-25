import { PREDEFINED_VARIABLES_MAP } from '../mockData';
import { ScannedVariableSummary, TemplateVariable, VariableDataType } from '../../../types/contract';

/**
 * Scans HTML content for both TipTap VariableNode spans and raw {{placeholders}}.
 * Returns a deduplicated array of variables with occurrences and metadata.
 */
export function scanVariablesFromHtml(html: string): ScannedVariableSummary[] {
  if (!html) return [];

  const variableMap = new Map<string, { label: string; count: number }>();

  // 1. Scan for TipTap data-variable-id spans:
  // e.g. <span data-variable-id="client_name" data-variable-label="اسم الموكل">...</span>
  const spanRegex = /<span[^>]*data-variable-id=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = spanRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const key = match[1];

    // Extract label attribute if present
    const labelMatch = fullTag.match(/data-variable-label=["']([^"']+)["']/i);
    const label = labelMatch ? labelMatch[1] : (PREDEFINED_VARIABLES_MAP[key]?.label || key);

    const existing = variableMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      variableMap.set(key, { label, count: 1 });
    }
  }

  // 2. Scan for raw {{variable_key}} in case template was imported or edited with raw text
  const rawRegex = /\{\{([a-zA-Z0-9_-]+)\}\}/g;
  while ((match = rawRegex.exec(html)) !== null) {
    const key = match[1];
    // If this raw brace was not inside a span we already counted
    if (!variableMap.has(key)) {
      const label = PREDEFINED_VARIABLES_MAP[key]?.label || key;
      variableMap.set(key, { label, count: 1 });
    }
  }

  // Map to ScannedVariableSummary array
  return Array.from(variableMap.entries()).map(([key, data]) => {
    const meta = PREDEFINED_VARIABLES_MAP[key];
    return {
      key,
      label: data.label,
      occurrences: data.count,
      type: (meta?.type || inferVariableType(key)) as VariableDataType,
      category: meta?.category || 'custom',
      isFilled: false,
    };
  });
}

/**
 * Infers variable data type from its key naming conventions
 */
export function inferVariableType(key: string): VariableDataType {
  const lower = key.toLowerCase();
  if (lower.includes('date') || lower.includes('تاريخ')) return 'date';
  if (
    lower.includes('price') ||
    lower.includes('rent') ||
    lower.includes('value') ||
    lower.includes('fee') ||
    lower.includes('deposit') ||
    lower.includes('قيمة') ||
    lower.includes('مبلغ') ||
    lower.includes('أتعاب')
  ) {
    return 'currency';
  }
  if (lower.includes('count') || lower.includes('number') || lower.includes('area') || lower.includes('sqm')) {
    return 'number';
  }
  if (lower.includes('notes') || lower.includes('description') || lower.includes('summary')) {
    return 'textarea';
  }
  return 'text';
}

export interface InterpolationOptions {
  /** If true, highlights filled values with subtle styling for proofreading */
  highlight?: boolean;
  /** Whether to show unfilled placeholders as warning badges or empty underlines */
  renderUnfilledAsBadge?: boolean;
}

/**
 * Interpolates template HTML with user-entered values in real-time.
 * Handles both TipTap VariableNode spans and raw {{key}} placeholders.
 */
export function interpolateHtml(
  html: string,
  filledData: Record<string, any>,
  options: InterpolationOptions = { highlight: false, renderUnfilledAsBadge: true }
): string {
  if (!html) return '';

  let output = html;

  // 1. Replace <span ... data-variable-id="key" ...>...</span> chips
  const spanChipRegex = /<span\b[^>]*data-variable-id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/span>/gi;

  output = output.replace(spanChipRegex, (fullMatch, key, innerContent) => {
    const labelMatch = fullMatch.match(/data-variable-label=["']([^"']+)["']/i);
    const label = labelMatch ? labelMatch[1] : (PREDEFINED_VARIABLES_MAP[key]?.label || key);

    const val = filledData[key];
    const isFilled = val !== undefined && val !== null && String(val).trim() !== '';

    if (isFilled) {
      const displayVal = formatDisplayValue(val, key);
      if (options.highlight) {
        return `<span class="siyaq-interpolated-highlight bg-amber-100 text-amber-950 font-semibold px-1.5 py-0.5 rounded border-b-2 border-amber-500 transition-colors">${displayVal}</span>`;
      }
      return `<span class="siyaq-interpolated-value font-medium">${displayVal}</span>`;
    }

    if (options.renderUnfilledAsBadge) {
      return `<span class="siyaq-unfilled-chip inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-rose-50 text-rose-700 border border-rose-300 border-dashed" title="حقل غير مكتمل: ${label}">[ ${label} - مطلوب ]</span>`;
    }

    // Default underline placeholder for clean legal drafts
    return `<span class="siyaq-empty-placeholder inline-block min-w-[80px] border-b border-dashed border-slate-400 text-slate-400 text-xs text-center px-2">[ ${label} ]</span>`;
  });

  // 2. Replace any raw {{variable_key}} that might remain
  output = output.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (match, key) => {
    const val = filledData[key];
    const isFilled = val !== undefined && val !== null && String(val).trim() !== '';
    const label = PREDEFINED_VARIABLES_MAP[key]?.label || key;

    if (isFilled) {
      const displayVal = formatDisplayValue(val, key);
      if (options.highlight) {
        return `<span class="siyaq-interpolated-highlight bg-amber-100 text-amber-950 font-semibold px-1.5 py-0.5 rounded border-b-2 border-amber-500">${displayVal}</span>`;
      }
      return `<span class="siyaq-interpolated-value font-medium">${displayVal}</span>`;
    }

    if (options.renderUnfilledAsBadge) {
      return `<span class="siyaq-unfilled-chip inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-rose-50 text-rose-700 border border-rose-300 border-dashed">[ ${label} - مطلوب ]</span>`;
    }

    return `<span class="siyaq-empty-placeholder inline-block min-w-[80px] border-b border-dashed border-slate-400 text-slate-400 text-xs text-center px-2">[ ${label} ]</span>`;
  });

  return output;
}

/**
 * Generates finalized clean legal HTML without any badges or editing wrappers.
 * Suitable for storing as `final_html` and printing on legal letterhead.
 */
export function generateFinalCleanHtml(
  html: string,
  filledData: Record<string, any>
): string {
  return interpolateHtml(html, filledData, {
    highlight: false,
    renderUnfilledAsBadge: false,
  });
}

/**
 * Formats values based on type (e.g. adding currency symbols or standard Arabic date formatting)
 */
function formatDisplayValue(val: any, key: string): string {
  const str = String(val).trim();
  const type = inferVariableType(key);

  // If number or currency, format cleanly
  if (type === 'currency' && !str.includes('جنيه') && !str.includes('EGP') && !isNaN(Number(str.replace(/,/g, '')))) {
    const num = Number(str.replace(/,/g, ''));
    return `${num.toLocaleString('ar-EG')} جنيهاً مصرياً`;
  }

  return str;
}
