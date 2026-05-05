import { Module } from '@nestjs/common';

import { GiteaModule } from '../gitea/gitea.module';
import { DatabaseModule } from '../database/database.module';
import { EmbeddingModule } from '../embedding/embedding.module';

import { ImportRepoController } from './import-repo.controller';
import { ImportRepoService } from './import-repo.service';

@Module({
  imports: [GiteaModule, DatabaseModule, EmbeddingModule],
  providers: [ImportRepoService],
  controllers: [ImportRepoController],
})
export class ImportRepoModule {}
