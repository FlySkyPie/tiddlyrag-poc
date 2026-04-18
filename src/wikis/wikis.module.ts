import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { WikisController } from './wikis.controller';
import { WikisService } from './wikis.service';
import { wikiProviders } from './wiki.providers';
import { TiddlywikisService } from './tiddywiki.service';

@Module({
  imports: [DatabaseModule],
  controllers: [WikisController],
  providers: [...wikiProviders, WikisService, TiddlywikisService],
})
export class WikisModule {}
