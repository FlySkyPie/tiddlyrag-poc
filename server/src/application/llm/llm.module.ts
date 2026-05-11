import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { EmbeddingModule } from '../embedding/embedding.module';

import { LlmService } from './llm.service';

@Module({
  imports: [HttpModule, EmbeddingModule],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
