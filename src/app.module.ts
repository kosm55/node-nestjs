import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from './common/http/global-exception.filter';
import configuration from './configs/configs';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from './modules/logger/logger.module';
import { PostgresModule } from './modules/postgres/postgres.module';
import { RedisModule } from './modules/redis/redis.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      //forRoot()- конфігурація стає доступною для всіх модулів
      load: [configuration], //завантажує конфігурацію з іншого файлу який вказано і обєднує з основною
      isGlobal: true, //встановлення глобального доступу до конфігурації
    }),
    RepositoryModule,
    LoggerModule,
    PostgresModule,
    RedisModule,
    AuthModule,
    UserModule,
    ArticleModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
