import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KyselyModule } from '@anchan828/nest-kysely';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { KyselyMigrationProvider } from './kysely.migration-provider';

@Module({
  imports: [
    KyselyModule.registerAsync({
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
        migrations: {
          migrationsRun: true,
          migratorProps: {
            provider: new KyselyMigrationProvider(),
          },
        },
      }),
    }),
  ],
  providers: [],
  exports: [KyselyModule],
})
export class DatabaseModule {}
