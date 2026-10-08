import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { rmSync } from 'fs';
import { join } from 'path';
import { Connection, Repository } from 'typeorm';

import { AppModule } from 'app.module';
import { configureApp } from 'app.setup';
import { hashPassword } from 'common/utils/password.utils';
import { RolesUser, UserEntity } from 'modules/user/domain';
import { TYPES as TYPES_UTIL } from 'modules/utils/interfaces';

export const PASSWORD = 'E2e-password-123';

export const USERS: Record<RolesUser, string> = {
  [RolesUser.ADMIN]: 'admin@e2e.test',
  [RolesUser.EDITOR]: 'editor@e2e.test',
  [RolesUser.VIEWER]: 'viewer@e2e.test',
  [RolesUser.REPORTER]: 'reporter@e2e.test',
};

export interface SentMail {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}

export interface TestApp {
  app: INestApplication;
  http: () => ReturnType<typeof request>;
  sentMails: SentMail[];
  users: Record<RolesUser, UserEntity>;
  close: () => Promise<void>;
}

// Boots the whole AppModule against the e2e database, with the same request
// pipeline as main.ts. Emails are captured instead of sent.
export async function createTestApp(): Promise<TestApp> {
  const sentMails: SentMail[] = [];

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(TYPES_UTIL.services.IMailUtilService)
    .useValue({
      send: async (params: SentMail) => {
        sentMails.push(params);
      },
    })
    .compile();

  const app = configureApp(moduleRef.createNestApplication());
  await app.init();

  await resetData(app);
  const users = await seedUsers(app);

  return {
    app,
    http: () => request(app.getHttpServer()),
    sentMails,
    users,
    close: () => app.close(),
  };
}

// Each spec file starts from an empty database (the schema and the global
// settings rows from the migrations stay) and empty data/ and backups/.
async function resetData(app: INestApplication): Promise<void> {
  const connection = app.get(Connection);
  const tables: { name: string }[] = await connection.query(
    'SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE()',
  );
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const { name } of tables) {
    if (name === 'migrations' || name === 'global_settings') continue;
    await connection.query(`TRUNCATE TABLE \`${name}\``);
  }
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  await connection.query('UPDATE global_settings SET enabled = 0');

  for (const dir of ['data', 'backups']) {
    rmSync(join(process.cwd(), dir), { recursive: true, force: true });
  }
}

// One user per role.
async function seedUsers(
  app: INestApplication,
): Promise<Record<RolesUser, UserEntity>> {
  const repo = app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  const users = {} as Record<RolesUser, UserEntity>;

  for (const role of Object.values(RolesUser)) {
    let user = await repo.findOne({ where: { username: USERS[role] } });
    if (!user) {
      user = new UserEntity();
      user.username = USERS[role];
      user.password = await hashPassword(PASSWORD);
      user.role = role;
      user.otp_active = false;
      user.blocked = false;
      user = await repo.save(user);
    }
    users[role] = user;
  }

  return users;
}

export interface Session {
  access_token: string;
  refresh_token?: string;
  cookie: string;
  body: any;
}

function readSession(res: request.Response): Session {
  const cookies = [].concat(res.headers['set-cookie'] || []);
  return {
    access_token: res.body.access_token,
    refresh_token: res.body.refresh_token,
    cookie: cookies.find((c: string) => c.startsWith('access_token=')),
    body: res.body,
  };
}

export async function loginWeb(
  t: TestApp,
  username: string,
  password = PASSWORD,
): Promise<Session> {
  const res = await t
    .http()
    .post('/login/web')
    .send({ username, password })
    .expect(201);
  return readSession(res);
}

export async function loginMobile(
  t: TestApp,
  username: string,
  password = PASSWORD,
): Promise<Session> {
  const res = await t
    .http()
    .post('/login')
    .send({ username, password })
    .expect(201);
  return readSession(res);
}

export const bearer = (session: Session) => ({
  Authorization: `Bearer ${session.access_token}`,
});

// Polls until check() returns a truthy value.
export async function waitFor<T>(
  check: () => Promise<T>,
  timeoutMs = 30000,
  intervalMs = 250,
): Promise<T> {
  const start = Date.now();
  for (;;) {
    const result = await check();
    if (result) return result;
    if (Date.now() - start > timeoutMs) {
      throw new Error(`waitFor timed out after ${timeoutMs}ms`);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}
