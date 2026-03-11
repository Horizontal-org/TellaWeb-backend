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
  readFileSync,
  writeFileSync,
} from 'fs';
import * as path from 'path';
import * as GetFileType from 'file-type';
import * as sharp from 'sharp';

import { BadRequestException } from '@nestjs/common';
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
import { convertHeicFileToJpg } from '../utils/convertHeicToJpg.utils';
import { FileType } from '../../domain';
import { StreamFileDto } from 'modules/file/dto/stream.file.dto';
import { join } from 'path';

@Injectable()
export class StorageFileHandler implements IStorageFileHandler {
  private basePath = join(process.cwd(), 'data');
  private partialFolder = 'partial';
  private fullFolder = 'full';
  private previewFolder = 'preview';

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

  async getResources(fileNames: string[]): Promise<ReadStream[]> {
    const bucketFullPath = path.join(this.basePath, 'resources', this.fullFolder);
    const bucketFullFiles = readdirSync(bucketFullPath, {
      withFileTypes: true,
    });

    return bucketFullFiles
      .filter((different) => different.isFile())
      .filter((different) => fileNames.includes(different.name))
      .map((different) =>
        createReadStream(path.join(bucketFullPath, different.name)),
      );
  }

  async downloadFileFromBucket(
    bucketId: string,
    fileName: string,
  ): Promise<ReadStream | null> {
    const bucketFullPath = path.join(this.basePath, bucketId, this.fullFolder);
    const bucketFullFiles = readdirSync(bucketFullPath, {
      withFileTypes: true,
    });

    const file = bucketFullFiles.find(
      (file) => file.isFile() && file.name === fileName,
    );
    if (!file) {
      return null; // File not found in the bucket
    }

    const filePath = path.join(bucketFullPath, file.name);
    return createReadStream(filePath);
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
      console.log("StorageFileHandler ~ get ~ size:", size)
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
  ): Promise<number> {
    console.log(`[HANDLER] StorageFileHandler.append() called for ${fileInputStreamDto.fileName}`);
    
    const file = await this.get(fileInputStreamDto);
    console.log(`[HANDLER] File status - exists: ${file.exist}, closed: ${file.closed}, size: ${file.size}`);
    
    if (file.closed)
      throw new AlreadyClosedFileException(fileInputStreamDto.fileName);

    if (file.exist && !!(fileInputStreamDto.totalSize) && file.size >= fileInputStreamDto.totalSize) {
      console.log(`[HANDLER] Partial file already has ${file.size} bytes meeting or exceeding totalSize ${fileInputStreamDto.totalSize}, skipping stream`);
      return file.size;
    }

    if (fileInputStreamDto.rangeStart !== undefined) {
      if (fileInputStreamDto.rangeStart > file.size) {
        throw new BadRequestException(
          `Content-Range start (${fileInputStreamDto.rangeStart}) is beyond current file size (${file.size})`,
        );
      }
    }

    const bytesWritten = await this.streamToFile(fileInputStreamDto);

    if (fileInputStreamDto.contentLength !== undefined && bytesWritten !== fileInputStreamDto.contentLength) {
      console.warn(`[UPLOAD] Content-Length mismatch: expected ${fileInputStreamDto.contentLength}, received ${bytesWritten}`);
    }

    return bytesWritten;
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

  public async convertHeicToJpg(input: ReadFileDto): Promise<string | null> {
    const filePath = this.getPath(input, false);
    try {
      const result = await convertHeicFileToJpg(filePath);
      if (!result) return null;
      const newFileName = input.fileName.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg');
      console.log(`[CONVERT] Converted HEIC to JPG: ${input.fileName} -> ${newFileName}`);
      return newFileName;
    } catch (err) {
      console.error(`[CONVERT] Failed to convert HEIC to JPG for ${input.fileName}:`, err);
      return null;
    }
  }

  public async getType(input: ReadFileDto): Promise<FileType> {
    const filePath = this.getPath(input, false);
    console.log(`[CLOSE] getType() called for file: ${filePath}`);

    try {
      const result = await GetFileType.fromFile(filePath);
      console.log(`[CLOSE] file-type detection result:`, result);
      if (result) {
        const { mime } = result;
        console.log(`[CLOSE] Detected MIME type: ${mime}`);
        if (mime.includes('video')) {
          console.log(`[CLOSE] Classified as VIDEO`);
          return FileType.VIDEO;
        }
        if (mime.includes('audio')) {
          console.log(`[CLOSE] Classified as AUDIO`);
          return FileType.AUDIO;
        }
        if (mime.includes('image')) {
          console.log(`[CLOSE] Classified as IMAGE`);
          return FileType.IMAGE;
        }
      } else {
        console.log(`[CLOSE] file-type returned null/undefined`);
      }
    } catch (e) {
      console.log(`[CLOSE] file-type detection error:`, e);
    }

    // Fallback: check file extension for HEIC/HEIF
    const ext = input.fileName.toLowerCase().split('.').pop();
    console.log(`[CLOSE] Fallback: checking file extension: ${ext}`);
    if (ext === 'heic' || ext === 'heif') {
      console.log(`[CLOSE] Extension match - classified as IMAGE`);
      return FileType.IMAGE;
    }

    console.log(`[CLOSE] No match - classified as OTHER`);
    return FileType.OTHER;
  }

  public async generatePreview(input: ReadFileDto): Promise<void> {
    const fullPath = this.getPath(input, false);
    const ext = input.fileName.toLowerCase().split('.').pop();
    const isHeic = ext === 'heic' || ext === 'heif';
    const previewFileName = isHeic
      ? input.fileName.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg')
      : input.fileName;

    const previewDir = path.join(this.basePath, input.bucket, this.previewFolder);
    if (!existsSync(previewDir)) {
      mkdirSync(previewDir, { mode: 0o755, recursive: true });
    }
    const previewPath = path.join(previewDir, previewFileName);

    let inputBuffer: Buffer;
    if (isHeic) {
      const heicBuffer = readFileSync(fullPath);
      const convert = require('heic-convert');
      inputBuffer = Buffer.from(await convert({ buffer: heicBuffer, format: 'JPEG', quality: 0.92 }));
    } else {
      inputBuffer = readFileSync(fullPath);
    }

    await sharp(inputBuffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toFile(previewPath);

    console.log(`[PREVIEW] Generated preview: ${previewPath}`);
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
    const previewDir = path.join(reportDir, this.previewFolder);
    if (existsSync(reportDir)) return;
    mkdirSync(fullDir, { mode: 0o755, recursive: true });
    mkdirSync(partialDir, { mode: 0o755, recursive: true });
    mkdirSync(previewDir, { mode: 0o755, recursive: true });
  }

  private async fileExist(input: ReadFileDto, isPartial: boolean) {
    const filePath = this.getPath(input, isPartial);
    console.log("🚀 ~ StorageFileHandler ~ fileExist ~ filePath:", filePath)
    return existsSync(filePath);
  }

  private async fileSize(input: ReadFileDto, isPartial: boolean) {
    const filePath = this.getPath(input, isPartial);
    console.log("🚀 ~ StorageFileHandler ~ fileSize ~ filePath:", filePath)
    return statSync(filePath).size;
  }

  private async streamToFile(input: WriteStreamFileDto) {
    this.createBucket(input.bucket);
    const filePath = this.getPath(input, true);
    return await createWritePromise(filePath, input.stream, input.rangeStart);
  }
}
