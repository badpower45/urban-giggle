import React, { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Copy,
  ExternalLink,
  Shield,
  Clock,
  Check,
  X,
  FileCheck2,
  Scale,
  ShieldAlert,
  FileSpreadsheet,
  Layers,
  Eye,
  Edit3,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { cn } from "../../lib/utils";
import {
  OcrAnalysisResponse,
  OcrDocumentType,
  OcrExtractedData,
  ProcessingStage,
  ScannerState,
  SavedLegalEntityPayload,
} from "../../types/ocr";
import { analyzeLegalDocument } from "../../lib/api/ocr";
import { appStore } from "../../lib/api/store";
import { useToast } from "../common/Toast";

interface SmartDocumentScannerProps {
  onSuccessSave?: (payload: SavedLegalEntityPayload) => void;
  className?: string;
  defaultDocumentType?: OcrDocumentType;
  showCardWrapper?: boolean;
}

export const SmartDocumentScanner: React.FC<SmartDocumentScannerProps> = ({
  onSuccessSave,
  className,
  defaultDocumentType,
  showCardWrapper = true,
}) => {
  const { showToast } = useToast();

  // State Machine: 'idle' | 'processing' | 'review' | 'success' | 'error'
  const [state, setState] = useState<ScannerState>("idle");
  const [stage, setStage] = useState<ProcessingStage>("uploading");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File and Preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Extracted and Editable Data
  const [extractedResponse, setExtractedResponse] = useState<OcrAnalysisResponse | null>(null);
  const [formData, setFormData] = useState<OcrExtractedData>({
    plaintiffName: "",
    defendantName: "",
    caseNumber: "",
    date: "",
    summary: "",
  });
  const [documentType, setDocumentType] = useState<OcrDocumentType>(defaultDocumentType || "unknown");
  const [activeTab, setActiveTab] = useState<"preview" | "raw">("preview");

  // Document Viewer Controls
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savedEntity, setSavedEntity] = useState<SavedLegalEntityPayload | null>(null);

  // Clean up object URLs
  const cleanupPreview = () => {
    if (previewUrl && !previewUrl.startsWith("data:")) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // Reset entire scanner
  const handleReset = () => {
    cleanupPreview();
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsPdf(false);
    setExtractedResponse(null);
    setFormData({
      plaintiffName: "",
      defendantName: "",
      caseNumber: "",
      date: "",
      summary: "",
    });
    setDocumentType("unknown");
    setProgressPercent(0);
    setErrorMessage(null);
    setState("idle");
    setIsSaved(false);
    setSavedEntity(null);
  };

  // File Validation & Ingestion
  const processSelectedFile = async (file: File) => {
    // 1. Validation
    const MAX_SIZE = 15 * 1024 * 1024; // 15 MB
    if (file.size > MAX_SIZE) {
      setErrorMessage(`الملف المرفق كبير جداً (${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت). الحد الأقصى المسموح به هو 15 ميجابايت.`);
      setState("error");
      return;
    }

    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/tiff"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|jpe?g|png|webp|tiff)$/i)) {
      setErrorMessage("صيغة الملف غير مدعومة. يرجى رفع مستند PDF أو صورة عالية الوضوح (JPEG, PNG).");
      setState("error");
      return;
    }

    setSelectedFile(file);
    const isPdfFile = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    setIsPdf(isPdfFile);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // 2. Transition to State 2: Uploading & OCR
    setState("processing");
    setErrorMessage(null);
    setProgressPercent(15);
    setStage("uploading");
    setStatusMessage("جاري رفع المستند المشفر وتأمينه...");

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await analyzeLegalDocument(file, {
        signal: abortController.signal,
        onProgress: (currentStage, percent, message) => {
          setStage(currentStage);
          setProgressPercent(percent);
          setStatusMessage(message);
        },
      });

      // 3. Transition to State 3: Review (Human in the loop)
      setExtractedResponse(response);
      setDocumentType(response.documentType || "unknown");
      setFormData({
        plaintiffName: response.extractedData.plaintiffName || "",
        defendantName: response.extractedData.defendantName || "",
        caseNumber: response.extractedData.caseNumber || "",
        date: response.extractedData.date || "",
        summary: response.extractedData.summary || "",
      });
      setState("review");
      showToast("تم استخراج البيانات القانونية بنجاح! يرجى المراجعة والاعتماد.", "success");
    } catch (err: any) {
      if (err.name === "AbortError") {
        handleReset();
        return;
      }
      setErrorMessage(err.message || "تعذر قراءة المستند أو تحليل نصوصه. يرجى التأكد من وضوح المسح الضوئي وإعادة المحاولة.");
      setState("error");
      showToast("فشلت عملية معالجة المستند", "error");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  // Quick Demo Samples Loader
  const loadSampleDocument = (type: "police" | "case" | "contract") => {
    let mockFile: File;
    if (type === "police") {
      mockFile = new File(
        ["mock police report content"],
        "محضر_شرطة_جنح_الدقي_14820.pdf",
        { type: "application/pdf" }
      );
    } else if (type === "contract") {
      mockFile = new File(
        ["mock lease contract content"],
        "عقد_ايجار_وحدة_تجارية_مشاهرة.pdf",
        { type: "application/pdf" }
      );
    } else {
      mockFile = new File(
        ["mock court case statement"],
        "صحيفة_دعوى_تعويض_مدني_4892.pdf",
        { type: "application/pdf" }
      );
    }
    processSelectedFile(mockFile);
  };

  // State 3: Save Extracted Entity
  const handleSaveToSystem = (target: "case" | "police_report") => {
    const payload: SavedLegalEntityPayload = {
      entityType: target,
      title:
        target === "case"
          ? `دعوى ${formData.plaintiffName || "موكل"} ضد ${formData.defendantName || "خصم"}`
          : `محضر ${formData.caseNumber || "جديد"}`,
      caseNumber: formData.caseNumber || "غير محدد",
      clientName: formData.plaintiffName || "موكل جديد",
      opponentName: formData.defendantName || "الخصم",
      date: formData.date || new Date().toISOString().split("T")[0],
      summary: formData.summary || "",
      confidenceScore: extractedResponse?.confidenceScore || 90,
    };

    // Store in appStore directly for immediate UI reflection in Siyaq
    if (target === "case") {
      appStore.addCase({
        firm_id: "firm-1",
        client_id: "client-1",
        court_id: "court-1",
        case_type_id: "ct1",
        case_type_name: "مدني",
        title: payload.title,
        case_number: payload.caseNumber,
        client_name: payload.clientName,
        opponent_name: payload.opponentName,
        case_year: new Date().getFullYear(),
        filing_date: payload.date,
        description: payload.summary,
        status: "active",
        court_name: "محكمة استئناف القاهرة",
        court_governorate: "القاهرة",
        circuit: "الدائرة 7 مدني",
        client_role: "plaintiff",
        total_fees: 15000,
        total_paid: 5000,
        created_by: "user-1",
      });
    } else {
      appStore.addPoliceReport({
        client_id: "client-1",
        client_name: payload.clientName,
        report_number: payload.caseNumber,
        report_year: new Date().getFullYear(),
        report_type: "junhah",
        security_directorate: "مديرية أمن الجيزة",
        police_station: "قسم الدقي",
        general_prosecution: "نيابة الجيزة الكلية",
        district_prosecution: "نيابة الدقي الجزئية",
        subject: payload.summary.slice(0, 50) || "محضر جنحة جديد",
        incident_summary: payload.summary,
        status: "under_investigation",
        total_fees: 4000,
        total_expenses: 500,
        created_by: "user-1",
      });
    }

    setSavedEntity(payload);
    setIsSaved(true);
    setState("success");
    showToast(`تم حفظ البيانات بنجاح في سجل ${target === "case" ? "القضايا" : "محاضر الشرطة"}!`, "success");
    onSuccessSave?.(payload);
  };

  // Confidence Score Styling
  const getConfidenceBadge = (score: number) => {
    if (score >= 80) {
      return {
        variant: "success" as const,
        label: `دقة استخراج فائقة (${score}%)`,
        icon: CheckCircle2,
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }
    if (score >= 60) {
      return {
        variant: "warning" as const,
        label: `يوصى بالمراجعة البشرية (${score}%)`,
        icon: AlertTriangle,
        bg: "bg-amber-50 text-amber-800 border-amber-200",
      };
    }
    return {
      variant: "destructive" as const,
      label: `دقة منخفضة (${score}%)`,
      icon: AlertTriangle,
      bg: "bg-red-50 text-red-700 border-red-200",
    };
  };

  // Render Title with required Beta Badge
  const renderHeaderTitle = () => (
    <div className="flex items-center gap-2.5">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        <Sparkles className="h-5 w-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Smart Document Scanner
          </h2>
          {/* REQUIRED: Stylish Beta Badge */}
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-2 py-0.5 rounded-full shadow-xs"
          >
            Beta
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          المسح الضوئي الذكي للمستندات القانونية وتفريغها آلياً بواسطة الذكاء الاصطناعي
        </p>
      </div>
    </div>
  );

  // ==========================================
  // STATE 1: IDLE (Drag & Drop Zone)
  // ==========================================
  const renderIdleState = () => (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center min-h-[300px]",
          isDragging
            ? "border-primary bg-primary/5 scale-[0.99]"
            : "border-border hover:border-primary/50 hover:bg-slate-50/50 bg-white"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200 shadow-xs">
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3 className="text-base font-semibold text-foreground mb-1">
          اسحب وأفلت ملف القضية أو المحضر هنا، أو{" "}
          <span className="text-primary underline underline-offset-4">تصفح جهازك</span>
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mb-4 leading-relaxed">
          يدعم مستندات الـ PDF المصورة والماسحة الضوئية، وصور الهواتف (PNG, JPG) حتى 15 ميجابايت لكل ملف
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-border/40 w-full max-w-sm">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Shield className="h-3 w-3 text-emerald-600" /> تشفير كامل ومسح فوري للملفات المؤقتة
          </span>
        </div>
      </div>

      {/* Quick Demo Previews */}
      <div className="rounded-xl border border-border/70 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            أو جرب المسح فوراً بنماذج جاهزة من القضايا والمحاضر:
          </span>
          <Badge variant="outline" className="text-[10px] text-muted-foreground">
            تجارب سريعة
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadSampleDocument("police")}
            className="justify-start text-xs h-auto py-2.5 bg-white hover:bg-slate-100 hover:text-primary transition-all border-border"
          >
            <ShieldAlert className="h-4 w-4 ml-2 text-rose-500 shrink-0" />
            <div className="text-right truncate">
              <p className="font-semibold truncate">محضر جنحة نصب</p>
              <p className="text-[10px] text-muted-foreground">قسم الدقي - شيك بدون رصيد</p>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadSampleDocument("case")}
            className="justify-start text-xs h-auto py-2.5 bg-white hover:bg-slate-100 hover:text-primary transition-all border-border"
          >
            <Scale className="h-4 w-4 ml-2 text-indigo-500 shrink-0" />
            <div className="text-right truncate">
              <p className="font-semibold truncate">صحيفة دعوى تعويض</p>
              <p className="text-[10px] text-muted-foreground">مدني كلي شمال القاهرة</p>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadSampleDocument("contract")}
            className="justify-start text-xs h-auto py-2.5 bg-white hover:bg-slate-100 hover:text-primary transition-all border-border"
          >
            <FileSpreadsheet className="h-4 w-4 ml-2 text-emerald-600 shrink-0" />
            <div className="text-right truncate">
              <p className="font-semibold truncate">عقد إيجار وحدة تجارية</p>
              <p className="text-[10px] text-muted-foreground">مشاهرة وتوثيق قصر النيل</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // STATE 2: PROCESSING (Uploading & OCR)
  // ==========================================
  const renderProcessingState = () => (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
          <Sparkles className="h-10 w-10 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md">
          <Clock className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-foreground">
          جاري معالجة المستند وتحليله...
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {statusMessage || "يقوم النظام باستخراج النصوص وهيكلة الأطراف القضائية عبر الذكاء الاصطناعي"}
        </p>
      </div>

      {/* Progress Bar with Steps */}
      <div className="w-full space-y-3">
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-border/50">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-muted-foreground font-mono">
          <span>{progressPercent}% مكتمل</span>
          <span>{stage === "uploading" ? "الرفع" : stage === "ocr" ? "استخراج النصوص (OCR)" : "الذكاء الاصطناعي (AI)"}</span>
        </div>
      </div>

      {/* Dynamic Stepper */}
      <div className="w-full grid grid-cols-3 gap-2 text-[11px] pt-4 border-t border-border">
        <div className={cn("p-2 rounded-lg border text-center transition-colors", stage === "uploading" ? "border-primary bg-primary/5 text-primary font-bold" : "border-border/60 text-muted-foreground")}>
          1. تشفير ورفع الملف
        </div>
        <div className={cn("p-2 rounded-lg border text-center transition-colors", stage === "ocr" ? "border-primary bg-primary/5 text-primary font-bold" : "border-border/60 text-muted-foreground")}>
          2. استخراج OCR
        </div>
        <div className={cn("p-2 rounded-lg border text-center transition-colors", stage === "structuring" ? "border-primary bg-primary/5 text-primary font-bold" : "border-border/60 text-muted-foreground")}>
          3. هيكلة الكيانات
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          abortControllerRef.current?.abort();
          handleReset();
        }}
        className="text-xs text-muted-foreground hover:text-destructive"
      >
        <X className="h-3.5 w-3.5 ml-1" /> إلغاء المعالجة
      </Button>
    </div>
  );

  // ==========================================
  // STATE 3: REVIEW (Human in the loop)
  // ==========================================
  const renderReviewState = () => {
    const score = extractedResponse?.confidenceScore || 85;
    const badgeInfo = getConfidenceBadge(score);
    const BadgeIcon = badgeInfo.icon;

    return (
      <div className="space-y-5">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-border/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-white border border-border text-foreground">
              {isPdf ? <FileText className="h-4 w-4 text-rose-600" /> : <ImageIcon className="h-4 w-4 text-blue-600" />}
            </div>
            <div className="truncate max-w-[220px] sm:max-w-xs">
              <p className="text-xs font-bold text-foreground truncate">
                {selectedFile?.name || "المستند المرفوع"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {((selectedFile?.size || 0) / 1024).toFixed(1)} KB • {extractedResponse?.metadata?.ocrEngine || "OCR Engine"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs font-semibold px-2.5 py-1 gap-1.5", badgeInfo.bg)}>
              <BadgeIcon className="h-3.5 w-3.5" />
              <span>{badgeInfo.label}</span>
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs h-8 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3 w-3 ml-1" /> مسح جديد
            </Button>
          </div>
        </div>

        {/* Split-Screen: Left Preview & Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[500px]">
          {/* LEFT / TOP: Document Viewer */}
          <div className="lg:col-span-6 flex flex-col rounded-xl border border-border bg-slate-900/5 overflow-hidden">
            {/* Viewer Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-border text-xs text-foreground font-medium">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-semibold transition-colors",
                    activeTab === "preview" ? "bg-white text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Eye className="h-3 w-3 inline ml-1" /> معاينة المستند
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("raw")}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-semibold transition-colors",
                    activeTab === "raw" ? "bg-white text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FileText className="h-3 w-3 inline ml-1" /> النص الخام المستخرج
                </button>
              </div>

              {activeTab === "preview" && !isPdf && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(50, z - 20))}
                    className="p-1 rounded-md hover:bg-white text-muted-foreground hover:text-foreground"
                    title="تصغير"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] font-mono w-8 text-center">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(200, z + 20))}
                    className="p-1 rounded-md hover:bg-white text-muted-foreground hover:text-foreground"
                    title="تكبير"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1 rounded-md hover:bg-white text-muted-foreground hover:text-foreground"
                    title="تدوير"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Viewer Content Area */}
            <div className="relative flex-1 min-h-[420px] max-h-[550px] overflow-auto p-4 flex items-center justify-center bg-slate-900/5">
              {activeTab === "preview" ? (
                isPdf ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-white rounded-lg border border-border/80 shadow-xs">
                    <FileText className="h-16 w-16 text-rose-500 animate-pulse" />
                    <p className="text-sm font-bold text-foreground">مستند قضائي (PDF)</p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      تم استخراج وفهرسة النص الرقمي للمستند بنجاح. يمكنك فتح الملف أو استعراض النصوص المستخرجة.
                    </p>
                    {previewUrl && (
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-2"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> فتح المستند الأصلي في نافذة منفصلة
                      </a>
                    )}
                  </div>
                ) : (
                  <div
                    className="transition-transform duration-200"
                    style={{
                      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                    }}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Scanned Document"
                        className="max-h-[500px] w-auto object-contain rounded shadow-md border border-border bg-white"
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground">لا توجد صورة للمعاينة</div>
                    )}
                  </div>
                )
              ) : (
                /* Raw OCR Text View */
                <div className="w-full h-full p-3 bg-white rounded-lg border border-border font-mono text-xs text-slate-800 whitespace-pre-wrap overflow-y-auto leading-relaxed text-right dir-rtl">
                  {extractedResponse?.metadata?.rawTextSnippet || "لا تتوفر نصوص خام."}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT / BOTTOM: Human-in-the-Loop Editable Form */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4 bg-white p-5 rounded-xl border border-border shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <Edit3 className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-bold text-foreground">
                    مراجعة وتعديل البيانات المستخرجة
                  </h4>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  الحقول قابلة للتعديل والاعتماد
                </span>
              </div>

              {/* Document Type Selector */}
              <div>
                <Label className="text-xs font-semibold mb-1.5 block text-foreground">
                  نوع المستند القانوني
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(
                    [
                      { id: "court_case", label: "دعوى قضائية", icon: Scale },
                      { id: "police_report", label: "محضر شرطة", icon: ShieldAlert },
                      { id: "contract", label: "عقد قانوني", icon: FileSpreadsheet },
                      { id: "unknown", label: "أخرى / غير محدد", icon: FileText },
                    ] as const
                  ).map((item) => {
                    const Icon = item.icon;
                    const isSelected = documentType === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setDocumentType(item.id)}
                        className={cn(
                          "flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-xs"
                            : "border-border bg-slate-50/50 hover:bg-slate-100 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Plaintiff & Defendant */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold mb-1 block text-foreground">
                    المدعي / الشاكي / الطرف الأول
                  </Label>
                  <Input
                    value={formData.plaintiffName || ""}
                    onChange={(e) => setFormData({ ...formData, plaintiffName: e.target.value })}
                    placeholder="مثال: أحمد محمود السيد"
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block text-foreground">
                    المدعى عليه / المشكو في حقه / الخصم
                  </Label>
                  <Input
                    value={formData.defendantName || ""}
                    onChange={(e) => setFormData({ ...formData, defendantName: e.target.value })}
                    placeholder="مثال: طارق عبد العزيز"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Case Number & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold mb-1 block text-foreground">
                    رقم الدعوى / المحضر / القيد
                  </Label>
                  <Input
                    value={formData.caseNumber || ""}
                    onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                    placeholder="مثال: 14820 لسنة 2024 جنح الدقي"
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block text-foreground">
                    تاريخ التحرير / القيد / الواقعة
                  </Label>
                  <Input
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="YYYY-MM-DD"
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Summary / Notes */}
              <div>
                <Label className="text-xs font-semibold mb-1 block text-foreground">
                  ملخص الواقعة / المنطوق القانوني
                </Label>
                <Textarea
                  rows={4}
                  value={formData.summary || ""}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="ملخص النزاع، المطالبات المالية، أو ملابسات الواقعة..."
                  className="text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs h-9 text-muted-foreground"
              >
                إلغاء وتجاهل
              </Button>

              <div className="flex items-center gap-2">
                {documentType === "police_report" ? (
                  <Button
                    type="button"
                    onClick={() => handleSaveToSystem("police_report")}
                    className="text-xs h-9 gap-1.5 bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    حفظ في محاضر الشرطة
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => handleSaveToSystem("case")}
                    className="text-xs h-9 gap-1.5"
                  >
                    <Scale className="h-3.5 w-3.5" />
                    حفظ في سجل القضايا
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // STATE 4: SUCCESS (Confirmed & Reset)
  // ==========================================
  const renderSuccessState = () => (
    <div className="py-10 px-6 text-center max-w-md mx-auto space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="h-9 w-9" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-foreground">
          تم حفظ البيانات والملف بنجاح!
        </h3>
        <p className="text-xs text-muted-foreground">
          تم إنشاء السجل وتوثيقه في قاعدة بيانات النظام بعد مراجعة الأطراف القانونية.
        </p>
      </div>

      {savedEntity && (
        <div className="bg-slate-50 border border-border/80 rounded-xl p-4 text-right text-xs space-y-2 font-medium">
          <div className="flex justify-between border-b border-border/50 pb-1.5">
            <span className="text-muted-foreground">نوع السجل:</span>
            <span className="font-bold text-foreground">
              {savedEntity.entityType === "case" ? "قضية متداولة" : "محضر شرطة رسمي"}
            </span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-1.5">
            <span className="text-muted-foreground">رقم القيد / المحضر:</span>
            <span className="font-mono font-bold text-primary">{savedEntity.caseNumber}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-1.5">
            <span className="text-muted-foreground">الموكل / الشاكي:</span>
            <span className="text-foreground">{savedEntity.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الخصم / المشكو في حقه:</span>
            <span className="text-foreground">{savedEntity.opponentName}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
        <Button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto text-xs h-9 gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          مسح مستند قانوني آخر
        </Button>
      </div>
    </div>
  );

  // ==========================================
  // STATE 5: ERROR
  // ==========================================
  const renderErrorState = () => (
    <div className="py-10 px-6 text-center max-w-md mx-auto space-y-5">
      <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto shadow-sm">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-foreground">
          فشلت عملية معالجة المستند
        </h3>
        <p className="text-xs text-destructive leading-relaxed">
          {errorMessage || "حدث خطأ غير متوقع أثناء معالجة المستند."}
        </p>
      </div>

      <div className="pt-2 flex justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-xs h-9"
        >
          <RefreshCw className="h-3.5 w-3.5 ml-1.5" /> المحاولة مرة أخرى
        </Button>
      </div>
    </div>
  );

  const content = (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header with Title and stylish Beta Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        {renderHeaderTitle()}
      </div>

      {/* State Machine Router */}
      {state === "idle" && renderIdleState()}
      {state === "processing" && renderProcessingState()}
      {state === "review" && renderReviewState()}
      {state === "success" && renderSuccessState()}
      {state === "error" && renderErrorState()}
    </div>
  );

  if (!showCardWrapper) {
    return content;
  }

  return (
    <Card className="shadow-xs border-border/80 bg-white">
      <CardContent className="p-6">{content}</CardContent>
    </Card>
  );
};

export default SmartDocumentScanner;
