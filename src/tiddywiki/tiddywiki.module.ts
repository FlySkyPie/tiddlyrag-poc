import { Module } from '@nestjs/common';

import { TiddlywikisService } from './tiddywiki.service';

@Module({
  providers: [TiddlywikisService],
  exports: [TiddlywikisService],
})
export class TiddlywikisModule {}
