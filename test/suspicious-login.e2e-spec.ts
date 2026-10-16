import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'modules/user/domain';
import {
  bearer,
  createTestApp,
  loginMobile,
  loginWeb,
  PASSWORD,
  Session,
  TestApp,
  USERS,
  waitFor,
} from './setup/app';
import { totp } from './setup/totp';

// node-ipinfo looks the IP up on ipinfo.io; here it answers with whatever
// country the test sets
let mockCountry: string | undefined;
const mockLookups: string[] = [];
jest.mock('node-ipinfo', () => ({
  __esModule: true,
  default: class {
    async lookupIp(ip: string) {
      mockLookups.push(ip);
      return { ip, country: mockCountry };
    }
  },
}));

describe('suspicious login detection', () => {
  let t: TestApp;
  let users: Repository<UserEntity>;
  // sessions the viewer opened before being blocked
  let webSession: Session;
  let mobileSession: Session;

  const login = () =>
    t
      .http()
      .post('/login/web')
      .send({ username: USERS.viewer, password: PASSWORD })
      .expect(201);

  beforeAll(async () => {
    t = await createTestApp();
    users = t.app.get(getRepositoryToken(UserEntity));

    const admin = await loginWeb(t, USERS.admin);
    const settings = await t
      .http()
      .get('/global-setting')
      .set(bearer(admin))
      .expect(200);
    const detection = settings.body.find(
      (s) => s.name === 'SUSPICIOUS LOGIN DETECTION',
    );
    await t
      .http()
      .put('/global-setting')
      .set(bearer(admin))
      .send({ id: detection.id, enabled: true })
      .expect(200);
  });

  afterAll(async () => {
    await t.close();
  });

  it('the first login whitelists its country', async () => {
    mockCountry = 'AR';
    const res = await login();
    expect(res.body.access_token).toEqual(expect.any(String));
    expect(mockLookups.length).toBeGreaterThan(0);
  });

  it('later logins from that country go through', async () => {
    const res = await login();
    expect(res.body.access_token).toEqual(expect.any(String));

    webSession = await loginWeb(t, USERS.viewer);
    mobileSession = await loginMobile(t, USERS.viewer);
  });

  it('a login from a new country is flagged: no tokens, the user is blocked and gets an email', async () => {
    mockCountry = 'US';
    const res = await login();

    expect(res.body).toEqual({ flagged: true });
    expect(res.headers['set-cookie']).toBeUndefined();

    const user = await users.findOne({ where: { id: t.users.viewer.id } });
    expect(user.blocked).toBe(true);

    const mail = await waitFor(async () =>
      t.sentMails.find((m) => m.template === 'blocked-account'),
    );
    expect(mail).toMatchObject({
      to: USERS.viewer,
      subject: 'blocked account',
      data: { location: 'US', token: expect.stringMatching(/^[0-9a-f]{40}$/) },
    });
  });

  // Blocking applies to the web only: suspicious login detection runs on web
  // logins, and the mobile app keeps working.
  describe('while blocked', () => {
    it('web login is refused, even from a whitelisted country', async () => {
      mockCountry = 'AR';
      const res = await t
        .http()
        .post('/login/web')
        .send({ username: USERS.viewer, password: PASSWORD })
        .expect(403);
      expect(res.body.message).toMatch(/blocked/i);
      expect(res.body.access_token).toBeUndefined();
      expect(res.headers['set-cookie']).toBeUndefined();
    });

    it('the existing web session stops working, and its refresh token is refused', async () => {
      await t.http().get('/user').set(bearer(webSession)).expect(401);
      await t
        .http()
        .post('/auth/refresh')
        .send({ refresh_token: webSession.refresh_token })
        .expect(403);
    });

    it('mobile login and the existing mobile session keep working', async () => {
      await t.http().get('/user').set(bearer(mobileSession)).expect(200);
      const session = await loginMobile(t, USERS.viewer);
      await t.http().get('/user').set(bearer(session)).expect(200);
    });

    it('2FA code and recovery key logins are refused', async () => {
      const admin = await loginWeb(t, USERS.admin);
      const created = await t
        .http()
        .post('/user')
        .set(bearer(admin))
        .send({
          username: 'blocked-2fa@e2e.test',
          password: PASSWORD,
          role: 'editor',
        })
        .expect(201);
      const session = await loginWeb(t, 'blocked-2fa@e2e.test');
      const { otp_code: secret } = (
        await t
          .http()
          .post('/auth/otp/enable')
          .set(bearer(session))
          .send({ password: PASSWORD })
          .expect(201)
      ).body;
      const keys = (
        await t
          .http()
          .post('/auth/otp/activate')
          .set(bearer(session))
          .send({ code: totp(secret) })
          .expect(201)
      ).body;

      await users.update(created.body.id, { blocked: true });

      await t
        .http()
        .post('/auth/otp/login')
        .send({ userId: created.body.id, code: totp(secret) })
        .expect(403);
      await t
        .http()
        .post('/auth/otp/recovery-key')
        .send({ userId: created.body.id, code: keys[0], password: PASSWORD })
        .expect(403);
    });
  });

  it('the emailed code unblocks the user and whitelists the new country', async () => {
    mockCountry = 'US';
    const { token } = t.sentMails.find((m) => m.template === 'blocked-account')
      .data as { token: string };

    await t.http().get('/user/unblock?code=nope').expect(404);

    const res = await t.http().get(`/user/unblock?code=${token}`).expect(200);
    expect(res.text).toBe('true');

    const user = await waitFor(async () => {
      const u = await users.findOne({ where: { id: t.users.viewer.id } });
      return u.blocked === false && u;
    });
    expect(user.blocked).toBe(false);

    const again = await login();
    expect(again.body.access_token).toEqual(expect.any(String));

    // the code works once
    await t.http().get(`/user/unblock?code=${token}`).expect(404);
  });

  it('logins go through when the IP has no known country', async () => {
    mockCountry = undefined;
    const res = await login();
    expect(res.body.access_token).toEqual(expect.any(String));
  });
});
