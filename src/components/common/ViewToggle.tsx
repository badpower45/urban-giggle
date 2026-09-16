import React from "react";
import { LayoutGrid, Table as TableIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface ViewToggleProps<T extends string = "grid" | "table"> {
  viewMode: T;
  onChange: (mode: T) => void;
  className?: string;
  firstMode?: T;
  secondMode?: T;
  firstTitle?: string;
  secondTitle?: string;
}

export const ViewToggle = <T extends string = "grid" | "table">({
  viewMode,
  onChange,
  className,
  firstMode = "grid" as T,
  secondMode = "table" as T,
  firstTitle = "بطاقات",
  secondTitle = "جدول",
}: ViewToggleProps<T>) => {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-lg border border-border bg-white p-1",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange(firstMode)}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
          viewMode === firstMode
            ? "bg-primary text-white shadow-xs"
            : "text-tertiary hover:text-primary hover:bg-neutral"
        )}
        title={firstTitle}
      >
        <LayoutGrid size={14} />
      </button>
      <button
        type="button"
        onClick={() => onChange(secondMode)}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
          viewMode === secondMode
            ? "bg-primary text-white shadow-xs"
            : "text-tertiary hover:text-primary hover:bg-neutral"
        )}
        title={secondTitle}
      >
        <TableIcon size={14} />
      </button>
    </div>
  );
};
