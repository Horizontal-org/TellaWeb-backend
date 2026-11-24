import { comparePassword, hashPassword } from './password.utils';

describe('password utils', () => {
  // made by bcrypt 5.1 at cost 10, like the hashes already in the database
  const existingHash =
    '$2b$10$oUWqpygRCzQN3cXAuZB59ecUG0iNzLrb.1OlY5/qPPc2xQgdybSda';

  it('accepts the right password for a hash made by an older bcrypt', async () => {
    expect(await comparePassword('Existing-password-1', existingHash)).toBe(
      true,
    );
  });

  it('rejects a wrong password for a hash made by an older bcrypt', async () => {
    expect(await comparePassword('Existing-password-2', existingHash)).toBe(
      false,
    );
  });

  it('hashes in the same format', async () => {
    const hash = await hashPassword('New-password-1');
    expect(hash).toMatch(/^\$2b\$\d{2}\$[./A-Za-z0-9]{53}$/);
    expect(await comparePassword('New-password-1', hash)).toBe(true);
  });
});
