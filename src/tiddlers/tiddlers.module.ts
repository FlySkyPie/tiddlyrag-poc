import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { WikisModule } from '../wikis/wikis.module';

import { TiddlersController } from './tiddlers.controller';
import { TiddlersService } from './tiddlers.service';
import { tiddlerProviders } from './tiddler.providers';

@Module({
  imports: [DatabaseModule, EmbeddingModule, forwardRef(() => WikisModule)],
  controllers: [TiddlersController],
  providers: [...tiddlerProviders, TiddlersService],
  exports: [TiddlersService],
})
export class TiddlersModule {}
