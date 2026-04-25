import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { TiddlywikisModule } from '../tiddywiki/tiddywiki.module';
import { ImportWikiModule } from '../import-wiki/import-wiki.module';

import { WikisController } from './wikis.controller';
import { WikisService } from './wikis.service';

@Module({
  imports: [DatabaseModule, TiddlywikisModule, ImportWikiModule],
  controllers: [WikisController],
  providers: [WikisService],
  exports: [WikisService],
})
export class WikisModule {}
