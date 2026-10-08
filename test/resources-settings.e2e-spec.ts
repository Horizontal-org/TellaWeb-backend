import * as JSZip from 'jszip';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RemoteConfigurationEntity } from 'modules/remoteConfiguration/domain';

import {
  bearer,
  createTestApp,
  loginMobile,
  loginWeb,
  Session,
  TestApp,
  USERS,
} from './setup/app';
import { binaryParser, pdf, png } from './setup/fixtures';

describe('resources, remote configurations and global settings', () => {
  let t: TestApp;
  let admin: Session;
  let editor: Session;
  let viewer: Session;
  let reporter: Session;

  beforeAll(async () => {
    t = await createTestApp();
    admin = await loginWeb(t, USERS.admin);
    editor = await loginWeb(t, USERS.editor);
    viewer = await loginWeb(t, USERS.viewer);
    reporter = await loginMobile(t, USERS.reporter);
  });

  afterAll(async () => {
    await t.close();
  });

  describe('resources', () => {
    const document = pdf();
    let resource: any;
    let project: any;

    it('check-name is false for a new name', async () => {
      const res = await t
        .http()
        .get('/resource/check/guide.pdf')
        .set(bearer(admin))
        .expect(200);
      expect(res.body).toEqual({ taken: false });
    });

    it('admins upload a PDF', async () => {
      const res = await t
        .http()
        .put('/resource/upload/guide.pdf')
        .set(bearer(admin))
        .set('Content-Type', 'application/octet-stream')
        .send(document)
        .expect(200);

      resource = res.body;
      expect(resource).toMatchObject({
        id: expect.any(String),
        fileName: 'guide.pdf',
        title: 'guide',
      });

      const close = await t
        .http()
        .post('/resource/upload/guide.pdf')
        .set(bearer(admin))
        .send({ size: String(document.length) })
        .expect(201);
      expect(close.body).toEqual({ success: true });
    });

    it('check-name is true once the name is used', async () => {
      const res = await t
        .http()
        .get('/resource/check/guide.pdf')
        .set(bearer(admin))
        .expect(200);
      expect(res.body).toEqual({ taken: true });
    });

    it('rejects a file that is not a PDF', async () => {
      await t
        .http()
        .put('/resource/upload/fake.pdf')
        .set(bearer(admin))
        .set('Content-Type', 'application/octet-stream')
        .send(await png(10, 10))
        .expect(400);
    });

    it('rejects a PDF with JavaScript', async () => {
      await t
        .http()
        .put('/resource/upload/script.pdf')
        .set(bearer(admin))
        .set('Content-Type', 'application/octet-stream')
        .send(Buffer.concat([document, Buffer.from('<< /S /JavaScript /JS (app.alert(1)) >>')]))
        .expect(400);
    });

    it('only admins upload', async () => {
      await t
        .http()
        .put('/resource/upload/editor.pdf')
        .set(bearer(editor))
        .set('Content-Type', 'application/octet-stream')
        .send(document)
        .expect(403);
    });

    it('lists resources', async () => {
      const res = await t
        .http()
        .get('/resource?limit=10&offset=0')
        .set(bearer(editor))
        .expect(200);
      expect(res.body.total).toBe(1);
      expect(res.body.results[0]).toMatchObject({ id: resource.id, fileName: 'guide.pdf' });
    });

    it('admins download any resource', async () => {
      const res = await t
        .http()
        .get('/resource/asset/guide.pdf')
        .set(bearer(admin))
        .buffer(true)
        .parse(binaryParser)
        .expect(206);
      expect(Buffer.compare(res.body, document)).toBe(0);
    });

    it('others only download resources of their projects', async () => {
      await t.http().get('/resource/asset/guide.pdf').set(bearer(viewer)).expect(401);
      await t.http().get('/resource/mobile/asset/guide.pdf').set(bearer(reporter)).expect(401);

      project = (
        await t
          .http()
          .post('/project')
          .set(bearer(admin))
          .send({ name: 'E2E resources project', users: [t.users.viewer.id, t.users.reporter.id] })
          .expect(201)
      ).body;
      await t
        .http()
        .put(`/project/${project.id}`)
        .set(bearer(admin))
        .send({ resources: [resource.id] })
        .expect(200);

      const web = await t
        .http()
        .get('/resource/asset/guide.pdf')
        .set(bearer(viewer))
        .buffer(true)
        .parse(binaryParser)
        .expect(206);
      expect(Buffer.compare(web.body, document)).toBe(0);

      const mobile = await t
        .http()
        .get('/resource/mobile/asset/guide.pdf')
        .set(bearer(reporter))
        .buffer(true)
        .parse(binaryParser)
        .expect(206);
      expect(Buffer.compare(mobile.body, document)).toBe(0);
    });

    it('lists the resources of the given projects', async () => {
      const res = await t
        .http()
        .get(`/resource/projects?projectId=${project.id}`)
        .set(bearer(reporter))
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({
        id: project.id,
        resources: [expect.objectContaining({ id: resource.id, fileName: 'guide.pdf' })],
      });
    });

    it('zips several resources', async () => {
      const res = await t
        .http()
        .get('/resource/download?fileNames=guide.pdf')
        .set(bearer(reporter))
        .buffer(true)
        .parse(binaryParser)
        .expect(200);

      expect(res.headers['content-type']).toBe('application/zip');
      const zip = await JSZip.loadAsync(res.body);
      const content = await zip.file('guide.pdf').async('nodebuffer');
      expect(Buffer.compare(content, document)).toBe(0);
    });

    it('admins delete a resource', async () => {
      const res = await t
        .http()
        .delete(`/resource/${resource.id}`)
        .set(bearer(admin))
        .expect(200);
      expect(res.body).toEqual({ deleted: true });

      const list = await t
        .http()
        .get('/resource?limit=10&offset=0')
        .set(bearer(admin))
        .expect(200);
      expect(list.body.total).toBe(0);
    });
  });

  describe('remote configurations', () => {
    const camouflage = JSON.stringify({ visible: true, change_name: false, calculator: true });
    const crashReports = JSON.stringify({ visible: true, enabled: false });
    let configuration: any;

    it('admins create one with a short code', async () => {
      const res = await t
        .http()
        .post('/config')
        .set(bearer(admin))
        .send({ name: 'E2E config', camouflage, crashReports, serversVisible: true })
        .expect(201);

      configuration = res.body;
      expect(configuration).toMatchObject({
        id: expect.any(String),
        name: 'E2E config',
        camouflage,
        crashReports,
        serversVisible: true,
      });
    });

    it('validates the body', async () => {
      await t
        .http()
        .post('/config')
        .set(bearer(admin))
        .send({ name: 'bad', camouflage: 'not json', crashReports, serversVisible: true })
        .expect(400);
    });

    it('only admins create', async () => {
      await t
        .http()
        .post('/config')
        .set(bearer(editor))
        .send({ name: 'nope', camouflage, crashReports, serversVisible: true })
        .expect(403);
    });

    it('lists', async () => {
      const res = await t
        .http()
        .get('/config?limit=10&offset=0')
        .set(bearer(viewer))
        .expect(200);
      expect(res.body.total).toBe(1);
      expect(res.body.results[0]).toMatchObject({ id: configuration.id });
    });

    it('gets one by id, with any token type', async () => {
      const res = await t
        .http()
        .get(`/config/${configuration.id}`)
        .set(bearer(reporter))
        .expect(200);
      expect(res.body).toMatchObject({ id: configuration.id, name: 'E2E config', camouflage });
    });

    it('gets one by short code', async () => {
      // the short code isn't in any response; the mobile app gets it from the QR code
      const repo = t.app.get(getRepositoryToken(RemoteConfigurationEntity));
      const { shortCode } = await repo.findOne({ where: { id: configuration.id } });
      expect(shortCode).toMatch(/^[\w-]{8}$/);

      const res = await t
        .http()
        .get(`/config/shortcode/${shortCode}`)
        .set(bearer(admin))
        .expect(200);
      expect(res.body).toMatchObject({ id: configuration.id });
    });

    it('edits', async () => {
      const res = await t
        .http()
        .post(`/config/${configuration.id}`)
        .set(bearer(admin))
        .send({ id: configuration.id, name: 'E2E config edited', camouflage, crashReports, serversVisible: false })
        .expect(201);
      expect(res.body).toMatchObject({ name: 'E2E config edited', serversVisible: false });
    });

    it('deletes', async () => {
      await t.http().delete(`/config/${configuration.id}`).set(bearer(admin)).expect(200);
      const res = await t
        .http()
        .get('/config?limit=10&offset=0')
        .set(bearer(admin))
        .expect(200);
      expect(res.body.total).toBe(0);
    });
  });

  describe('global settings', () => {
    let settings: any[];

    // the migrations create EMAILS too, and a later one deletes it
    it('lists the settings created by the migrations', async () => {
      const res = await t
        .http()
        .get('/global-setting')
        .set(bearer(viewer))
        .expect(200);

      settings = res.body;
      expect(settings.map((s) => s.name).sort()).toEqual(
        ['ANALYTICS', 'FEEDBACK', 'SUSPICIOUS LOGIN DETECTION'],
      );
    });

    it('gets one by name', async () => {
      const res = await t
        .http()
        .get('/global-setting/FEEDBACK')
        .set(bearer(viewer))
        .expect(200);
      expect(res.body).toMatchObject({ name: 'FEEDBACK', enabled: false });
    });

    it('admins toggle a setting', async () => {
      const feedback = settings.find((s) => s.name === 'FEEDBACK');
      await t
        .http()
        .put('/global-setting')
        .set(bearer(admin))
        .send({ id: feedback.id, enabled: true })
        .expect(200);

      const res = await t
        .http()
        .get('/global-setting/FEEDBACK')
        .set(bearer(admin))
        .expect(200);
      expect(res.body.enabled).toBe(true);

      await t
        .http()
        .put('/global-setting')
        .set(bearer(admin))
        .send({ id: feedback.id, enabled: false })
        .expect(200);
    });

    it('only admins toggle; the body is validated', async () => {
      const feedback = settings.find((s) => s.name === 'FEEDBACK');
      await t
        .http()
        .put('/global-setting')
        .set(bearer(editor))
        .send({ id: feedback.id, enabled: true })
        .expect(403);
      await t
        .http()
        .put('/global-setting')
        .set(bearer(admin))
        .send({ id: feedback.id, enabled: 'yes' })
        .expect(400);
    });
  });
});
