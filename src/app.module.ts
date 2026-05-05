import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import giteaConfig from './config/gitea';
import openaiConfig from './config/openai';
import databaseConfig from './config/database';
import { GiteaModule } from './gitea/gitea.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    GiteaModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [giteaConfig, openaiConfig, databaseConfig],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
