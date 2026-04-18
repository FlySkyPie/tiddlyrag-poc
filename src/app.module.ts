import { Module } from '@nestjs/common';
import { WikisModule } from './wikis/wikis.module';
import { TiddlersModule } from './tiddlers/tiddlers.module';

@Module({
  imports: [WikisModule, TiddlersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
