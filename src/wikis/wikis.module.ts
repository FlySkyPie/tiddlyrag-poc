import { Module } from '@nestjs/common';
import { WikisController } from './wikis.controller';
import { WikisService } from './wikis.service';

@Module({
  imports: [],
  controllers: [WikisController],
  providers: [WikisService],
})
export class WikisModule {}
