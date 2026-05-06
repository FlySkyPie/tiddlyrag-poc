import { basename } from 'node:path';
import { Injectable } from '@nestjs/common';
import { KyselyService } from '@anchan828/nest-kysely';
import { toSql } from 'pgvector/kysely';
import { sql } from 'kysely';

import type { FileContentDto } from '../llm/interface/file-content.dto';
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
    /**
     * Dummy data for now.
     */
    const languageName = 'Traditional Chinese (繁體中文)';
    const repoType = 'github';
    const repoUrl = 'https://github.com/FlySkyPie/ariadne-gis';

    const totalFiles = await this.giteaRepository.readFilePaths(repoName);
    const readme = await this.giteaRepository.readFile(repoName, 'README.md');
    const input = this.llmService.renderWikiGenerator(
      repoName,
      readme,
      totalFiles,
    );
    const files = await this.vectorRepository.queryFiles(repoName, input);
    const {
      wiki_structure: {
        articles: { article: articles },
        title,
        description,
      },
    } = await this.llmService.createWikiStructure({
      files,
      isComprehensiveView: false,
      languageName,
      readme,
      repoName,
      repoType,
      repoUrl,
    });

    const articleContents: string[] = [];

    for (let index = 0; index < articles.length; index++) {
      const {
        title,
        relevant_files: { file_path: filePaths },
      } = articles[index];

      /**
       * The files should query from vector database, but let's do this as mock data for now.
       */
      const articleFiles: FileContentDto[] = [];
      for (let j = 0; j < filePaths.length; j++) {
        const path = filePaths[j];
        const content = await this.giteaRepository.readFile(repoName, path);
        articleFiles.push({
          path,
          content,
        });
      }

      const articleContent = await this.llmService.createWikiArticle({
        files: articleFiles,
        fileUrls: filePaths.map((path) => ({
          path,
          url: path,
        })),
        languageName,
        repoName,
        repoType,
        repoUrl,
        title,
      });
      articleContents.push(articleContent);
    }

    return {
      title,
      description,
      articleContents,
    };
  }
}
