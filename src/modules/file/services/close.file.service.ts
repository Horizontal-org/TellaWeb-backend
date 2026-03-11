import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloseFileDto } from '../dto';
import { FileEntity, FileType } from '../domain';
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
      throw new NotFoundFileException(closeFileDto.fileName);
    }
    console.log(`[CLOSE] Found file in database: id=${file.id}`);
    console.log(`[CLOSE] Moving file from partial to full folder...`);
    await this.fileHandler.close(closeFileDto);
    console.log(`[CLOSE] File moved successfully`);


    console.log(`[CLOSE] Detecting file type...`);
    file.type = await this.fileHandler.getType(closeFileDto);
    console.log(`[CLOSE] File type detected: ${file.type}`);
    
    file.attachToReport(reportId);
    file.fileInfo = closeFileDto.fileInfo;
    console.log(`[CLOSE] Attached to report: ${reportId}, fileInfo: ${JSON.stringify(closeFileDto.fileInfo)}`);
    

    await this.fileRepository.save(file);
    //UNTIL HERE, FILE IS CLOSED AND SAVED IN FULL FOLDER
    
    console.log(`[CLOSE] File entity saved successfully: id=${file.id}, type=${file.type}`);

    if (file.type === FileType.IMAGE) {
      console.log(`[CLOSE] Generating preview for image: ${closeFileDto.fileName}`);
      await this.fileHandler.generatePreview(closeFileDto);
      console.log(`[CLOSE] Preview generated successfully`);
    }
    
    return;
  }
}
