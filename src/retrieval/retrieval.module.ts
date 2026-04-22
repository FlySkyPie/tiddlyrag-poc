import { Module } from '@nestjs/common';

import { WikisModule } from '../wikis/wikis.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { TiddlersModule } from '../tiddlers/tiddlers.module';

import { RetrievalController } from './retrieval.controller';

@Module({
  imports: [WikisModule, EmbeddingModule, TiddlersModule],
  controllers: [RetrievalController],
})
export class RetrievalModule {}
