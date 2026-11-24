import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

import {
  bearer,
  createTestApp,
  loginMobile,
  loginWeb,
  Session,
  TestApp,
  USERS,
} from './setup/app';

// File and resource names come from the URL, where Express decodes %2F into
// '/'. A name that leaves its bucket folder must be refused everywhere.
// data/<bucket>/<folder>/../../../ is the working directory of the test app.
const up3 = (name: string) => encodeURIComponent(`../../../${name}`);

describe('path traversal in file and resource names', () => {
  let t: TestApp;
  let admin: Session;
  let reporter: Session;
  let reportId: string;
  let otherReportId: string;
  const inCwd = (name: string) => join(process.cwd(), name);

  const upload = (session: Session, report: string, name: string) =>
    t
      .http()
      .put(`/file/v2/${report}/${name}`)
      .set(bearer(session))
      .set('Content-Type', 'application/octet-stream')
      .set('Content-Range', 'bytes 0-4/5')
      .send(Buffer.from('hello'));

  beforeAll(async () => {
    t = await createTestApp();
    admin = await loginWeb(t, USERS.admin);
    reporter = await loginMobile(t, USERS.reporter);
    const project = (
      await t
        .http()
        .post('/project')
        .set(bearer(admin))
        .send({ name: 'E2E traversal', users: [t.users.reporter.id] })
        .expect(201)
    ).body;
    const create = async (session: Session, title: string) =>
      (
        await t
          .http()
          .post(`/project/${project.id}`)
          .set(bearer(session))
          .send({ title })
          .expect(201)
      ).body.id;
    reportId = await create(reporter, 'E2E traversal report');
    otherReportId = await create(admin, 'E2E someone else');
    // give the other report a bucket, which a planted file needs
    await upload(admin, otherReportId, 'legit.txt').expect(200);
    writeFileSync(inCwd('secret.txt'), 'TOP-SECRET');
  });

  afterAll(async () => {
    await t.close();
  });

  it('a report upload cannot create a file outside its bucket', async () => {
    await upload(reporter, reportId, up3('pwned.html')).expect(400);
    expect(existsSync(inCwd('pwned.html'))).toBe(false);
  });

  it("a report upload cannot plant a file in another user's report", async () => {
    const name = encodeURIComponent(`../../${otherReportId}/full/planted.txt`);
    await upload(reporter, reportId, name).expect(400);
    expect(
      existsSync(
        join(process.cwd(), 'data', otherReportId, 'full', 'planted.txt'),
      ),
    ).toBe(false);
  });

  it('a backslash or a bare dot segment is refused too', async () => {
    await upload(reporter, reportId, encodeURIComponent('..\\x.txt')).expect(
      400,
    );
    await upload(reporter, reportId, '..').expect(400);
  });

  it('HEAD does not reveal whether a file outside the bucket exists', async () => {
    await t
      .http()
      .head(`/file/${reportId}/${up3('secret.txt')}`)
      .set(bearer(reporter))
      .expect(400);
  });

  it('admins cannot read files outside the resources folder', async () => {
    await t
      .http()
      .get(`/resource/asset/${up3('secret.txt')}`)
      .set(bearer(admin))
      .expect(400);
    const adminMobile = await loginMobile(t, USERS.admin);
    await t
      .http()
      .get(`/resource/mobile/asset/${up3('secret.txt')}`)
      .set(bearer(adminMobile))
      .expect(400);
  });

  it('a resource upload cannot write outside the resources folder', async () => {
    await t
      .http()
      .put(`/resource/upload/${up3('evil.pdf')}`)
      .set(bearer(admin))
      .set('Content-Type', 'application/octet-stream')
      .send(Buffer.from('%PDF-1.4\n%%EOF\n'))
      .expect(400);
    expect(existsSync(inCwd('evil.pdf'))).toBe(false);
  });

  it('a missing resource file is a 404 and the server keeps running', async () => {
    await t
      .http()
      .get('/resource/asset/missing.pdf')
      .set(bearer(admin))
      .expect(404);
    await t
      .http()
      .get('/resource/asset/missing.pdf')
      .set(bearer(admin))
      .expect(404);
  });

  it('ordinary names still upload', async () => {
    await upload(
      reporter,
      reportId,
      encodeURIComponent('IMG 001 (1).txt'),
    ).expect(200);
  });
});
