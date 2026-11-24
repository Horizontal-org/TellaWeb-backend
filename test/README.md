# E2E tests

These tests start the whole `AppModule` against a real MySQL and Redis and call it over HTTP with [supertest](https://github.com/ladjs/supertest). They cover what the web and mobile apps rely on: the auth flows, permissions per role, uploads and downloads, backups, the console commands, and the HTTP layer itself (CORS, Swagger).

Unit tests are separate. They live next to the code as `src/**/*.spec.ts` and run with `npm test`.

## Running

You need Docker, for MySQL and Redis.

```bash
# 1. Throwaway MySQL 5.7, published on port 3307 and kept in memory (tmpfs)
docker-compose -f docker-compose.e2e.yml up -d

# 2. Redis (the same one the dev setup uses)
docker-compose up -d redis

# 3. The whole suite
npm run test:e2e
```

One file, or one test:

```bash
npx jest --config ./test/jest-e2e.json test/auth.e2e-spec.ts
npx jest --config ./test/jest-e2e.json -t "rotates the refresh token"
```

When you're done, stop the e2e database with `docker-compose -f docker-compose.e2e.yml down`. It keeps nothing on disk.

### Configuration

The connection settings are in `setup/e2e-env.ts` and are hardcoded, so the suite doesn't depend on your `.env`:

| Variable | Value | Notes |
| --- | --- | --- |
| `MYSQL_HOST` / `MYSQL_PORT` | `127.0.0.1` / `3307` | the port `docker-compose.e2e.yml` publishes, so the suite never touches a dev MySQL on 3306 |
| `MYSQL_DATABASE` | `tellaweb_e2e` | dropped and recreated on every run |
| `MYSQL_USER` / `MYSQL_PASSWORD` | `tellaweb_e2e` / `e2e` | |
| `MYSQL_ROOT_PASSWORD` | `e2e` | the global setup and the backup restore test connect as root |
| `REDIS_HOST` | `REDIS_HOST` from `.env`, else `localhost` | other Redis settings (password, port) come from `.env` |
| `BULL_PREFIX` | `bull-e2e` | keeps the e2e jobs apart from the dev queues |
| `JWT_SECRET`, `COOKIE_DOMAIN`, `WEB_ORIGIN`, `APP_ORIGIN`, `BCRYPT_SALT` | test values | `BCRYPT_SALT=4` keeps hashing fast |

`.env` is still loaded first, so any variable not listed here (SMTP, IP lookup key, …) comes from it. The values above override it.

## How it works

### Jest config (`jest-e2e.json`)

- Matches `*.e2e-spec.ts` in this folder.
- Resolves imports from `../src`, so tests import app code the same way the app does (`import { UserEntity } from 'modules/user/domain'`).
- `maxWorkers: 1`: spec files run one after another, because they share one database and one working directory.
- `testTimeout: 60000`: some tests wait on Bull jobs (backups) or start child processes (console commands).

### Once per run: `setup/global-setup.ts`

1. Connects to MySQL as root, drops `tellaweb_e2e` if it exists, recreates it and grants it to `tellaweb_e2e`.
2. Runs `npm run typeorm:run` with the e2e env. The schema comes from the migrations, the way a fresh install gets it, so a broken migration fails the whole suite.
3. Empties `test/.e2e-workdir/` (gitignored).

### Once per spec file: `setup/env.ts`

Runs before each spec file is loaded:

- copies `e2eEnv` into `process.env`;
- `chdir`s into `test/.e2e-workdir/`. The app writes uploaded files to `<cwd>/data/` and backups to `<cwd>/backups/`, so they end up there and not in the repo.

### In each spec: `createTestApp()` (`setup/app.ts`)

Each spec file calls it in `beforeAll` and calls `close()` in `afterAll`. It:

1. Compiles `AppModule` and **replaces the mail service** with a stub that pushes each email onto `t.sentMails` and sends nothing.
2. Applies `configureApp()` from `src/app.setup.ts`, the same pipeline as `main.ts` (validation pipe, response transform, CORS, cookies, …). With `{ swagger: true }` it also mounts Swagger.
3. **Resets the data**: truncates every table except `migrations` and `global_settings`, sets every global setting to `enabled = 0`, and deletes `data/` and `backups/`.
4. **Seeds one user per role** with the password `PASSWORD` (`E2e-password-123`):

   | Role | Username |
   | --- | --- |
   | admin | `admin@e2e.test` |
   | editor | `editor@e2e.test` |
   | viewer | `viewer@e2e.test` |
   | reporter | `reporter@e2e.test` |

So every spec file starts from the same state. Tests **inside** a file share state and run in order, and many build on earlier ones (create, then list, then edit, then delete).

## Helpers

### `setup/app.ts`

| Export | What it does |
| --- | --- |
| `createTestApp({ swagger? })` | Boots the app as described above. Returns a `TestApp`. |
| `TestApp.http()` | A fresh supertest agent on the app's server: `t.http().get('/user/profile')`. |
| `TestApp.users` | The seeded `UserEntity` per role (`t.users.admin.id`, …). |
| `TestApp.sentMails` | The emails "sent" so far: `{ to, subject, template, data }`. |
| `TestApp.app` | The `INestApplication`, for direct access to repositories: `t.app.get(getRepositoryToken(UserEntity))`. |
| `USERS`, `PASSWORD` | The seeded usernames and their password. |
| `loginWeb(t, username, password?)` | `POST /login/web`. Returns a `Session`. |
| `loginMobile(t, username, password?)` | `POST /login` (mobile token). Returns a `Session`. |
| `Session` | `{ access_token, refresh_token, cookie, body }`. `cookie` is the `access_token=…` `Set-Cookie` value. |
| `bearer(session)` | `{ Authorization: 'Bearer …' }`, for `.set(bearer(session))`. |
| `waitFor(check, timeoutMs?, intervalMs?)` | Polls `check()` until it returns something truthy (default: 30s, every 250ms). Use it for background work like Bull jobs. |

Web and mobile tokens are different token types, and endpoints accept `WEB`, `MOBILE` or `ALL`. Use `loginWeb` or `loginMobile` to match the client the endpoint is for.

### `setup/fixtures.ts`

Small valid files built in memory, so the repo has no binary fixtures:

| Export | What it builds |
| --- | --- |
| `wav(dataBytes?)` | A mono 8 kHz PCM WAV. The samples aren't all zeros, so a wrong byte range shows up in the test. |
| `png(width?, height?)` | A solid-colour PNG (default 1200×900), made with sharp. |
| `pdf()` | A minimal valid PDF with no JavaScript in it. |
| `binaryParser` | supertest parser that collects a binary response into a `Buffer`: `.buffer(true).parse(binaryParser)`. |

### `setup/totp.ts`

`totp(secret, at?)` computes an RFC 6238 code (SHA1, 6 digits, 30s steps), the same code an authenticator app shows. It's written here on purpose, so the 2FA tests don't check otplib against otplib.

## What each spec covers

| File | Covers |
| --- | --- |
| `auth.e2e-spec.ts` | Web and mobile login, rejected credentials, reporters can't log into the web, token types per endpoint, cookie-only auth, tampered tokens, refresh token rotation, logout. 2FA: enable, verify, activate, OTP login, recovery keys (several users, re-activation), and secrets set up before the otplib 13 upgrade. |
| `suspicious-login.e2e-spec.ts` | The `SUSPICIOUS LOGIN DETECTION` setting. The first country is whitelisted. A new country blocks the user and emails an unlock code. While blocked: web, 2FA and recovery-key logins and existing web sessions are refused, but mobile still works. The code unblocks the user. An IP with no known country lets the login through. `node-ipinfo` is mocked with `jest.mock`, so there's no network call. |
| `users.e2e-spec.ts` | User CRUD, validation, unknown fields stripped, duplicate usernames, list/search/paginate/exclude, `limit=0`, profile, password change and confirmation, batch delete, admin-only actions. |
| `projects-reports.e2e-spec.ts` | Projects: slug and URL, membership, access by id and slug, what each role sees in lists, edit. Reports: created by reporters through a project from mobile, access rules, list/search, edit, batch delete. Deleting a project keeps its reports. |
| `files.e2e-spec.ts` | Resumable uploads (v2: `Content-Range`, `HEAD`, 206 answers, validation), the deprecated v1 upload plus close, URL-unsafe file names, byte-range streaming, image previews and thumbnails, report zips, single-file downloads, cookie-only downloads, path traversal, deleting files with their reports. |
| `backups.e2e-spec.ts` | Starting a backup (admin only) and waiting for it in the background, the zip's contents (CSVs, `database_dump.sql`, files), **restoring the dump into `tellaweb_e2e_restore` and comparing it with the original**, range downloads, mobile tokens, 404s, delete. |
| `resources-settings.e2e-spec.ts` | Resources (PDF upload and validation, PDFs with JavaScript rejected, per-project download access, zips), remote configurations (CRUD, short codes) and global settings (list, toggle, admin-only). |
| `sorting.e2e-spec.ts` | `sort` on every list endpoint only accepts whitelisted columns. Injected SQL is rejected without being run. |
| `console.e2e-spec.ts` | `users create` and `users list` run as a separate process with `npm run console:dev`, the way an admin runs them on a server. |
| `http.e2e-spec.ts` | CORS preflight and exposed headers for the web origin, other origins refused. The Swagger UI and JSON, the bearer scheme, documented DTO bodies, and a **snapshot of every route** (`__snapshots__/http.e2e-spec.ts.snap`). |

## Snapshots

`http.e2e-spec.ts` snapshots the sorted list of `METHOD /path` in the Swagger document, so a framework upgrade can't add, drop or rename a route without anyone noticing. When you change routes on purpose, update the snapshot and commit it:

```bash
npx jest --config ./test/jest-e2e.json test/http.e2e-spec.ts -u
```

Read the snapshot diff before committing. It should show only the routes you meant to change.

## Writing a test

- Put it in an existing spec if it fits the area. Otherwise create `<area>.e2e-spec.ts` with this skeleton:

  ```ts
  import { bearer, createTestApp, loginWeb, TestApp, USERS } from './setup/app';

  describe('things', () => {
    let t: TestApp;

    beforeAll(async () => {
      t = await createTestApp();
    });

    afterAll(async () => {
      await t.close();
    });

    it('admins list things', async () => {
      const admin = await loginWeb(t, USERS.admin);
      const res = await t.http().get('/thing').set(bearer(admin)).expect(200);
      expect(res.body).toEqual([]);
    });
  });
  ```

- Go through HTTP the way a client would. Read the database through `t.app.get(...)` only to check things the API doesn't expose (a user getting blocked, rows being deleted).
- Global settings start disabled. Turn on the ones a test needs through the API, as `suspicious-login.e2e-spec.ts` does.
- Check emails through `t.sentMails`, never a real SMTP server.
- Mock outside services (like `node-ipinfo`) with `jest.mock` at the top of the spec file, so the suite works offline.
- Use `waitFor` for anything that finishes in a Bull job. Don't use fixed sleeps.
- Build fixtures with `setup/fixtures.ts` instead of adding binary files.

## Troubleshooting

- **`ECONNREFUSED` in the global setup**: the e2e MySQL isn't running, or `MYSQL_PORT` in `setup/e2e-env.ts` doesn't match the port in `docker-compose.e2e.yml`. MySQL also needs a few seconds after `up -d` before it accepts connections.
- **The global setup fails on `typeorm:run`**: a migration is broken. Run it on its own with the e2e env to see the error, because the setup hides the migration output (`stdio: 'pipe'`).
- **Tests hang until the 60s timeout, mostly backups**: Redis is unreachable. A wrong Redis host fails silently in this app, so the jobs just never run. Check `REDIS_HOST` and the Redis password in `.env`, and that the `redis` container is up.
- **Leftover files**: everything the app writes goes under `test/.e2e-workdir/`, which is gitignored and emptied on every run. It's safe to delete.
