import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as process from 'process';

import { Config, DatabaseConfig } from '../../configs/config.type';

@Injectable()
export class PostgresConnectService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<Config>) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseConfig = this.configService.get<DatabaseConfig>('database');
    return {
      type: 'postgres',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.dbName,
      //entities: [AuthEntity, UserEntity],
      entities: [
        path.join(
          process.cwd(),
          'dist',
          'src',
          'database',
          'entities',
          '*.entity.js',
        ),
      ],
      migrations: [
        path.join(
          process.cwd(),
          'dist',
          'src',
          'database',
          'migrations',
          '*.js',
        ),
      ],
      synchronize: false,
      migrationsRun: true,
    };
  }
}
