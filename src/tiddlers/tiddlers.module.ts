import { Module } from '@nestjs/common';

import { wikiProviders } from '../wikis/wiki.providers';
import { DatabaseModule } from '../database/database.module';
import { EmbeddingModule } from '../embedding/embedding.module';

import { TiddlersController } from './tiddlers.controller';
import { TiddlersService } from './tiddlers.service';
import { tiddlerProviders } from './tiddler.providers';

@Module({
  imports: [DatabaseModule, EmbeddingModule],
  controllers: [TiddlersController],
  providers: [...tiddlerProviders, ...wikiProviders, TiddlersService],
  exports: [TiddlersService],
})
export class TiddlersModule {}
