import { Module } from '@nestjs/common';
import { TiddlersController } from './tiddlers.controller';
import { TiddlersService } from './tiddlers.service';
import { tiddlerProviders } from './tiddler.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TiddlersController],
  providers: [...tiddlerProviders, TiddlersService],
})
export class TiddlersModule {}
