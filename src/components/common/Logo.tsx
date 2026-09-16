import React, { useState } from "react";
import { cn } from "../../lib/utils";

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  iconSize = 36,
  showText = true,
  textColor = "text-primary",
  subtextColor = "text-tertiary",
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* Authentic Logo Icon */}
      <div
        className="flex items-center justify-center rounded-xl overflow-hidden shrink-0 shadow-sm bg-neutral border border-border"
        style={{ width: iconSize, height: iconSize }}
      >
        {!imgError ? (
          <img
            src="/logo.webp"
            alt="سياق"
            className="h-full w-full object-contain p-0.5"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary text-white font-bold text-sm">
            س
          </div>
        )}
      </div>

      {/* Brand Typographic Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none text-start">
          <div className="flex items-center gap-1.5">
            <span className={cn("text-lg font-bold font-headline tracking-tight", textColor)}>
              سِـيَـاق
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#C5A059]/10 text-[#9E7B35] border border-[#C5A059]/30 leading-none">
              LEGAL
            </span>
          </div>
          <span className={cn("mt-1 text-[11px] font-medium truncate", subtextColor)}>
            نظام إدارة مكاتب المحاماة
          </span>
        </div>
      )}
    </div>
  );
};
