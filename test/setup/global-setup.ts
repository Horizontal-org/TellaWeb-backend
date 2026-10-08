import { execFileSync } from 'child_process';
import { rmSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createConnection } from 'mysql2/promise';
import { e2eEnv, E2E_DATABASE, E2E_WORKDIR } from './e2e-env';

// Recreates the e2e database from the migrations, the way a fresh install
// gets its schema, and empties the e2e working directory.
export default async function globalSetup() {
  const connection = await createConnection({
    host: e2eEnv.MYSQL_HOST,
    port: +e2eEnv.MYSQL_PORT,
    user: 'root',
    password: e2eEnv.MYSQL_ROOT_PASSWORD,
  });
  await connection.query(`DROP DATABASE IF EXISTS \`${E2E_DATABASE}\``);
  await connection.query(`CREATE DATABASE \`${E2E_DATABASE}\``);
  await connection.query(
    `GRANT ALL ON \`${E2E_DATABASE}\`.* TO ?@'%'`,
    [e2eEnv.MYSQL_USER],
  );
  await connection.end();

  execFileSync('npm', ['run', '--silent', 'typeorm:run'], {
    cwd: join(__dirname, '../..'),
    env: { ...process.env, ...e2eEnv },
    stdio: 'pipe',
  });

  rmSync(E2E_WORKDIR, { recursive: true, force: true });
  mkdirSync(E2E_WORKDIR, { recursive: true });
}
