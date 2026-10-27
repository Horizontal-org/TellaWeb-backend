export interface BackupSpace {
  // bytes
  needed: number;
  available: number;
}

export interface ICheckSpaceBackupService {
  execute(): Promise<BackupSpace>;
}
