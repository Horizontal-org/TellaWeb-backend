import * as JSZip from 'jszip';

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
    expect(backup).toMatchObject({ id: expect.any(String), status: 'finished' });
    expect((await latest()).processing).toBeUndefined();
  });

  // Known bug: /backup/latest wraps the entities in a plain object, which
  // TransformInterceptor doesn't serialize, so @Exclude is ignored and the
  // absolute server path leaks. Remove `.failing` once it's fixed.
  it.failing('does not expose the server folder of a backup', async () => {
    expect((await latest()).latest.folderName).toBeUndefined();
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
    expect(res.headers['content-disposition']).toBe('attachment; filename="TELLAWEB_BACKUP.zip"');
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

    expect(res.headers['content-range']).toBe(`bytes 10-19/${full.body.length}`);
    expect(Buffer.compare(res.body, full.body.subarray(10, 20))).toBe(0);
  });

  it('accepts a mobile token too', async () => {
    const mobile = await loginMobile(t, USERS.admin);
    await t.http().get(`/backup/download/${backup.id}`).set(bearer(mobile)).expect(200);
  });

  it('an unknown backup is a 404', async () => {
    await t
      .http()
      .get('/backup/download/00000000-0000-4000-8000-000000000000')
      .set(bearer(admin))
      .expect(404);
  });

  it('deletes a backup; it can no longer be downloaded', async () => {
    await t.http().delete(`/backup/delete/${backup.id}`).set(bearer(admin)).expect(200);

    const after = await latest();
    expect(after.latest).toBeUndefined();
    expect(after.deleted).toMatchObject({ id: backup.id, status: 'deleted' });

    await t.http().get(`/backup/download/${backup.id}`).set(bearer(admin)).expect(404);
  });
});
