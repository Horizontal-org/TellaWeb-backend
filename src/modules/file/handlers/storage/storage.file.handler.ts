import { Injectable } from '@nestjs/common';
import {
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
  createReadStream,
  ReadStream,
  readdirSync,
  unlinkSync,
  rmSync,
} from 'fs';
import * as path from 'path';
import * as GetFileType from 'file-type';

import {
  AlreadyClosedFileException,
  CantBeClosedFileException,
  NotFoundFileException,
} from '../../exceptions';
import { IStorageFileHandler } from '../../interfaces';
import {
  ReadFileDto,
  WriteStreamFileDto,
  InfoFileDto,
  CloseFileDto,
} from '../../dto';

import { createWritePromise } from '../utils/writeAsPromise.utils';
import { FileType } from '../../domain';
import { StreamFileDto } from 'modules/file/dto/stream.file.dto';
import { join } from 'path';

@Injectable()
export class StorageFileHandler implements IStorageFileHandler {
  private basePath = join(process.cwd(), 'data');
  private partialFolder = 'partial';
  private fullFolder = 'full';

  async delete(readFileDto: ReadFileDto): Promise<boolean> {
    const filePath = this.getPath(readFileDto, false);
    try {
      unlinkSync(filePath);
      return true;
    } catch (_) {
      return false;
    }
  }

  async getBucket(bucketId: string): Promise<ReadStream[]> {
    const bucketFullPath = path.join(this.basePath, bucketId, this.fullFolder);
    const bucketFullFiles = readdirSync(bucketFullPath, {
      withFileTypes: true,
    });

    return bucketFullFiles
      .filter((different) => different.isFile())
      .map((different) =>
        createReadStream(path.join(bucketFullPath, different.name)),
      );
  }

  async deleteBucket(bucketId: string): Promise<boolean> {
    const bucketFullPath = path.join(this.basePath, bucketId, this.fullFolder);
    try {
      rmSync(bucketFullPath, { recursive: true, force: true });
      return true;
    } catch (_) {
      return false;
    }
  }

  private getContentRange(
    range: string,
    total: number,
  ): { start?: number; end?: number } {
    if (!range) return { start: 0, end: total };

    const [startString, endAndTotalString] = range
      .replace('bytes', '')
      .replace('=', '')
      .replace(' ', '')
      .split('-');
    const [endString] = endAndTotalString?.split('/');

    const start = parseInt(startString, 10) || 0;
    const end = parseInt(endString, 10) || total - 1;

    return { start, end };
  }

  async stream(input: ReadFileDto, range?: string): Promise<StreamFileDto> {
    const fileSize = await this.fileSize(input, false);
    const filePath = this.getPath(input, false);
    const rangeOptions = this.getContentRange(range, fileSize);
    const chunkSize = rangeOptions.end - rangeOptions.start + 1;
    const { mime } = await GetFileType.fromFile(filePath);

    const responseOptions = {
      'Content-Type': mime,
      'Content-Length': chunkSize,
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${rangeOptions.start}-${rangeOptions.end}/${fileSize}`,
      'Content-Disposition': `attachable; filename="${input.fileName}"`,
    };

    const stream = createReadStream(filePath, rangeOptions);

    return {
      response: responseOptions,
      stream,
    };
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

  public async getType(input: ReadFileDto): Promise<FileType> {
    const filePath = this.getPath(input, false);
    const { mime } = await GetFileType.fromFile(filePath);
    if (mime.includes('video')) return FileType.VIDEO;
    if (mime.includes('audio')) return FileType.AUDIO;
    if (mime.includes('image')) return FileType.IMAGE;
    return FileType.OTHER;
  }

  private getPath(input: ReadFileDto, isPartial: boolean) {
    return path.join(
      this.basePath,
      input.bucket,
      isPartial ? this.partialFolder : this.fullFolder,
      input.fileName,
    );
  }

  private async createBucket(bucket: string) {
    const reportDir = path.join(this.basePath, bucket);
    const fullDir = path.join(reportDir, this.fullFolder);
    const partialDir = path.join(reportDir, this.partialFolder);
    if (existsSync(reportDir)) return;
    mkdirSync(fullDir, { mode: 0o755, recursive: true });
    mkdirSync(partialDir, { mode: 0o755, recursive: true });
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
