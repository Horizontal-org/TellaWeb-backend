import { mkdirSync } from 'fs';
import { e2eEnv, E2E_WORKDIR } from './e2e-env';

Object.assign(process.env, e2eEnv);

// files and backups are written under process.cwd()
mkdirSync(E2E_WORKDIR, { recursive: true });
process.chdir(E2E_WORKDIR);
