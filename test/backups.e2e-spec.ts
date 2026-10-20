import * as JSZip from 'jszip';
import { createConnection } from 'mysql2/promise';

import {
  bearer,
  createTestApp,
  loginMobile,
  loginWeb,
  Session,
  TestApp,
  USERS,
  waitFor,
} from './setup/app';
import { binaryParser, wav } from './setup/fixtures';
import { e2eEnv, E2E_DATABASE } from './setup/e2e-env';

describe('backups', () => {
  let t: TestApp;
  let admin: Session;
  let editor: Session;
  let backup: any;

  const latest = async () =>
    (await t.http().get('/backup/latest').set(bearer(admin)).expect(200)).body;

  beforeAll(async () => {
    t = await createTestApp();
    admin = await loginWeb(t, USERS.admin);
    editor = await loginWeb(t, USERS.editor);

    // some data for the CSVs and one uploaded file
    const reporter = await loginMobile(t, USERS.reporter);
    const project = (
      await t
        .http()
        .post('/project')
        .set(bearer(admin))
        .send({ name: 'E2E backup project', users: [t.users.reporter.id] })
        .expect(201)
    ).body;
    const report = (
      await t
        .http()
        .post(`/project/${project.id}`)
        .set(bearer(reporter))
        .send({ title: 'E2E backup report' })
        .expect(201)
    ).body;
    const audio = wav(500);
    await t
      .http()
      .put(`/file/v2/${report.id}/backup.wav`)
      .set(bearer(reporter))
      .set('Content-Type', 'application/octet-stream')
      .set('Content-Range', `bytes 0-${audio.length - 1}/${audio.length}`)
      .send(audio)
      .expect(200);

    // values a dump has to escape correctly
    await t
      .http()
      .post(`/project/${project.id}`)
      .set(bearer(reporter))
      .send({
        title: `O'Brien "quoted" back\\slash`,
        description: 'line one\nline two, año, naïve; DROP TABLE x; --',
        deviceInfo: '{"os":"android","note":"it\'s \\"fine\\""}',
      })
      .expect(201);
    await t
      .http()
      .post('/config')
      .set(bearer(admin))
      .send({
        name: 'E2E backup config',
        camouflage: JSON.stringify({
          visible: true,
          change_name: false,
          calculator: true,
        }),
        crashReports: JSON.stringify({ visible: true, enabled: false }),
        serversVisible: true,
      })
      .expect(201);
  });

  afterAll(async () => {
    await t.close();
  });

  it('nothing to download before the first backup', async () => {
    expect(await latest()).toEqual({});
  });

  it('only admins start a backup', async () => {
    await t.http().post('/backup').set(bearer(editor)).expect(403);
  });

  it('starts a backup, which finishes in the background', async () => {
    await t.http().post('/backup').set(bearer(admin)).expect(201);

    backup = await waitFor(async () => (await latest()).latest, 60000);
    expect(backup).toMatchObject({
      id: expect.any(String),
      status: 'finished',
    });
    expect((await latest()).processing).toBeUndefined();
  });

  it('does not expose the server folder of a backup', async () => {
    const { latest: finished } = await latest();
    expect(Object.keys(finished).sort()).toEqual(['createdAt', 'id', 'status']);
  });

  it('downloads the zip with the CSVs, the database dump and the files', async () => {
    const res = await t
      .http()
      .get(`/backup/download/${backup.id}`)
      .set(bearer(admin))
      .buffer(true)
      .parse(binaryParser)
      .expect(200);

    expect(res.headers['content-type']).toBe('application/zip');
    expect(res.headers['content-disposition']).toBe(
      'attachment; filename="TELLAWEB_BACKUP.zip"',
    );
    expect(res.headers['accept-ranges']).toBe('bytes');
    expect(Number(res.headers['content-length'])).toBe(res.body.length);

    const zip = await JSZip.loadAsync(res.body);
    const names = Object.keys(zip.files);
    expect(names).toEqual(expect.arrayContaining(['database_dump.sql']));
    expect(names.some((n) => n.endsWith('.csv'))).toBe(true);
    expect(names.some((n) => n.endsWith('backup.wav'))).toBe(true);

    const dump = await zip.file('database_dump.sql').async('string');
    expect(dump).toContain('E2E backup report');
  });

  it('the database dump restores to an identical database', async () => {
    const res = await t
      .http()
      .get(`/backup/download/${backup.id}`)
      .set(bearer(admin))
      .buffer(true)
      .parse(binaryParser)
      .expect(200);
    const dump = await (
      await JSZip.loadAsync(res.body)
    )
      .file('database_dump.sql')
      .async('string');

    const root = await createConnection({
      host: e2eEnv.MYSQL_HOST,
      port: +e2eEnv.MYSQL_PORT,
      user: 'root',
      password: e2eEnv.MYSQL_ROOT_PASSWORD,
      multipleStatements: true,
    });
    const restored = `${E2E_DATABASE}_restore`;
    try {
      await root.query(`DROP DATABASE IF EXISTS \`${restored}\``);
      await root.query(`CREATE DATABASE \`${restored}\``);
      await root.query(`USE \`${restored}\``);
      await root.query(dump);

      const [tables] = await root.query<any[]>(
        'SELECT table_name AS name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name',
        [E2E_DATABASE],
      );
      const [restoredTables] = await root.query<any[]>(
        'SELECT table_name AS name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name',
        [restored],
      );
      expect(restoredTables.map((r) => r.name)).toEqual(
        tables.map((r) => r.name),
      );

      // the backups table changes after the dump (the backup's own status)
      for (const { name } of tables.filter((t) => t.name !== 'backups')) {
        const [[original]] = await root.query<any[]>(
          `CHECKSUM TABLE \`${E2E_DATABASE}\`.\`${name}\``,
        );
        const [[copy]] = await root.query<any[]>(
          `CHECKSUM TABLE \`${restored}\`.\`${name}\``,
        );
        expect({ table: name, checksum: copy.Checksum }).toEqual({
          table: name,
          checksum: original.Checksum,
        });
      }

      // the tricky values come back byte for byte
      const row = (db: string) =>
        root.query<any[]>(
          `SELECT title, description, deviceInfo FROM \`${db}\`.report_entity WHERE title LIKE 'O%Brien%'`,
        );
      const [[copy]] = await row(restored);
      const [[original]] = await row(E2E_DATABASE);
      expect(copy).toEqual(original);
      expect(copy.title).toBe(`O'Brien "quoted" back\\slash`);
      expect(copy.description).toBe(
        'line one\nline two, año, naïve; DROP TABLE x; --',
      );
    } finally {
      await root.query(`DROP DATABASE IF EXISTS \`${restored}\``);
      await root.end();
    }
  });

  it('serves a byte range, for resumable downloads', async () => {
    const full = await t
      .http()
      .get(`/backup/download/${backup.id}`)
      .set(bearer(admin))
      .buffer(true)
      .parse(binaryParser)
      .expect(200);

    const res = await t
      .http()
      .get(`/backup/download/${backup.id}`)
      .set(bearer(admin))
      .set('Range', 'bytes=10-19')
      .buffer(true)
      .parse(binaryParser)
      .expect(206);

    expect(res.headers['content-range']).toBe(
      `bytes 10-19/${full.body.length}`,
    );
    expect(Buffer.compare(res.body, full.body.subarray(10, 20))).toBe(0);
  });

  it('accepts a mobile token too', async () => {
    const mobile = await loginMobile(t, USERS.admin);
    await t
      .http()
      .get(`/backup/download/${backup.id}`)
      .set(bearer(mobile))
      .expect(200);
  });

  it('an unknown backup is a 404', async () => {
    await t
      .http()
      .get('/backup/download/00000000-0000-4000-8000-000000000000')
      .set(bearer(admin))
      .expect(404);
  });

  it('deletes a backup; it can no longer be downloaded', async () => {
    await t
      .http()
      .delete(`/backup/delete/${backup.id}`)
      .set(bearer(admin))
      .expect(200);

    // the delete service doesn't await its save, so the status can lag behind the response
    const after = await waitFor(async () => {
      const l = await latest();
      return l.deleted && l;
    });
    expect(after.latest).toBeUndefined();
    expect(after.deleted).toMatchObject({ id: backup.id, status: 'deleted' });

    await t
      .http()
      .get(`/backup/download/${backup.id}`)
      .set(bearer(admin))
      .expect(404);
  });
});
