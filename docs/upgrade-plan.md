# Upgrade plan: backend dependencies

**Goal:** every dependency on a supported version, without changing how the API behaves. Same approach as the frontend (`TellaWeb-FrontEnd-nextjs/docs/upgrade-plan-*.md`): tests first, one commit per step, beta drops at fixed checkpoints.
**Branch:** `upgrade/dependencies`, started from `upgrade/rop-last` (`27243bb`, the backup download fixes). Rebase onto `development` once those are merged.
**Status (2026-10-08):** Tiers 0–4 done. **Waiting for beta drop #1** (see "Beta drops"). Tiers 1 and 2 go in drop #2, TypeORM 0.3 (Tier 3) in drop #3, NestJS 11 (Tier 4) in drop #4, each on its own.
**Branches:** Tiers 0–3 on `upgrade/dependencies`; Tier 4 on `upgrade/nestjs`, started from its tip (`8a8d4e4`).

## Decisions

- **One commit per step.** After each step: `npm run typecheck`, `npm run lint`, `npm run build` (it also checks declaration emit, which `typecheck` doesn't), `npm test`, `npm run test:e2e`, and after any dependency change `npm run check:lockfile` (npm 11 can write lockfiles the image's npm 10 refuses). A Docker build before each beta drop.
- **A maintainer does tags and deploys.** The work stops at each beta checkpoint.
- **Known bugs are pinned, not fixed.** A test marked `it.failing` describes the correct behaviour. It turns red when someone fixes the bug, so the marker gets removed then. Fixes go in their own commits or tickets.
- **Held back on purpose:**
  - **NestJS 12:** ESM-only, and `nestjs-console` doesn't support it.
  - **TypeScript 5:** needs Nest CLI ≥ 10 (Tier 4, see below).
  - **TypeScript 7.**
  - **ESLint 10.**
  - **`file-type` > 16, `nanoid` > 3, `archiver` 8, `nodemailer-express-handlebars` 7:** ESM-only.
  - **otplib 13:** depends on ESM-only packages Jest can't load (see Tier 2).
  - **Bull → BullMQ.**
  - **`@types/node` stays on 14.** Newer versions need TypeScript 5; it moves to 22 with TypeScript.

## Tiers

| Tier | What | Risk |
|---|---|---|
| 0 | Safety net (API e2e suite), Jest 30, remove unused packages, Node 22, minor/patch updates | none |
| 1 | ESLint 9 + Prettier 3, small single-call-site libraries (sharp 0.35, node-ipinfo 4, dotenv 18) | low |
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

## Done: Tier 1

