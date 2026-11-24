import { once } from 'events';
import { createWriteStream, WriteStream } from 'fs';
import {
  Connection,
  createConnection,
  escape,
  escapeId,
  SqlValue,
} from 'mysql2';

export interface DumpConnectionOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// Same header and footer as the mysqldump package wrote before
const HEADER = [
  '/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;',
  '/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;',
  '/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;',
  '/*!40101 SET NAMES utf8mb4 */;',
  '/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;',
  "/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;",
  '/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;',
  '',
].join('\n');

const FOOTER = [
  '',
  '/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;',
  '/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;',
  '/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;',
  '/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;',
  '/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;',
  '/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;',
  '',
].join('\n');

/**
 * Writes an SQL dump of every table of the database (schema and rows) to
 * filePath, for restoring into an empty database. Replaces the unmaintained
 * mysqldump package, which pulled in a vulnerable mysql2 2.x.
 *
 * Rows are streamed to the file, and all tables are read from one
 * consistent snapshot, so a dump taken while the app runs isn't half old,
 * half new.
 */
export async function dumpDatabase(
  options: DumpConnectionOptions,
  filePath: string,
): Promise<void> {
  const connection = createConnection({
    ...options,
    charset: 'utf8mb4',
    // dates as the database stores them, no time zone conversion
    dateStrings: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    // JSON columns as their text, not parsed objects
    typeCast: (field, next) =>
      field.type === 'JSON' ? field.string() : next(),
  });
  const out = createWriteStream(filePath);
  const failed = once(out, 'error').then(([err]) => Promise.reject(err));
  failed.catch(() => undefined);

  try {
    await Promise.race([
      failed,
      (async () => {
        await write(out, HEADER);
        await query(
          connection,
          'SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ',
        );
        await query(connection, 'START TRANSACTION WITH CONSISTENT SNAPSHOT');

        const tables = await query(
          connection,
          "SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'",
          true,
        );
        for (const [table] of tables) {
          await dumpTable(connection, out, table);
        }

        await query(connection, 'COMMIT');
        await write(out, FOOTER);
      })(),
    ]);
  } finally {
    out.end();
    await once(out, 'close').catch(() => undefined);
    connection.end();
  }
}

async function dumpTable(
  connection: Connection,
  out: WriteStream,
  table: string,
): Promise<void> {
  const [[, createTable]] = await query(
    connection,
    `SHOW CREATE TABLE ${escapeId(table)}`,
    true,
  );
  await write(
    out,
    [
      '',
      '# ------------------------------------------------------------',
      `# SCHEMA DUMP FOR TABLE: ${table}`,
      '# ------------------------------------------------------------',
      '',
      `${createTable.replace(/^CREATE TABLE/, 'CREATE TABLE IF NOT EXISTS')};`,
      '',
      '# ------------------------------------------------------------',
      `# DATA DUMP FOR TABLE: ${table}`,
      '# ------------------------------------------------------------',
      '',
      '',
    ].join('\n'),
  );

  await new Promise<void>((resolve, reject) => {
    let insertInto = '';
    const rows = connection
      .query({ sql: `SELECT * FROM ${escapeId(table)}`, rowsAsArray: true })
      .stream();

    rows.on('fields', (fields: { name: string }[]) => {
      const columns = fields.map((f) => escapeId(f.name)).join(',');
      insertInto = `INSERT INTO ${escapeId(table)} (${columns}) VALUES `;
    });
    rows.on('data', (row: SqlValue[]) => {
      const values = row.map((value) => escape(value)).join(',');
      // respect the file's back-pressure, so big tables aren't buffered
      if (!out.write(`${insertInto}(${values});\n`)) {
        rows.pause();
        out.once('drain', () => rows.resume());
      }
    });
    rows.on('error', reject);
    rows.on('end', resolve);
  });
}

function query(
  connection: Connection,
  sql: string,
  rowsAsArray = false,
): Promise<any[]> {
  return new Promise((resolve, reject) =>
    connection.query({ sql, rowsAsArray }, (err, result) =>
      err ? reject(err) : resolve(result as any[]),
    ),
  );
}

function write(out: WriteStream, text: string): Promise<void> {
  return new Promise((resolve, reject) =>
    out.write(text, (err) => (err ? reject(err) : resolve())),
  );
}
