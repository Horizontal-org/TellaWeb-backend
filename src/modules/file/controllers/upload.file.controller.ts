import {
  BadRequestException,
  Header,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiCreatedResponse, ApiHeader } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { OnlyAuthor } from 'modules/report/guard/only-author.report.guard';

import { FileDto } from '../dto';
import {
  TYPES,
  ICreateFileApplication,
  ICloseFileApplication,
} from '../interfaces';
import {
  TYPES as GLOBAL_SETTINGS_TYPES,
  IRecordAnalyticsEventGlobalSettingService,
} from '../../globalSettings/interfaces';
import { RolesUser } from 'modules/user/domain';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@AuthController('file', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER], JwtTypes.ALL)
export class UploadFileReportController {
  constructor(
    @Inject(TYPES.applications.ICreateFileApplication)
    private createFileApplication: ICreateFileApplication,
    @Inject(TYPES.applications.ICloseFileApplication)
    private readonly closeFileApplication: ICloseFileApplication,
    @Inject(GLOBAL_SETTINGS_TYPES.services.IRecordAnalyticsEventGlobalSettingService)
    private readonly recordAnalyticsService: IRecordAnalyticsEventGlobalSettingService,
  ) {}

  @ApiCreatedResponse({ type: FileDto })
  @ApiHeader({
    name: 'X-File-Info',
    description: 'JSON-encoded file metadata',
    required: false,
  })
  @ApiHeader({
    name: 'Content-Range',
    description: 'Byte range of the chunk being uploaded, e.g. "bytes 0-499/1000"',
    required: false,
  })
  @UseGuards(OnlyAuthor)
  @Put('/v2/:reportId/:fileName')
  async handler(
    @Req() stream: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
    @Headers('x-file-info') fileInfoHeader?: string,
    @Headers('content-length') contentLengthHeader?: string,
    @Headers('content-range') contentRangeHeader?: string,
  ): Promise<FileDto | { success: boolean; error?: string; complete: boolean; }> {
    
    const startTime = Date.now();

    console.log(`[UPLOAD] === Starting upload for ${fileName} to report ${reportId} ===`);
    console.log(`[UPLOAD] Content-Length header: ${contentLengthHeader}`);
    console.log(`[UPLOAD] Content-Range header: ${contentRangeHeader}`);
    console.log(`[UPLOAD] Content-Type header: ${stream.headers['content-type']}`);

    if (!contentLengthHeader || contentLengthHeader.trim() === '' || isNaN(parseInt(contentLengthHeader))) {
      throw new HttpException('Content-Length header is required', HttpStatus.LENGTH_REQUIRED);
    }
    
    if (!contentRangeHeader || contentRangeHeader.trim() === '') {
      throw new HttpException('Content-Range header is required', HttpStatus.LENGTH_REQUIRED);
    }
    
    const contentLength = parseInt(contentLengthHeader, 10);
    
    const parsed = this.parseContentRange(contentRangeHeader);
    if (!parsed) {
      throw new BadRequestException('Invalid Content-Range header format. Expected: bytes <start>-<end>/<total>');
    }
    
    const rangeStart = parsed.start;
    const rangeEnd = parsed.end;
    const totalSize = parsed.total;

    const expectedChunkSize = rangeEnd - rangeStart + 1;
    if (contentLength !== expectedChunkSize) {
      throw new BadRequestException(
        `Content-Length (${contentLength}) does not match Content-Range chunk size (${expectedChunkSize})`,
      );
    }    

    console.log(`[UPLOAD] Calling createFileApplication.execute()...`);
    const file = await this.createFileApplication.execute({
      bucket: reportId,
      fileName,
      stream,
      contentLength,
      rangeStart,
      rangeEnd,
      totalSize,
    });

    const uploadDuration = Date.now() - startTime;
    console.log(`[UPLOAD] Stream completed in ${uploadDuration}ms, file created:`, file);

    if (file.bytesWritten !== contentLength) {
      console.warn(`[UPLOAD] Incomplete upload: received ${file.bytesWritten} of ${contentLength} bytes, keeping file partial for resume`);
      return {
        success: true,
        error: `Incomplete upload: received ${file.bytesWritten} of ${contentLength} bytes`,
        complete: false,
      };
    }

    const accumulatedBytes = (rangeStart ?? 0) + file.bytesWritten;
    const fileTotalSize = totalSize ?? contentLength;

    if (accumulatedBytes < fileTotalSize) {
      console.log(`[UPLOAD] Chunk received (${accumulatedBytes}/${fileTotalSize}), resumable incomplete`);
      res.setHeader('Range', `bytes=0-${accumulatedBytes - 1}`);
      res.status(HttpStatus.PARTIAL_CONTENT)
      return {
        success: true,
        error: null,
        complete: false,
      };
    }

    let fileInfo = null;
    if (fileInfoHeader) {
      try {
        fileInfo = JSON.parse(fileInfoHeader);
        console.log(`[UPLOAD] X-File-Info parsed:`, fileInfo);
      } catch {
        throw new BadRequestException('Invalid JSON in X-File-Info header');
      }
    }
    
    console.log(`[UPLOAD] Now closing file...`);
    try {
      await this.closeFileApplication.execute(
        {
          fileName,
          bucket: reportId,
          fileInfo,
        },
        reportId,
      );
    } catch (err) {
      return {
        success: false,
        complete: false,
        error: err instanceof Error ? err.message : 'Failed to close file',
      };
    }

    return file;
  }

  private parseContentRange(header: string): { start: number; end: number; total: number } | null {
    const match = header.match(/^bytes\s+(\d+)-(\d+)\/(\d+)$/);
    if (!match) return null;

    const start = parseInt(match[1], 10);
    const end = parseInt(match[2], 10);
    const total = parseInt(match[3], 10);

    if (start > end || end >= total) return null;

    return { start, end, total };
  }



  @ApiCreatedResponse({ type: FileDto })
  @UseGuards(OnlyAuthor)
  @Header('Deprecation', 'true')
  @Put(':reportId/:fileName')
  async uploadV1(
    @Req() stream: Request,
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
  ): Promise<FileDto> {
    console.log('V1 upload endpoint is deprecated, please use /v2/:reportId/:fileName instead');
    const file = await this.createFileApplication.execute({
      bucket: reportId,
      fileName,
      stream,
    });

    return file;
  }
}
