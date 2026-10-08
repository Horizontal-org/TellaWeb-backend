# Upgrade plan: backend dependencies

**Goal:** every dependency on a supported version, without changing how the API behaves. Same approach as the frontend (`TellaWeb-FrontEnd-nextjs/docs/upgrade-plan-*.md`): tests first, one commit per step, beta drops at fixed checkpoints.
**Branch:** `upgrade/dependencies`, started from `upgrade/rop-last` (`27243bb`, the backup download fixes). Rebase onto `development` once those are merged.
**Status (2026-10-08):** Tier 0 done. **Waiting for beta drop #1** (see "Beta drops").

## Decisions

- **One commit per step.** After each step: `npm run typecheck`, `npm run build`, `npm test`, `npm run test:e2e`, and a Docker build before each beta drop.
- **A maintainer does tags and deploys.** The work stops at each beta checkpoint.
- **Known bugs are pinned, not fixed.** A test marked `it.failing` describes the correct behaviour. It turns red when someone fixes the bug, so the marker gets removed then. Fixes go in their own commits or tickets.
- **Held back on purpose:**
  - **NestJS 12:** ESM-only, and `nestjs-console` doesn't support it.
  - **TypeScript 5:** needs Nest CLI ≥ 10 (Tier 4, see below).
  - **TypeScript 7.**
  - **ESLint 10.**
  - **`file-type` > 16 and `nanoid` > 3:** ESM-only.
  - **Bull → BullMQ.**
  - **`@types/node` stays on 14.** Newer versions need TypeScript 5; it moves to 22 with TypeScript.

## Tiers

| Tier | What | Risk |
|---|---|---|
| 0 | Safety net (API e2e suite), Jest 30, remove unused packages, Node 22, minor/patch updates | none |
| 1 | ESLint 9 + Prettier 3, small single-call-site libraries (archiver 8, sharp 0.35, node-ipinfo 4, dotenv) | low |
| 2 | class-validator 0.14+, passport 0.7, bcrypt 6, otplib 13, CASL 7, nodemailer 8+ | medium |
| 3 | TypeORM 0.2 → 0.3, still on Nest 8 (`@nestjs/typeorm` ≥ 9 needs TypeORM 0.3, so it has to come first) | high |
| 4 | NestJS 8 → 9 → 10 → 11, and TypeScript 5 with Nest CLI 10. Express 5 comes with Nest 11 | high |
| 5 | TypeORM 1.x (optional, later) | low–medium |

## Done: Tier 0 (beta drop #1)

