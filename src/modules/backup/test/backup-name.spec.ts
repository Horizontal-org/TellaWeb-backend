import { backupName, folderName } from '../handlers/process.backup.handler';

describe('backupName', () => {
  it('formats day, month, year and time in UTC', () => {
    expect(backupName(new Date('2024-09-13T16:45:59Z'))).toBe(
      'tellaweb-backup-13sept2024-16h45utc',
    );
  });

  it('pads hours and minutes but not the day', () => {
    expect(backupName(new Date('2025-01-05T03:07:00Z'))).toBe(
      'tellaweb-backup-5jan2025-03h07utc',
    );
  });
});

describe('folderName', () => {
  it('keeps a title with separators or dot segments as one folder', () => {
    expect(folderName('../../../usr/src/app')).toBe('.._.._.._usr_src_app');
    expect(folderName('a\\b')).toBe('a_b');
    expect(folderName('..')).toBe('_');
    expect(folderName('.')).toBe('_');
    expect(folderName('')).toBe('_');
  });

  it('leaves ordinary names alone', () => {
    expect(folderName(`O'Brien "quoted" año`)).toBe(`O'Brien "quoted" año`);
    expect(folderName(null)).toBe('null');
  });
});
