import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fsp } from 'fs';
import { join } from 'path';
import { BackupEntity } from '../domain';
import {
  BackupSpace,
  ICheckSpaceBackupService,
} from '../interfaces/services/check-space.backup.service.interface';

// room for the sql dump, the csvs and uploads arriving while the backup runs
const RESERVE_BYTES = 1024 ** 3;

@Injectable()
export class CheckSpaceBackupService implements ICheckSpaceBackupService {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepo: Repository<BackupEntity>,
  ) {}

  private backupsPath = join(process.cwd(), 'backups');
  private dataPath = join(process.cwd(), 'data');

  async execute(): Promise<BackupSpace> {
    // backups/ may not be on the same disk as data/, so measure where the zip is written
    await fsp.mkdir(this.backupsPath, { recursive: true });
    const { bavail, bsize } = await fsp.statfs(this.backupsPath);

    // StartBackupService deletes the previous zips before the new backup runs
    const finished = await this.backupRepo.find({
      where: { status: 'finished' },
    });
    const freed = await this.sumSizes(
      finished.map((b) => b.folderName + '.zip'),
    );

    // files are copied into a folder and then zipped, so both exist at once
    return {
      needed: 2 * (await this.dataFilesSize()) + RESERVE_BYTES,
      available: bavail * bsize + freed,
    };
  }

  // every bucket's full/ folder; includes some files the backup skips, so it can only overestimate
  private async dataFilesSize(): Promise<number> {
    const buckets = await this.readdir(this.dataPath);
    let total = 0;
    for (const bucket of buckets) {
      const fullPath = join(this.dataPath, bucket, 'full');
      const files = await this.readdir(fullPath);
      total += await this.sumSizes(files.map((f) => join(fullPath, f)));
    }
    return total;
  }

  private async sumSizes(paths: string[]): Promise<number> {
    const sizes = await Promise.all(
      paths.map((p) =>
        fsp.stat(p).then(
          (s) => (s.isFile() ? s.size : 0),
          () => 0,
        ),
      ),
    );
    return sizes.reduce((a, b) => a + b, 0);
  }

  private async readdir(path: string): Promise<string[]> {
    try {
      return await fsp.readdir(path);
    } catch (e) {
      if (e.code === 'ENOENT' || e.code === 'ENOTDIR') return [];
      throw e;
    }
  }
}
