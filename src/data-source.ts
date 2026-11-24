import { DataSource } from 'typeorm';
import { OrmConfig } from './ormconfig';

// For the TypeORM CLI (npm run typeorm:run, typeorm:migrate)
export default new DataSource(OrmConfig);
