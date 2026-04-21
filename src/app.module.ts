import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WikisModule } from './wikis/wikis.module';
import { TiddlersModule } from './tiddlers/tiddlers.module';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database';
import tiddlywikiConfig from './config/tiddlywiki';
import openaiConfig from './config/openai';

@Module({
  imports: [
    WikisModule,
    TiddlersModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [databaseConfig, tiddlywikiConfig, openaiConfig],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
