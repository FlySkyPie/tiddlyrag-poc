import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WikisModule } from './wikis/wikis.module';
import { TiddlersModule } from './tiddlers/tiddlers.module';
import { RetrievalModule } from './retrieval/retrieval.module';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database';
import tiddlywikiConfig from './config/tiddlywiki';
import openaiConfig from './config/openai';
import { ImportWikiModule } from './import-wiki/import-wiki.module';

@Module({
  imports: [
    WikisModule,
    TiddlersModule,
    DatabaseModule,
    RetrievalModule,
    ImportWikiModule,
    ConfigModule.forRoot({
      load: [databaseConfig, tiddlywikiConfig, openaiConfig],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
