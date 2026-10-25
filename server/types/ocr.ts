/**
 * Enterprise Legal SaaS - Siyaq System
 * Backend TypeScript Types for Smart Legal OCR
 */

export type OcrDocumentType = 'police_report' | 'contract' | 'court_case' | 'unknown';

export interface OcrExtractedData {
  plaintiffName: string | null;
  defendantName: string | null;
  caseNumber: string | null;
  date: string | null;
  summary: string | null;
}

export interface OcrAnalysisResponse {
  documentType: OcrDocumentType;
  extractedData: OcrExtractedData;
  confidenceScore: number; // 0 to 100
  metadata?: {
    fileName?: string;
    fileSizeBytes?: number;
    mimeType?: string;
    processingTimeMs?: number;
    ocrEngine?: string;
    llmModel?: string;
    rawTextSnippet?: string;
  };
}

export class UnreadableDocumentError extends Error {
  constructor(message: string = 'The uploaded document contains no legible text or is unreadable.') {
    super(message);
    this.name = 'UnreadableDocumentError';
  }
}

export class FileTooLargeError extends Error {
  constructor(message: string = 'The uploaded file exceeds the maximum permitted size of 15MB.') {
    super(message);
    this.name = 'FileTooLargeError';
  }
}

export class UnsupportedFileTypeError extends Error {
  constructor(message: string = 'Unsupported file format. Please upload a PDF or an image (JPEG, PNG, WebP).') {
    super(message);
    this.name = 'UnsupportedFileTypeError';
  }
}
