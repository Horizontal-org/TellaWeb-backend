import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'modules/user/domain';
import {
  bearer,
  createTestApp,
  loginMobile,
  loginWeb,
  PASSWORD,
  TestApp,
  USERS,
} from './setup/app';
import { totp } from './setup/totp';

describe('auth', () => {
  let t: TestApp;

  beforeAll(async () => {
    t = await createTestApp();
  });

  afterAll(async () => {
    await t.close();
  });

  describe('web login', () => {
    it('returns tokens, the user and an httpOnly access_token cookie', async () => {
      const session = await loginWeb(t, USERS.admin);

      expect(session.access_token).toEqual(expect.any(String));
      expect(session.refresh_token).toMatch(/^[0-9a-f]{80}$/);
      expect(session.body.user).toMatchObject({
        id: t.users.admin.id,
        username: USERS.admin,
        role: 'admin',
      });
      expect(session.body.user.password).toBeUndefined();
      expect(session.body.user.otp_secret).toBeUndefined();
      expect(session.cookie).toMatch(/HttpOnly/);
      expect(session.cookie).toMatch(/Domain=localhost/);
    });

    it('rejects a wrong password', async () => {
      await t
        .http()
        .post('/login/web')
        .send({ username: USERS.admin, password: 'wrong' })
        .expect(401);
    });

    it('rejects an unknown user', async () => {
      await t
        .http()
        .post('/login/web')
        .send({ username: 'nobody@e2e.test', password: PASSWORD })
        .expect(401);
    });

    it('rejects a body without credentials', async () => {
      await t.http().post('/login/web').send({}).expect(400);
    });

    // 405 because InvalidCredentailsUserException extends MethodNotAllowedException
    it('does not let reporters log in to the web', async () => {
      await t
        .http()
        .post('/login/web')
        .send({ username: USERS.reporter, password: PASSWORD })
        .expect(405);
    });
  });

  describe('mobile login', () => {
    it('returns a token, the user and the API version', async () => {
      const session = await loginMobile(t, USERS.reporter);

      expect(session.access_token).toEqual(expect.any(String));
      expect(session.refresh_token).toBeUndefined();
      expect(session.body.user).toMatchObject({ username: USERS.reporter });
      expect(session.body.version).toEqual(expect.any(String));
      expect(session.cookie).toMatch(/HttpOnly/);
    });
  });

  describe('token types', () => {
    it('accepts a web token on a web-only endpoint', async () => {
      const session = await loginWeb(t, USERS.admin);
      await t
        .http()
        .get('/user/list?limit=10&offset=0')
        .set(bearer(session))
        .expect(200);
    });

    it('rejects a mobile token on a web-only endpoint', async () => {
      const session = await loginMobile(t, USERS.admin);
      await t
        .http()
        .get('/user/list?limit=10&offset=0')
        .set(bearer(session))
        .expect(403);
    });

    it('accepts a mobile token on an endpoint open to all token types', async () => {
      const session = await loginMobile(t, USERS.reporter);
      const res = await t.http().get('/user').set(bearer(session)).expect(200);
      expect(res.body).toMatchObject({ username: USERS.reporter });
    });

    it('authenticates with the cookie alone on an endpoint open to all token types', async () => {
      const session = await loginWeb(t, USERS.viewer);
      const res = await t
        .http()
        .get('/user')
        .set('Cookie', session.cookie)
        .expect(200);
      expect(res.body).toMatchObject({ username: USERS.viewer });
    });

    it('rejects requests without a token', async () => {
      await t.http().get('/user').expect(401);
    });

    it('rejects a tampered token', async () => {
      const session = await loginWeb(t, USERS.admin);
      await t
        .http()
        .get('/user')
        .set('Authorization', `Bearer ${session.access_token}x`)
        .expect(401);
    });
  });

  describe('refresh and logout', () => {
    it('rotates the refresh token and refuses the old one', async () => {
      const session = await loginWeb(t, USERS.editor);

      const res = await t
        .http()
        .post('/auth/refresh')
        .send({ refresh_token: session.refresh_token })
        .expect(201);

      expect(res.body.access_token).toEqual(expect.any(String));
      expect(res.body.refresh_token).not.toEqual(session.refresh_token);
      expect([].concat(res.headers['set-cookie'])[0]).toMatch(/^access_token=/);

      await t
        .http()
        .get('/user')
        .set('Authorization', `Bearer ${res.body.access_token}`)
        .expect(200);

      await t
        .http()
        .post('/auth/refresh')
        .send({ refresh_token: session.refresh_token })
        .expect(401);
    });

    it('rejects an unknown refresh token', async () => {
      await t
        .http()
        .post('/auth/refresh')
        .send({ refresh_token: 'nope' })
        .expect(401);
    });

    it('logout clears the cookie and revokes refresh tokens', async () => {
      const session = await loginWeb(t, USERS.editor);

      const res = await t
        .http()
        .post('/auth/logout')
        .set(bearer(session))
        .expect(201);

      expect(res.body).toEqual({ success: true });
      expect([].concat(res.headers['set-cookie'])[0]).toMatch(
        /^access_token=;.*Expires=Thu, 01 Jan 1970/,
      );

      await t
        .http()
        .post('/auth/refresh')
        .send({ refresh_token: session.refresh_token })
        .expect(401);
    });
  });

  describe('two-factor authentication', () => {
    const username = 'otp@e2e.test';
    let userId: string;
    let secret: string;
    let recoveryKeys: string[];

    beforeAll(async () => {
      const admin = await loginWeb(t, USERS.admin);
      const res = await t
        .http()
        .post('/user')
        .set(bearer(admin))
        .send({ username, password: PASSWORD, role: 'editor' })
        .expect(201);
      userId = res.body.id;
    });

    it('enable requires the password', async () => {
      const session = await loginWeb(t, username);
      await t
        .http()
        .post('/auth/otp/enable')
        .set(bearer(session))
        .send({ password: 'wrong' })
        .expect(401);
    });

    it('enable returns an otpauth url and the secret', async () => {
      const session = await loginWeb(t, username);
      const res = await t
        .http()
        .post('/auth/otp/enable')
        .set(bearer(session))
        .send({ password: PASSWORD })
        .expect(201);

      secret = res.body.otp_code;
      expect(secret).toMatch(/^[A-Z2-7]{16,}$/);

      // what authenticator apps read from the QR code
      const url = new URL(res.body.otp_url);
      expect(url.protocol).toBe('otpauth:');
      expect(url.host).toBe('totp');
      expect(decodeURIComponent(url.pathname)).toBe('/Tellaweb:otp@e2e.test');
      expect(url.searchParams.get('secret')).toBe(secret);
      expect(url.searchParams.get('issuer')).toBe('Tellaweb');
      // SHA1, 6 digits and 30s are the defaults when these are left out
      for (const [param, value] of [
        ['algorithm', 'SHA1'],
        ['digits', '6'],
        ['period', '30'],
      ]) {
        if (url.searchParams.has(param)) {
          expect(url.searchParams.get(param)).toBe(value);
        }
      }
    });

    it('verify accepts a valid code and rejects a wrong one', async () => {
      const session = await loginWeb(t, username);
      await t
        .http()
        .post('/auth/otp/verify')
        .set(bearer(session))
        .send({ code: totp(secret) })
        .expect(201);
      await t
        .http()
        .post('/auth/otp/verify')
        .set(bearer(session))
        .send({ code: '000000' })
        .expect(401);
    });

    it('activate returns 15 recovery keys', async () => {
      const session = await loginWeb(t, username);
      const res = await t
        .http()
        .post('/auth/otp/activate')
        .set(bearer(session))
        .send({ code: totp(secret) })
        .expect(201);

      recoveryKeys = res.body;
      expect(recoveryKeys).toHaveLength(15);
      recoveryKeys.forEach((key) => expect(key).toMatch(/^\d{8}$/));
    });

    it('web login then only returns the user id and otp flag', async () => {
      const res = await t
        .http()
        .post('/login/web')
        .send({ username, password: PASSWORD })
        .expect(201);

      expect(res.body).toEqual({ user: { id: userId, otp_active: true } });
      expect(res.headers['set-cookie']).toBeUndefined();
    });

    it('otp login with a valid code returns tokens', async () => {
      const res = await t
        .http()
        .post('/auth/otp/login')
        .send({ userId, code: totp(secret) })
        .expect(201);

      expect(res.body.access_token).toEqual(expect.any(String));
      expect(res.body.refresh_token).toEqual(expect.any(String));
      expect(res.body.user).toMatchObject({ id: userId });
    });

    it('otp login with a wrong code is rejected', async () => {
      await t
        .http()
        .post('/auth/otp/login')
        .send({ userId, code: '000000' })
        .expect(401);
    });

    it('validates a recovery key', async () => {
      await t
        .http()
        .post('/auth/otp/validate/recovery-key')
        .send({ userId, code: recoveryKeys[0] })
        .expect(201);
      await t
        .http()
        .post('/auth/otp/validate/recovery-key')
        .send({ userId, code: '12345678' })
        .expect(401);
    });

    it('logs in with a recovery key and the password', async () => {
      const res = await t
        .http()
        .post('/auth/otp/recovery-key')
        .send({ userId, code: recoveryKeys[1], password: PASSWORD })
        .expect(201);
      expect(res.body.access_token).toEqual(expect.any(String));

      await t
        .http()
        .post('/auth/otp/recovery-key')
        .send({ userId, code: recoveryKeys[1], password: 'wrong' })
        .expect(401);
    });

    it('lists the recovery keys', async () => {
      const otp = await t
        .http()
        .post('/auth/otp/login')
        .send({ userId, code: totp(secret) })
        .expect(201);
      const res = await t
        .http()
        .get('/auth/otp/recovery-key')
        .set('Authorization', `Bearer ${otp.body.access_token}`)
        .expect(200);
      expect(res.body).toHaveLength(15);
    });

    it('disable with a recovery key turns 2FA off', async () => {
      const otp = await t
        .http()
        .post('/auth/otp/login')
        .send({ userId, code: totp(secret) })
        .expect(201);

      await t
        .http()
        .post('/auth/otp/disable')
        .set('Authorization', `Bearer ${otp.body.access_token}`)
        .send({
          code: recoveryKeys[2],
          is_otp: false,
          confirm_password: PASSWORD,
        })
        .expect(201);

      const repo = t.app.get<Repository<UserEntity>>(
        getRepositoryToken(UserEntity),
      );
      const user = await repo.findOne({ where: { id: userId } });
      expect(user.otp_active).toBe(false);

      const session = await loginWeb(t, username);
      expect(session.access_token).toEqual(expect.any(String));
    });

    describe('a user who set up 2FA before the otplib 13 upgrade', () => {
      // a 16-character secret, the format otplib 12 generated and stored
      const storedSecret = 'JBSWY3DPEHPK3PXP';
      let legacyId: string;

      beforeAll(async () => {
        const admin = await loginWeb(t, USERS.admin);
        const res = await t
          .http()
          .post('/user')
          .set(bearer(admin))
          .send({
            username: 'otp-legacy@e2e.test',
            password: PASSWORD,
            role: 'editor',
          })
          .expect(201);
        legacyId = res.body.id;

        const repo = t.app.get<Repository<UserEntity>>(
          getRepositoryToken(UserEntity),
        );
        await repo.update(legacyId, {
          otp_secret: storedSecret,
          otp_active: true,
        });
      });

      it('logs in with the code from their authenticator app', async () => {
        const res = await t
          .http()
          .post('/auth/otp/login')
          .send({ userId: legacyId, code: totp(storedSecret) })
          .expect(201);
        expect(res.body.access_token).toEqual(expect.any(String));
      });

      it('codes from earlier 30-second steps are rejected', async () => {
        for (const secondsAgo of [30, 60, 90]) {
          await t
            .http()
            .post('/auth/otp/login')
            .send({
              userId: legacyId,
              code: totp(storedSecret, Date.now() - secondsAgo * 1000),
            })
            .expect(401);
        }
      });
    });
  });
});
