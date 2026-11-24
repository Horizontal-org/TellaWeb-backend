import { StartBackupApplication } from '../applications/start.backup.application';
import { NotEnoughSpaceBackupException } from '../exceptions/not-enough-space.backup.exception';

describe('StartBackupApplication', () => {
  const user = { id: 'user-1' };

  const setup = (space: { needed: number; available: number }) => {
    const startBackupService = { execute: jest.fn() };
    const application = new StartBackupApplication(
      { execute: jest.fn().mockResolvedValue(false) },
      { execute: jest.fn().mockResolvedValue(space) },
      startBackupService,
    );
    return { application, startBackupService };
  };

  it('refuses without touching the previous backup when space is short', async () => {
    const { application, startBackupService } = setup({
      needed: 10,
      available: 9,
    });

    await expect(application.execute(user)).rejects.toBeInstanceOf(
      NotEnoughSpaceBackupException,
    );
    expect(startBackupService.execute).not.toHaveBeenCalled();
  });

  it('starts the backup when there is enough space', async () => {
    const { application, startBackupService } = setup({
      needed: 10,
      available: 10,
    });

    await application.execute(user);

    expect(startBackupService.execute).toHaveBeenCalledWith(user);
  });
});
