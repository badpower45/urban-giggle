import React from "react";
import { SmartDocumentScanner } from "../../components/ocr/SmartDocumentScanner";
import { Badge } from "../../components/ui/badge";
import { Sparkles, ShieldCheck, Zap, Layers } from "lucide-react";

export const DocumentScannerPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner / Feature Intro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/15 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Smart Document Scanner
            </h1>
            <Badge
              variant="secondary"
              className="bg-primary/15 text-primary border-primary/25 text-xs font-semibold px-2 py-0.5 rounded-full"
            >
              Beta
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            استخراج بيانات القضايا ومحاضر الشرطة والعقود آلياً بدقة فائقة مع إمكانية المراجعة البشرية والاعتماد المباشر.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>حذف أمني للملفات المؤقتة</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>معالجة فورية</span>
          </div>
        </div>
      </div>

      {/* Main Scanner Component */}
      <SmartDocumentScanner />
    </div>
  );
};

export default DocumentScannerPage;
