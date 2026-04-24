import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KyselyModule } from 'nestjs-kysely';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { databaseProviders } from './database.providers';

@Module({
  imports: [
    KyselyModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: new PostgresDialect({
          pool: new Pool({
            database: configService.get<string>('database.database'),
            host: configService.get<string>('database.host'),
            port: configService.get<number>('database.port'),
            user: configService.get<string>('database.user'),
            password: configService.get<string>('database.password'),
          }),
        }),
      }),
    }),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders, KyselyModule],
})
export class DatabaseModule {}
