import { Head, Inject, Param, Res, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { OnlyAuthor } from 'modules/report/guard/only-author.report.guard';

import { TYPES, IGetByNameAndBucketFileApplication } from '../interfaces';

@AuthController('file')
export class GetSizeFileController {
  constructor(
    @Inject(TYPES.applications.IGetByNameAndBucketFileApplication)
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
  @UseGuards(OnlyAuthor)
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
