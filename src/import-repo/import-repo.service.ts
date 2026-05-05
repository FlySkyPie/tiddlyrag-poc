import { basename } from 'node:path';
import { Injectable } from '@nestjs/common';
import { KyselyService } from '@anchan828/nest-kysely';
import { toSql } from 'pgvector/kysely';
import { sql } from 'kysely';

import { GiteaRepository } from '../gitea/gitea.repository';
import { EmbeddingService } from '../embedding/embedding.service';
import { Database } from '../database/interfaces/database';

@Injectable()
export class ImportRepoService {
  constructor(
    private readonly giteaRepository: GiteaRepository,
    private readonly embeddingService: EmbeddingService,
    private readonly kysely: KyselyService<Database>,
  ) {}

  /**
   * POC implementation. This method would blocked the eexecution until all task is done.
   * Not a production ready implementation but providing basic interface to import Git Repo.
   */
  async saimpleImport(repoUrl: string, repoName: string): Promise<void> {
    await this.giteaRepository.migrate(repoUrl, repoName);
    const createdRepo = await this.kysely.db
      .insertInto('repo')
      .values([
        {
          id: repoName,
        },
      ])
      .returning('uid')
      .executeTakeFirst();

    if (!createdRepo) {
      throw new Error('Unexpected state');
    }

    const filepaths = await this.giteaRepository.readFilePaths(repoName);
    for (let index = 0; index < filepaths.length; index++) {
      const path = filepaths[index];
      const content = await this.giteaRepository.readFile(repoName, path);
      const embedding = await this.embeddingService.embedding(content);

      await this.kysely.db
        .insertInto('repoContent')
        .values([
          {
            repo_uid: createdRepo.uid,
            content,
            filename: basename(path),
            path,
            embedding: sql<number[]>`${toSql(embedding)}`,
          },
        ])
        .executeTakeFirst();
    }
  }
}
