import { Injectable } from '@nestjs/common';
import { KyselyService } from '@anchan828/nest-kysely';
import { l2Distance } from 'pgvector/kysely';

import { EmbeddingService } from '../embedding/embedding.service';
import { Database } from '../database/interfaces/database';

@Injectable()
export class VectorRepository {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly kysely: KyselyService<Database>,
  ) {}

  async queryFiles(repoId: string, query: string) {
    const embeddingVec = await this.embeddingService.embedding(query);
    const files = await this.kysely.db.transaction().execute(async (trx) => {
      const repo = await trx
        .selectFrom('repo')
        .select(['id', 'uid'])
        .where('id', '=', repoId)
        .executeTakeFirst();
      if (!repo) {
        return null;
      }

      const _files = await this.kysely.db
        .selectFrom('repo-content')
        .select(['path', 'content'])
        .where('repo_uid', '=', repo.uid)
        .orderBy(l2Distance('embedding', embeddingVec))
        .limit(20)
        .execute();

      return _files;
    });
    if (!files) {
      return [];
    }

    return files;
  }
}
