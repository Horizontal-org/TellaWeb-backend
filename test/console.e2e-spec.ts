import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';

import { bearer, createTestApp, loginWeb, TestApp, USERS } from './setup/app';

const ROOT = join(__dirname, '..');

// The nestjs-console commands (what npm run console:dev runs), as a separate
// process against the e2e database, the way an admin runs them on a server.
// It runs from the e2e workdir (not through npm, which resets cwd to the repo
// root) so files go to the same data/ as the test app, not the dev one.
function consoleCommand(args: string[], input = '') {
  const result = spawnSync(
    join(ROOT, 'node_modules/.bin/ts-node'),
    [
      '--files',
      '-r',
      'tsconfig-paths/register',
      join(ROOT, 'src/console.ts'),
      ...args,
    ],
    {
      cwd: process.cwd(),
      env: { ...process.env, TS_NODE_PROJECT: join(ROOT, 'tsconfig.json') },
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

  describe('reports clean-orphans', () => {
    const bucket = (id: string) => join(process.cwd(), 'data', id);
    let inProject: string;
    let oldOrphan: string;
    let newOrphan: string;

    beforeAll(async () => {
      const admin = await loginWeb(t, USERS.admin);
      const project = (
        await t
          .http()
          .post('/project')
          .set(bearer(admin))
          .send({ name: 'E2E clean orphans project' })
          .expect(201)
      ).body;
      const create = async (path: string, title: string) =>
        (
          await t
            .http()
            .post(path)
            .set(bearer(admin))
            .send({ title })
            .expect(201)
        ).body.id;
      inProject = await create(`/project/${project.id}`, 'E2E in project');
      oldOrphan = await create(`/project/${project.id}`, 'E2E old orphan');
      newOrphan = await create(`/project/${project.id}`, 'E2E new orphan');

      // orphan them the way project deletes used to; the project report is old too
      const db = t.app.get(DataSource);
      await db.query(
        'UPDATE report_entity SET projectId = NULL WHERE id IN (?, ?)',
        [oldOrphan, newOrphan],
      );
      await db.query(
        'UPDATE report_entity SET created_at = NOW() - INTERVAL 10 DAY WHERE id IN (?, ?)',
        [inProject, oldOrphan],
      );
      for (const id of [inProject, oldOrphan, newOrphan]) {
        for (const dir of ['full', 'partial', 'preview']) {
          mkdirSync(join(bucket(id), dir), { recursive: true });
          writeFileSync(join(bucket(id), dir, 'file.bin'), 'x');
        }
      }
    });

    const reportExists = async (id: string) =>
      (
        await t.app
          .get(DataSource)
          .query('SELECT COUNT(*) AS n FROM report_entity WHERE id = ?', [id])
      )[0].n *
        1 ===
      1;

    it('--dry-run lists only old reports without a project and deletes nothing', async () => {
      const { status, output } = consoleCommand([
        'reports',
        'clean-orphans',
        '5',
        '--dry-run',
      ]);

      expect(status).toBe(0);
      expect(output).toContain(oldOrphan);
      expect(output).not.toContain(inProject);
      expect(output).not.toContain(newOrphan);
      expect(await reportExists(oldOrphan)).toBe(true);
      expect(existsSync(bucket(oldOrphan))).toBe(true);
    });

    it('deletes only old reports without a project, with their files', async () => {
      const { status, output } = consoleCommand(
        ['reports', 'clean-orphans', '5'],
        'yes\n',
      );

      expect(status).toBe(0);
      expect(output).toMatch(/Deleted \d+ report\(s\)/);
      expect(await reportExists(oldOrphan)).toBe(false);
      expect(existsSync(bucket(oldOrphan))).toBe(false);

      for (const id of [inProject, newOrphan]) {
        expect(await reportExists(id)).toBe(true);
        expect(existsSync(join(bucket(id), 'full', 'file.bin'))).toBe(true);
      }
    });
  });
});
