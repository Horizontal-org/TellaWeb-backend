import { Test, TestingModule } from '@nestjs/testing';
import { FetchFileService } from './fetch.file.service';
import { TYPES } from '../interfaces/types';
import { IFetchFileService, IStorageFileHandler } from '../interfaces';
import { FileDto } from '../dto';
import { StorageFileHandler } from '../handlers';
import { Readable } from 'stream';
import { ReadStream } from 'fs';

const readableToString2 = async (readable: Readable) => {
  let result = '';
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
};

describe('FetchFileService', () => {
  let service: IFetchFileService;
  let storageFileHandler: IStorageFileHandler;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.services.IFetchFileService,
          useClass: FetchFileService,
        },
        {
          provide: TYPES.handlers.IStorageFileHandler,
          useClass: StorageFileHandler,
        },
      ],
    }).compile();

    service = app.get<IFetchFileService>(TYPES.services.IFetchFileService);
    storageFileHandler = app.get<IStorageFileHandler>(
      TYPES.handlers.IStorageFileHandler,
    );

    return;
  });

  describe('fetch success', () => {
    it('should return the file as a stream', async () => {
      const file: FileDto = {
        id: '2ff5cfdb-a179-4c4f-b6be-ef8835a1ab34',
        fileName: 'testfile.txt',
        bucket: '01d65110-8aa5-4fdd-a826-1943241162f7',
      };

      jest
        .spyOn(storageFileHandler, 'fetch')
        .mockResolvedValue(
          Readable.from('test content', { encoding: 'utf8' }) as ReadStream,
        );

      const fileStream = await service.execute(file);

      expect(await readableToString2(fileStream)).toBe('test content');
    });
  });
});
