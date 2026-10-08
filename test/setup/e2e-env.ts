import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env'), quiet: true });

// The e2e tests run against the throwaway MySQL in docker-compose.e2e.yml,
// their own Bull prefix and their own working directory, so they don't
// touch a local dev setup.
export const E2E_DATABASE = 'tellaweb_e2e';
export const E2E_WORKDIR = join(__dirname, '../.e2e-workdir');

export const e2eEnv = {
  MYSQL_HOST: '127.0.0.1',
  MYSQL_PORT: '3307',
  MYSQL_DATABASE: E2E_DATABASE,
  MYSQL_USER: 'tellaweb_e2e',
  MYSQL_PASSWORD: 'e2e',
  MYSQL_ROOT_PASSWORD: 'e2e',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  BULL_PREFIX: 'bull-e2e',
  JWT_SECRET: 'e2e-secret',
  COOKIE_DOMAIN: 'localhost',
  BCRYPT_SALT: '4',
};
