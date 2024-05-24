import { Module } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { Config, DatabaseConfig } from '../configs/config.type';
// import { AuthEntity } from '../database/entities/auth.entity';
// import { UserEntity } from '../database/entities/user.entity';
import { PostgresConnectService } from './postgres-connect.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresConnectService,
    }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: (configService: ConfigService<Config>) => {
    //     const databaseConfig = configService.get<DatabaseConfig>('database');
    //     return {
    //       type: 'postgres',
    //       host: databaseConfig.host,
    //       port: databaseConfig.port,
    //       username: databaseConfig.user,
    //       password: databaseConfig.password,
    //       database: databaseConfig.dbName,
    //       entities: [AuthEntity, UserEntity],
    //       synchronize: true,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [],
  providers: [],
})
export class PostgresModule {}