| Commit | Change |
|---|---|
| `53f52b4` | Jest 30, ts-jest 29, supertest 7. Jest 26 couldn't load sharp 0.34 (`node:` imports), so no test could boot the app. Fixed the report service spec, which was already broken |
| `7971d47`, `9d98d0d`, `dbc7553` | **API e2e suite** (`test/*.e2e-spec.ts`, 122 tests): auth and 2FA, token types, roles, project access guard, users, projects, reports, resumable file upload and Range streaming, thumbnails, zips, resources, remote configurations, global settings, backups (real `mysqldump` and zip), console commands. Also: `app.setup.ts` (the `main.ts` pipeline, shared with the tests), `MYSQL_PORT` and `BULL_PREFIX` env vars, `docker-compose.e2e.yml`, `typecheck` script |
| `e5e2341` | `skipLibCheck` (Nest's default). The Jest 30 type declarations need a TypeScript 5 lib and broke `nest build` |
| `ab04173` | Removed unused packages: sqlite3, pug, geoip-lite, passport-local, passport-http, mime-types, commander, yargs, pdf-parse, handlebars, @nestjs-modules/mailer. The six delete endpoints passed yargs' `boolean` function as their Swagger type; they now use `Boolean` |
| `96f9219` | **Node 22** (`node:22.23.3-alpine`; Node 20 is end of life). `Dockerfile.dev` was still on Node 16. `npm ci`, and `.dockerignore` keeps `dist/`, `backups/` and test data out of the image |
| `bc12414` | Minor/patch updates: mysql2 3.24, bull 4.16, ioredis 5.11, bcrypt 5.1.1, nodemailer 6.10, lodash 4.18, rxjs 7.8. Fix in `console.ts` (see below) |

**Gate on the branch tip:** typecheck 0 errors, build, 6 unit tests, 122 e2e tests. The Docker image builds and was checked on a fresh database: `npm run typeorm:run` applies all 15 migrations, `npm run console -- users create` works, and the server serves Swagger, logins, uploads, previews and thumbnails.

### Things learned in Tier 0
- **TypeScript 5 needs Nest CLI ≥ 10.** Nest CLI 8 rewrites `baseUrl` imports (`modules/...`) to relative paths with `getMutableClone`/`createLiteral`, which TypeScript 5 removed. The hook swallows the error, so `dist/` keeps bare `require("modules/...")` and **won't start**, while the build reports success. ts-node 10.9 + TypeScript 5.9 also refused to compile some files through `baseUrl` barrels in the TypeORM CLI ("Unable to require file"). `--transpile-only` is **not** a workaround: without types, enum columns get `Object` metadata and TypeORM rejects them. After TypeScript 5 lands, check that `dist/` has no bare `require("modules/...")` and that `typeorm:run` and `console:dev` work.
- **ioredis ≥ 5.8.2 connects more slowly** (`CLIENT SETINFO` in the handshake). `@nestjs/bull` starts queue workers with `queue.process()` and ignores the returned promise. Closing the app while a worker is still connecting rejects that promise, and nobody handles it. Only the console commands close right after starting: they printed their result, then exited with an error. `console.ts` now ignores unhandled rejections once it's shutting down. The server isn't affected unless it's closed during startup.
- **npm 11 doesn't run install scripts** of packages it hasn't been told to allow (`npm install-scripts ls`). Docker uses npm 10, which does. Locally, bcrypt and sharp still loaded after reinstalls, but check native modules after `npm ci` with npm 11.
- The e2e suite runs on its own MySQL (`docker-compose -f docker-compose.e2e.yml up -d`, port 3307). The local dev database's root password no longer matches `.env`, so root (which backups use for `mysqldump`) can't log in there.

## Known bugs found by the e2e suite (not fixed, pinned with `it.failing`)

| Bug | Where | Impact |
|---|---|---|
| **Project list search ignores membership:** with `search`, non-admins see every matching project | `ListProjectService`: `query.where()` for the search replaces the user condition | Data leak: project names, members and report counts |
| **`/backup/latest` exposes the backup folder path** (`folderName`) | `LatestBackupService` returns entities inside a plain object, which `TransformInterceptor` doesn't serialize, so `@Exclude` is ignored | Absolute server path in the response (`27243bb` meant to hide it) |
| `GET /file/asset/...` without a Range header never completes | `getContentRange` uses `end = size` instead of `size - 1`, so Content-Length is one byte too long | Browsers send `Range: bytes=0-` for media, so they're fine. Other clients hang |
| `GET /file/download/:bucket/:name` with an unknown name → 500 | `downloadFileFromBucket` returns null, the controller calls `.pipe` on it | Error response instead of 404 |

Also found, not pinned in a test:
- `GET /resource/asset/:name` hangs forever if the file is missing on disk: the read stream error is never handled. A hung request also blocks `app.close()`.
- `DeleteBackupService` doesn't `await` its `save()`, so the status can lag the response, and a DB error there becomes an unhandled rejection.
- `sort` query parameters go into `orderBy()` unchecked (project, report and user lists); this needs a whitelist of sortable columns. Possible SQL injection for any logged-in admin, editor or viewer.
- `.env` is committed to git, with a 34-character `JWT_SECRET` (`2310e2e`), and `COPY . .` puts it into the image. If any server ever used that value, rotate it. Consider adding `.env` to `.dockerignore`, once you've confirmed that the servers pass env vars at runtime.

Odd but current behaviour that the tests document:
- A reporter's web login is 405, not 401: `InvalidCredentailsUserException` extends `MethodNotAllowedException`.
- `POST /report` is disabled; reports are created with `POST /project/:id`.
- `/file/asset` answers 206 even for whole files, and returns the 800px JPEG preview for images.
- `/file/download/:bucket/:name` takes a file name (not an id) and sends the raw file with `Content-Type: application/zip`.
- Boolean responses (`/user/confirm/password`) are sent as text, not JSON.

## Notes for later tiers

- **Tier 2, class-validator:** `CheckPasswordUserApplication` calls `validate()` on a plain object. With 0.14's default `forbidUnknownValues: true`, **every login fails**. The auth e2e tests catch this.
- **Tier 3, TypeORM:** besides `findOne(id)`, `findByIds` and `getConnection()`, the where-shorthand `find({ role })` (`GetByIdProjectService`) and `findOne({ code, user })` (`ValidateRecoveryKeysService`) are also removed in 0.3.
- **Tier 4, Nest 11 / Express 5:** the e2e tests pin the current HTTP contract. Watch `ParseIntPipe` on missing `limit`/`offset` (400 today), comma-separated `exclude`/`projectId`/`fileNames` (`ParseArrayPipe`), `res.download` Range handling, and boolean responses sent as text.
- **Audit baseline** (`npm audit --omit=dev`, after Tier 0): 52 (7 critical, 23 high). Most are fixed by Tiers 2–4. Not covered by any tier:
  - `mysqldump` (unmaintained) brings mysql2 2.3 with a critical RCE advisory.
  - `image-thumbnail` brings an old sharp.
  - bcrypt 5's `node-pre-gyp` brings `tar`; bcrypt 6 (Tier 2) drops it.

## Beta drops (maintainer)

### #1: Tier 0 (`upgrade/dependencies` at `bc12414` or later)
| Change | Check |
|---|---|
| Docker image on Node 22, `npm ci` | Container starts on beta; `npm run typeorm:run` inside it ("No migrations are pending") |
| `console.ts` change | `npm run console -- users list` inside the container exits without an error |
| Unused packages removed | Swagger (`/api`) renders; the six delete endpoints show a boolean response |
| Minor/patch updates (mysql2, bull, ioredis, nodemailer) | Web login + 2FA; mobile app login, resumable upload and remote configuration fetch; a backup (generate, download a large one, delete); an email (unblock a user or a finished backup, with emails enabled) |

## How to run the tests

```bash
docker-compose -f docker-compose.e2e.yml up -d   # throwaway MySQL on port 3307
docker-compose up -d redis                       # the e2e tests use their own Bull prefix
npm test                                         # unit
npm run test:e2e                                 # API e2e (about 10s)
```
