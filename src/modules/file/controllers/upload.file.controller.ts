import {
  BadRequestException,
  Headers,
  Inject,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
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
  // @ApiHeader({
  //   name: 'X-Auto-Close',
  //   description: 'Whether to auto-close the file after upload (default: true). Set to false for chunked uploads.',
  //   required: false,
  // })
  @UseGuards(OnlyAuthor)
  @Put(':reportId/:fileName')
  async handler(
    @Req() stream: Request,
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
    @Headers('x-file-info') fileInfoHeader?: string,
    // @Headers('x-auto-close') autoCloseHeader?: string,
  ): Promise<FileDto | { success: boolean; error?: string }> {
    // const autoClose = autoCloseHeader !== 'false';
    const startTime = Date.now();
    console.log(`[UPLOAD] === Starting upload for ${fileName} to report ${reportId} ===`);
    console.log(`[UPLOAD] Content-Length header: ${stream.headers['content-length']}`);
    console.log(`[UPLOAD] Content-Type header: ${stream.headers['content-type']}`);
    // console.log(`[UPLOAD] Auto-close: ${autoClose}`);

    let fileInfo: unknown = undefined;
    if (fileInfoHeader) {
      try {
        fileInfo = JSON.parse(fileInfoHeader);
        console.log(`[UPLOAD] X-File-Info parsed:`, fileInfo);
      } catch {
        throw new BadRequestException('Invalid JSON in X-File-Info header');
      }
    }

    console.log(`[UPLOAD] Calling createFileApplication.execute()...`);
    const file = await this.createFileApplication.execute({
      bucket: reportId,
      fileName,
      stream,
    });

    const uploadDuration = Date.now() - startTime;
    console.log(`[UPLOAD] Stream completed in ${uploadDuration}ms, file created:`, file);

    // if (!autoClose) {
    //   console.log(`[UPLOAD] Auto-close disabled, skipping close`);
    //   return file;
    // }

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
        error: err instanceof Error ? err.message : 'Failed to close file',
      };
    }

    // try {
    //   await this.recordAnalyticsService.execute({
    //     measurement: true,
    //     timePrecision: 300,
    //     type: 'count',
    //     id: 'MyApPucrtpDkJWoNHh_DHiXDSEQ7cH5s9Bl3GDPJfXg',
    //   });
    // } catch {
    //   // Analytics failure should not cause upload to fail
    // }

    return file;
  }
}
