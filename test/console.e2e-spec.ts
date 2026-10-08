import { spawnSync } from 'child_process';
import { join } from 'path';

import { createTestApp, loginWeb, TestApp, USERS } from './setup/app';

// The nestjs-console commands (npm run console:dev), run as a separate process
// against the e2e database, the way an admin runs them on a server.
function consoleCommand(args: string[], input = '') {
  const result = spawnSync(
    'npm',
    ['run', '--silent', 'console:dev', '--', ...args],
    {
      cwd: join(__dirname, '..'),
      env: process.env,
      input,
      encoding: 'utf8',
      timeout: 120000,
    },
  );
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

describe('console commands', () => {
  let t: TestApp;

  beforeAll(async () => {
    t = await createTestApp();
  });

  afterAll(async () => {
    await t.close();
  });

  it('users create makes an admin with the password typed at the prompt', async () => {
    const { status, output } = consoleCommand(
      ['users', 'create', 'console-admin@e2e.test', '--isAdmin'],
      'Console-password-1\n',
    );

    expect(output).toMatch(
      /User console-admin@e2e.test was created with id [0-9a-f-]{36}/,
    );
    expect(status).toBe(0);

    const session = await loginWeb(
      t,
      'console-admin@e2e.test',
      'Console-password-1',
    );
    expect(session.body.user.role).toBe('admin');
  });

  it('users list prints every user and role', () => {
    const { status, output } = consoleCommand(['users', 'list']);

    expect(status).toBe(0);
    expect(output).toContain('console-admin@e2e.test');
    expect(output).toContain(USERS.reporter);
  });
});
