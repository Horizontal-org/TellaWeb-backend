export interface PdfAnalysisResult {
  isValid: boolean;
  containsJavaScript: boolean;
  error?: string;
}

export interface IPdfAnalyzerService {
  analyze(buffer: Buffer): Promise<PdfAnalysisResult>;
  // containsJavaScript(buffer: Buffer): Promise<boolean>;
}
