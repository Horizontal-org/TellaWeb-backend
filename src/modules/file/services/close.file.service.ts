import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloseFileDto } from '../dto';
import { FileEntity } from '../domain';
import { NotFoundFileException } from '../exceptions';
import { TYPES, ICloseFileService, IStorageFileHandler } from '../interfaces';

@Injectable()
export class CloseFileService implements ICloseFileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly fileHandler: IStorageFileHandler,
  ) {}

  async execute(closeFileDto: CloseFileDto, reportId: string): Promise<void> {
    console.log(`[CLOSE] CloseFileService.execute() called for ${closeFileDto.fileName}`);
    
    const file = await this.fileRepository.findOne({
      where: {
        bucket: closeFileDto.bucket,
        fileName: closeFileDto.fileName,
      },
    });
    if (!file) {
      console.log(`[CLOSE] File not found in database: ${closeFileDto.fileName}`);
      throw new NotFoundFileException(closeFileDto.fileName);
    }
    console.log(`[CLOSE] Found file in database: id=${file.id}`);
    
    console.log(`[CLOSE] Moving file from partial to full folder...`);
    await this.fileHandler.close(closeFileDto);
    console.log(`[CLOSE] File moved successfully`);

    const convertedFileName = await this.fileHandler.convertHeicToJpg(closeFileDto);
    if (convertedFileName) {
      console.log(`[CLOSE] HEIC converted to JPG: ${closeFileDto.fileName} -> ${convertedFileName}`);
      closeFileDto = { ...closeFileDto, fileName: convertedFileName };
      file.fileName = convertedFileName;
    }
    
    console.log(`[CLOSE] Detecting file type...`);
    file.type = await this.fileHandler.getType(closeFileDto);
    console.log(`[CLOSE] File type detected: ${file.type}`);
    
    file.attachToReport(reportId);
    file.fileInfo = closeFileDto.fileInfo;
    console.log(`[CLOSE] Attached to report: ${reportId}, fileInfo: ${JSON.stringify(closeFileDto.fileInfo)}`);
    
    await this.fileRepository.save(file);
    console.log(`[CLOSE] File entity saved successfully: id=${file.id}, type=${file.type}`);

    return;
  }
}
