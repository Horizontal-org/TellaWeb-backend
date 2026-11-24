import { mkdtempSync, mkdirSync, rmSync, writeFileSync, promises } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { CheckSpaceBackupService } from '../services/check-space.backup.service';

const GB = 1024 ** 3;

describe('CheckSpaceBackupService', () => {
  let cwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), 'backup-space-'));
    jest.spyOn(process, 'cwd').mockReturnValue(cwd);
    jest
      .spyOn(promises, 'statfs')
      .mockResolvedValue({ bavail: 1000, bsize: 4096 } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    rmSync(cwd, { recursive: true, force: true });
  });

  const service = (finished: { folderName: string }[] = []) =>
    new CheckSpaceBackupService({
      find: jest.fn().mockResolvedValue(finished),
    } as any);

  it('needs twice the full files plus the reserve, ignoring previews', async () => {
    mkdirSync(join(cwd, 'data', 'report-1', 'full'), { recursive: true });
    mkdirSync(join(cwd, 'data', 'report-1', 'preview'), { recursive: true });
    mkdirSync(join(cwd, 'data', 'report-2', 'full'), { recursive: true });
    writeFileSync(
      join(cwd, 'data', 'report-1', 'full', 'a'),
      Buffer.alloc(100),
    );
    writeFileSync(
      join(cwd, 'data', 'report-1', 'preview', 'a'),
      Buffer.alloc(50),
    );
    writeFileSync(join(cwd, 'data', 'report-2', 'full', 'b'), Buffer.alloc(30));

    const space = await service().execute();

    expect(space.needed).toBe(2 * 130 + GB);
    expect(space.available).toBe(1000 * 4096);
    expect(promises.statfs).toHaveBeenCalledWith(join(cwd, 'backups'));
  });

  it('counts the previous zip as freed and skips missing ones', async () => {
    mkdirSync(join(cwd, 'backups'));
    const old = join(cwd, 'backups', 'old-backup');
    writeFileSync(old + '.zip', Buffer.alloc(500));

    const space = await service([
      { folderName: old },
      { folderName: join(cwd, 'backups', 'gone') },
    ]).execute();

    expect(space.available).toBe(1000 * 4096 + 500);
  });

  it('works without a data folder', async () => {
    const space = await service().execute();
    expect(space.needed).toBe(GB);
  });
});
