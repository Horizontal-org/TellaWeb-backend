import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { Request } from 'express';

import { UploadResourceController } from '../../controllers/upload.resource.controller';
import { MAX_RESOURCE_SIZE } from '../../domain';
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

  it('should reject a file over the size limit without reading the upload', async () => {
    await expect(
      controller.handler(stream, 'doc.pdf', String(MAX_RESOURCE_SIZE + 1)),
    ).rejects.toThrow(PayloadTooLargeException);
    expect(uploadResourceService.execute).not.toHaveBeenCalled();
  });

  it('should upload a file at the size limit', async () => {
    await controller.handler(stream, 'doc.pdf', String(MAX_RESOURCE_SIZE));

    expect(uploadResourceService.execute).toHaveBeenCalled();
  });
});
