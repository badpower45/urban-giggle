import { Router } from 'express';
import { ocrUpload } from '../middleware/upload.middleware';
import { analyzeDocumentController } from '../controllers/ocr.controller';

const router = Router();

/**
 * @route   POST /api/v1/ocr/analyze
 * @desc    Uploads legal document (PDF/Image), runs OCR via Google Cloud Vision & structured LLM analysis
 * @access  Private (Enterprise Law Firm User)
 */
router.post('/analyze', ocrUpload.single('file'), analyzeDocumentController);

export default router;
