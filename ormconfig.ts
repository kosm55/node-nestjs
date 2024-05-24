import * as path from 'node:path';

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import getter from './src/configs/configs';

dotenv.config({ path: './environments/local.env' });

const databaseConfig = getter().database;

export default new DataSource({
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.dbName,
  //entities: [AuthEntity, UserEntity],
  entities: [
    path.join(process.cwd(), 'dist', 'database', 'entities', '*.entity.js'),
  ],
  migrations: [
    path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
  ],
  synchronize: false,
});
