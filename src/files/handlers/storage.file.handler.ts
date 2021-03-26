import { existsSync, mkdirSync, renameSync, statSync } from 'fs';
import * as path from 'path';
import { FileInputDto, FileInputStreamDto } from '../dto/file-input.dto';
import { FileInfoDto } from '../dto/file-info.dto';
import { FileAlreadyClosed } from '../exceptions/already-closed';
import { FileCantBeClosed } from '../exceptions/cant-be-closed';
import { Injectable } from '@nestjs/common';
import { IStorageFileHandler } from '../interfaces/handlers/storage.file.handler.inteface';
import { createWritePromise } from './utils/writeAsPromise.utils';

@Injectable()
export class StorageFileHandler implements IStorageFileHandler {
  private basePath: string;
  private appendableSuffix: string;

  constructor() {
    this.basePath = './data';
    this.appendableSuffix = '.part';
  }

  public async get(
    input: FileInputDto,
    isPartial = false,
  ): Promise<FileInfoDto> {
    const fileExist = await this.fileExist(input, isPartial);
    if (fileExist) {
      const size = await this.fileSize(input, isPartial);
      return {
        exist: true,
        size: size,
        closed: !isPartial,
      };
    }

    if (isPartial) {
      return {
        exist: false,
        size: 0,
        closed: false,
      };
    }

    return this.get(input, true);
  }

  public async append({
    bucket,
    fileName,
    stream,
  }: FileInputStreamDto): Promise<boolean> {
    const file = await this.get({ bucket, fileName });
    if (file.closed) throw new FileAlreadyClosed(fileName);

    const saved = await this.streamToFile({ bucket, fileName, stream });
    return saved;
  }

  public async close(input: FileInputDto): Promise<boolean> {
    const file = await this.get(input);
    if (file.closed) throw new FileAlreadyClosed(input.fileName);
    try {
      renameSync(this.getPath(input, true), this.getPath(input, false));
      return true;
    } catch (e) {
      throw new FileCantBeClosed(input.fileName);
    }
  }

  private getPath(input: FileInputDto, isPartial: boolean) {
    const fileName = isPartial
      ? input.fileName + this.appendableSuffix
      : input.fileName;
    return path.join(this.basePath, input.bucket, fileName);
  }

  private async createBucket(bucket: string) {
    const dir = path.join(this.basePath, bucket);
    if (existsSync(dir)) return;
    mkdirSync(dir, { mode: 0o755, recursive: true });
  }

  private async fileExist(input: FileInputDto, isPartial: boolean) {
    const filePath = this.getPath(input, isPartial);
    return existsSync(filePath);
  }

  private async fileSize(input: FileInputDto, isPartial: boolean) {
    const filePath = this.getPath(input, isPartial);
    return statSync(filePath).size;
  }

  private async streamToFile(input: FileInputStreamDto) {
    this.createBucket(input.bucket);
    const filePath = this.getPath(input, true);
    return await createWritePromise(filePath, input.stream);
  }
}
