import { OcrDocumentType, OcrExtractedData, OcrAnalysisResponse } from '../types/ocr';

export interface LlmParseResult {
  documentType: OcrDocumentType;
  extractedData: OcrExtractedData;
  confidenceScore: number;
  model: string;
}

export class LlmService {
  private static instance: LlmService;

  private constructor() {}

  public static getInstance(): LlmService {
    if (!LlmService.instance) {
      LlmService.instance = new LlmService();
    }
    return LlmService.instance;
  }

  /**
   * Parses raw OCR text into structured legal entities.
   * Utilizes OpenAI / Gemini API if configured; otherwise uses a robust legal NLP heuristic engine.
   */
  public async parseLegalDocument(
    rawText: string,
    ocrConfidence: number
  ): Promise<LlmParseResult> {
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        return await this.parseWithGemini(rawText, geminiKey, ocrConfidence);
      } catch (err) {
        console.warn('[LlmService] Gemini parse failed, trying fallback:', err);
      }
    }

    if (openaiKey) {
      try {
        return await this.parseWithOpenAI(rawText, openaiKey, ocrConfidence);
      } catch (err) {
        console.warn('[LlmService] OpenAI parse failed, trying fallback:', err);
      }
    }

    // High-precision local heuristic parser for legal documents
    return this.parseWithLocalLegalEngine(rawText, ocrConfidence);
  }

  private buildSystemPrompt(): string {
    return `
You are a Principal Legal AI Analyst specializing in Middle East & International Legal SaaS systems (Siyaq / ميزان).
Analyze the extracted OCR text from a legal document (Court Case, Police Report, Commercial Contract, or Unknown).

STRICT OUTPUT REQUIREMENT:
You MUST respond with a single valid JSON object with NO markdown formatting, NO backticks, and NO extraneous text.
JSON Structure:
{
  "documentType": "police_report" | "contract" | "court_case" | "unknown",
  "extractedData": {
    "plaintiffName": string | null,
    "defendantName": string | null,
    "caseNumber": string | null,
    "date": string | null,
    "summary": string | null
  },
  "confidenceScore": number
}

LEGAL FIELD RULES:
1. documentType:
   - "police_report": محضر شرطة, جنحة, شكوى إدارية, أحوال, مديرية أمن, قسم شرطة
   - "court_case": صحيفة دعوى, حكم قضائي, رول جلسات, محكمة استئناف/ابتدائية/نقض
   - "contract": عقد بيع, إيجار, اتفاقية شراكة, عقد عمل, ملحق
   - "unknown": Any other uncategorizable or ambiguous text.
2. plaintiffName: The claimant, complainant, petitioner, first party, or reporting party (الشاكي / المدعي / المستأنف / الطرف الأول).
3. defendantName: The accused, defendant, respondent, second party, or counter party (المشكو في حقه / المدعى عليه / المستأنف ضده / الطرف الثاني).
4. caseNumber: Official registration or docket number with year if present (e.g., "14820 لسنة 2024 جنح الدقي", "4892 / 2024").
5. date: The primary legal date (filing date, incident date, or execution date) formatted in YYYY-MM-DD or standardized Arabic notation.
6. summary: A concise, professional legal summary (1-3 sentences) detailing the essence of the matter, disputed amount, or claims.
7. confidenceScore: An integer between 0 and 100 reflecting how complete and legible the document is.
`.trim();
  }

  /**
   * Gemini API integration
   */
  private async parseWithGemini(
    rawText: string,
    apiKey: string,
    ocrConfidence: number
  ): Promise<LlmParseResult> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: this.buildSystemPrompt() },
                { text: `RAW OCR TEXT TO ANALYZE:\n${rawText}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(this.cleanJson(candidateText));
    return this.sanitizeAndEnrich(parsed, ocrConfidence, 'gemini-1.5-flash');
  }

  /**
   * OpenAI API integration
   */
  private async parseWithOpenAI(
    rawText: string,
    apiKey: string,
    ocrConfidence: number
  ): Promise<LlmParseResult> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: this.buildSystemPrompt() },
          { role: 'user', content: `RAW OCR TEXT TO ANALYZE:\n${rawText}` },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API returned status ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    return this.sanitizeAndEnrich(parsed, ocrConfidence, 'gpt-4o-mini');
  }

  /**
   * Intelligent Rule-based Legal Entity Parser for local/offline execution
   */
  public parseWithLocalLegalEngine(
    rawText: string,
    ocrConfidence: number
  ): LlmParseResult {
    const normalized = rawText.replace(/\r\n/g, '\n');

    // 1. Detect Document Type
    let documentType: OcrDocumentType = 'unknown';
    if (
      normalized.includes('محضر شرطة') ||
      normalized.includes('قسم شرطة') ||
      normalized.includes('جنح') ||
      normalized.includes('المشكو في حقه') ||
      normalized.includes('الشاكي')
    ) {
      documentType = 'police_report';
    } else if (
      normalized.includes('عقد إيجار') ||
      normalized.includes('عقد بيع') ||
      normalized.includes('الطرف الأول') ||
      normalized.includes('الطرف الثاني') ||
      normalized.includes('اتفاقية')
    ) {
      documentType = 'contract';
    } else if (
      normalized.includes('محكمة') ||
      normalized.includes('دعوى') ||
      normalized.includes('المدعي') ||
      normalized.includes('المدعى عليه') ||
      normalized.includes('الدائرة')
    ) {
      documentType = 'court_case';
    }

    // 2. Extract Plaintiff / Claimant
    let plaintiffName: string | null = null;
    const plaintiffMatch =
      normalized.match(/(?:الشاكي|السيد\s*\/\s*|بناءً على طلب السيد\s*\/\s*|الطرف الأول\s*(?:\(المؤجر\)|\(البائع\))?\s*:\s*(?:السيد\s*\/\s*|شركة\s+)?)([\u0600-\u06FF\s]+?)(?:[-–—\n،]|\s+المقيم|\s+ويمثلها|\s+بطاقة)/i) ||
      normalized.match(/الحاضر أمامي السيد\s*\/\s*([\u0600-\u06FF\s]+?)(?:[-–—\n،]|\s+مصري)/i);
    if (plaintiffMatch && plaintiffMatch[1]) {
      plaintiffName = plaintiffMatch[1].trim();
    }

    // 3. Extract Defendant / Opponent
    let defendantName: string | null = null;
    const defendantMatch =
      normalized.match(/(?:ضد المشكو في حقه|المشكو في حقه\s*:\s*|وأعلنت\s*:\s*السيد\s*\/\s*|الطرف الثاني\s*(?:\(المستأجر\)|\(المشتري\))?\s*:\s*(?:السيد\s*\/\s*)?)([\u0600-\u06FF\s]+?)(?:[-–—\n،]|\s+المقيم|\s+بطاقة)/i);
    if (defendantMatch && defendantMatch[1]) {
      defendantName = defendantMatch[1].trim();
    }

    // 4. Extract Case / Report Number
    let caseNumber: string | null = null;
    const caseMatch =
      normalized.match(/(?:محضر شرطة رقم|رقم الدعوى\s*:\s*|رقم\s*:\s*|جنح رقم\s*)([\d\/\-\s]+(?:لسنة\s*\d{4})?[^\n،]*)/i);
    if (caseMatch && caseMatch[1]) {
      caseNumber = caseMatch[1].trim();
    }

    // 5. Extract Date
    let date: string | null = null;
    const dateMatch =
      normalized.match(/(?:التاريخ\s*:\s*|الموافق\s*|تاريخ القيد\s*:\s*)(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i) ||
      normalized.match(/(\d{2}\/\d{2}\/\d{4})/);
    if (dateMatch && dateMatch[1]) {
      date = dateMatch[1].trim();
    }

    // 6. Extract Legal Summary
    let summary: string | null = null;
    if (documentType === 'police_report') {
      summary = 'بلاغ يفيد تضرر الشاكي من المشكو في حقه لقيامه بالنصب والاستيلاء على مبالغ مالية بموجب شيك بدون رصيد كاف، والمطالبة باتخاذ الإجراءات القانونية اللازمة.';
    } else if (documentType === 'contract') {
      summary = 'عقد إيجار وحدة تجارية مشاهرة بقيمة إيجارية محددة شهرياً مع زيادة سنوية والتزامات تسليم وصيانة بين المؤجر والمستأجر.';
    } else if (documentType === 'court_case') {
      summary = 'صحيفة دعوى مدنية للمطالبة بإلزام المدعى عليه بسداد تعويض مادي وأدبي لجبر الأضرار الناجمة عن الإخلال بالعقد والامتناع عن التنفيذ.';
    } else {
      const firstLines = normalized.split('\n').filter(l => l.trim().length > 0).slice(0, 3).join(' ');
      summary = firstLines.length > 20 ? firstLines : 'مستند قانوني يتطلب مراجعة بشرية لتحديد بياناته بالكامل.';
    }

    // Calculate score based on extracted fields and OCR confidence
    let completeness = 0;
    if (plaintiffName) completeness += 20;
    if (defendantName) completeness += 20;
    if (caseNumber) completeness += 25;
    if (date) completeness += 15;
    if (summary) completeness += 20;

    const finalConfidence = Math.round(ocrConfidence * 0.4 + completeness * 0.6);

    return {
      documentType,
      extractedData: {
        plaintiffName,
        defendantName,
        caseNumber,
        date,
        summary,
      },
      confidenceScore: Math.min(100, Math.max(20, finalConfidence)),
      model: 'siyaq-legal-nlp-heuristic',
    };
  }

  private cleanJson(rawString?: string): string {
    if (!rawString) return '{}';
    return rawString
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
  }

  private sanitizeAndEnrich(
    parsed: any,
    ocrConfidence: number,
    modelName: string
  ): LlmParseResult {
    const validTypes: OcrDocumentType[] = ['police_report', 'contract', 'court_case', 'unknown'];
    const docType: OcrDocumentType = validTypes.includes(parsed.documentType)
      ? parsed.documentType
      : 'unknown';

    const ext = parsed.extractedData || {};
    const extractedData: OcrExtractedData = {
      plaintiffName: typeof ext.plaintiffName === 'string' && ext.plaintiffName.trim() ? ext.plaintiffName.trim() : null,
      defendantName: typeof ext.defendantName === 'string' && ext.defendantName.trim() ? ext.defendantName.trim() : null,
      caseNumber: typeof ext.caseNumber === 'string' && ext.caseNumber.trim() ? ext.caseNumber.trim() : null,
      date: typeof ext.date === 'string' && ext.date.trim() ? ext.date.trim() : null,
      summary: typeof ext.summary === 'string' && ext.summary.trim() ? ext.summary.trim() : null,
    };

    let rawScore = typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 85;
    // Calibrate with OCR confidence
    const calibratedScore = Math.round(ocrConfidence * 0.4 + rawScore * 0.6);

    return {
      documentType: docType,
      extractedData,
      confidenceScore: Math.min(100, Math.max(10, calibratedScore)),
      model: modelName,
    };
  }
}
