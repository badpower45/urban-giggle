import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import { Request } from 'express';
import { UnsupportedFileTypeError } from '../types/ocr';

// Secure temporary directory with strict permissions
const OCR_TEMP_DIR = path.join(os.tmpdir(), 'siyaq-ocr-temp');
if (!fs.existsSync(OCR_TEMP_DIR)) {
  fs.mkdirSync(OCR_TEMP_DIR, { recursive: true, mode: 0o700 });
}

// 15MB maximum file limit for enterprise legal briefs & high-resolution scans
export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/tiff',
]);

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, OCR_TEMP_DIR);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const randomSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    cb(null, `ocr_${Date.now()}_${randomSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(
      new UnsupportedFileTypeError(
        `Invalid file type: ${file.mimetype}. Only PDFs and Images (JPEG, PNG, WebP) are supported.`
      )
    );
  }
};

export const ocrUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1, // Strict single file upload for atomic analysis
  },
  fileFilter,
});
