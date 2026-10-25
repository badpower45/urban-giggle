import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import {
  OcrAnalysisResponse,
  UnreadableDocumentError,
  FileTooLargeError,
  UnsupportedFileTypeError,
} from '../types/ocr';
import { VisionService } from '../services/vision.service';
import { LlmService } from '../services/llm.service';

/**
 * Controller: Analyze Legal Document via OCR and LLM Structuring
 * Route: POST /api/v1/ocr/analyze
 *
 * Flow:
 * 1. Validate uploaded multipart file.
 * 2. Invoke Google Cloud Vision API to extract raw textual tokens.
 * 3. Invoke LLM with strict system prompt to map entities to Siyaq schema.
 * 4. Compute calibrated confidence score (0-100).
 * 5. CRITICAL SECURITY REQUIREMENT:
 *    Execute guaranteed ephemeral cleanup via `finally { await fs.promises.unlink(...) }`
 *    ensuring zero customer legal data persists in temporary storage unencrypted.
 */
export async function analyzeDocumentController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const startTime = Date.now();
  const file = req.file;

  if (!file) {
    res.status(400).json({
      error: 'No document uploaded. Please attach a PDF or image file (field name: "file").',
      code: 'MISSING_FILE',
    });
    return;
  }

  const filePath = file.path;
  const fileName = file.originalname || 'document';
  const fileSizeBytes = file.size;
  const mimeType = file.mimetype;

  console.log(
    `[OcrController] Processing uploaded document: "${fileName}" (${mimeType}, ${(fileSizeBytes / 1024).toFixed(1)} KB)`
  );

  try {
    // 1. Text Extraction via Google Cloud Vision (or Mock fallback)
    const visionService = VisionService.getInstance();
    const visionResult = await visionService.extractText(filePath, mimeType);

    if (!visionResult.rawText || visionResult.rawText.trim().length === 0) {
      throw new UnreadableDocumentError(
        'The uploaded document contains no readable text. Ensure the image is focused and high-resolution.'
      );
    }

    // 2. Structured Extraction via LLM (Gemini / OpenAI / Heuristic fallback)
    const llmService = LlmService.getInstance();
    const parsedResult = await llmService.parseLegalDocument(
      visionResult.rawText,
      visionResult.ocrConfidence
    );

    const processingTimeMs = Date.now() - startTime;

    // 3. Assemble Response conforming to strict specification
    const responsePayload: OcrAnalysisResponse = {
      documentType: parsedResult.documentType,
      extractedData: {
        plaintiffName: parsedResult.extractedData.plaintiffName,
        defendantName: parsedResult.extractedData.defendantName,
        caseNumber: parsedResult.extractedData.caseNumber,
        date: parsedResult.extractedData.date,
        summary: parsedResult.extractedData.summary,
      },
      confidenceScore: parsedResult.confidenceScore,
      metadata: {
        fileName,
        fileSizeBytes,
        mimeType,
        processingTimeMs,
        ocrEngine: visionResult.engine,
        llmModel: parsedResult.model,
        rawTextSnippet:
          visionResult.rawText.length > 300
            ? `${visionResult.rawText.substring(0, 300)}...`
            : visionResult.rawText,
      },
    };

    console.log(
      `[OcrController] Successfully analyzed "${fileName}" in ${processingTimeMs}ms. Confidence: ${parsedResult.confidenceScore}%. Type: ${parsedResult.documentType}`
    );

    res.status(200).json(responsePayload);
  } catch (error: any) {
    console.error(`[OcrController] Error processing file "${fileName}":`, error);

    if (error instanceof UnreadableDocumentError) {
      res.status(422).json({
        error: error.message,
        code: 'UNREADABLE_DOCUMENT',
        details: 'OCR engine could not detect legible characters. Please re-scan with higher contrast.',
      });
      return;
    }

    if (error instanceof UnsupportedFileTypeError) {
      res.status(400).json({
        error: error.message,
        code: 'INVALID_FILE_TYPE',
      });
      return;
    }

    if (error instanceof FileTooLargeError || error.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        error: 'The uploaded file exceeds the 15MB size limit.',
        code: 'FILE_TOO_LARGE',
      });
      return;
    }

    // Default 500
    res.status(500).json({
      error: 'An internal server error occurred while processing the document.',
      code: 'INTERNAL_SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    // 4. Critical Security Mandate: Immediately delete the file from temporary storage
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`[OcrController] Securely deleted temporary file: ${filePath}`);
      }
    } catch (cleanupErr) {
      console.error(
        `[OcrController] Warning: Failed to securely delete temporary file ${filePath}:`,
        cleanupErr
      );
    }
  }
}
