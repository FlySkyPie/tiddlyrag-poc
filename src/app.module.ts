import { Module } from '@nestjs/common';

import { WikisModule } from './wikis/wikis.module';
import { TiddlersModule } from './tiddlers/tiddlers.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [WikisModule, TiddlersModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
