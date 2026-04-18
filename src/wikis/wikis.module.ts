import { Module } from '@nestjs/common';

import { WikisController } from './wikis.controller';
import { WikisService } from './wikis.service';
import { wikiProviders } from './wiki.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WikisController],
  providers: [...wikiProviders, WikisService],
})
export class WikisModule {}
