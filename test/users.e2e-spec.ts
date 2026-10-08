import {
  bearer,
  createTestApp,
  loginWeb,
  PASSWORD,
  Session,
  TestApp,
  USERS,
} from './setup/app';

describe('users', () => {
  let t: TestApp;
  let admin: Session;
  let editor: Session;

  beforeAll(async () => {
    t = await createTestApp();
    admin = await loginWeb(t, USERS.admin);
    editor = await loginWeb(t, USERS.editor);
  });

  afterAll(async () => {
    await t.close();
  });

  const createUser = async (username: string, role = 'viewer') =>
    (
      await t
        .http()
        .post('/user')
        .set(bearer(admin))
        .send({ username, password: PASSWORD, role })
        .expect(201)
    ).body;

  it('admins create users; the password is never returned', async () => {
    const user = await createUser('created@e2e.test', 'editor');
    expect(user).toMatchObject({
      id: expect.any(String),
      username: 'created@e2e.test',
      role: 'editor',
    });
    expect(user.password).toBeUndefined();

    const session = await loginWeb(t, 'created@e2e.test');
    expect(session.access_token).toEqual(expect.any(String));
  });

  it('rejects a duplicate username', async () => {
    const res = await t
      .http()
      .post('/user')
      .set(bearer(admin))
      .send({ username: USERS.viewer, password: PASSWORD, role: 'viewer' })
      .expect((r) => expect(r.status).toBeGreaterThanOrEqual(400));
    expect(res.status).toBeLessThan(500);
  });

  it('validates the body: short username, missing password', async () => {
    await t
      .http()
      .post('/user')
      .set(bearer(admin))
      .send({ username: 'abc', password: PASSWORD, role: 'viewer' })
      .expect(400);
    await t
      .http()
      .post('/user')
      .set(bearer(admin))
      .send({ username: 'nopassword@e2e.test', role: 'viewer' })
      .expect(400);
  });

  it('strips unknown fields from the body', async () => {
    const user = (
      await t
        .http()
        .post('/user')
        .set(bearer(admin))
        .send({
          username: 'stripped@e2e.test',
          password: PASSWORD,
          role: 'viewer',
          otp_active: true,
          blocked: true,
        })
        .expect(201)
    ).body;

    const session = await loginWeb(t, 'stripped@e2e.test');
    expect(session.body.user).toMatchObject({ id: user.id });
    expect(session.access_token).toEqual(expect.any(String));
  });

  it('only admins create users', async () => {
    await t
      .http()
      .post('/user')
      .set(bearer(editor))
      .send({ username: 'nope@e2e.test', password: PASSWORD, role: 'admin' })
      .expect(403);
  });

  it('lists, searches, paginates and excludes users', async () => {
    const all = await t
      .http()
      .get('/user/list?limit=100&offset=0')
      .set(bearer(admin))
      .expect(200);
    expect(all.body.total).toBeGreaterThanOrEqual(4);
    expect(all.body.results[0].password).toBeUndefined();

    const page = await t
      .http()
      .get(
        '/user/list?limit=2&offset=0&search=e2e.test&sort=user.username&order=asc',
      )
      .set(bearer(admin))
      .expect(200);
    expect(page.body.results).toHaveLength(2);
    expect(page.body.total).toBe(all.body.total);

    const excluded = await t
      .http()
      .get(
        `/user/list?limit=100&offset=0&exclude=${t.users.viewer.id},${t.users.editor.id}`,
      )
      .set(bearer(admin))
      .expect(200);
    const ids = excluded.body.results.map((u) => u.id);
    expect(ids).not.toContain(t.users.viewer.id);
    expect(ids).not.toContain(t.users.editor.id);
    expect(ids).toContain(t.users.admin.id);
  });

  it('get by id', async () => {
    const res = await t
      .http()
      .get(`/user/${t.users.viewer.id}`)
      .set(bearer(admin))
      .expect(200);
    expect(res.body).toMatchObject({
      id: t.users.viewer.id,
      username: USERS.viewer,
    });
  });

  it('profile returns the logged-in user', async () => {
    const res = await t.http().get('/user').set(bearer(editor)).expect(200);
    expect(res.body).toMatchObject({ id: t.users.editor.id, role: 'editor' });
  });

  it('admins edit role, note and password', async () => {
    const user = await createUser('edited@e2e.test');

    const res = await t
      .http()
      .post(`/user/${user.id}`)
      .set(bearer(admin))
      .send({ role: 'editor', note: 'a note', password: 'New-password-1' })
      .expect(201);
    expect(res.body).toMatchObject({ id: user.id, role: 'editor' });

    await loginWeb(t, 'edited@e2e.test', 'New-password-1');
    await t
      .http()
      .post('/login/web')
      .send({ username: 'edited@e2e.test', password: PASSWORD })
      .expect(401);
  });

  it('change-password needs the current password', async () => {
    await createUser('changepw@e2e.test');
    const session = await loginWeb(t, 'changepw@e2e.test');

    await t
      .http()
      .post('/user/change-password')
      .set(bearer(session))
      .send({ current: 'wrong', new: 'Another-password-1' })
      .expect((r) => expect(r.status).toBeGreaterThanOrEqual(400));

    await t
      .http()
      .post('/user/change-password')
      .set(bearer(session))
      .send({ current: PASSWORD, new: 'Another-password-1' })
      .expect(201);

    await loginWeb(t, 'changepw@e2e.test', 'Another-password-1');
  });

  it('confirm password', async () => {
    const res = await t
      .http()
      .post('/user/confirm/password')
      .set(bearer(editor))
      .send({ current: PASSWORD })
      .expect(201);
    // booleans are sent as text, not JSON
    expect(res.text).toBe('true');

    await t
      .http()
      .post('/user/confirm/password')
      .set(bearer(editor))
      .send({ current: 'wrong' })
      .expect((r) => expect(r.status).toBeGreaterThanOrEqual(400));
  });

  it('change-self renames the user after confirming the password', async () => {
    await createUser('self@e2e.test');
    const session = await loginWeb(t, 'self@e2e.test');

    await t
      .http()
      .post('/user/change-self')
      .set(bearer(session))
      .send({ username: 'self-renamed@e2e.test', confirmPassword: PASSWORD })
      .expect(201);

    await loginWeb(t, 'self-renamed@e2e.test');
  });

  it('deletes a user, and batch-deletes several', async () => {
    const one = await createUser('delete-one@e2e.test');
    const two = await createUser('delete-two@e2e.test');
    const three = await createUser('delete-three@e2e.test');

    await t.http().delete(`/user/${one.id}`).set(bearer(admin)).expect(200);
    await t
      .http()
      .post('/user/batch-delete')
      .set(bearer(admin))
      .send({ toDelete: [two.id, three.id] })
      .expect(201);

    for (const username of [
      'delete-one@e2e.test',
      'delete-two@e2e.test',
      'delete-three@e2e.test',
    ]) {
      await t
        .http()
        .post('/login/web')
        .send({ username, password: PASSWORD })
        .expect(401);
    }
  });

  it('only admins delete users', async () => {
    await t
      .http()
      .delete(`/user/${t.users.viewer.id}`)
      .set(bearer(editor))
      .expect(403);
  });
});
