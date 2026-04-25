import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { TiddlersController } from './tiddlers.controller';
import { TiddlersService } from './tiddlers.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TiddlersController],
  providers: [TiddlersService],
  exports: [],
})
export class TiddlersModule {}
