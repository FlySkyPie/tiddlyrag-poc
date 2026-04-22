import { Module } from '@nestjs/common';

import { WikisModule } from '../wikis/wikis.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { TiddlersModule } from '../tiddlers/tiddlers.module';
import { LlmModule } from '../llm/llm.module';

import { RetrievalController } from './retrieval.controller';

@Module({
  imports: [WikisModule, EmbeddingModule, TiddlersModule, LlmModule],
  controllers: [RetrievalController],
})
export class RetrievalModule {}
