import { PdfAnalyzerService } from '../../services/pdf-analyzer.service';

describe('PdfAnalyzerService', () => {
  const service = new PdfAnalyzerService();

  it('should reject content that is not a PDF', async () => {
    const result = await service.analyze(Buffer.from('<html></html>'));

    expect(result.isValid).toBe(false);
  });

  it('should accept a PDF', async () => {
    const result = await service.analyze(
      Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF'),
    );

    expect(result).toEqual({ isValid: true, containsJavaScript: false });
  });
});
