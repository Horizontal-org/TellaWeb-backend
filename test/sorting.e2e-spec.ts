import {
  bearer,
  createTestApp,
  loginMobile,
  loginWeb,
  Session,
  TestApp,
  USERS,
} from './setup/app';
import { pdf } from './setup/fixtures';

// The list endpoints take a `sort` column from the client. Only the columns
// the web app sorts by are accepted; anything else used to go straight into
// the SQL ORDER BY.
describe('sorting lists', () => {
  let t: TestApp;
  let admin: Session;

  const list = (path: string, sort: string, order = 'asc') =>
    t
      .http()
      .get(
        `${path}?limit=100&offset=0&sort=${encodeURIComponent(sort)}&order=${order}`,
      )
      .set(bearer(admin));

  beforeAll(async () => {
    t = await createTestApp();
    admin = await loginWeb(t, USERS.admin);
    const reporter = await loginMobile(t, USERS.reporter);

    for (const name of ['Sort B project', 'Sort A project']) {
      const project = (
        await t
          .http()
          .post('/project')
          .set(bearer(admin))
          .send({ name, users: [t.users.reporter.id] })
          .expect(201)
      ).body;
      await t
        .http()
        .post(`/project/${project.id}`)
        .set(bearer(reporter))
        .send({ title: `${name} report` })
        .expect(201);
    }
    for (const name of ['sort-b.pdf', 'sort-a.pdf']) {
      await t
        .http()
        .put(`/resource/upload/${name}`)
        .set(bearer(admin))
        .set('Content-Type', 'application/octet-stream')
        .send(pdf())
        .expect(200);
    }
  });

  afterAll(async () => {
    await t.close();
  });

  // the sort keys the web app sends (TellaWeb-FrontEnd-nextjs)
  const sortable: Record<string, string[]> = {
    '/project': ['project.created_at', 'project.createdAt', 'project.name'],
    '/report': ['report.title', 'report.createdAt', 'author.username'],
    '/user/list': ['user.username', 'user.role', 'user.createdAt'],
    '/resource': ['resource.title', 'resource.fileName', 'resource.createdAt'],
  };

  for (const [path, keys] of Object.entries(sortable)) {
    describe(path, () => {
      for (const key of keys) {
        it(`sorts by ${key}`, async () => {
          await list(path, key).expect(200);
          await list(path, key, 'desc').expect(200);
        });
      }

      it('rejects injected SQL without running it', async () => {
        const started = Date.now();
        await list(path, `${keys[0]},(SELECT SLEEP(1))`).expect(400);
        expect(Date.now() - started).toBeLessThan(1000);
      });

      it('rejects a column that is not in the list', async () => {
        await list(path, 'user.password').expect(400);
      });
    });
  }

  it('sorts in the requested order', async () => {
    const asc = await list('/project', 'project.name', 'asc').expect(200);
    const names = asc.body.results.map((p) => p.name);
    expect(names).toEqual(['Sort A project', 'Sort B project']);

    const desc = await list('/report', 'report.title', 'desc').expect(200);
    expect(desc.body.results.map((r) => r.title)).toEqual([
      'Sort B project report',
      'Sort A project report',
    ]);

    const resources = await list('/resource', 'resource.title').expect(200);
    expect(resources.body.results.map((r) => r.fileName)).toEqual([
      'sort-a.pdf',
      'sort-b.pdf',
    ]);
  });

  it('lists unsorted without a sort', async () => {
    await t
      .http()
      .get('/user/list?limit=10&offset=0')
      .set(bearer(admin))
      .expect(200);
  });
});
