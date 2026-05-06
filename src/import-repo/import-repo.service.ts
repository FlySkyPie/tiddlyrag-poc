import { basename } from 'node:path';
import { Injectable } from '@nestjs/common';
import { KyselyService } from '@anchan828/nest-kysely';
import { toSql } from 'pgvector/kysely';
import { sql } from 'kysely';

import { GiteaRepository } from '../gitea/gitea.repository';
import { EmbeddingService } from '../embedding/embedding.service';
import { Database } from '../database/interfaces/database';
import { LlmService } from '../llm/llm.service';

import { VectorRepository } from './vector.repository';

@Injectable()
export class ImportRepoService {
  constructor(
    private readonly giteaRepository: GiteaRepository,
    private readonly embeddingService: EmbeddingService,
    private readonly kysely: KyselyService<Database>,
    private readonly vectorRepository: VectorRepository,
    private readonly llmService: LlmService,
  ) {}

  /**
   * POC implementation. This method would blocked the eexecution until all task is done.
   * Not a production ready implementation but providing basic interface to import Git Repo.
   */
  async simpleImport(repoUrl: string, repoName: string): Promise<void> {
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

    const filepaths = await this.giteaRepository.readFilePaths(
      repoName,
      undefined,
      ['**/package-lock.json', '**/*.lock', '**/*.png', '**/*.ico'],
    );
    for (let index = 0; index < filepaths.length; index++) {
      const path = filepaths[index];
      try {
        const content = await this.giteaRepository.readFile(repoName, path);
        const embedding = await this.embeddingService.embedding(content);

        await this.kysely.db
          .insertInto('repo-content')
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
      } catch (error) {
        console.log(`File: ${path} is skip, due to error: ${error}`);
      }
    }
  }

  /**
   * POC implementation. This method would blocked the eexecution until all task is done.
   * Not a production ready implementation but providing basic interface to import Git Repo.
   */
  async simpleCreateWiki(repoName: string) {
    const totalFiles = await this.giteaRepository.readFilePaths(repoName);
    const readme = await this.giteaRepository.readFile(repoName, 'README.md');
    const input = this.llmService.renderWikiGenerator(
      repoName,
      readme,
      totalFiles,
    );
    const files = await this.vectorRepository.queryFiles(repoName, input);
    const result = this.llmService.createWikiStructure({
      files,
      isComprehensiveView: false,
      languageName: 'Traditional Chinese (繁體中文)',
      readme,
      repoName,
      repoType: 'github',
      repoUrl: 'https://github.com/FlySkyPie/ariadne-gis',
    });

    return result;
  }
}
