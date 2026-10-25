/**
 * Smart Legal OCR & Document Scanner Types
 * Enterprise Legal SaaS - Siyaq System
 */

export type OcrDocumentType = 'police_report' | 'contract' | 'court_case' | 'unknown';

export interface OcrExtractedData {
  plaintiffName: string | null;
  defendantName: string | null;
  caseNumber: string | null;
  date: string | null;
  summary: string | null;
}

export interface OcrAnalysisMetadata {
  fileName?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  pageCount?: number;
  processingTimeMs?: number;
  ocrEngine?: string;
  llmModel?: string;
  rawTextSnippet?: string;
}

/**
 * Standard backend response payload for POST /api/v1/ocr/analyze
 */
export interface OcrAnalysisResponse {
  documentType: OcrDocumentType;
  extractedData: OcrExtractedData;
  confidenceScore: number; // 0 to 100
  metadata?: OcrAnalysisMetadata;
}

export type OcrErrorCode = 
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'UNREADABLE_DOCUMENT'
  | 'EXTRACTION_FAILED'
  | 'INTERNAL_SERVER_ERROR';

export interface OcrErrorResponse {
  error: string;
  code: OcrErrorCode;
  details?: string;
}

/**
 * UI State Machine Types for <SmartDocumentScanner />
 */
export type ScannerState = 'idle' | 'processing' | 'review' | 'success' | 'error';

export type ProcessingStage = 'uploading' | 'ocr' | 'structuring';

export interface ScannerProgressState {
  stage: ProcessingStage;
  progressPercent: number;
  statusMessage: string;
}

export interface SavedLegalEntityPayload {
  entityType: 'case' | 'police_report' | 'contract';
  title: string;
  caseNumber: string;
  clientName: string;
  opponentName: string;
  date: string;
  summary: string;
  confidenceScore: number;
}
