import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

import { UploadResourceController } from '../../controllers/upload.resource.controller';
import { IUploadResourceService } from '../../interfaces';

describe('UploadResourceController', () => {
  let controller: UploadResourceController;
  let uploadResourceService: IUploadResourceService;
  const stream = {} as Request;

  beforeEach(() => {
    uploadResourceService = { execute: jest.fn().mockResolvedValue({}) };
    controller = new UploadResourceController(uploadResourceService);
  });

  it.each(['doc.txt', 'doc.pdf.html', 'pdf', 'doc'])(
    'should reject %s without reading the upload',
    async (fileName) => {
      await expect(controller.handler(stream, fileName)).rejects.toThrow(
        BadRequestException,
      );
      expect(uploadResourceService.execute).not.toHaveBeenCalled();
    },
  );

  it.each(['doc.pdf', 'doc.PDF'])('should upload %s', async (fileName) => {
    await controller.handler(stream, fileName);

    expect(uploadResourceService.execute).toHaveBeenCalledWith({
      bucket: 'resources',
      fileName,
      stream,
    });
  });
});
