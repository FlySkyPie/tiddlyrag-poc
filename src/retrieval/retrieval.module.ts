import { Module } from '@nestjs/common';

import { WikisModule } from '../wikis/wikis.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { TiddlersModule } from '../tiddlers/tiddlers.module';
import { LlmModule } from '../llm/llm.module';

import { RetrievalController } from './retrieval.controller';
import { RetrievalService } from './retrieval.service';

@Module({
  imports: [WikisModule, EmbeddingModule, TiddlersModule, LlmModule],
  providers: [RetrievalService],
  controllers: [RetrievalController],
})
export class RetrievalModule {}
