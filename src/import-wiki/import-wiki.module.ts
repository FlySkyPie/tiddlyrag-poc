import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { TiddlywikisModule } from '../tiddywiki/tiddywiki.module';
import { LlmModule } from '../llm/llm.module';
import { EmbeddingModule } from '../embedding/embedding.module';

import { ImportWikiController } from './import-wiki.controller';

@Module({
  imports: [DatabaseModule, TiddlywikisModule, LlmModule, EmbeddingModule],
  controllers: [ImportWikiController],
})
export class ImportWikiModule {}
