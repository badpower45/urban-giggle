import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import ocrRouter from './routes/ocr.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Parsing Middlewares
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'siyaq-legal-ocr-api', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/ocr', ocrRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server] Unhandled error:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({
      error: 'The uploaded file exceeds the 15MB size limit.',
      code: 'FILE_TOO_LARGE',
    });
    return;
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Siyaq OCR Service] Server listening on http://localhost:${PORT}`);
    console.log(`[Siyaq OCR Service] OCR endpoint: http://localhost:${PORT}/api/v1/ocr/analyze`);
  });
}

export default app;
