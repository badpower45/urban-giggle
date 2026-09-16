import React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    current: number;
    prev: number;
  };
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  trend,
  subtitle,
  className,
}) => {
  let percentChange: number | null = null;
  let isPositive = true;

  if (trend && trend.prev > 0) {
    percentChange = Math.round(((trend.current - trend.prev) / trend.prev) * 100);
    isPositive = percentChange >= 0;
  }

  return (
    <Card className={cn("overflow-hidden border-border hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-headline text-foreground tracking-tight">
              {value}
            </div>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 shadow-sm transition-transform hover:scale-105",
              iconBgColor
            )}
          >
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>

        {(percentChange !== null || subtitle) && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            {percentChange !== null && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded",
                  isPositive
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-red-700 bg-red-50"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(percentChange)}%
              </span>
            )}
            <span className="text-muted-foreground truncate">
              {subtitle || "مقارنة بالشهر السابق"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
