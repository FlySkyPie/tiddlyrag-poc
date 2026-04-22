import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { TiddlersModule } from '../tiddlers/tiddlers.module';
import { TiddlywikisModule } from '../tiddywiki/tiddywiki.module';

import { WikisController } from './wikis.controller';
import { WikisService } from './wikis.service';
import { wikiProviders } from './wiki.providers';

@Module({
  imports: [DatabaseModule, TiddlersModule, TiddlywikisModule],
  controllers: [WikisController],
  providers: [...wikiProviders, WikisService],
  exports: [WikisService],
})
export class WikisModule {}
