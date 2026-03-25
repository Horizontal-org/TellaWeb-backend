import { Injectable, Logger } from '@nestjs/common';
import * as FileType from 'file-type';
import {
  IPdfAnalyzerService,
  PdfAnalysisResult,
} from '../interfaces/services/pdf-analyzer.service.interface';

@Injectable()
export class PdfAnalyzerService implements IPdfAnalyzerService {
  private readonly logger = new Logger(PdfAnalyzerService.name);


  async analyze(buffer: Buffer): Promise<PdfAnalysisResult> {
    try {
      const fileType = await FileType.fromBuffer(buffer);
      console.log("🚀 ~ PdfAnalyzerService ~ analyze ~ fileType:", fileType)

      if (!fileType || fileType.mime !== 'application/pdf') {
        this.logger.warn(
          `Invalid file type: expected PDF, got ${fileType?.mime || 'unknown'}`,
        );
        return {
          isValid: false,
          containsJavaScript: false,
          error: 'File is not a valid PDF',
        };
      }

      const containsJs = this.detectJavaScript(buffer);

      return {
        isValid: true,
        containsJavaScript: containsJs,
      };
      
    } catch (error) {
      this.logger.error(`Error analyzing PDF: ${error.message}`);
      return {
        isValid: false,
        containsJavaScript: false,
        error: 'Failed to analyze file',
      };
    }
  }
  

  private detectJavaScript(buffer: Buffer): boolean {
    const content = buffer.toString('binary');

    const jsPatterns = [
      /\/JS\s/i,
      /\/JavaScript\s/i,
      /\/OpenAction\s*<<[^>]*\/JS/i,
      /\/OpenAction\s*<<[^>]*\/JavaScript/i,
      /\/AA\s*<<[^>]*\/JS/i,
      /\/S\s*\/JavaScript/i,
    ];

    for (const pattern of jsPatterns) {
      if (pattern.test(content)) {
        this.logger.warn(
          `PDF contains JavaScript pattern: ${pattern.toString()}`,
        );
        return true;
      }
    }

    return false;
  }
}
