import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { Database } from './interfaces/database';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
  {
    provide: 'KYSELY_DB',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const dialect = new PostgresDialect({
        pool: new Pool({
          database: configService.get<string>('database.database'),
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          user: configService.get<string>('database.user'),
          password: configService.get<string>('database.password'),
        }),
      });

      return new Kysely<Database>({
        dialect,
      });
    },
  },
];
