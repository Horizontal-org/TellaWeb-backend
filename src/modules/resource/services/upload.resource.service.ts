import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import { ReadStream } from 'fs';

import { ReadResourceDto, WriteStreamResourceDto } from '../dto';
import { StorageFileHandler } from '../../file/handlers';
import { streamToBuffer } from '../../file/handlers/utils/streamToBuffer';
import {
  IPdfAnalyzerService,
  IUploadResourceService,
  TYPES,
} from '../interfaces';
import { Repository } from 'typeorm';
import { ResourceEntity } from '../domain';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UploadResourceService implements IUploadResourceService {
  private readonly logger = new Logger(UploadResourceService.name);

  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: StorageFileHandler,
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
    @Inject(TYPES.services.IPdfAnalyzerService)
    private readonly pdfAnalyzerService: IPdfAnalyzerService,
  ) {}

  async execute(input: WriteStreamResourceDto): Promise<ReadResourceDto> {
    const buffer = await streamToBuffer(input.stream as ReadStream);

    const analysis = await this.pdfAnalyzerService.analyze(buffer);
    if (!analysis.isValid) {
      this.logger.warn(
        `Rejected upload: ${input.fileName} - ${analysis.error}`,
      );
      throw new BadRequestException(analysis.error);
    }
    if (analysis.containsJavaScript) {
      this.logger.warn(
        `Rejected PDF upload: ${input.fileName} - contains JavaScript`,
      );
      throw new BadRequestException(
        'PDF contains JavaScript and cannot be uploaded',
      );
    }

    const newStream = new Readable();
    newStream.push(buffer);
    newStream.push(null);
    const modifiedInput = { ...input, stream: newStream };

    await this.fileHandler.append(modifiedInput);

    const resource = new ResourceEntity();
    resource.fileName = input.fileName;
    resource.title = input.fileName.split('.pdf')[0];
    resource.type = 'pdf';
    const newResource = await this.resourceRepository.save(resource);

    return plainToClass(ReadResourceDto, newResource);
  }
}
