import { Head, Inject, Param, Res } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import {
  TYPES as TYPES_FILE,
  IGetByNameAndBucketFileApplication,
} from 'modules/files/interfaces';

@AuthController('reports')
export class GetFileSizeReportController {
  constructor(
    @Inject(TYPES_FILE.applications.IGetByNameAndBucketFileApplication)
    private getByNameAndBucketFileApplication: IGetByNameAndBucketFileApplication,
  ) {}

  @ApiOkResponse({
    headers: {
      size: {
        schema: {
          type: 'number',
        },
        description: 'Current size of the file in the server',
      },
    },
  })
  @Head(':reportId/:fileName')
  async handler(
    @Res() res: Response,
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
  ): Promise<void> {
    const fileInfo = await this.getByNameAndBucketFileApplication.execute({
      bucket: reportId,
      fileName: fileName,
    });
    res.setHeader('size', fileInfo.size || 0);
    res.send();
  }
}
