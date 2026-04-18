import { Module } from '@nestjs/common';
import { TiddlersController } from './tiddlers.controller';
import { TiddlersService } from './tiddlers.service';

@Module({
  imports: [],
  controllers: [TiddlersController],
  providers: [TiddlersService],
})
export class TiddlersModule {}
