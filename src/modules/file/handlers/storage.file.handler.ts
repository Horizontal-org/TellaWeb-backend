import { Injectable } from '@nestjs/common';
import {
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
  createReadStream,
  ReadStream,
} from 'fs';
import * as path from 'path';

import {
  AlreadyClosedFileException,
  CantBeClosedFileException,
  NotFoundFileException,
} from '../exceptions';
import { IStorageFileHandler } from '../interfaces';
import {
  ReadFileDto,
  WriteStreamFileDto,
  InfoFileDto,
  CloseFileDto,
} from '../dto';

import { createWritePromise } from './utils/writeAsPromise.utils';

@Injectable()
export class StorageFileHandler implements IStorageFileHandler {
  private basePath: string;
  private appendableSuffix: string;

  constructor() {
    this.basePath = './data';
    this.appendableSuffix = '.part';
  }

  async fetch(input: ReadFileDto): Promise<ReadStream> {
    if (!this.fileExist(input, false))
      throw new NotFoundFileException(input.fileName);

    return createReadStream(this.getPath(input, false));
  }

  public async get(
    input: ReadFileDto,
    isPartial = false,
  ): Promise<InfoFileDto> {
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

  public async append(
    fileInputStreamDto: WriteStreamFileDto,
  ): Promise<boolean> {
    const file = await this.get(fileInputStreamDto);
    if (file.closed)
      throw new AlreadyClosedFileException(fileInputStreamDto.fileName);

    const saved = await this.streamToFile(fileInputStreamDto);
    return saved;
  }

  public async close(input: CloseFileDto): Promise<boolean> {
    const file = await this.get(input);
    if (file.closed) throw new AlreadyClosedFileException(input.fileName);
    try {
      renameSync(this.getPath(input, true), this.getPath(input, false));
      return true;
    } catch (e) {
      throw new CantBeClosedFileException(input.fileName);
    }
  }

  private getPath(input: ReadFileDto, isPartial: boolean) {
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

  private async fileExist(input: ReadFileDto, isPartial: boolean) {
    const filePath = this.getPath(input, isPartial);
    return existsSync(filePath);
  }

  private async fileSize(input: ReadFileDto, isPartial: boolean) {
    const filePath = this.getPath(input, isPartial);
    return statSync(filePath).size;
  }

  private async streamToFile(input: WriteStreamFileDto) {
    this.createBucket(input.bucket);
    const filePath = this.getPath(input, true);
    return await createWritePromise(filePath, input.stream);
  }
}
