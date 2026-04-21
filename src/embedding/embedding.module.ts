import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { EmbeddingService } from './embedding.service';

@Module({
  providers: [HttpModule],
  exports: [EmbeddingService],
})
export class EmbeddingModule {}
