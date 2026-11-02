import React from "react";
import { cn } from "../../lib/utils";

interface CountBadgeProps {
  count: number;
  isLoading?: boolean;
  className?: string;
  prefix?: string;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  isLoading = false,
  className = "",
  prefix = "عددهم: ",
}) => {
  if (isLoading || count <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center bg-blue-500/10 text-blue-600 border border-blue-500/25 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold shrink-0 select-none",
        className
      )}
    >
      {prefix}{count}
    </span>
  );
};
