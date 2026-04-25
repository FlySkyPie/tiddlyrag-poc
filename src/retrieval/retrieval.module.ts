import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';

import { WikisModule } from '../wikis/wikis.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { TiddlersModule } from '../tiddlers/tiddlers.module';
import { LlmModule } from '../llm/llm.module';

import { RetrievalController } from './retrieval.controller';
import { RetrievalService } from './retrieval.service';
import { RetrievalTools } from './retrieval.tools';

@Module({
  imports: [
    McpModule.forRoot({
      name: 'tiddlyrag-mcp-server',
      version: '0.1.0',
    }),
    WikisModule,
    EmbeddingModule,
    TiddlersModule,
    LlmModule,
  ],
  providers: [RetrievalService, RetrievalTools],
  controllers: [RetrievalController],
})
export class RetrievalModule {}
