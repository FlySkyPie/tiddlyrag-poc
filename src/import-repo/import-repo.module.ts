import { Module } from '@nestjs/common';

import { GiteaModule } from '../gitea/gitea.module';
import { DatabaseModule } from '../database/database.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { LlmModule } from '../llm/llm.module';

import { ImportRepoController } from './import-repo.controller';
import { ImportRepoService } from './import-repo.service';
import { VectorRepository } from './vector.repository';

@Module({
  imports: [GiteaModule, DatabaseModule, EmbeddingModule, LlmModule],
  providers: [ImportRepoService, VectorRepository],
  controllers: [ImportRepoController],
})
export class ImportRepoModule {}
