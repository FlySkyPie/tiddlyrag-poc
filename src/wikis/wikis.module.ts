import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { TiddlersModule } from '../tiddlers/tiddlers.module';
import { TiddlywikisModule } from '../tiddywiki/tiddywiki.module';
import { LlmModule } from '../llm/llm.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { ImportWikiModule } from '../import-wiki/import-wiki.module';

import { WikisController } from './wikis.controller';
import { WikisService } from './wikis.service';
import { wikiProviders } from './wiki.providers';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => TiddlersModule),
    TiddlywikisModule,
    LlmModule,
    EmbeddingModule,
    ImportWikiModule,
  ],
  controllers: [WikisController],
  providers: [...wikiProviders, WikisService],
  exports: [...wikiProviders, WikisService],
})
export class WikisModule {}
