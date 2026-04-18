import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { TiddlersModule } from '../tiddlers/tiddlers.module';

import { WikisController } from './wikis.controller';
import { WikisService } from './wikis.service';
import { wikiProviders } from './wiki.providers';
import { TiddlywikisService } from './tiddywiki.service';

@Module({
  imports: [DatabaseModule, TiddlersModule],
  controllers: [WikisController],
  providers: [...wikiProviders, WikisService, TiddlywikisService],
})
export class WikisModule {}
