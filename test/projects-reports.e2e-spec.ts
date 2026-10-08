import {
  bearer,
  createTestApp,
  loginMobile,
  loginWeb,
  Session,
  TestApp,
  USERS,
} from './setup/app';

describe('projects and reports', () => {
  let t: TestApp;
  let admin: Session;
  let editor: Session;
  let viewer: Session;
  let reporterMobile: Session;

  // the viewer and reporter belong to this project, not to the other one
  let project: any;
  let otherProject: any;

  beforeAll(async () => {
    t = await createTestApp();
    admin = await loginWeb(t, USERS.admin);
    editor = await loginWeb(t, USERS.editor);
    viewer = await loginWeb(t, USERS.viewer);
    reporterMobile = await loginMobile(t, USERS.reporter);

    project = (
      await t
        .http()
        .post('/project')
        .set(bearer(admin))
        .send({
          name: 'E2E Project One',
          users: [t.users.viewer.id, t.users.reporter.id],
        })
        .expect(201)
    ).body;

    otherProject = (
      await t
        .http()
        .post('/project')
        .set(bearer(admin))
        .send({ name: 'E2E Other Project' })
        .expect(201)
    ).body;
  });

  afterAll(async () => {
    await t.close();
  });

  describe('projects', () => {
    it('create builds the slug and url from the name and links the users', () => {
      expect(project).toMatchObject({
        id: expect.any(String),
        name: 'E2E Project One',
        slug: 'e2e-project-one',
        url: `${process.env.PUBLIC_DOMAIN}/p/e2e-project-one`,
      });
      expect(project.users.map((u) => u.id).sort()).toEqual(
        [t.users.viewer.id, t.users.reporter.id].sort(),
      );
    });

    it('viewers and reporters cannot create projects', async () => {
      await t
        .http()
        .post('/project')
        .set(bearer(viewer))
        .send({ name: 'nope' })
        .expect(403);
    });

    it('get by id includes members plus every admin', async () => {
      const res = await t
        .http()
        .get(`/project/${project.id}`)
        .set(bearer(admin))
        .expect(200);

      const ids = res.body.users.map((u) => u.id);
      expect(ids).toEqual(
        expect.arrayContaining([
          t.users.viewer.id,
          t.users.reporter.id,
          t.users.admin.id,
        ]),
      );
      expect(ids).not.toContain(t.users.editor.id);
      expect(res.body.users[0].password).toBeUndefined();
    });

    it('a member can open the project by id, a non-member cannot', async () => {
      await t
        .http()
        .get(`/project/${project.id}`)
        .set(bearer(viewer))
        .expect(200);
      await t
        .http()
        .get(`/project/${otherProject.id}`)
        .set(bearer(viewer))
        .expect(403);
    });

    it('a member can open the project by slug, a non-member cannot', async () => {
      const res = await t
        .http()
        .get(`/p/${project.slug}`)
        .set(bearer(reporterMobile))
        .expect(200);
      expect(res.body).toMatchObject({ id: project.id, slug: project.slug });

      await t
        .http()
        .get(`/p/${otherProject.slug}`)
        .set(bearer(reporterMobile))
        .expect(403);
    });

    it('admins can open any project by slug; an unknown slug is 404', async () => {
      await t
        .http()
        .get(`/p/${otherProject.slug}`)
        .set(bearer(admin))
        .expect(200);
      await t.http().get('/p/does-not-exist').set(bearer(admin)).expect(404);
    });

    it('lists every project for admins', async () => {
      const res = await t
        .http()
        .get('/project?limit=25&offset=0')
        .set(bearer(admin))
        .expect(200);

      expect(res.body.total).toBeGreaterThanOrEqual(2);
      const ids = res.body.results.map((p) => p.id);
      expect(ids).toEqual(
        expect.arrayContaining([project.id, otherProject.id]),
      );
    });

    it('lists only their own projects for other roles', async () => {
      const res = await t
        .http()
        .get('/project?limit=25&offset=0')
        .set(bearer(viewer))
        .expect(200);

      const ids = res.body.results.map((p) => p.id);
      expect(ids).toContain(project.id);
      expect(ids).not.toContain(otherProject.id);
    });

    it('searching still lists only their own projects for other roles', async () => {
      const res = await t
        .http()
        .get('/project?limit=25&offset=0&search=E2E')
        .set(bearer(viewer))
        .expect(200);

      const ids = res.body.results.map((p) => p.id);
      expect(ids).toEqual([project.id]);
      expect(res.body.total).toBe(1);
    });

    it('paginates, searches and sorts', async () => {
      const page = await t
        .http()
        .get('/project?limit=1&offset=0&sort=project.name&order=asc&search=E2E')
        .set(bearer(admin))
        .expect(200);

      expect(page.body.total).toBe(2);
      expect(page.body.results).toHaveLength(1);
      expect(page.body.results[0].name).toBe('E2E Other Project');

      const next = await t
        .http()
        .get('/project?limit=1&offset=1&sort=project.name&order=asc&search=E2E')
        .set(bearer(admin))
        .expect(200);
      expect(next.body.results[0].name).toBe('E2E Project One');
    });

    it('list requires limit and offset', async () => {
      await t.http().get('/project').set(bearer(admin)).expect(400);
    });

    it('edit toggles the users it receives and renames the slug', async () => {
      const res = await t
        .http()
        .put(`/project/${otherProject.id}`)
        .set(bearer(admin))
        .send({
          name: 'E2E Other Project',
          slug: 'E2E Other Renamed',
          users: [t.users.editor.id],
        })
        .expect(200);

      expect(res.body.slug).toBe('e2e-other-renamed');
      expect(res.body.users.map((u) => u.id)).toEqual([t.users.editor.id]);

      // sending the same user again removes it
      const toggled = await t
        .http()
        .put(`/project/${otherProject.id}`)
        .set(bearer(admin))
        .send({ users: [t.users.editor.id] })
        .expect(200);
      expect(toggled.body.users).toEqual([]);
      otherProject = toggled.body;
    });

    it('editors can only edit projects they belong to', async () => {
      await t
        .http()
        .put(`/project/${project.id}`)
        .set(bearer(editor))
        .send({ name: 'nope' })
        .expect(403);
    });
  });

  describe('reports', () => {
    let report: any;

    it('a reporter creates a report in their project from the mobile app', async () => {
      const res = await t
        .http()
        .post(`/project/${project.id}`)
        .set(bearer(reporterMobile))
        .send({
          title: 'E2E report',
          description: 'from e2e',
          deviceInfo: '{"os":"android"}',
        })
        .expect(201);

      report = res.body;
      expect(report).toMatchObject({
        id: expect.any(String),
        title: 'E2E report',
        description: 'from e2e',
      });
    });

    it('a reporter cannot add a report to a project they do not belong to', async () => {
      await t
        .http()
        .post(`/project/${otherProject.id}`)
        .set(bearer(reporterMobile))
        .send({ title: 'nope' })
        .expect(403);
    });

    it('a report needs a title', async () => {
      await t
        .http()
        .post(`/project/${project.id}`)
        .set(bearer(reporterMobile))
        .send({ description: 'no title' })
        .expect(400);
    });

    it('reports are only created through a project', async () => {
      await t
        .http()
        .post('/report')
        .set(bearer(reporterMobile))
        .send({ title: 'E2E loose report' })
        .expect(404);
    });

    it('get by id returns the report with its author', async () => {
      const res = await t
        .http()
        .get(`/report/${report.id}`)
        .set(bearer(viewer))
        .expect(200);

      expect(res.body).toMatchObject({
        id: report.id,
        title: 'E2E report',
        author: { id: t.users.reporter.id, username: USERS.reporter },
        files: [],
      });
      expect(res.body.author.password).toBeUndefined();
    });

    it('the project includes its reports', async () => {
      const res = await t
        .http()
        .get('/project?limit=25&offset=0&search=E2E Project One')
        .set(bearer(admin))
        .expect(200);
      expect(res.body.results[0].reports.map((r) => r.id)).toContain(report.id);
    });

    it('lists, searches and paginates reports', async () => {
      await t
        .http()
        .post(`/project/${project.id}`)
        .set(bearer(reporterMobile))
        .send({ title: 'E2E another report' })
        .expect(201);

      const res = await t
        .http()
        .get('/report?limit=1&offset=0&search=E2E&sort=report.title&order=desc')
        .set(bearer(editor))
        .expect(200);

      expect(res.body.total).toBe(2);
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0]).toMatchObject({
        title: 'E2E report',
        author: { username: USERS.reporter },
      });
    });

    it('reporters cannot list reports', async () => {
      const reporterWeb = await loginMobile(t, USERS.reporter);
      await t
        .http()
        .get('/report?limit=10&offset=0')
        .set(bearer(reporterWeb))
        .expect(403);
    });

    it('editors edit a report', async () => {
      const res = await t
        .http()
        .post(`/report/${report.id}`)
        .set(bearer(editor))
        .send({ title: 'E2E report edited', description: 'edited' })
        .expect(201);
      expect(res.body).toMatchObject({
        title: 'E2E report edited',
        description: 'edited',
      });
    });

    it('viewers cannot edit or delete reports', async () => {
      await t
        .http()
        .post(`/report/${report.id}`)
        .set(bearer(viewer))
        .send({ title: 'nope' })
        .expect(403);
      await t
        .http()
        .delete(`/report/${report.id}`)
        .set(bearer(viewer))
        .expect(403);
    });

    it('batch delete removes several reports', async () => {
      const ids = [];
      for (const title of ['E2E batch 1', 'E2E batch 2']) {
        const res = await t
          .http()
          .post(`/project/${project.id}`)
          .set(bearer(reporterMobile))
          .send({ title })
          .expect(201);
        ids.push(res.body.id);
      }

      await t
        .http()
        .post('/report/batch-delete')
        .set(bearer(editor))
        .send({ toDelete: ids })
        .expect(201);

      for (const id of ids) {
        await t.http().get(`/report/${id}`).set(bearer(editor)).expect(404);
      }
    });

    it('deleting a project keeps its reports', async () => {
      const temp = (
        await t
          .http()
          .post('/project')
          .set(bearer(admin))
          .send({ name: 'E2E temp project' })
          .expect(201)
      ).body;
      const tempReport = (
        await t
          .http()
          .post(`/project/${temp.id}`)
          .set(bearer(admin))
          .send({ title: 'E2E orphan report' })
          .expect(201)
      ).body;

      await t
        .http()
        .delete(`/project/${temp.id}`)
        .set(bearer(admin))
        .expect(200);
      await t.http().get(`/p/${temp.slug}`).set(bearer(admin)).expect(404);

      const res = await t
        .http()
        .get(`/report/${tempReport.id}`)
        .set(bearer(admin))
        .expect(200);
      expect(res.body.title).toBe('E2E orphan report');

      await t
        .http()
        .delete(`/report/${tempReport.id}`)
        .set(bearer(admin))
        .expect(200);
    });
  });
});
