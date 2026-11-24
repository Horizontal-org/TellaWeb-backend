import {
  bearer,
  createTestApp,
  loginWeb,
  mfaToken,
  PASSWORD,
  TestApp,
  USERS,
} from './setup/app';
import { totp } from './setup/totp';

describe('login rate limiting', () => {
  let t: TestApp;

  beforeAll(async () => {
    process.env.THROTTLE_DISABLED = 'false';
    t = await createTestApp();
  });

  afterAll(async () => {
    process.env.THROTTLE_DISABLED = 'true';
    await t.close();
  });

  // creates an editor with 2FA on and returns its TOTP secret
  async function withTwoFactor(username: string): Promise<string> {
    const admin = await loginWeb(t, USERS.admin);
    await t
      .http()
      .post('/user')
      .set(bearer(admin))
      .send({ username, password: PASSWORD, role: 'editor' })
      .expect(201);
    const session = await loginWeb(t, username);
    const { otp_code: secret } = (
      await t
        .http()
        .post('/auth/otp/enable')
        .set(bearer(session))
        .send({ password: PASSWORD })
        .expect(201)
    ).body;
    await t
      .http()
      .post('/auth/otp/activate')
      .set(bearer(session))
      .send({ code: totp(secret) })
      .expect(201);
    return secret;
  }

  const wrongCode = (secret: string) =>
    String((Number(totp(secret)) + 1) % 1_000_000).padStart(6, '0');

  it('blocks the 11th password attempt in a minute from one client IP', async () => {
    const attempt = (ip: string) =>
      t
        .http()
        .post('/login/web')
        .set('X-Forwarded-For', ip)
        .send({ username: USERS.admin, password: 'wrong' });

    for (let i = 0; i < 10; i++) await attempt('10.0.0.1').expect(401);
    await attempt('10.0.0.1').expect(429);
    // another client behind the proxy has its own limit
    await attempt('10.0.0.2').expect(401);
  });

  it('blocks the 6th 2FA code for a user, even with a fresh mfa token', async () => {
    const secretA = await withTwoFactor('throttle-a@e2e.test');
    const secretB = await withTwoFactor('throttle-b@e2e.test');

    const first = await mfaToken(t, 'throttle-a@e2e.test');
    const second = await mfaToken(t, 'throttle-a@e2e.test');
    const other = await mfaToken(t, 'throttle-b@e2e.test');
    const attempt = (mfa_token: string, code: string, ip = '10.0.1.1') =>
      t
        .http()
        .post('/auth/otp/login')
        .set('X-Forwarded-For', ip)
        .send({ mfa_token, code });

    for (let i = 0; i < 5; i++) {
      await attempt(first, wrongCode(secretA)).expect(401);
    }
    await attempt(first, totp(secretA)).expect(429);
    // a new token and a new IP don't reset it
    await attempt(second, totp(secretA), '10.0.1.2').expect(429);
    // other users aren't affected
    await attempt(other, totp(secretB)).expect(201);
  });
});