| Commit | Change |
|---|---|
| `339b316`, `a4487ea` | **Bug fixes before beta drop #1:** the project search no longer lists other users' projects, and `/backup/latest` no longer exposes `folderName` |
| `b66cd68` | ESLint 9 with a flat config (`eslint.config.mjs`), typescript-eslint 8, Prettier 3. Same rules as before; test files are linted too, with no tsconfig of their own (the uncommitted `tsconfig.eslint.json` isn't needed). Dropped `eslint-plugin-import`, which was configured but never enabled |
| `da9932e` | Prettier 3 reformat of `src` and `test`, formatting only (271 files weren't formatted). Skipped by `git blame` via `.git-blame-ignore-revs` (`git config blame.ignoreRevsFile .git-blame-ignore-revs`) |
| `f4133c2` | e2e for suspicious login detection and unblocking, with node-ipinfo mocked (written before upgrading it) |
| `e1409d7` | sharp 0.35, node-ipinfo 4, dotenv 18 |

**Gate on the branch tip:** typecheck 0 errors, lint 0 errors (294 `no-unused-vars` warnings), build, 6 unit tests, 128 e2e tests. The Docker image was checked again on a fresh database (migrations, console, upload, preview, thumbnail).

### Things learned in Tier 1
- **sharp ≥ 0.35 types vs runtime:** with `node10` module resolution TypeScript reads sharp's ESM types (a default export), while `require('sharp')` is the function itself. Without `esModuleInterop`, `import sharp from 'sharp'` would compile to `require('sharp').default` and crash. sharp is loaded through `src/common/utils/sharp.utils.ts` (a typed `require`); drop it once the project uses `node16` resolution (with TypeScript 5, Tier 4).
- **node-ipinfo 4** maps country codes to the same 250 names as 3 (checked), so stored login whitelists keep matching.
- **dotenv 18:** since 15 an unquoted `#` starts a comment, and since 16 values containing backticks must be quoted. `@nestjs/config` already used dotenv 16, but `ormconfig.ts` loaded `.env` first with dotenv 8. `quiet: true` keeps the 17+ startup log out.
- typescript-eslint 8 reports 294 unused variables where 4 reported 1,756 (fewer false positives); left as warnings.

## Done: Tier 2

| Commit | Change |
|---|---|
| `3360537` | **class-validator 0.15.** The password check validated a plain object, which 0.14+ rejects (`forbidUnknownValues`), so every login failed; it now validates a `CredentialUserDto` instance |
| `ad655d6` | passport 0.7, `@nestjs/passport` 10.0.3 (the first that accepts passport 0.7; still supports Nest 8). No sessions are used |
| `ab2cdee`, `50a49ab` | bcrypt 6, with a unit test that a hash made by bcrypt 5 still verifies. Prebuilt binaries for glibc and musl; drops `node-pre-gyp` and its vulnerable `tar` |
| `cd1df4b` | 2FA tests now use an independent RFC 6238 TOTP (`test/setup/totp.ts`) instead of otplib, cover a stored otplib 12 secret, the QR code URI fields, and that only the current 30-second step is accepted |
| `4f9a3f0`, `5de907c` | CASL 7 with `createMongoAbility`; unit tests of the ability rules pass on CASL 5 and 7 |
| `9e146e2`, `b867a5a` | nodemailer 10, with a unit test rendering both email templates through nodemailer. `nodemailer-express-handlebars` stays on 6 |
| `3e0a3e9`, `6b291a7` | **Docker build fix:** since `3360537` the lockfile failed `npm ci` with npm 10 (a `@nestjs/mapped-types` peer range); fixed with an override, and `npm run check:lockfile` now catches it. Commits `3360537`..`b867a5a` don't build in Docker |

**Gate on the branch tip:** typecheck 0 errors, lint 0 errors, build, 22 unit tests, 131 e2e tests, `check:lockfile`. `npm audit --omit=dev`: 45 (3 critical, 21 high), down from 52 (7 critical, 23 high). The Docker image was built and checked on a fresh database: migrations, console, a bcrypt 5 hash verifies, login 201 / wrong password 401 / empty body 400.

### Things learned in Tier 2
- **otplib 13 is held back**, with three traps for whoever upgrades it:
  1. `verify()` is async and returns `{ valid }`. The current `if (!isValid)` would treat the returned Promise as true and **accept every code**.
  2. It rejects secrets under 16 bytes; every secret otplib 12 stored is 10 bytes, so **every 2FA user would be locked out** unless `new OTP({ guardrails: createGuardrails({ MIN_SECRET_BYTES: 10 }) })`.
  3. Its CommonJS build requires ESM-only `@scure/base` / `@noble/hashes`: Node 22 loads them, Jest doesn't.
  The 2FA tests (independent TOTP, stored 10-byte secret, time steps) are ready for when it moves.
- **The CASL checks don't restrict anything:** they build the abilities of the *target* user and check whether that user may read or update itself, which is always true. Real access control is the role guards. Editing an unknown user id returns 500 because the abilities are built before the existence check (pinned).
- npm 11 vs npm 10: see `check:lockfile` above.

## Done: Tier 3 (TypeORM 0.3)

| Commit | Change |
|---|---|
| `c616864` | Tests first, passing on 0.2: deleting reports (single and batch) that have files, deletes their files and nothing else; `limit=0` lists everything |
| `8f4496d` | **TypeORM 0.3.31, `@nestjs/typeorm` 8.1.4** (the last line for Nest 8). See below |

What changed in the code:
- `findOne(id[, opts])`, `findByIds` and where-shorthand (`find({ role })`, `findOne({ code, user })`) are now find options; relations are compared by id as `{ user: { id } }`. **Four of these took an untyped (`any`) id, so the compiler didn't flag them**; they were found by grep (`activate`/`disable`/`verify`-OTP, recovery keys).
- `getConnection()` (14 calls) → the injected `DataSource`. The `ProjectAccessGuard` mixin keeps it `public`: with `declaration: true` a mixin can't have private members (only `npm run build` reports this).
- **`invalidWhereValuesBehavior: { undefined: 'throw', null: 'throw' }`** in `ormconfig.ts`. In 0.3 a `where` value of `undefined`/`null` is dropped, so `findOne({ where: { id: undefined } })` returns the first row; now it throws instead.
- `take(0)` / `skip(0)` keep meaning "no limit / no offset" in the five list services, as in 0.2 (0.3 sends `LIMIT 0`, and MySQL refuses an `OFFSET` without `LIMIT`). The console's `users list` relies on it.
- `/backup/latest` keeps omitting empty fields (0.3 returns `null` where 0.2 returned `undefined`).
- CLI: `src/data-source.ts`. `npm run typeorm:run` and `npm run typeorm:migrate <name>` work as before (the second now writes to `src/migrations/<timestamp>-<name>.ts`).

New tests: recovery keys of several users (re-activating replaces only that user's keys, disabling deletes only theirs), report deletion with files, `limit=0`.

**Gate:** typecheck, lint, build, 22 unit tests, 135 e2e tests, `check:lockfile`. **Upgrade path checked with Docker:** a database created and filled by the 0.2 image (migrations, an admin from the console, a project, a report, an uploaded image), then the 0.3 image on the same database: "No migrations are pending", the existing user logs in, the project, report and file are listed, the file streams, the project guard passes, no errors in the logs. `npm audit --omit=dev`: 43 (2 critical: mysql2 through `mysqldump`, webpack through Nest CLI 8).

### Things learned in Tier 3
- **`migration:generate` was already unsafe to use as is.** The hand-written migrations don't match the entities exactly: 0.2 already proposed 142 statements on a fully migrated database, 0.3 proposes 184 (the extra 42 are the `id` columns of seven tables, `varchar(255)` in the database vs `varchar(36)` expected for UUIDs). They include dropping and re-creating primary keys. Always review a generated migration and keep only your change; aligning the schema would be a separate, careful migration.
- `utils migrate` (console) runs SQLite `PRAGMA` statements and has never worked on MySQL; migrations are run with `npm run typeorm:run`.

## Done: Tier 4 (NestJS 8 → 11, TypeScript 5, Express 5), branch `upgrade/nestjs`

| Commit | Change |
|---|---|
| `325e3e3` | Tests first: CORS (credentials, exposed `Range`/`Content-Range`/`size`, other origins refused) and Swagger (`/api`, `/api-json`, the JWT scheme, DTO bodies, a **snapshot of all 66 routes**). Swagger's setup moved to `app.setup.ts` (`setupSwagger`) |
| `40b4097` | **Nest 9**: `@nestjs/*` 9.4, typeorm 9, jwt 9, swagger 6, nestjs-console 8, CLI 9. No code changes |
| `ad1ce7e` | **Nest 10**: `@nestjs/*` 10.4, typeorm 10, jwt 10, swagger 7 (bundles its UI; `swagger-ui-express` removed), config 3, bull 10, nestjs-console 9, CLI 10. No code changes |
| `a652f3e` | **TypeScript 5.9**, ts-node 10.9.2, `@types/node` 22. CLI 10 rewrites `baseUrl` imports correctly (no bare `require("modules/...")` in `dist`). The TypeORM and console scripts run ts-node with `--files` (see below) |
| `cc2dd10` | Tests first for Express 5: a body-less POST (closing a file), file names with spaces, parentheses, accents and `+` in the URL, repeated query keys |
| `a14c209` | **Nest 11 + Express 5**: `@nestjs/*` 11.2, typeorm 11, jwt 11, passport 11, swagger 11, config 4, bull 11, nestjs-console 10, CLI 11, `@types/express` 5. Two code changes, below |

Code changes for Nest 11:
- **Backup download:** Express 5's `res.download` refuses an absolute path with a dot directory anywhere in it (`dotfiles: 'ignore'` now covers the whole path); production paths don't have one, but any install under a dot directory would get 500. The directory now goes in the `root` option, so only the file name is checked.
- `TokenOptions.expiresIn` is typed from `JwtSignOptions` (`@nestjs/jwt` 11 types it as an `ms` duration).

**Gate:** typecheck, lint, build, 22 unit tests, 146 e2e tests, route snapshot unchanged, `check:lockfile`. The built `dist` starts without warnings (67 routes mapped). **Docker, as an upgrade:** data created by the previous image (Nest 8), then the Nest 11 image on it: no pending migrations, console works, the existing report is served, a two-chunk resumable upload of `Voice note (2).wav` (206, HEAD size, then 200), a Range request returns the right bytes, a backup is generated in the container and downloads whole and by range, no errors in the logs. `npm audit --omit=dev`: **11** (1 critical, 3 high), all from `mysqldump` and `image-thumbnail`.

### Things learned in Tier 4
- **ts-node + TypeScript 5:** without `--files`, ts-node treats some files reached through `baseUrl` barrels as "external library" files and refuses to compile them ("Unable to require file"), which broke `npm run typeorm:run`. `--files` makes every file in the tsconfig a root file. `--transpile-only` is not an alternative (enum columns lose their type metadata).
- Swagger's routes must be registered before `app.init()` (in `main.ts`, `listen()` runs init).
- `tsc --noEmit` doesn't report declaration-emit errors; `npm run build` does (Tier 3).
- Nest 12 stays held: ESM-only, and `nestjs-console` has no version for it. Moving to it is the "ESM move" that also unlocks otplib 13, `file-type`, `nanoid`, `archiver` 8 and `nodemailer-express-handlebars` 7.

## Known bugs found by the e2e suite (not fixed, pinned with `it.failing`)

The full list, with status, is in the shared bug doc. Fixed so far: the project search membership leak (`339b316`), `folderName` in `/backup/latest` (`a4487ea`), and the **SQL injection through `sort`** on the project, report, user and resource lists (`8575759`, also cherry-picked onto `upgrade/nestjs` and `upgrade/typeorm-1`), all shipping with beta drop #1. Also fixed for drop #1: **blocked users can't use the web until they unblock** (`45fc341`; mobile is deliberately not affected) and **the server refuses to start without a real `JWT_SECRET`** (`d09ed86`; missing, empty or the `.env` placeholder). Both are cherry-picked onto the later branches. The `sort` fix also repairs the web app's projects list, which sends `sort=project.created_at` and got a 500 (in production too). Found in Tier 1: the `blocked` flag is never checked at login (pinned), and unblocking doesn't await its save.

| Bug | Where | Impact |
|---|---|---|
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

- **Tier 4, Nest 11 / Express 5:** the e2e tests pin the current HTTP contract. Watch `ParseIntPipe` on missing `limit`/`offset` (400 today), comma-separated `exclude`/`projectId`/`fileNames` (`ParseArrayPipe`), `res.download` Range handling, and boolean responses sent as text.
- **Audit baseline** (`npm audit --omit=dev`, after Tier 0): 52 (7 critical, 23 high). Most are fixed by Tiers 2–4. Not covered by any tier:
  - `mysqldump` (unmaintained) brings mysql2 2.3 with a critical RCE advisory.
  - `image-thumbnail` brings an old sharp.
  - bcrypt 5's `node-pre-gyp` brings `tar`; bcrypt 6 dropped it (Tier 2).

## Beta drops (maintainer)

### #1: Tier 0 and the security fixes (`upgrade/dependencies` at `d09ed86` or later)
**Before deploying:** every server must set `JWT_SECRET` in its environment. A server without one now refuses to start (before, it silently used the placeholder from `.env`).
| Change | Check |
|---|---|
| Project search fix | As an editor or viewer, search the projects list: only your own projects show. As an admin: all of them |
| `/backup/latest` fix | Admin Center → backups: the list and download still work (the response no longer has `folderName`) |
| Blocked users (suspicious login detection on) | Log in from a new country: flagged, email arrives. Then, until the email link is used: web login (password, 2FA, recovery key) shows "Account blocked", an open web session is logged out, **the mobile app keeps working**. After the link: web login works again |
| Sort allow-list | Sort every column of every list page (projects, reports, users, resources) both ways. **The projects page now loads** (before: 500 on `sort=project.created_at`) |
| Docker image on Node 22, `npm ci` | Container starts on beta; `npm run typeorm:run` inside it ("No migrations are pending") |
| `console.ts` change | `npm run console -- users list` inside the container exits without an error |
| Unused packages removed | Swagger (`/api`) renders; the six delete endpoints show a boolean response |
| Minor/patch updates (mysql2, bull, ioredis, nodemailer) | Web login + 2FA; mobile app login, resumable upload and remote configuration fetch; a backup (generate, download a large one, delete); an email (unblock a user or a finished backup, with emails enabled) |

### #1 or #2: Tier 1 (`upgrade/dependencies` at `e1409d7` or later)
| Change | Check |
|---|---|
| dotenv 18 parsing | **Before deploying:** in each server's `.env`, values with `#` or a backtick are quoted (an unquoted `#` now starts a comment) |
| sharp 0.35 | Upload a photo (JPEG and HEIC from a phone): preview and thumbnails show in the web app |
| node-ipinfo 4 | With suspicious login detection on: log in from a known country (goes through) |
| Prettier reformat, ESLint 9 | Nothing to check on beta (formatting and tooling only) |

### #2: Tiers 1 and 2 (`upgrade/dependencies` at `6b291a7` or later)
Tier 1 checks above, plus:
| Change | Check |
|---|---|
| class-validator 0.15 | Web login, mobile login, and creating/editing users, projects, resources and remote configurations from the web app (validation errors still show as before) |
| passport 0.7 | Login, a 15+ minute idle then a page load (token refresh), logout |
| bcrypt 6 | Existing users log in with their current passwords; change a password and log in with the new one |
| CASL 7 | Admin edits another user; a non-admin edits their own profile |
| nodemailer 10 | With emails enabled: a real email arrives for a finished backup and for a blocked login (suspicious login detection) |

### #3: TypeORM 0.3 (`upgrade/dependencies` at `8f4496d` or later), on its own
**Before deploying:** back up the database. Then, on beta, in the new container: `npm run typeorm:run` must print "No migrations are pending" (no migration is added in this drop).
| Change | Check |
|---|---|
| Find options rewrite | Every list page (users, projects, reports, resources, configurations) with search, sort and paging; open a project, a report, a user |
| `getConnection()` → DataSource | Non-member opening a project URL gets 403; delete a report with files, batch-delete reports and users, delete a project (its reports stay) |
| Recovery keys | 2FA: activate (15 keys), log in with a recovery key, disable |
| Suspicious login | Block and unblock flow (whitelist rows) |
| Backups | Generate, download, delete (raw queries in the backup handler) |
| Mobile app | Login, create a report in a project, resumable upload, remote configuration fetch |

### #4: NestJS 11 + Express 5 (`upgrade/nestjs` at `a14c209` or later), on its own
| Change | Check |
|---|---|
| Express 5 request handling | Mobile app: login, create a report, a **resumable upload of a large video interrupted halfway** (airplane mode) and resumed, files with spaces or accents in the name |
| Express 5 `res.download` | Admin Center: generate a backup and download it (a large one, and resume an interrupted download in the browser) |
| Range streaming | Play audio and video in the web app, seek in the middle |
| Swagger 11 | `/api` loads and lists the endpoints |
| `@nestjs/config` 4, jwt 11, passport 11 | Login (web, mobile, 2FA), token refresh after 15+ minutes, logout |
| Bull 11 | A backup email and a suspicious-login email arrive (emails enabled) |
| Console (nestjs-console 10) | `npm run console -- users list` in the container |

## How to run the tests

```bash
docker-compose -f docker-compose.e2e.yml up -d   # throwaway MySQL on port 3307
docker-compose up -d redis                       # the e2e tests use their own Bull prefix
npm test                                         # unit
npm run test:e2e                                 # API e2e (about 10s)
```
